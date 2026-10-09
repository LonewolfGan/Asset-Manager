import { Router, type IRouter } from "express";
import { apiError } from "../../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload, guardImage } from "../../middlewares/upload.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";

const execFileAsync = promisify(execFile);
const router: IRouter = Router();

// ─────────────────────────────────────────────────────────
// Potrace: PNG → real SVG vector via bitmap tracing
// ─────────────────────────────────────────────────────────
function buildPBM(grayscale: Buffer, width: number, height: number): Buffer {
  const header = Buffer.from(`P4\n${width} ${height}\n`, "ascii");
  const rowBytes = Math.ceil(width / 8);
  const bitmap = Buffer.alloc(height * rowBytes, 0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grayscale[y * width + x] < 128) {
        const bi = y * rowBytes + Math.floor(x / 8);
        bitmap[bi] |= 1 << (7 - (x % 8));
      }
    }
  }
  return Buffer.concat([header, bitmap]);
}

async function convertToSvgWithPotrace(inputBuffer: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(inputBuffer)
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pbm = buildPBM(data, info.width, info.height);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pbmPath = join(workDir, "input.pbm");
  const svgPath = join(workDir, "output.svg");

  try {
    await writeFile(pbmPath, pbm);
    await execFileAsync(BIN.potrace, [
      "--svg",
      "--turdsize", "4",
      "--alphamax", "1",
      "-o", svgPath,
      pbmPath,
    ], { timeout: 30_000 });
    return await readFile(svgPath);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

const SHARP_SUPPORTED = new Set(["jpeg", "png", "webp", "avif", "gif", "tiff"]);

const mimeToSharpFormat = (mime: string): keyof sharp.FormatEnum | null => {
  const map: Record<string, keyof sharp.FormatEnum> = {
    "image/jpeg": "jpeg", "image/jpg": "jpeg",
    "image/png": "png", "image/webp": "webp",
    "image/avif": "avif", "image/gif": "gif", "image/tiff": "tiff",
  };
  return map[mime] ?? null;
};

// ─────────────────────────────────────────────────────────
// POST /convert/image
// ─────────────────────────────────────────────────────────
router.post("/convert/image", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  const { format, quality, width, height } = req.body as {
    format?: string; quality?: string; width?: string; height?: string;
  };
  if (!format) { apiError(res, 400, "MISSING_PARAM", "format field required"); return; }

  const originalBase = (req.file.originalname ?? "converted").replace(/\.[^.]+$/, "");

  if (format === "image/svg+xml") {
    try {
      const svgBuf = await convertToSvgWithPotrace(req.file.buffer);
      res.set("Content-Type", "image/svg+xml");
      res.set("Content-Disposition", `attachment; filename="${originalBase}.svg"`);
      res.set("Cache-Control", "no-store");
      res.send(svgBuf);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "SVG vectorization failed");
    }
    return;
  }

  const sharpFormat = mimeToSharpFormat(format);
  if (!sharpFormat || !SHARP_SUPPORTED.has(sharpFormat)) {
    apiError(res, 422, "UNSUPPORTED_FORMAT", `Format ${format} is not supported server-side. Use client-side conversion.`, "clientFallback=true");
    return;
  }

  try {
    const qualityNum = quality ? Math.round(parseFloat(quality) * 100) : 80;
    const widthNum = width ? parseInt(width, 10) : undefined;
    const heightNum = height ? parseInt(height, 10) : undefined;
    if ((widthNum && widthNum > 10000) || (heightNum && heightNum > 10000)) {
      apiError(res, 400, "INVALID_PARAM", "Resize dimensions must not exceed 10,000 px."); return;
    }
    let pipeline = sharp(req.file.buffer);
    if (widthNum || heightNum) {
      pipeline = pipeline.resize(widthNum, heightNum, { fit: "inside", withoutEnlargement: true });
    }
    const outputBuffer = await pipeline.toFormat(sharpFormat, { quality: qualityNum }).toBuffer();
    const ext = sharpFormat === "jpeg" ? "jpg" : sharpFormat;
    res.set("Content-Type", format);
    res.set("Content-Disposition", `attachment; filename="${originalBase}.${ext}"`);
    res.set("Cache-Control", "no-store");
    res.send(outputBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// HEIC Helpers
// ─────────────────────────────────────────────────────────
async function heicViaSharp(inputBuffer: Buffer, outputMime: string): Promise<Buffer> {
  const fmt = mimeToSharpFormat(outputMime);
  if (!fmt) throw new Error(`Unsupported output format: ${outputMime}`);
  return sharp(inputBuffer).toFormat(fmt, { quality: 90 }).toBuffer();
}

async function heicViaPython(inputBuffer: Buffer, outputMime: string, workDir: string): Promise<Buffer> {
  const fmtMap: Record<string, string> = {
    "image/jpeg": "JPEG", "image/jpg": "JPEG",
    "image/png": "PNG", "image/webp": "WEBP",
  };
  const fmt = fmtMap[outputMime];
  if (!fmt) throw new Error(`Unsupported HEIC output format for Python bridge: ${outputMime}`);
  const extMap: Record<string, string> = { JPEG: "jpg", PNG: "png", WEBP: "webp" };
  const inputPath = join(workDir, "input.heic");
  const outputPath = join(workDir, `output.${extMap[fmt]}`);
  await writeFile(inputPath, inputBuffer);
  const heicScript = getPythonScriptPath("heic_convert.py");
  await execFileAsync(BIN.python3, [heicScript, "--input", inputPath, "--output", outputPath, "--format", fmt], { timeout: 60_000 });
  return readFile(outputPath);
}

// ─────────────────────────────────────────────────────────
// POST /convert/heic
// ─────────────────────────────────────────────────────────
router.post("/convert/heic", defaultRateLimit, upload.single("file"), async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  const mime = req.file.mimetype.toLowerCase();
  if (!mime.includes("heic") && !mime.includes("heif") && !req.file.originalname?.match(/\.(heic|heif)$/i)) {
    apiError(res, 415, "UNSUPPORTED_TYPE", "Only HEIC/HEIF files are accepted.");
    return;
  }
  if (req.file.size > 30 * 1024 * 1024) {
    apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 30 MB for HEIC conversion.");
    return;
  }

  const outputMime = String(req.body.format ?? "image/jpeg");
  const baseName = (req.file.originalname ?? "image").replace(/\.(heic|heif)$/i, "");
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg", "image/jpg": "jpg",
    "image/png": "png", "image/webp": "webp", "application/pdf": "pdf",
  };

  if (outputMime === "application/pdf") {
    try {
      let jpegBuf: Buffer;
      try {
        jpegBuf = await heicViaSharp(req.file.buffer, "image/jpeg");
      } catch {
        const id = randomUUID();
        const workDir = join(tmpdir(), "everydaytools", id);
        await mkdir(workDir, { recursive: true });
        try {
          jpegBuf = await heicViaPython(req.file.buffer, "image/jpeg", workDir);
        } finally {
          await rm(workDir, { recursive: true, force: true }).catch(() => {});
        }
      }
      const A4W = 595.28, A4H = 841.89, MARGIN = 40;
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([A4W, A4H]);
      const img = await pdfDoc.embedJpg(jpegBuf);
      const maxW = A4W - 2 * MARGIN, maxH = A4H - 2 * MARGIN;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const dw = img.width * scale, dh = img.height * scale;
      page.drawImage(img, { x: (A4W - dw) / 2, y: (A4H - dh) / 2, width: dw, height: dh });
      const pdfBytes = await pdfDoc.save();
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${baseName}.pdf"`, "Cache-Control": "no-store" });
      res.send(Buffer.from(pdfBytes));
    } catch (err) {
      apiError(res, 500, "HEIC_CONVERSION_FAILED", err instanceof Error ? err.message : "HEIC to PDF failed");
    }
    return;
  }

  const ext = extMap[outputMime] ?? "jpg";
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });

  try {
    let outputBuf: Buffer;
    try {
      outputBuf = await heicViaSharp(req.file.buffer, outputMime);
    } catch {
      outputBuf = await heicViaPython(req.file.buffer, outputMime, workDir);
    }
    const normalizedMime = outputMime === "image/jpg" ? "image/jpeg" : outputMime;
    res.set({ "Content-Type": normalizedMime, "Content-Disposition": `attachment; filename="${baseName}.${ext}"`, "Cache-Control": "no-store" });
    res.send(outputBuf);
  } catch (err) {
    apiError(res, 500, "HEIC_CONVERSION_FAILED", err instanceof Error ? err.message : "HEIC conversion failed. Ensure libvips is compiled with HEIF support or pillow-heif is installed.");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/image-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/convert/image-to-pdf", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const A4W = 595.28, A4H = 841.89, MARGIN = 40;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4W, A4H]);

    let imgBuf: Buffer;
    let isPNG = false;
    if (req.file.mimetype === "image/png") {
      imgBuf = req.file.buffer; isPNG = true;
    } else if (req.file.mimetype === "image/svg+xml") {
      imgBuf = await sharp(req.file.buffer).png().toBuffer(); isPNG = true;
    } else {
      imgBuf = await sharp(req.file.buffer).jpeg({ quality: 92 }).toBuffer();
    }

    const img = isPNG ? await pdfDoc.embedPng(imgBuf) : await pdfDoc.embedJpg(imgBuf);
    const maxW = A4W - 2 * MARGIN, maxH = A4H - 2 * MARGIN;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = img.width * scale, dh = img.height * scale;
    page.drawImage(img, { x: (A4W - dw) / 2, y: (A4H - dh) / 2, width: dw, height: dh });

    const pdfBytes = await pdfDoc.save();
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="${baseName}.pdf"`);
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

export default router;
