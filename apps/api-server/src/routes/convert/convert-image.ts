import { Router, type IRouter } from "express";
import { apiError } from "../../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { upload, guardImage } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { convertToSvgWithPotrace } from "./potrace-vectorize.js";
import {
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
  getOptimizedTiffOptions,
} from "../images/image-helpers.js";
import { convertHeicBuffer } from "./heic-logic.js";

const router: IRouter = Router();

const SHARP_SUPPORTED = new Set(["jpeg", "png", "webp", "avif", "gif", "tiff"]);

export const mimeToSharpFormat = (mime: string): keyof sharp.FormatEnum | null => {
  const map: Record<string, keyof sharp.FormatEnum> = {
    "image/jpeg": "jpeg", "image/jpg": "jpeg", "image/png": "png",
    "image/webp": "webp", "image/avif": "avif", "image/gif": "gif", "image/tiff": "tiff",
  };
  return map[mime] ?? null;
};

/**
 * Builds RFC 5987 / RFC 6266 Content-Disposition header with full UTF-8 and quote escaping.
 */
export function buildContentDisposition(originalName: string, ext: string): string {
  const rawBase = originalName.replace(/\.[^.]+$/, "").trim();
  const safeBase = rawBase || "image";
  const asciiBase = safeBase.replace(/[^\x20-\x7E]/g, "_").replace(/["\r\n\\]/g, "_").trim() || "image";
  const rfc5987Encoded = encodeURIComponent(`${safeBase}.${ext}`).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return `attachment; filename="${asciiBase}.${ext}"; filename*=UTF-8''${rfc5987Encoded}`;
}

export interface ConvertImageOptions {
  format: string;
  quality?: number;
  width?: number;
  height?: number;
  isGeometric?: boolean;
  animated?: boolean;
}

/**
 * Universal Image Conversion Engine with Pareto quality/speed optimization,
 * Lanczos3 downscaling, sRGB color normalization, and Potrace vectorization.
 */
export async function convertImageBuffer(
  inputBuffer: Buffer,
  options: ConvertImageOptions
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const { format, quality, width, height, isGeometric, animated } = options;
  if (format === "image/svg+xml") {
    const svgBuf = await convertToSvgWithPotrace(inputBuffer, isGeometric);
    return { buffer: svgBuf, mime: "image/svg+xml", ext: "svg" };
  }
  const sharpFormat = mimeToSharpFormat(format);
  if (!sharpFormat || !SHARP_SUPPORTED.has(sharpFormat)) {
    throw new Error(`UNSUPPORTED_FORMAT: Format ${format} is not supported server-side.`);
  }

  if (
    (width !== undefined && (!Number.isInteger(width) || width <= 0 || width > 10000)) ||
    (height !== undefined && (!Number.isInteger(height) || height <= 0 || height > 10000))
  ) {
    throw new Error("INVALID_PARAM: Resize dimensions must be positive integers not exceeding 10,000 px.");
  }

  const qualityNum = quality ? Math.min(100, Math.max(1, quality)) : 80;
  let pipeline = createColorManagedPipeline(inputBuffer, Boolean(animated));

  if (sharpFormat === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 });
  }

  if (sharpFormat === "jpeg") pipeline = pipeline.jpeg(getOptimizedJpegOptions(qualityNum, isGeometric));
  else if (sharpFormat === "webp") pipeline = pipeline.webp(getOptimizedWebpOptions(qualityNum, isGeometric));
  else if (sharpFormat === "avif") pipeline = pipeline.avif(getOptimizedAvifOptions(qualityNum, isGeometric));
  else if (sharpFormat === "png") pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  else if (sharpFormat === "tiff") pipeline = pipeline.tiff(getOptimizedTiffOptions(qualityNum));
  else pipeline = pipeline.toFormat(sharpFormat);

  const outputBuffer = await pipeline.toBuffer();
  return { buffer: outputBuffer, mime: format, ext: sharpFormat === "jpeg" ? "jpg" : sharpFormat };
}

// POST /convert/image
router.post("/convert/image", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  const { format, quality, width, height, isGeometric, animated } = req.body as {
    format?: string; quality?: string; width?: string; height?: string; isGeometric?: string; animated?: string | boolean;
  };
  if (!format) { apiError(res, 400, "MISSING_PARAM", "format field required"); return; }

  const parsedQ = quality ? parseFloat(quality) : undefined;
  const resolvedQuality = parsedQ !== undefined && !Number.isNaN(parsedQ)
    ? (parsedQ <= 1 && parsedQ > 0 ? Math.round(parsedQ * 100) : Math.round(parsedQ))
    : 80;

  const widthNum = width ? parseInt(width, 10) : undefined;
  const heightNum = height ? parseInt(height, 10) : undefined;

  try {
    const { buffer, mime, ext } = await convertImageBuffer(req.file.buffer, {
      format,
      quality: resolvedQuality,
      width: widthNum,
      height: heightNum,
      isGeometric: isGeometric === "true",
      animated: animated === undefined ? format === "image/gif" : (animated === true || animated === "true"),
    });
    res.set({
      "Content-Type": mime,
      "Content-Disposition": buildContentDisposition(req.file.originalname ?? "converted", ext),
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Conversion failed";
    if (message.startsWith("UNSUPPORTED_FORMAT")) {
      res.status(422).json({ error: true, code: "UNSUPPORTED_FORMAT", message, clientFallback: true });
      return;
    }
    if (message.startsWith("INVALID_PARAM")) {
      apiError(res, 400, "INVALID_PARAM", message);
      return;
    }
    apiError(res, 500, "CONVERSION_FAILED", message);
  }
});

// POST /convert/heic
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
  try {
    const { buffer, mime: outMime, ext } = await convertHeicBuffer(req.file.buffer, {
      outputMime,
      originalName: req.file.originalname,
    });
    res.set({
      "Content-Type": outMime,
      "Content-Disposition": buildContentDisposition(req.file.originalname ?? "image", ext),
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "HEIC_CONVERSION_FAILED", err instanceof Error ? err.message : "HEIC conversion failed");
  }
});

// POST /convert/image-to-pdf
router.post("/convert/image-to-pdf", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const A4W = 595.28, A4H = 841.89, MARGIN = 40;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4W, A4H]);

    let imgBuf: Buffer;
    let isPNG = false;
    if (req.file.mimetype === "image/png") {
      imgBuf = await createColorManagedPipeline(req.file.buffer).png().toBuffer();
      isPNG = true;
    } else if (req.file.mimetype === "image/svg+xml") {
      imgBuf = await sharp(req.file.buffer).png().toBuffer();
      isPNG = true;
    } else {
      imgBuf = await createColorManagedPipeline(req.file.buffer).jpeg(getOptimizedJpegOptions(92)).toBuffer();
    }

    const img = isPNG ? await pdfDoc.embedPng(imgBuf) : await pdfDoc.embedJpg(imgBuf);
    const maxW = A4W - 2 * MARGIN, maxH = A4H - 2 * MARGIN;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = img.width * scale, dh = img.height * scale;
    page.drawImage(img, { x: (A4W - dw) / 2, y: (A4H - dh) / 2, width: dw, height: dh });

    const pdfBytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": buildContentDisposition(req.file.originalname ?? "image", "pdf"),
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

export default router;

