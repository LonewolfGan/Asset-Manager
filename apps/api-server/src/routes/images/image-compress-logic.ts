import sharp from "sharp";
import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export interface CompressImageOptions {
  quality?: number;
  targetKB?: number;
  resizeMode?: "none" | "percent" | "dimensions";
  resizePct?: number;
  resizeW?: number;
  resizeH?: number;
  isGraphic?: boolean;
}

export interface CompressImageResult {
  buffer: Buffer;
  mime: string;
  ext: string;
  originalSize: number;
  compressedSize: number;
  gain: number;
}

export async function compressAtQuality(
  input: Buffer,
  mime: string,
  quality: number,
  cachedDeflate?: Buffer,
  strictTarget?: boolean,
  isGraphic = false,
): Promise<{ output: Buffer; outMime: string }> {
  const q = Math.min(100, Math.max(1, quality));

  if (mime === "image/jpeg" || mime === "image/jpg") {
    return {
      output: await createColorManagedPipeline(input)
        .jpeg(getOptimizedJpegOptions(q, isGraphic))
        .toBuffer(),
      outMime: "image/jpeg",
    };
  }
  if (mime === "image/png") {
    const colours = Math.max(16, Math.min(256, Math.round((q / 100) * 256)));
    const deflate =
      cachedDeflate ??
      (await createColorManagedPipeline(input)
        .png({ compressionLevel: 9, effort: 7, adaptiveFiltering: true })
        .toBuffer());
    const palette = await createColorManagedPipeline(input)
      .png({ compressionLevel: 9, effort: 7, palette: true, colours, dither: 1 })
      .toBuffer();
    let best = deflate.length < input.length ? deflate : input;
    const threshold = strictTarget ? 1.0 : 0.85;
    if (palette.length < best.length * threshold) best = palette;
    return { output: best, outMime: "image/png" };
  }
  if (mime === "image/webp") {
    return {
      output: await createColorManagedPipeline(input)
        .webp(getOptimizedWebpOptions(q, isGraphic))
        .toBuffer(),
      outMime: "image/webp",
    };
  }
  if (mime === "image/avif") {
    return {
      output: await createColorManagedPipeline(input)
        .avif(getOptimizedAvifOptions(q, isGraphic))
        .toBuffer(),
      outMime: "image/avif",
    };
  }
  return {
    output: await createColorManagedPipeline(input)
      .jpeg(getOptimizedJpegOptions(82, isGraphic))
      .toBuffer(),
    outMime: "image/jpeg",
  };
}

export async function compressToTargetBytes(
  input: Buffer,
  mime: string,
  targetBytes: number,
  isGraphic = false,
): Promise<Buffer> {
  let cachedDeflate: Buffer | undefined;
  if (mime === "image/png") {
    cachedDeflate = await createColorManagedPipeline(input)
      .png({ compressionLevel: 9, effort: 7, adaptiveFiltering: true })
      .toBuffer();
    if (cachedDeflate.length <= targetBytes) {
      return cachedDeflate;
    }
  }

  let lo = 1;
  let hi = 95;
  let best: Buffer | null = null;

  for (let i = 0; i < 6; i++) {
    const mid = Math.round((lo + hi) / 2);
    const { output } = await compressAtQuality(input, mime, mid, cachedDeflate, true, isGraphic);
    if (output.length <= targetBytes) {
      best = output;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
    if (lo > hi) break;
  }

  if (!best) {
    const { output } = await compressAtQuality(input, mime, 1, cachedDeflate, true, isGraphic);
    best = output;
  }
  return best;
}

export async function compressImageBuffer(
  input: Buffer,
  mime: string,
  options: CompressImageOptions = {},
): Promise<CompressImageResult> {
  const {
    quality = 82,
    targetKB = 0,
    resizeMode = "none",
    resizePct = 100,
    resizeW,
    resizeH,
    isGraphic = false,
  } = options;

  let workingBuffer = input;

  if (resizeMode === "percent" && resizePct !== 100) {
    if (resizePct < 1 || resizePct > 500) {
      throw new Error("Resize percentage must be between 1% and 500%.");
    }
    const meta = await sharp(input).metadata();
    const orientation = meta.orientation ?? 0;
    const isRotated = orientation >= 5 && orientation <= 8;
    const origW = (isRotated ? meta.height : meta.width) ?? 1000;
    const origH = (isRotated ? meta.width : meta.height) ?? 1000;
    const w = Math.max(1, Math.min(10000, Math.round((origW * resizePct) / 100)));
    const h = Math.max(1, Math.min(10000, Math.round((origH * resizePct) / 100)));
    workingBuffer = await createColorManagedPipeline(input).resize(w, h, { kernel: sharp.kernel.lanczos3 }).toBuffer();
  } else if (resizeMode === "dimensions" && (resizeW || resizeH)) {
    if (
      (resizeW !== undefined && (resizeW <= 0 || resizeW > 10000)) ||
      (resizeH !== undefined && (resizeH <= 0 || resizeH > 10000))
    ) {
      throw new Error("Resize dimensions must be between 1 and 10,000 px.");
    }
    workingBuffer = await createColorManagedPipeline(input)
      .resize(resizeW, resizeH, { fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
      .toBuffer();
  }

  let output: Buffer;
  let outMime: string;

  if (targetKB > 0) {
    output = await compressToTargetBytes(workingBuffer, mime, targetKB * 1024, isGraphic);
    const fmt = sharpFormatFromMime(mime);
    outMime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
  } else {
    ({ output, outMime } = await compressAtQuality(workingBuffer, mime, quality, undefined, false, isGraphic));
  }

  let finalBuffer = output;
  let effectiveMime = outMime;

  if (output.length >= workingBuffer.length) {
    try {
      const stripped = await createColorManagedPipeline(workingBuffer).toBuffer();
      if (stripped.length < workingBuffer.length) {
        finalBuffer = stripped;
        effectiveMime = mime === "image/jpg" ? "image/jpeg" : mime;
      } else {
        finalBuffer = workingBuffer;
        effectiveMime = mime === "image/jpg" ? "image/jpeg" : mime;
      }
    } catch {
      finalBuffer = workingBuffer;
      effectiveMime = mime === "image/jpg" ? "image/jpeg" : mime;
    }
  }

  if (finalBuffer.length > workingBuffer.length) {
    finalBuffer = workingBuffer;
    effectiveMime = mime === "image/jpg" ? "image/jpeg" : mime;
  }

  const fmt = sharpFormatFromMime(effectiveMime);
  const ext = extFromFormat(fmt);
  const gain = Math.max(0, Math.round((1 - finalBuffer.length / input.length) * 100));

  return {
    buffer: finalBuffer,
    mime: effectiveMime,
    ext,
    originalSize: input.length,
    compressedSize: finalBuffer.length,
    gain,
  };
}
