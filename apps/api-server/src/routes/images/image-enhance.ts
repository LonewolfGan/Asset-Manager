import { Router } from "express";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { upscaleImageBuffer } from "./image-upscale-logic.js";
import { cleanImageMetadata, applyImageFilter, SUPPORTED_IMAGE_FILTERS } from "./image-filter-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/image-metadata-clean
// ─────────────────────────────────────────────────────────
router.post("/tools/image-metadata-clean", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const requestedFormat = req.body.outputFormat ? String(req.body.outputFormat) : undefined;
    const parsedQ = req.body.quality ? parseInt(String(req.body.quality), 10) : undefined;
    const quality = parsedQ !== undefined && Number.isFinite(parsedQ) ? Math.min(100, Math.max(1, parsedQ)) : undefined;
    const isGraphic = req.body.isGraphic === "true" || req.body.isGraphic === true;

    const { buffer, mime, ext, originalSize, cleanedSize } = await cleanImageMetadata(req.file.buffer, {
      outputFormat: requestedFormat,
      quality,
      isGraphic,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_clean.${ext}`, ext);

    res.set({
      "Content-Type": mime,
      "Content-Disposition": disposition,
      "X-Original-Size": String(originalSize),
      "X-Cleaned-Size": String(cleanedSize),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Cleaned-Size",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Metadata cleaning failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-filter
// ─────────────────────────────────────────────────────────
router.post("/tools/image-filter", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const filter = String(req.body.filter ?? "grayscale").toLowerCase();
    if (!SUPPORTED_IMAGE_FILTERS.has(filter)) {
      apiError(res, 400, "INVALID_FILTER", `Filter "${filter}" is not supported`);
      return;
    }
    const rawValue = req.body.value !== undefined ? parseFloat(String(req.body.value)) : undefined;
    const value = rawValue !== undefined && Number.isFinite(rawValue) ? rawValue : undefined;
    const requestedFormat = req.body.outputFormat ? String(req.body.outputFormat) : undefined;
    const parsedQ = req.body.quality ? parseInt(String(req.body.quality), 10) : undefined;
    const quality = parsedQ !== undefined && Number.isFinite(parsedQ) ? Math.min(100, Math.max(1, parsedQ)) : undefined;
    const isGraphic = req.body.isGraphic === "true" || req.body.isGraphic === true;

    const { buffer, mime, ext } = await applyImageFilter(req.file.buffer, {
      filter,
      value,
      outputFormat: requestedFormat,
      quality,
      isGraphic,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_${filter}.${ext}`, ext);

    res.set({
      "Content-Type": mime,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image filter failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-upscale
// ─────────────────────────────────────────────────────────
router.post("/tools/image-upscale", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const scale = parseInt(String(req.body.scale ?? "2"), 10) === 4 ? 4 : 2;
    const shouldSharpen = req.body.sharpen !== "false";
    const requestedFormat = (req.body.outputFormat as string) || (req.body.format as string) || req.file.mimetype;

    const { buffer, mime: outMime, ext } = await upscaleImageBuffer(req.file.buffer, {
      scale,
      sharpen: shouldSharpen,
      outputFormat: requestedFormat,
      quality: 92,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_upscaled_${scale}x.${ext}`, ext);

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image upscale failed");
  }
});

export default router;
