/**
 * POST /extract/ocr
 *
 * OCR an image using Tesseract CLI.
 * Accepts: JPEG, PNG, WEBP, GIF, BMP, TIFF
 * Returns: JSON { text: string }
 */

import { Router } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload, guardImage } from "../middlewares/upload.js";
import { BIN } from "../lib/binaries.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const router = Router();

router.post(
  "/extract/ocr",
  defaultRateLimit,
  upload.single("file"),
  guardImage,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: true, code: "NO_FILE", message: "No file uploaded" });
      return;
    }

    const lang = typeof req.body.lang === "string" ? req.body.lang.replace(/[^a-z+]/gi, "") || "eng" : "eng";

    const id = randomUUID();
    const workDir = join(tmpdir(), `everydaytools`, id);
    await mkdir(workDir, { recursive: true });

    const inputPath = join(workDir, "input.png");
    const outputBase = join(workDir, "output");

    try {
      // Normalize to PNG for Tesseract (handles WEBP, HEIC, etc.)
      const pngBuf = await sharp(req.file.buffer).png().toBuffer();
      await writeFile(inputPath, pngBuf);

      await execFileAsync(
        BIN.tesseract,
        [inputPath, outputBase, "-l", lang, "txt"],
        { timeout: 90_000, maxBuffer: 10 * 1024 * 1024 },
      );

      const text = await readFile(`${outputBase}.txt`, "utf-8");
      res.json({ text: text.trim() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OCR failed";
      const isMissing = msg.includes("ENOENT") || msg.includes("not found");
      res.status(isMissing ? 503 : 500).json({
        error: true,
        code: isMissing ? "TESSERACT_UNAVAILABLE" : "OCR_FAILED",
        message: isMissing
          ? "Tesseract OCR is not installed on this server. Set TESSERACT_PATH in .env."
          : msg,
      });
    } finally {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  },
);

export default router;
