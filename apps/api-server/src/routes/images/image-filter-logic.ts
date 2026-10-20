import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export type ImageFilterType =
  | "grayscale"
  | "blackwhite"
  | "sepia"
  | "invert"
  | "negative"
  | "blur"
  | "sharpen"
  | "brightness"
  | "contrast"
  | "saturation"
  | "hue";

export interface ImageFilterOptions {
  filter: ImageFilterType | string;
  value?: number;
  outputFormat?: string;
  quality?: number;
  isGraphic?: boolean;
}

export interface CleanMetadataOptions {
  outputFormat?: string;
  quality?: number;
  isGraphic?: boolean;
}

/**
 * Universal Image Metadata Stripping Engine.
 * Normalizes visual EXIF orientation physically and converts color gamut to sRGB
 * BEFORE stripping all metadata (EXIF, GPS, camera details, timestamps).
 */
export async function cleanImageMetadata(
  inputBuffer: Buffer,
  options: CleanMetadataOptions = {}
): Promise<{ buffer: Buffer; mime: string; ext: string; originalSize: number; cleanedSize: number }> {
  let pipeline = createColorManagedPipeline(inputBuffer);
  const meta = await pipeline.metadata();

  const rawFmt = options.outputFormat ?? (meta.format ? `image/${meta.format}` : "image/jpeg");
  const targetMime = rawFmt.includes("/") ? rawFmt : `image/${rawFmt}`;
  const fmt = sharpFormatFromMime(targetMime);
  const q = options.quality ?? 92;
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

  return {
    buffer,
    mime: outMime,
    ext,
    originalSize: inputBuffer.length,
    cleanedSize: buffer.length,
  };
}

export const SUPPORTED_IMAGE_FILTERS = new Set<string>([
  "grayscale",
  "blackwhite",
  "sepia",
  "invert",
  "negative",
  "blur",
  "sharpen",
  "brightness",
  "contrast",
  "saturation",
  "hue",
]);

/**
 * Universal Image Filter Studio Engine.
 * Applies artistic and corrective filters with gamut normalization and Pareto output encoding.
 */
export async function applyImageFilter(
  inputBuffer: Buffer,
  options: ImageFilterOptions
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  let pipeline = createColorManagedPipeline(inputBuffer);
  const meta = await pipeline.metadata();

  const filter = String(options.filter ?? "grayscale").toLowerCase();
  const value = options.value !== undefined && Number.isFinite(Number(options.value))
    ? Number(options.value)
    : undefined;

  switch (filter) {
    case "grayscale":
    case "blackwhite":
      pipeline = pipeline.grayscale();
      break;

    case "sepia": {
      if (meta.channels === 1) {
        pipeline = pipeline.toColorspace("srgb");
      }
      if (meta.hasAlpha || meta.channels === 4) {
        pipeline = pipeline.recomb([
          [0.393, 0.769, 0.189, 0],
          [0.349, 0.686, 0.168, 0],
          [0.272, 0.534, 0.131, 0],
          [0,     0,     0,     1],
        ]);
      } else {
        pipeline = pipeline.recomb([
          [0.393, 0.769, 0.189],
          [0.349, 0.686, 0.168],
          [0.272, 0.534, 0.131],
        ]);
      }
      break;
    }

    case "invert":
    case "negative":
      pipeline = pipeline.negate({ alpha: false });
      break;

    case "blur": {
      const sigma = Math.min(50, Math.max(0.3, value ?? 5));
      pipeline = pipeline.blur(sigma);
      break;
    }

    case "sharpen": {
      const sigma = value !== undefined ? Math.min(10, Math.max(0.3, value)) : 1.5;
      pipeline = pipeline.sharpen({ sigma, m1: 1.0, m2: 0.5 });
      break;
    }

    case "brightness": {
      const bVal = value !== undefined ? Math.max(0.1, Math.min(3, value)) : 1.2;
      pipeline = pipeline.modulate({ brightness: bVal });
      break;
    }

    case "contrast": {
      const linearFactor = value !== undefined ? Math.max(0.1, Math.min(3, value)) : 1.3;
      pipeline = pipeline.linear(linearFactor, -(128 * linearFactor) + 128);
      break;
    }

    case "saturation": {
      const sVal = value !== undefined ? Math.max(0, Math.min(3, value)) : 1.5;
      pipeline = pipeline.modulate({ saturation: sVal });
      break;
    }

    case "hue": {
      const hVal = value !== undefined ? ((Math.round(value) % 360) + 360) % 360 : 45;
      pipeline = pipeline.modulate({ hue: hVal });
      break;
    }

    default:
      pipeline = pipeline.grayscale();
  }
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
