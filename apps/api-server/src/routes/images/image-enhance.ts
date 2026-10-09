import { Router } from "express";
import sharp from "sharp";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import { sharpFormatFromMime, extFromFormat } from "./image-helpers.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/image-metadata-clean
// ─────────────────────────────────────────────────────────
router.post("/tools/image-metadata-clean", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await sharp(input).toFormat(fmt, { quality: 95 }).toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_clean.${ext}"`,
      "X-Original-Size": String(input.length),
      "X-Cleaned-Size": String(output.length),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Cleaned-Size",
    });
    res.send(output);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Metadata cleaning failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-filter
// ─────────────────────────────────────────────────────────
router.post("/tools/image-filter", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const filter = String(req.body.filter ?? "grayscale").toLowerCase();
    const value = parseFloat(String(req.body.value ?? "1"));

    let pipeline = sharp(input);

    switch (filter) {
      case "grayscale":
      case "blackwhite":
        pipeline = pipeline.grayscale();
        break;
      case "sepia":
        pipeline = pipeline.recomb([
          [0.393, 0.769, 0.189],
          [0.349, 0.686, 0.168],
          [0.272, 0.534, 0.131],
        ]);
        break;
      case "invert":
      case "negative":
        pipeline = pipeline.negate({ alpha: false });
        break;
      case "blur":
        const sigma = Math.min(20, Math.max(0.3, isNaN(value) ? 5 : value));
        pipeline = pipeline.blur(sigma);
        break;
      case "sharpen":
        pipeline = pipeline.sharpen(isNaN(value) ? 2 : value);
        break;
      case "brightness":
        const bVal = isNaN(value) ? 1.2 : Math.max(0.1, Math.min(3, value));
        pipeline = pipeline.modulate({ brightness: bVal });
        break;
      case "contrast":
        const linearFactor = isNaN(value) ? 1.3 : Math.max(0.1, Math.min(3, value));
        pipeline = pipeline.linear(linearFactor, -(128 * linearFactor) + 128);
        break;
      default:
        pipeline = pipeline.grayscale();
    }

    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await pipeline.toFormat(fmt, { quality: 90 }).toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_${filter}.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image filter failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-upscale
// ─────────────────────────────────────────────────────────
router.post("/tools/image-upscale", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const scale = parseInt(String(req.body.scale ?? "2"), 10) === 4 ? 4 : 2;
    const shouldSharpen = req.body.sharpen !== "false";

    const meta = await sharp(input).metadata();
    const origW = meta.width ?? 800;
    const origH = meta.height ?? 600;

    const targetW = Math.min(8000, origW * scale);
    const targetH = Math.min(8000, origH * scale);

    let pipeline = sharp(input).resize({
      width: targetW,
      height: targetH,
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    });

    if (shouldSharpen) {
      pipeline = pipeline.sharpen({
        sigma: 1.0,
        m1: 1.2,
        m2: 0.5,
      });
    }

    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await pipeline.toFormat(fmt, { quality: 95 }).toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_upscaled_${scale}x.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image upscale failed");
  }
});

export default router;
