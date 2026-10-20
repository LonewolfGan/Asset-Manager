import { Router } from "express";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { applyWatermarkToImage, type NinePointPosition } from "./watermark-logic.js";
import { generateFaviconPack } from "./favicon-logic.js";
import { transformFlipRotate } from "./flip-rotate-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/flip-rotate
// ─────────────────────────────────────────────────────────
router.post("/tools/flip-rotate", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const parsedRot = parseFloat(String(req.body.rotation ?? "0"));
    const rotation = Number.isFinite(parsedRot) ? parsedRot : 0;
    const flipH = req.body.flipH === "true" || req.body.flipH === true;
    const flipV = req.body.flipV === "true" || req.body.flipV === true;
    const requestedFormat = req.body.outputFormat ? String(req.body.outputFormat) : undefined;
    const parsedQ = req.body.quality ? parseInt(String(req.body.quality), 10) : undefined;
    const quality = parsedQ !== undefined && Number.isFinite(parsedQ) ? Math.min(100, Math.max(1, parsedQ)) : undefined;

    const { buffer, mime, ext } = await transformFlipRotate(req.file.buffer, {
      rotation,
      flipH,
      flipV,
      outputFormat: requestedFormat,
      quality,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_edited.${ext}`, ext);

    res.set({
      "Content-Type": mime,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Transform failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/watermark-image
// ─────────────────────────────────────────────────────────
router.post("/tools/watermark-image", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const text = String(req.body.text ?? "Watermark").slice(0, 200);
    const opacity = req.body.opacity !== undefined ? parseFloat(String(req.body.opacity)) : 0.75;
    const mode = req.body.mode === "tile" ? "tile" : "points";
    const color = String(req.body.color ?? "#ffffff");
    const fontSize = req.body.fontSize ? parseInt(String(req.body.fontSize), 10) : undefined;
    const rotation = req.body.rotation ? parseFloat(String(req.body.rotation)) : undefined;
    const requestedFormat = String(req.body.outputFormat ?? req.file.mimetype);

    let position: NinePointPosition | NinePointPosition[] = "center";
    if (req.body.position) {
      if (Array.isArray(req.body.position)) {
        position = req.body.position as NinePointPosition[];
      } else if (typeof req.body.position === "string" && req.body.position.includes(",")) {
        position = req.body.position.split(",").map((s: string) => s.trim()) as NinePointPosition[];
      } else {
        position = String(req.body.position) as NinePointPosition;
      }
    }

    const parsedQ = req.body.quality ? parseInt(String(req.body.quality), 10) : 90;
    const safeQuality = Number.isFinite(parsedQ) ? Math.min(100, Math.max(1, parsedQ)) : 90;
    const hasShadow = req.body.hasShadow !== undefined
      ? req.body.hasShadow === "true" || req.body.hasShadow === true
      : undefined;

    const { buffer, mime, ext } = await applyWatermarkToImage(req.file.buffer, {
      text,
      opacity,
      mode,
      color,
      fontSize,
      rotation,
      position,
      hasShadow,
      outputFormat: requestedFormat,
      quality: safeQuality,
    });

    const originalName = req.file.originalname ?? "image";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_watermarked.${ext}`, ext);

    res.set({
      "Content-Type": mime,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Watermark failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/favicon-generate
// ─────────────────────────────────────────────────────────
router.post("/tools/favicon-generate", defaultRateLimit, upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim().slice(0, 100) : undefined;
    const shortName = typeof req.body.shortName === "string" ? req.body.shortName.trim().slice(0, 50) : undefined;
    const themeColor = typeof req.body.themeColor === "string" ? req.body.themeColor.trim().slice(0, 30) : undefined;
    const backgroundColor = typeof req.body.backgroundColor === "string" ? req.body.backgroundColor.trim().slice(0, 30) : undefined;
    const fit = req.body.fit === "contain" ? "contain" : "cover";

    const zipBuffer = await generateFaviconPack(req.file.buffer, {
      name,
      shortName,
      themeColor,
      backgroundColor,
      fit,
    });

    const originalName = req.file.originalname ?? "favicon";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const disposition = buildContentDisposition(`${rawBase}_favicons.zip`, "zip");

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    });
    res.send(zipBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Favicon generation failed");
  }
});

export default router;
