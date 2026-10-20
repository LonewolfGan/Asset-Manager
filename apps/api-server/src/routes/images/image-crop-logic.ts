import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export interface ImageCropOptions {
  left: number;
  top: number;
  width: number;
  height: number;
  outputFormat?: string;
  quality?: number;
  isGraphic?: boolean;
}

/**
 * Universal Image Crop Engine.
 * Auto-orients EXIF first (crucial for portrait mobile captures),
 * validates and safely clamps bounding box coordinates,
 * normalizes color gamut to sRGB, and encodes with Pareto studio presets.
 */
export async function cropImageBuffer(
  inputBuffer: Buffer,
  options: ImageCropOptions
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  // 1. Validate raw inputs
  const rawW = Number(options.width);
  const rawH = Number(options.height);
  if (!Number.isFinite(rawW) || !Number.isFinite(rawH) || rawW <= 0 || rawH <= 0) {
    throw new Error("Invalid crop dimensions: width and height must be positive numbers");
  }

  // 2. Auto-orient EXIF and sRGB profile normalization
  let pipeline = createColorManagedPipeline(inputBuffer);
  const meta = await pipeline.metadata();

  const isRotated = meta.orientation !== undefined && meta.orientation >= 5 && meta.orientation <= 8;
  const imgW = isRotated ? (meta.height ?? rawW) : (meta.width ?? rawW);
  const imgH = isRotated ? (meta.width ?? rawH) : (meta.height ?? rawH);

  // 3. Coordinate clamping to avoid Sharp out-of-bounds crashes
  const parsedLeft = Number(options.left);
  const parsedTop = Number(options.top);
  const safeLeft = Math.max(0, Math.min(Number.isFinite(parsedLeft) ? Math.round(parsedLeft) : 0, imgW - 1));
  const safeTop = Math.max(0, Math.min(Number.isFinite(parsedTop) ? Math.round(parsedTop) : 0, imgH - 1));

  const safeWidth = Math.max(1, Math.min(Math.round(rawW), imgW - safeLeft));
  const safeHeight = Math.max(1, Math.min(Math.round(rawH), imgH - safeTop));

  pipeline = pipeline.extract({
    left: safeLeft,
    top: safeTop,
    width: safeWidth,
    height: safeHeight,
  });

  // 4. Target format and Pareto encoding
  const rawFmt = options.outputFormat ?? (meta.format ? `image/${meta.format}` : "image/jpeg");
  const targetMime = rawFmt.includes("/") ? rawFmt : `image/${rawFmt}`;
  const fmt = sharpFormatFromMime(targetMime);
  const q = options.quality ?? 90;
  const isGraphic = options.isGraphic ?? false;

  if (fmt === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg(getOptimizedJpegOptions(q, isGraphic));
  } else if (fmt === "webp") {
    pipeline = pipeline.webp(getOptimizedWebpOptions(q, isGraphic));
  } else if (fmt === "avif") {
    pipeline = pipeline.avif(getOptimizedAvifOptions(q, isGraphic));
  } else if (fmt === "png") {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else {
    pipeline = pipeline.toFormat(fmt);
  }

  const buffer = await pipeline.toBuffer();
  const outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
  const ext = extFromFormat(fmt);

  return { buffer, mime: outMime, ext };
}
