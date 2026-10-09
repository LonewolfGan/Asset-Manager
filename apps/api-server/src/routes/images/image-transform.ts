import { Router } from "express";
import sharp from "sharp";
import { zipSync } from "fflate";
import { upload, guardImage } from "../../middlewares/upload.js";
import { apiError } from "../../lib/errors.js";
import { sharpFormatFromMime, extFromFormat } from "./image-helpers.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/flip-rotate
// ─────────────────────────────────────────────────────────
router.post("/tools/flip-rotate", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

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
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Transform failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/watermark-image
// ─────────────────────────────────────────────────────────
router.post("/tools/watermark-image", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const mime = req.file.mimetype;
    const text = String(req.body.text ?? "Watermark").slice(0, 100);
    const opacity = Math.min(1, Math.max(0, parseFloat(String(req.body.opacity ?? "0.5"))));
    const position = String(req.body.position ?? "center");
    const colorHex = String(req.body.color ?? "#ffffff").replace(/[^#0-9a-fA-F]/g, "").slice(0, 7);

    const meta = await sharp(input).metadata();
    const imgW = meta.width ?? 800;
    const imgH = meta.height ?? 600;

    const requestedFontSize = parseInt(String(req.body.fontSize ?? "0")) || 0;
    const fontSize = requestedFontSize > 0 ? Math.min(requestedFontSize, Math.round(Math.min(imgW, imgH) * 0.5)) : Math.max(24, Math.round(Math.min(imgW, imgH) * 0.08));
    const approxTextW = text.length * fontSize * 0.55;
    const svgW = Math.min(Math.ceil(approxTextW + 60), imgW);
    const svgH = Math.min(Math.ceil(fontSize * 2.5), imgH);

    const safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const svgBuf = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">` +
        `<text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"` +
        ` font-family="Arial,sans-serif" font-size="${fontSize}"` +
        ` fill="${colorHex || "#ffffff"}" fill-opacity="${opacity}"` +
        ` stroke="rgba(0,0,0,0.3)" stroke-width="1" stroke-opacity="${opacity * 0.4}">` +
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
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Watermark failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/favicon-generate
// ─────────────────────────────────────────────────────────
function buildIcoMulti(images: Array<{ size: number; buf: Buffer }>): Buffer {
  const count = images.length;
  const headerSize = 6;
  const dirSize = 16 * count;
  const totalImgSize = images.reduce((acc, img) => acc + img.buf.length, 0);
  const totalBuf = Buffer.alloc(headerSize + dirSize + totalImgSize);

  totalBuf.writeUInt16LE(0, 0);
  totalBuf.writeUInt16LE(1, 2);
  totalBuf.writeUInt16LE(count, 4);

  let dataOffset = headerSize + dirSize;
  for (let i = 0; i < count; i++) {
    const img = images[i];
    const entryOffset = headerSize + i * 16;
    const imgLen = img.buf.length;

    totalBuf.writeUInt8(img.size >= 256 ? 0 : img.size, entryOffset);
    totalBuf.writeUInt8(img.size >= 256 ? 0 : img.size, entryOffset + 1);
    totalBuf.writeUInt8(0, entryOffset + 2);
    totalBuf.writeUInt8(0, entryOffset + 3);
    totalBuf.writeUInt16LE(1, entryOffset + 4);
    totalBuf.writeUInt16LE(32, entryOffset + 6);
    totalBuf.writeUInt32LE(imgLen, entryOffset + 8);
    totalBuf.writeUInt32LE(dataOffset, entryOffset + 12);

    img.buf.copy(totalBuf, dataOffset);
    dataOffset += imgLen;
  }

  return totalBuf;
}

router.post("/tools/favicon-generate", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const input = req.file.buffer;
    const sizes = [16, 32, 48, 64, 128, 180, 192, 512];
    const zipEntries: Record<string, Uint8Array> = {};

    for (const size of sizes) {
      let pipeline = sharp(input).resize(size, size, {
        fit: "cover",
        position: "centre",
        kernel: "lanczos3",
      });

      if (size <= 48) {
        pipeline = pipeline.sharpen({ sigma: 0.8, m1: 0.5, m2: 0.5 });
      }

      const buf = await pipeline.png().toBuffer();
      zipEntries[`favicon-${size}x${size}.png`] = new Uint8Array(buf);
    }

    const png16 = Buffer.from(zipEntries["favicon-16x16.png"]);
    const png32 = Buffer.from(zipEntries["favicon-32x32.png"]);
    const png48 = Buffer.from(zipEntries["favicon-48x48.png"]);

    zipEntries["favicon.ico"] = new Uint8Array(
      buildIcoMulti([
        { size: 16, buf: png16 },
        { size: 32, buf: png32 },
        { size: 48, buf: png48 },
      ])
    );

    const zipBuffer = Buffer.from(zipSync(zipEntries, { level: 6 }));

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="favicons.zip"`,
      "Cache-Control": "no-store",
    });
    res.send(zipBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Favicon generation failed");
  }
});

export default router;
