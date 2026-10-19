import { Router } from "express";
import sharp from "sharp";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import {
  sharpFormatFromMime,
  extFromFormat,
} from "./image-helpers.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { cropImageBuffer } from "./image-crop-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import {
  compressImageBuffer,
  compressAtQuality,
  compressToTargetBytes,
  type CompressImageOptions,
} from "./image-compress-logic.js";

export { compressAtQuality, compressToTargetBytes, compressImageBuffer };

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/image-compress
// ─────────────────────────────────────────────────────────
router.post("/tools/image-compress", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const quality = Math.min(100, Math.max(1, parseInt(String(req.body.quality ?? "82")) || 82));
    const targetKB = parseFloat(String(req.body.targetKB ?? "0")) || 0;

    const resizeMode = (req.body.resizeMode === "percent" || req.body.resizeMode === "dimensions")
      ? req.body.resizeMode
      : "none";
    const resizePct = parseFloat(String(req.body.resizePct ?? "100")) || 100;
    const resizeW = parseInt(String(req.body.resizeW ?? "0")) || undefined;
    const resizeH = parseInt(String(req.body.resizeH ?? "0")) || undefined;
    const isGraphic = req.body.isGraphic === "true" || req.body.isGraphic === true;

    if (
      (resizeW !== undefined && (resizeW <= 0 || resizeW > 10000)) ||
      (resizeH !== undefined && (resizeH <= 0 || resizeH > 10000))
    ) {
      apiError(res, 400, "INVALID_PARAM", "Resize dimensions must be between 1 and 10,000 px.");
      return;
    }

    if (resizeMode === "percent" && (resizePct < 1 || resizePct > 500)) {
      apiError(res, 400, "INVALID_PARAM", "Resize percentage must be between 1% and 500%.");
      return;
    }

    const options: CompressImageOptions = {
      quality,
      targetKB,
      resizeMode,
      resizePct,
      resizeW,
      resizeH,
      isGraphic,
    };

    const result = await compressImageBuffer(req.file.buffer, req.file.mimetype, options);

    const baseName = (req.file.originalname ?? "image")
      .replace(/\.[^.]+$/, "")
      .replace(/["\r\n\\]/g, "_");

    res.set({
      "Content-Type": result.mime,
      "Content-Length": String(result.compressedSize),
      "X-Original-Size": String(result.originalSize),
      "X-Compressed-Size": String(result.compressedSize),
      "X-Compression-Gain": String(result.gain),
      "Content-Disposition": buildContentDisposition(`compressed_${baseName}.${result.ext}`, result.ext),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
    });
    res.send(result.buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Compression failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-resize
// ─────────────────────────────────────────────────────────
router.post("/tools/image-resize", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const width = parseInt(String(req.body.width ?? "0")) || undefined;
    const height = parseInt(String(req.body.height ?? "0")) || undefined;
    const percentage = parseFloat(String(req.body.percentage ?? "0")) || 0;

    if ((width && width > 10000) || (height && height > 10000)) {
      apiError(res, 400, "INVALID_PARAM", "Dimensions must not exceed 10,000 px.");
      return;
    }

    let pipeline: ReturnType<typeof sharp>;

    if (percentage > 0) {
      const meta = await sharp(input).metadata();
      const w = Math.round((meta.width ?? 1000) * percentage / 100);
      const h = Math.round((meta.height ?? 1000) * percentage / 100);
      pipeline = sharp(input).resize(w, h);
    } else if (width || height) {
      pipeline = sharp(input).resize(width, height, { withoutEnlargement: false });
    } else {
      apiError(res, 400, "MISSING_PARAM", "Provide width, height, or percentage.");
      return;
    }

    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await pipeline.toFormat(fmt, { quality: 92 }).toBuffer();

    res.set({
      "Content-Type": outMime,
      "X-Original-Size": String(input.length),
      "Content-Disposition": `attachment; filename="${baseName}_resized.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Resize failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-crop
// ─────────────────────────────────────────────────────────
router.post("/tools/image-crop", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const left = parseFloat(String(req.body.left ?? "0")) || 0;
    const top = parseFloat(String(req.body.top ?? "0")) || 0;
    const width = parseFloat(String(req.body.width ?? "0"));
    const height = parseFloat(String(req.body.height ?? "0"));

    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      apiError(res, 400, "MISSING_PARAM", "Provide valid left, top, width, height.");
      return;
    }

    const isGraphic = req.body.isGraphic === "true" || req.body.isGraphic === true;
    const requestedFormat = req.body.outputFormat ? String(req.body.outputFormat) : undefined;
    const parsedQ = req.body.quality ? parseInt(String(req.body.quality), 10) : undefined;
    const quality = parsedQ !== undefined && Number.isFinite(parsedQ) ? Math.min(100, Math.max(1, parsedQ)) : undefined;

    const { buffer, mime, ext } = await cropImageBuffer(req.file.buffer, {
      left,
      top,
      width,
      height,
      outputFormat: requestedFormat,
      quality,
      isGraphic,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_cropped.${ext}`, ext);

    res.set({
      "Content-Type": mime,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Crop failed");
  }
});

export default router;
