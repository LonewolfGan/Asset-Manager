import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export interface FlipRotateOptions {
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  outputFormat?: string;
  quality?: number;
  isGraphic?: boolean;
}

/**
 * Universal Image Flip & Rotate Engine.
 * Auto-orients EXIF first, applies user rotation/flips, normalizes color gamut to sRGB,
 * and encodes with Pareto studio presets.
 */
export async function transformFlipRotate(
  inputBuffer: Buffer,
  options: FlipRotateOptions = {}
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  // 1. Auto-orient EXIF and sRGB profile normalization
  let pipeline = createColorManagedPipeline(inputBuffer);

  // 2. Target format resolution
  const meta = await pipeline.metadata();
  const rawFmt = options.outputFormat ?? (meta.format ? `image/${meta.format}` : "image/jpeg");
  const targetMime = rawFmt.includes("/") ? rawFmt : `image/${rawFmt}`;
  const fmt = sharpFormatFromMime(targetMime);
  const q = options.quality ?? 90;
  const isGraphic = options.isGraphic ?? false;

  // 3. User rotation (normalized to numbers, white background for JPEG, transparent for others)
  const parsedRot = options.rotation !== undefined ? Number(options.rotation) : 0;
  const userRotation = Number.isFinite(parsedRot) ? parsedRot : 0;
  const rotationBg = fmt === "jpeg"
    ? { r: 255, g: 255, b: 255, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 0 };

  if (userRotation % 360 !== 0) {
    pipeline = pipeline.rotate(userRotation, {
      background: rotationBg,
    });
  }

  // 4. Horizontal and vertical mirror flips
  if (options.flipH) {
    pipeline = pipeline.flop();
  }
  if (options.flipV) {
    pipeline = pipeline.flip();
  }

  // 5. Pareto encoding
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
