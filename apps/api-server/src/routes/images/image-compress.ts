import { Router } from "express";
import sharp from "sharp";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import { sharpFormatFromMime, extFromFormat } from "./image-helpers.js";

const router = Router();

export async function compressAtQuality(
  input: Buffer,
  mime: string,
  quality: number,
  cachedDeflate?: Buffer,
  strictTarget?: boolean,
): Promise<{ output: Buffer; outMime: string }> {
  const q = Math.min(100, Math.max(1, quality));
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return {
      output: await sharp(input).jpeg({ quality: q, mozjpeg: true }).toBuffer(),
      outMime: "image/jpeg",
    };
  }
  if (mime === "image/png") {
    const colours = Math.max(16, Math.min(256, Math.round((q / 100) * 256)));
    const deflate = cachedDeflate ?? await sharp(input).png({ compressionLevel: 9, effort: 7 }).toBuffer();
    const palette = await sharp(input).png({ compressionLevel: 9, effort: 7, palette: true, colours, dither: 1 }).toBuffer();
    let best = deflate.length < input.length ? deflate : input;
    const threshold = strictTarget ? 1.0 : 0.85;
    if (palette.length < best.length * threshold) best = palette;
    return { output: best, outMime: "image/png" };
  }
  if (mime === "image/webp") {
    return {
      output: await sharp(input).webp({ quality: q, effort: 6 }).toBuffer(),
      outMime: "image/webp",
    };
  }
  if (mime === "image/avif") {
    return {
      output: await sharp(input).avif({ quality: Math.min(q, 80), effort: 7 }).toBuffer(),
      outMime: "image/avif",
    };
  }
  return {
    output: await sharp(input).jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
    outMime: "image/jpeg",
  };
}

export async function compressToTargetBytes(
  input: Buffer,
  mime: string,
  targetBytes: number,
): Promise<Buffer> {
  let cachedDeflate: Buffer | undefined;
  if (mime === "image/png") {
    cachedDeflate = await sharp(input).png({ compressionLevel: 9, effort: 7 }).toBuffer();
    if (cachedDeflate.length <= targetBytes) {
      return cachedDeflate;
    }
  }

  let lo = 1;
  let hi = 95;
  let best: Buffer | null = null;

  for (let i = 0; i < 6; i++) {
    const mid = Math.round((lo + hi) / 2);
    const { output } = await compressAtQuality(input, mime, mid, cachedDeflate, true);
    if (output.length <= targetBytes) {
      best = output;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
    if (lo > hi) break;
  }

  if (!best) {
    const { output } = await compressAtQuality(input, mime, 1, cachedDeflate, true);
    best = output;
  }
  return best;
}

// ─────────────────────────────────────────────────────────
// POST /tools/image-compress
// ─────────────────────────────────────────────────────────
router.post("/tools/image-compress", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const quality = Math.min(100, Math.max(1, parseInt(String(req.body.quality ?? "82")) || 82));
    const targetKB = parseFloat(String(req.body.targetKB ?? "0")) || 0;

    const resizeMode = String(req.body.resizeMode ?? "none");
    const resizePct = parseFloat(String(req.body.resizePct ?? "100")) || 100;
    const resizeW = parseInt(String(req.body.resizeW ?? "0")) || undefined;
    const resizeH = parseInt(String(req.body.resizeH ?? "0")) || undefined;

    if ((resizeW && resizeW > 10000) || (resizeH && resizeH > 10000)) {
      apiError(res, 400, "INVALID_PARAM", "Resize dimensions must not exceed 10,000 px.");
      return;
    }

    let workingBuffer = input;

    if (resizeMode === "percent" && resizePct !== 100) {
      const meta = await sharp(input).metadata();
      const w = Math.round((meta.width ?? 1000) * resizePct / 100);
      const h = Math.round((meta.height ?? 1000) * resizePct / 100);
      workingBuffer = await sharp(input).resize(w, h).toBuffer();
    } else if (resizeMode === "dimensions" && (resizeW || resizeH)) {
      workingBuffer = await sharp(input)
        .resize(resizeW, resizeH, { fit: "inside", withoutEnlargement: true })
        .toBuffer();
    }

    let output: Buffer;
    let outMime: string;

    if (targetKB > 0) {
      output = await compressToTargetBytes(workingBuffer, mime, targetKB * 1024);
      outMime = mime === "image/jpg" ? "image/jpeg" : mime;
    } else {
      ({ output, outMime } = await compressAtQuality(workingBuffer, mime, quality));
    }

    const finalBuffer = output.length < workingBuffer.length ? output : workingBuffer;
    const effectiveMime = finalBuffer === workingBuffer ? (mime === "image/jpg" ? "image/jpeg" : mime) : outMime;
    const gain = Math.round((1 - finalBuffer.length / input.length) * 100);
    const fmt = sharpFormatFromMime(effectiveMime);
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    res.set({
      "Content-Type": effectiveMime,
      "Content-Length": String(finalBuffer.length),
      "X-Original-Size": String(input.length),
      "X-Compressed-Size": String(finalBuffer.length),
      "X-Compression-Gain": String(gain),
      "Content-Disposition": `attachment; filename="compressed_${baseName}.${ext}"`,
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
    });
    res.send(finalBuffer);
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
router.post("/tools/image-crop", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const left = Math.round(parseFloat(String(req.body.left ?? "0")) || 0);
    const top = Math.round(parseFloat(String(req.body.top ?? "0")) || 0);
    const width = Math.round(parseFloat(String(req.body.width ?? "0")));
    const height = Math.round(parseFloat(String(req.body.height ?? "0")));

    if (!width || !height || width < 1 || height < 1) {
      apiError(res, 400, "MISSING_PARAM", "Provide left, top, width, height.");
      return;
    }

    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await sharp(input)
      .extract({ left, top, width, height })
      .toFormat(fmt, { quality: 92 })
      .toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_cropped.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Crop failed");
  }
});

export default router;
