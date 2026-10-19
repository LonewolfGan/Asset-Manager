import sharp from "sharp";
import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export interface UpscaleOptions {
  scale?: 2 | 4 | number;
  sharpen?: boolean;
  outputFormat?: string;
  quality?: number;
}

/**
 * Universal Image Upscaler with Lanczos3 resampling, aspect ratio preservation,
 * sRGB normalization, adaptive unsharp masking, and Pareto-optimal encoding.
 */
export async function upscaleImageBuffer(
  inputBuffer: Buffer,
  options: UpscaleOptions = {}
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  let pipeline = createColorManagedPipeline(inputBuffer);
  const meta = await pipeline.metadata();

  const orientation = meta.orientation ?? 0;
  const isRotated = orientation >= 5 && orientation <= 8;
  const origW = (isRotated ? meta.height : meta.width) ?? 800;
  const origH = (isRotated ? meta.width : meta.height) ?? 600;

  const scaleFactor = options.scale === 4 ? 4 : 2;
  const maxDim = 8000;
  let targetW = Math.round(origW * scaleFactor);
  let targetH = Math.round(origH * scaleFactor);

  if (targetW > maxDim || targetH > maxDim) {
    const ratio = Math.min(maxDim / targetW, maxDim / targetH);
    targetW = Math.round(targetW * ratio);
    targetH = Math.round(targetH * ratio);
  }

  pipeline = pipeline.resize({
    width: targetW,
    height: targetH,
    kernel: sharp.kernel.lanczos3,
    fit: "fill",
  });

  if (options.sharpen !== false) {
    pipeline = pipeline.sharpen({
      sigma: 0.8,
      m1: 0.8,
      m2: 0.3,
    });
  }

  const rawMime = options.outputFormat ?? (meta.format ? `image/${meta.format}` : "image/jpeg");
  const targetMime = rawMime.includes("/") ? rawMime : `image/${rawMime}`;
  const fmt = sharpFormatFromMime(targetMime);
  const q = options.quality ?? 92;

  if (fmt === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg(getOptimizedJpegOptions(q, true));
  } else if (fmt === "webp") {
    pipeline = pipeline.webp(getOptimizedWebpOptions(q, true));
  } else if (fmt === "avif") {
    pipeline = pipeline.avif(getOptimizedAvifOptions(q, true));
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
