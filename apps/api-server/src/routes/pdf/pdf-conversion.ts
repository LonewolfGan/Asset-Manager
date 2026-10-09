import { Router } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir, readdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { zipSync } from "fflate";
import { upload } from "../../middlewares/upload.js";
import { BIN } from "../../lib/binaries.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";

const execFileAsync = promisify(execFile);
const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-images
// Each PDF page → PNG or JPEG, returned as a ZIP.
// Uses Ghostscript for high-quality rasterization.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-images", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rawFormat = String(req.body.format ?? "png").toLowerCase();
  const format: "png" | "jpeg" | "webp" | "avif" | "tiff" | "gif" =
    rawFormat === "jpeg" || rawFormat === "jpg"
      ? "jpeg"
      : rawFormat === "webp"
      ? "webp"
      : rawFormat === "avif"
      ? "avif"
      : rawFormat === "tiff" || rawFormat === "tif"
      ? "tiff"
      : rawFormat === "gif"
      ? "gif"
      : "png";

  const dpi = Math.min(300, Math.max(72, parseInt(String(req.body.dpi ?? "150")) || 150));
  const gsDevice = format === "jpeg" ? "jpeg" : "png16m";
  const gsExt = format === "jpeg" ? "jpg" : "png";
  const baseName = pdfBaseName(req.file.originalname);

  const transcodeImage = async (buf: Buffer): Promise<{ data: Buffer; mime: string; ext: string }> => {
    switch (format) {
      case "jpeg":
        return { data: buf, mime: "image/jpeg", ext: "jpg" };
      case "webp":
        return { data: Buffer.from(await sharp(buf).webp({ quality: 90 }).toBuffer()), mime: "image/webp", ext: "webp" };
      case "avif":
        return { data: Buffer.from(await sharp(buf).avif({ quality: 85 }).toBuffer()), mime: "image/avif", ext: "avif" };
      case "tiff":
        return { data: Buffer.from(await sharp(buf).tiff({ compression: "deflate" }).toBuffer()), mime: "image/tiff", ext: "tiff" };
      case "gif":
        return { data: Buffer.from(await sharp(buf).gif().toBuffer()), mime: "image/gif", ext: "gif" };
      case "png":
      default:
        return { data: buf, mime: "image/png", ext: "png" };
    }
  };

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPattern = join(workDir, `page-%d.${gsExt}`);

  try {
    await writeFile(inPath, req.file.buffer);
    await execFileAsync(BIN.gs, [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      `-sDEVICE=${gsDevice}`,
      `-r${dpi}`,
      `-sOutputFile=${outPattern}`,
      inPath,
    ], { timeout: 120_000 });

    const allFiles = await readdir(workDir);
    const imgFiles = allFiles
      .filter((f) => f.startsWith("page-") && f.endsWith(`.${gsExt}`))
      .sort((a, b) => {
        const n = (s: string) => parseInt(s.replace("page-", "").replace(`.${gsExt}`, "")) || 0;
        return n(a) - n(b);
      });

    if (imgFiles.length === 0) {
      apiError(res, 422, "CONVERSION_FAILED", "Ghostscript did not produce any image output. Check the PDF is valid.");
      return;
    }

    if (imgFiles.length === 1) {
      const rawBuf: Buffer = await readFile(join(workDir, imgFiles[0]));
      const { data, mime, ext } = await transcodeImage(rawBuf);
      res.set({
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${baseName}_page_1.${ext}"`,
        "Cache-Control": "no-store",
      });
      res.send(data);
    } else {
      const zipEntries: Record<string, Uint8Array> = {};
      let finalExt = "png";
      for (const f of imgFiles) {
        const pageNum = f.replace("page-", "").replace(`.${gsExt}`, "");
        const rawBuf: Buffer = await readFile(join(workDir, f));
        const { data, ext } = await transcodeImage(rawBuf);
        finalExt = ext;
        zipEntries[`${baseName}_page_${pageNum}.${ext}`] = new Uint8Array(data);
      }
      const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}_images_${finalExt}.zip"`,
        "X-Page-Count": String(imgFiles.length),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Page-Count",
      });
      res.send(zipBuf);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Conversion failed";
    const isMissing = msg.includes("ENOENT");
    apiError(res, isMissing ? 503 : 500, isMissing ? "BINARY_UNAVAILABLE" : "CONVERSION_FAILED", isMissing ? "Ghostscript is not installed on this server." : msg);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pdfa
// Convert PDF to PDF/A-2b standard for long-term archiving via Ghostscript
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-pdfa", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const conformance = String(req.body.conformance ?? "2b").toLowerCase();
  const pdfaLevel = conformance.startsWith("1") ? 1 : conformance.startsWith("3") ? 3 : 2;

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const rawOutputPath = join(workDir, "output_raw.pdf");

  try {
    await writeFile(inputPath, req.file.buffer);

    await execFileAsync(
      BIN.gs,
      [
        `-dPDFA=${pdfaLevel}`,
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sDEVICE=pdfwrite",
        "-sPDFACompatibilityPolicy=1",
        `-sOutputFile=${rawOutputPath}`,
        inputPath,
      ],
      { timeout: 120_000 },
    );

    const rawBytes = await readFile(rawOutputPath);
    const pdfaBuf = await linearizePdf(rawBytes);
    const baseName = pdfBaseName(req.file.originalname);
    const suffix = pdfaLevel === 1 ? "pdfa1b" : pdfaLevel === 3 ? "pdfa3b" : "pdfa2b";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_${suffix}.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(pdfaBuf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF/A conversion failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

export default router;
