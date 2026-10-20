import { PDFDocument, rgb, StandardFonts, degrees, type RGB } from "pdf-lib";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";

export interface WatermarkOptions {
  text?: string;
  opacity?: number;
  fontSize?: number;
  angle?: number;
  color?: string;
  pages?: string;
  pattern?: "single" | "repeat" | string;
}

export interface PageNumberOptions {
  position?: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left" | string;
  startFrom?: number;
  fontSize?: number;
  skipFirst?: boolean;
  format?: string;
}

export interface MetadataOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[] | string;
  creator?: string;
  producer?: string;
}

function parseColor(col: string): RGB {
  const s = col.toLowerCase().trim();
  if (s === "red") return rgb(0.85, 0.15, 0.15);
  if (s === "blue") return rgb(0.12, 0.45, 0.9);
  if (s === "black") return rgb(0.08, 0.08, 0.08);
  if (s === "green") return rgb(0.1, 0.65, 0.25);
  if (s === "amber") return rgb(0.85, 0.5, 0.05);
  if (s.startsWith("#") && (s.length === 7 || s.length === 4)) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return rgb(r, g, b);
  }
  return rgb(0.5, 0.5, 0.5);
}

function assertValidPdfBuffer(buffer: Buffer): void {
  if (!buffer || buffer.length === 0 || !buffer.subarray(0, 5).toString("ascii").startsWith("%PDF-")) {
    throw new Error("Empty or invalid PDF buffer provided");
  }
}

export async function applyPdfWatermark(
  inputBuffer: Buffer,
  options: WatermarkOptions = {},
): Promise<Buffer> {
  assertValidPdfBuffer(inputBuffer);

  const rawText = String(options.text ?? "WATERMARK").slice(0, 100);
  const text = sanitizeWinAnsi(rawText) || "WATERMARK";
  const opacity = typeof options.opacity === "number" && Number.isFinite(options.opacity)
    ? Math.min(1, Math.max(0.05, options.opacity))
    : 0.3;
  const fontSize = typeof options.fontSize === "number" && Number.isFinite(options.fontSize)
    ? Math.min(120, Math.max(10, options.fontSize))
    : 60;
  const angle = typeof options.angle === "number" && Number.isFinite(options.angle)
    ? options.angle
    : 45;
  const colorStr = String(options.color ?? "gray").trim();
  const pageScope = String(options.pages ?? "all").trim();
  const pattern = String(options.pattern ?? "repeat").trim();

  const watermarkColor = parseColor(colorStr);
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  let targetIndices: number[] = [];
  if (pageScope === "first") {
    targetIndices = [0];
  } else if (pageScope === "all") {
    targetIndices = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    targetIndices = pageScope.split(",").flatMap((part) => {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-").map((s) => parseInt(s.trim(), 10));
        if (!isNaN(startStr) && !isNaN(endStr)) {
          const lo = Math.min(startStr, endStr);
          const hi = Math.max(startStr, endStr);
          const start = Math.max(0, Math.min(lo - 1, totalPages - 1));
          const end = Math.max(0, Math.min(hi - 1, totalPages - 1));
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
      }
      const num = parseInt(trimmed, 10);
      return !isNaN(num) && num >= 1 && num <= totalPages ? [num - 1] : [];
    });
    if (targetIndices.length === 0) {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      targetIndices = [...new Set(targetIndices)];
    }
  }

  const rad = (angle * Math.PI) / 180;
  const textWidth = font.widthOfTextAtSize(text, fontSize);

  for (const idx of targetIndices) {
    const page = pages[idx];
    const { width, height } = page.getSize();

    if (pattern === "single") {
      const cx = width / 2;
      const cy = height / 2;
      const x = cx - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad);
      const y = cy - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad);

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: watermarkColor,
        opacity,
        rotate: degrees(angle),
      });
    } else {
      const stepX = Math.max(textWidth + 60, 140);
      const stepY = Math.max(fontSize * 3.2, 110);

      let row = 0;
      for (let py = -stepY; py <= height + stepY; py += stepY) {
        const xOffset = row % 2 === 0 ? 0 : stepX / 2;
        for (let px = -stepX + xOffset; px <= width + stepX; px += stepX) {
          page.drawText(text, {
            x: px,
            y: py,
            size: fontSize,
            font,
            color: watermarkColor,
            opacity,
            rotate: degrees(angle),
          });
        }
        row++;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return await linearizePdf(Buffer.from(pdfBytes));
}

export async function addPdfPageNumbers(
  inputBuffer: Buffer,
  options: PageNumberOptions = {},
): Promise<Buffer> {
  assertValidPdfBuffer(inputBuffer);

  const position = String(options.position ?? "bottom-center");
  const startFrom = typeof options.startFrom === "number" && Number.isFinite(options.startFrom)
    ? Math.max(1, options.startFrom)
    : 1;
  const fontSize = typeof options.fontSize === "number" && Number.isFinite(options.fontSize)
    ? Math.min(24, Math.max(8, options.fontSize))
    : 11;
  const skipFirst = Boolean(options.skipFirst);
  const rawFormat = String(options.format ?? "{n}").trim();
  const format = sanitizeWinAnsi(rawFormat) || "{n}";
  const margin = 22;

  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const startIdx = skipFirst ? 1 : 0;

  for (let i = startIdx; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const currentNumber = i + startFrom - (skipFirst ? 1 : 0);

    let label = format;
    if (label.includes("{n}")) {
      label = label.replace(/{n}/g, String(currentNumber));
    } else {
      label = String(currentNumber);
    }
    label = label.replace(/{total}/g, String(totalPages - (skipFirst ? 1 : 0)));

    const textWidth = font.widthOfTextAtSize(label, fontSize);
    let x: number, y: number;
    if (position === "bottom-right") { x = width - textWidth - margin; y = margin; }
    else if (position === "bottom-left") { x = margin; y = margin; }
    else if (position === "top-center") { x = (width - textWidth) / 2; y = height - margin - fontSize; }
    else if (position === "top-right") { x = width - textWidth - margin; y = height - margin - fontSize; }
    else if (position === "top-left") { x = margin; y = height - margin - fontSize; }
    else { x = (width - textWidth) / 2; y = margin; }

    page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
  }

  const pdfBytes = await pdfDoc.save();
  return await linearizePdf(Buffer.from(pdfBytes));
}

export async function updatePdfMetadata(
  inputBuffer: Buffer,
  options: MetadataOptions = {},
): Promise<Buffer> {
  assertValidPdfBuffer(inputBuffer);

  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });

  if (options.title !== undefined) pdfDoc.setTitle(String(options.title));
  if (options.author !== undefined) pdfDoc.setAuthor(String(options.author));
  if (options.subject !== undefined) pdfDoc.setSubject(String(options.subject));
  if (options.keywords !== undefined) {
    const kw = Array.isArray(options.keywords)
      ? options.keywords.map(String).map((s) => s.trim()).filter(Boolean)
      : String(options.keywords).split(",").map((s) => s.trim()).filter(Boolean);
    pdfDoc.setKeywords(kw);
  }
  if (options.creator !== undefined) pdfDoc.setCreator(String(options.creator));
  if (options.producer !== undefined) pdfDoc.setProducer(String(options.producer));

  const pdfBytes = await pdfDoc.save();
  return await linearizePdf(Buffer.from(pdfBytes));
}
