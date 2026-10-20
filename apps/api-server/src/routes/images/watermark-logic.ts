import sharp from "sharp";
import {
  sharpFormatFromMime,
  extFromFormat,
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "./image-helpers.js";

export type NinePointPosition =
  | "top-left"
  | "top"
  | "top-center"
  | "top-right"
  | "left"
  | "center-left"
  | "center"
  | "right"
  | "center-right"
  | "bottom-left"
  | "bottom"
  | "bottom-center"
  | "bottom-right";

export interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  mode?: "points" | "tile";
  position?: NinePointPosition | NinePointPosition[] | string;
  rotation?: number;
  hasShadow?: boolean;
  outputFormat?: string;
  quality?: number;
}

interface PointCoords {
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
}

function calculatePointCoords(
  width: number,
  height: number,
  fontSize: number,
  pos: NinePointPosition
): PointCoords {
  const padX = Math.max(20, Math.round(width * 0.04));
  const padY = Math.max(20, Math.round(height * 0.04));

  switch (pos) {
    case "top-left":
      return { x: padX, y: padY + fontSize * 0.5, anchor: "start" };
    case "top":
    case "top-center":
      return { x: Math.round(width / 2), y: padY + fontSize * 0.5, anchor: "middle" };
    case "top-right":
      return { x: width - padX, y: padY + fontSize * 0.5, anchor: "end" };
    case "left":
    case "center-left":
      return { x: padX, y: Math.round(height / 2), anchor: "start" };
    case "center":
      return { x: Math.round(width / 2), y: Math.round(height / 2), anchor: "middle" };
    case "right":
    case "center-right":
      return { x: width - padX, y: Math.round(height / 2), anchor: "end" };
    case "bottom-left":
      return { x: padX, y: height - padY - fontSize * 0.5, anchor: "start" };
    case "bottom":
    case "bottom-center":
      return { x: Math.round(width / 2), y: height - padY - fontSize * 0.5, anchor: "middle" };
    case "bottom-right":
    default:
      return { x: width - padX, y: height - padY - fontSize * 0.5, anchor: "end" };
  }
}

/**
 * Builds vector SVG overlay for watermarks (supports 9-point grid and anti-theft diagonal tile).
 */
export function generateWatermarkSvg(
  width: number,
  height: number,
  options: WatermarkOptions
): Buffer {
  const rawText = options.text && options.text.trim() ? options.text.trim() : "© EverydayTools";
  const safeText = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  const rawOp = options.opacity !== undefined ? Number(options.opacity) : 0.75;
  const opacity = Math.min(1, Math.max(0, isNaN(rawOp) ? 0.75 : rawOp > 1 ? rawOp / 100 : rawOp));
  const color = (options.color ?? "#ffffff").replace(/[^#0-9a-fA-F]/g, "").slice(0, 7) || "#ffffff";

  const requestedSize = Number(options.fontSize);
  const fontSize = requestedSize > 0
    ? Math.min(requestedSize, Math.round(Math.min(width, height) * 0.4))
    : Math.max(18, Math.round(Math.min(width, height) * 0.055));

  const hasShadow = options.hasShadow !== false;

  if (options.mode === "tile") {
    const rot = options.rotation !== undefined && !isNaN(Number(options.rotation)) ? Number(options.rotation) : -30;
    const patW = Math.max(160, Math.round(fontSize * rawText.length * 0.85 + 80));
    const patH = Math.max(100, Math.round(fontSize * 3 + 60));

    const shadowElement = hasShadow
      ? `<text x="${patW / 2}" y="${patH / 2}" text-anchor="middle" dominant-baseline="middle"` +
        ` font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="${fontSize}"` +
        ` stroke="rgba(0,0,0,0.3)" stroke-width="2" stroke-opacity="${opacity * 0.5}">${safeText}</text>`
      : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<defs>` +
      `<pattern id="wm-tile" width="${patW}" height="${patH}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})">` +
      shadowElement +
      `<text x="${patW / 2}" y="${patH / 2}" text-anchor="middle" dominant-baseline="middle"` +
      ` font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="${fontSize}"` +
      ` fill="${color}" fill-opacity="${opacity}">${safeText}</text>` +
      `</pattern>` +
      `</defs>` +
      `<rect width="100%" height="100%" fill="url(#wm-tile)" />` +
      `</svg>`;
    return Buffer.from(svg);
  }

  const rawPos = options.position ?? "center";
  const positions: NinePointPosition[] = Array.isArray(rawPos)
    ? (rawPos as NinePointPosition[])
    : [rawPos as NinePointPosition];

  let elements = "";
  for (const pos of positions) {
    const coords = calculatePointCoords(width, height, fontSize, pos);
    const rotNum = options.rotation !== undefined && !isNaN(Number(options.rotation)) ? Number(options.rotation) : 0;
    const rot = rotNum !== 0 ? ` transform="rotate(${rotNum}, ${coords.x}, ${coords.y})"` : "";
    if (hasShadow) {
      elements += `<text x="${coords.x}" y="${coords.y}" text-anchor="${coords.anchor}" dominant-baseline="middle"${rot}` +
        ` font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="${fontSize}"` +
        ` stroke="rgba(0,0,0,0.4)" stroke-width="2" stroke-opacity="${opacity * 0.6}">${safeText}</text>`;
    }
    elements += `<text x="${coords.x}" y="${coords.y}" text-anchor="${coords.anchor}" dominant-baseline="middle"${rot}` +
      ` font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="600" font-size="${fontSize}"` +
      ` fill="${color}" fill-opacity="${opacity}">${safeText}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${elements}</svg>`;
  return Buffer.from(svg);
}

/**
 * Universal Watermark Application Engine with sRGB color normalization and Pareto encoding.
 */
export async function applyWatermarkToImage(
  inputBuffer: Buffer,
  options: WatermarkOptions
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  let pipeline = createColorManagedPipeline(inputBuffer);
  const meta = await pipeline.metadata();
  const orientation = meta.orientation ?? 0;
  const isRotated = orientation >= 5 && orientation <= 8;
  const width = (isRotated ? meta.height : meta.width) ?? 800;
  const height = (isRotated ? meta.width : meta.height) ?? 600;

  const svgBuffer = generateWatermarkSvg(width, height, options);
  pipeline = pipeline.composite([{ input: svgBuffer, blend: "over" }]);

  const targetMime = options.outputFormat ?? (meta.format ? `image/${meta.format}` : "image/jpeg");
  const fmt = sharpFormatFromMime(targetMime);
  const q = options.quality ?? 85;

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
