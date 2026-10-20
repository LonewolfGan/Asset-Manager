import sharp from "sharp";

export function sharpFormatFromMime(mime: string): "jpeg" | "png" | "webp" | "avif" | "gif" | "tiff" {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpeg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  if (mime === "image/gif") return "gif";
  if (mime === "image/tiff") return "tiff";
  return "jpeg";
}

export function extFromFormat(fmt: string): string {
  if (fmt === "jpeg") return "jpg";
  return fmt;
}

/**
 * Creates a Sharp pipeline with proper EXIF orientation handling
 * and sRGB color profile transformation (prevents washed out Display P3 photos).
 */
export function createColorManagedPipeline(input: Buffer, animated: boolean = false): sharp.Sharp {
  return sharp(input, { animated })
    .rotate()
    .withIccProfile("srgb");
}

export function getOptimizedJpegOptions(quality: number, isGraphic = false): sharp.JpegOptions {
  return {
    quality: Math.min(100, Math.max(1, quality)),
    progressive: true,
    mozjpeg: true,
    trellisQuantisation: true,
    overshootDeringing: true,
    optimiseScans: false, // Prevents catastrophic 1.5s+ iterative scan overhead
    quantisationTable: 3,
    chromaSubsampling: isGraphic ? "4:4:4" : "4:2:0",
  };
}

export function getOptimizedWebpOptions(quality: number, isGraphic = false): sharp.WebpOptions {
  const q = Math.min(100, Math.max(1, quality));
  return {
    quality: q,
    effort: 4, // Pareto sweet spot (effort 6 is 8x slower for < 0.5% gain)
    smartSubsample: true,
    alphaQuality: 90,
    nearLossless: isGraphic && q >= 80,
  };
}

export function getOptimizedAvifOptions(quality: number, isGraphic = false): sharp.AvifOptions {
  const q = Math.min(75, Math.max(1, quality)); // Beyond 75, AVIF compression collapses
  return {
    quality: q,
    effort: 3, // Sub-800ms sweet spot on server CPU
    chromaSubsampling: isGraphic ? "4:4:4" : "4:2:0",
    bitdepth: 8,
  };
}

export function getOptimizedTiffOptions(quality = 80): sharp.TiffOptions {
  return {
    compression: "deflate",
    quality: Math.min(100, Math.max(1, quality)),
  };
}

