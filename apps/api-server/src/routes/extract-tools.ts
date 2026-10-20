import { Router, type Request, type Response } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { upload, guardImage } from "../middlewares/upload.js";
import { BIN } from "../lib/binaries.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";
import { resolveTesseractLanguages } from "./pdf/pdf-ocr-logic.js";
import { apiError } from "../lib/errors.js";

const execFileAsync = promisify(execFile);
const router = Router();

/**
 * Preprocess an image for optimal OCR extraction:
 * 1. Auto-orient via EXIF tags (.rotate()).
 * 2. Cap dimensions at 4000px to maintain < 500ms Pareto performance and avoid memory pressure.
 * 3. Convert to grayscale and normalize dynamic contrast for sharp character separation.
 * 4. Export as lossless PNG.
 */
export async function preprocessImageForOcr(buffer: Buffer): Promise<Buffer> {
  if (!buffer || buffer.length === 0) {
    throw new Error("Input buffer is empty");
  }

  const meta = await sharp(buffer).metadata();
  let pipeline = sharp(buffer).rotate();

  if ((meta.width && meta.width > 4000) || (meta.height && meta.height > 4000)) {
    pipeline = pipeline.resize({
      width: 4000,
      height: 4000,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  return pipeline
    .toColorspace("b-w")
    .normalize()
    .png({ compressionLevel: 6 })
    .toBuffer();
}

/**
 * POST /extract/ocr
 * Image to text OCR engine with high-performance native CLI & Tesseract.js fallback.
 */
router.post(
  "/extract/ocr",
  defaultRateLimit,
  upload.single("file"),
  guardImage,
  async (req: Request, res: Response) => {
    if (!req.file || req.file.size === 0 || !req.file.buffer) {
      apiError(res, 400, "NO_FILE", "No file uploaded or file is empty");
      return;
    }

    const rawLang = typeof req.body?.lang === "string" ? req.body.lang : "eng";
    const resolvedLangs = resolveTesseractLanguages(rawLang);
    const cliLang = resolvedLangs.join("+");

    const id = randomUUID();
    const workDir = join(tmpdir(), "everydaytools", id);
    await mkdir(workDir, { recursive: true });

    const inputPath = join(workDir, "input.png");
    const outputBase = join(workDir, "output");

    try {
      const pngBuf = await preprocessImageForOcr(req.file.buffer);
      await writeFile(inputPath, pngBuf);

      let text = "";
      let method: "cli" | "wasm" = "cli";

      try {
        await execFileAsync(
          BIN.tesseract,
          [inputPath, outputBase, "-l", cliLang, "txt"],
          { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
        );

        text = await readFile(`${outputBase}.txt`, "utf-8");
      } catch (cliErr) {
        const msg = cliErr instanceof Error ? cliErr.message : "";
        const errno = (cliErr as NodeJS.ErrnoException)?.code;
        const isMissingCli = errno === "ENOENT" || msg.includes("ENOENT") || msg.includes("not found");

        if (isMissingCli) {
          // Fallback to in-process Tesseract.js worker
          method = "wasm";
          const worker = await createWorker(cliLang || "eng");
          try {
            const ret = await worker.recognize(pngBuf);
            text = ret.data.text;
          } finally {
            await worker.terminate();
          }
        } else {
          throw cliErr;
        }
      }

      res.json({
        text: text.trim(),
        lang: cliLang,
        method,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OCR failed";
      apiError(res, 500, "OCR_FAILED", msg);
    } finally {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  },
);

export default router;
