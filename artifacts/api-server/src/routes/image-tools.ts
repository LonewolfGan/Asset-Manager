import { Router } from "express";
import sharp from "sharp";
import { zipSync } from "fflate";
import { upload, guardImage } from "../middlewares/upload.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

async function compressAtQuality(
  input: Buffer,
  mime: string,
  quality: number,
): Promise<{ output: Buffer; outMime: string }> {
  const q = Math.min(100, Math.max(1, quality));
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return {
      output: await sharp(input).jpeg({ quality: q, mozjpeg: true }).toBuffer(),
      outMime: "image/jpeg",
    };
  }
  if (mime === "image/png") {
    return {
      output: await sharp(input)
        .png({ compressionLevel: 9, palette: true, effort: 10, quality: q })
        .toBuffer(),
      outMime: "image/png",
    };
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

async function compressToTargetBytes(
  input: Buffer,
  mime: string,
  targetBytes: number,
): Promise<Buffer> {
  let lo = 1;
  let hi = 95;
  let best: Buffer | null = null;

  for (let i = 0; i < 14; i++) {
    const mid = Math.round((lo + hi) / 2);
    const { output } = await compressAtQuality(input, mime, mid);
    if (output.length <= targetBytes) {
      best = output;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
    if (lo > hi) break;
  }

  if (!best) {
    const { output } = await compressAtQuality(input, mime, 1);
    best = output;
  }
  return best;
}

function sharpFormatFromMime(mime: string): "jpeg" | "png" | "webp" | "avif" | "gif" | "tiff" {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpeg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  if (mime === "image/gif") return "gif";
  if (mime === "image/tiff") return "tiff";
  return "jpeg";
}

function extFromFormat(fmt: string): string {
  if (fmt === "jpeg") return "jpg";
  return fmt;
}

// ─────────────────────────────────────────────────────────
// POST /tools/image-compress
// ─────────────────────────────────────────────────────────
router.post("/tools/image-compress", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

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
      res.status(400).json({ error: "Resize dimensions must not exceed 10,000 px." });
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

    const finalBuffer = output.length < input.length ? output : input;
    const gain = Math.round((1 - finalBuffer.length / input.length) * 100);
    const fmt = sharpFormatFromMime(outMime);
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    res.set({
      "Content-Type": outMime,
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
    res.status(500).json({ error: err instanceof Error ? err.message : "Compression failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-resize
// ─────────────────────────────────────────────────────────
router.post("/tools/image-resize", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const width = parseInt(String(req.body.width ?? "0")) || undefined;
    const height = parseInt(String(req.body.height ?? "0")) || undefined;
    const percentage = parseFloat(String(req.body.percentage ?? "0")) || 0;

    if ((width && width > 10000) || (height && height > 10000)) {
      res.status(400).json({ error: "Dimensions must not exceed 10,000 px." });
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
      res.status(400).json({ error: "Provide width, height, or percentage." });
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
    res.status(500).json({ error: err instanceof Error ? err.message : "Resize failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-crop
// ─────────────────────────────────────────────────────────
router.post("/tools/image-crop", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const left = Math.round(parseFloat(String(req.body.left ?? "0")) || 0);
    const top = Math.round(parseFloat(String(req.body.top ?? "0")) || 0);
    const width = Math.round(parseFloat(String(req.body.width ?? "0")));
    const height = Math.round(parseFloat(String(req.body.height ?? "0")));

    if (!width || !height || width < 1 || height < 1) {
      res.status(400).json({ error: "Provide left, top, width, height." });
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
    res.status(500).json({ error: err instanceof Error ? err.message : "Crop failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/flip-rotate
// ─────────────────────────────────────────────────────────
router.post("/tools/flip-rotate", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const rotation = parseInt(String(req.body.rotation ?? "0")) || 0;
    const flipH = req.body.flipH === "true";
    const flipV = req.body.flipV === "true";
    const requestedFormat = String(req.body.outputFormat ?? mime);

    const fmt = sharpFormatFromMime(requestedFormat);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    let pipeline = sharp(input);
    if (rotation) pipeline = pipeline.rotate(rotation);
    if (flipH) pipeline = pipeline.flop();
    if (flipV) pipeline = pipeline.flip();

    const output = await pipeline.toFormat(fmt, { quality: 92 }).toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_edited.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Transform failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/watermark-image
// ─────────────────────────────────────────────────────────
router.post("/tools/watermark-image", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const text = String(req.body.text ?? "Watermark").slice(0, 100);
    const opacity = Math.min(1, Math.max(0, parseFloat(String(req.body.opacity ?? "0.5"))));
    const position = String(req.body.position ?? "center");

    const meta = await sharp(input).metadata();
    const imgW = meta.width ?? 800;
    const imgH = meta.height ?? 600;

    const fontSize = Math.max(24, Math.round(Math.min(imgW, imgH) * 0.08));
    const approxTextW = text.length * fontSize * 0.55;
    const svgW = Math.ceil(approxTextW + 60);
    const svgH = Math.ceil(fontSize * 2.5);

    const safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const svgBuf = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">` +
        `<text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"` +
        ` font-family="Arial,sans-serif" font-size="${fontSize}"` +
        ` fill="white" fill-opacity="${opacity}"` +
        ` stroke="black" stroke-width="1" stroke-opacity="${opacity * 0.4}">` +
        safeText +
        `</text></svg>`,
    );

    const gravityMap: Record<string, sharp.Gravity> = {
      center: "centre",
      "top-left": "northwest",
      "top-right": "northeast",
      "bottom-left": "southwest",
      "bottom-right": "southeast",
    };
    const gravity: sharp.Gravity = gravityMap[position] ?? "centre";

    const fmt = sharpFormatFromMime(mime);
    const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
    const ext = extFromFormat(fmt);
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

    const output = await sharp(input)
      .composite([{ input: svgBuf, gravity }])
      .toFormat(fmt, { quality: 90 })
      .toBuffer();

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}_watermarked.${ext}"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Watermark failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/favicon-generate
// ─────────────────────────────────────────────────────────
router.post("/tools/favicon-generate", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const sizes = [16, 32, 48, 64, 128, 180, 192, 512];
    const zipEntries: Record<string, Uint8Array> = {};

    for (const size of sizes) {
      const buf = await sharp(input)
        .resize(size, size, { fit: "cover", position: "centre" })
        .png()
        .toBuffer();
      zipEntries[`favicon-${size}x${size}.png`] = new Uint8Array(buf);
    }

    const zipBuffer = Buffer.from(zipSync(zipEntries, { level: 6 }));

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="favicons.zip"`,
      "Cache-Control": "no-store",
    });
    res.send(zipBuffer);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Favicon generation failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/image-metadata-clean
// ─────────────────────────────────────────────────────────
router.post("/tools/image-metadata-clean", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

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
    res.status(500).json({ error: err instanceof Error ? err.message : "Metadata cleaning failed" });
  }
});

export default router;
