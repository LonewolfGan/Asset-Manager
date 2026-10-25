import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, rgb, StandardFonts, degrees, type RGB } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";
import { pdfBaseName } from "../pdf/guards.js";

const execFileAsync = promisify(execFile);

export interface WatermarkOptions {
  text?: string;
  imageBuffer?: Buffer;
  imageMime?: string;
  fontSize?: number;
  opacity?: number;
  angle?: number;
  color?: string;
  position?: string;
  pattern?: "single" | "repeat" | string;
  pages?: string;
  pool?: ProcessPool;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface WatermarkResult {
  buffer: Buffer;
  watermarkType: "text" | "image";
  pageCount: number;
  watermarkedPagesCount?: number;
  isLinearized: boolean;
  watermarkedSize: number;
  originalSize: number;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  return Boolean(buffer && buffer.length >= 5 && buffer.subarray(0, 5).equals(Buffer.from("%PDF-")));
}

function parseColor(col?: string): RGB {
  if (!col) return rgb(0.5, 0.5, 0.5);
  const s = col.toLowerCase().trim();
  if (s === "red" || s === "#ff0000" || s === "#ec1c24") return rgb(0.92, 0.11, 0.14);
  if (s === "blue") return rgb(0.12, 0.45, 0.9);
  if (s === "black") return rgb(0.08, 0.08, 0.08);
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return rgb(r, g, b);
    }
  }
  return rgb(0.5, 0.5, 0.5);
}

function resolvePages(pageScope: string | undefined, total: number): number[] {
  if (!pageScope || pageScope === "all") return Array.from({ length: total }, (_, i) => i);
  if (pageScope === "first") return [0];
  const list = pageScope.split(",").flatMap((p) => {
    const s = p.trim();
    if (s.includes("-")) {
      const [a, b] = s.split("-").map((v) => parseInt(v.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) {
        const start = Math.max(0, Math.min(Math.min(a, b) - 1, total - 1));
        const end = Math.max(0, Math.min(Math.max(a, b) - 1, total - 1));
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    }
    const n = parseInt(s, 10);
    return !isNaN(n) && n >= 1 && n <= total ? [n - 1] : [];
  });
  return list.length > 0 ? [...new Set(list)] : Array.from({ length: total }, (_, i) => i);
}

export async function applyWatermark(
  inputBuffer: Buffer,
  options: WatermarkOptions = {}
): Promise<WatermarkResult> {
  if (!inputBuffer || inputBuffer.length === 0) throw new Error("Invalid or empty PDF buffer");
  if (!isValidPdfHeader(inputBuffer)) throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");

  const rawText = options.text !== undefined ? String(options.text).trim() : "";
  const hasImage = Boolean(options.imageBuffer && options.imageBuffer.length > 0);
  if (!rawText && !hasImage) {
    const err = new Error("Empty watermark: neither text nor image was provided");
    (err as unknown as { code: string }).code = "EMPTY_WATERMARK";
    throw err;
  }

  const opacity = typeof options.opacity === "number" && !isNaN(options.opacity)
    ? Math.max(0.05, Math.min(1.0, options.opacity)) : 0.3;
  const angle = typeof options.angle === "number" && !isNaN(options.angle) ? options.angle : 45;
  const pool = options.pool ?? defaultProcessPool;
  const timeoutMs = options.timeoutMs ?? 60_000;

  return pool.run(async (ctx) => {
    const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    const targetIndices = resolvePages(options.pages, pageCount);

    if (hasImage && options.imageBuffer) {
      const buf = options.imageBuffer;
      const unpooled = new Uint8Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const isPng = (options.imageMime && options.imageMime.includes("png")) ||
        (unpooled.length > 4 && unpooled[0] === 0x89 && unpooled[1] === 0x50 && unpooled[2] === 0x4E && unpooled[3] === 0x47);
      const img = isPng ? await pdfDoc.embedPng(unpooled) : await pdfDoc.embedJpg(unpooled);

      for (const idx of targetIndices) {
        const page = pdfDoc.getPage(idx);
        const { width, height } = page.getSize();
        const scale = Math.min(1.0, (width * 0.5) / img.width, (height * 0.5) / img.height);
        const dims = img.scale(scale);
        let x = (width - dims.width) / 2;
        let y = (height - dims.height) / 2;
        if (options.position === "top-left") { x = 36; y = height - dims.height - 36; }
        else if (options.position === "top-right") { x = width - dims.width - 36; y = height - dims.height - 36; }
        else if (options.position === "bottom-left") { x = 36; y = 36; }
        else if (options.position === "bottom-right") { x = width - dims.width - 36; y = 36; }
        page.drawImage(img, { x, y, width: dims.width, height: dims.height, opacity });
      }
    } else {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = typeof options.fontSize === "number" && !isNaN(options.fontSize) ? options.fontSize : 48;
      const pattern = options.pattern ?? "single";
      const rad = (angle * Math.PI) / 180;
      const textToDraw = sanitizeWinAnsi(rawText) || "WATERMARK";
      const textWidth = font.widthOfTextAtSize(textToDraw, fontSize);
      const col = parseColor(options.color);

      for (const idx of targetIndices) {
        const page = pdfDoc.getPage(idx);
        const { width, height } = page.getSize();
        if (pattern === "repeat") {
          const stepX = Math.max(textWidth + 60, 140);
          const stepY = Math.max(fontSize * 3.2, 110);
          let row = 0;
          for (let py = -stepY; py <= height + stepY; py += stepY) {
            const xOffset = row % 2 === 0 ? 0 : stepX / 2;
            for (let px = -stepX + xOffset; px <= width + stepX; px += stepX) {
              page.drawText(textToDraw, { x: px, y: py, size: fontSize, font, color: col, opacity, rotate: degrees(angle) });
            }
            row++;
          }
        } else {
          const cx = width / 2;
          const cy = height / 2;
          const x = cx - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad);
          const y = cy - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad);
          page.drawText(textToDraw, { x, y, size: fontSize, font, color: col, opacity, rotate: degrees(angle) });
        }
      }
    }

    const unlinearized = Buffer.from(await pdfDoc.save());
    const inPath = join(ctx.workspaceDir, "unlinearized.pdf");
    const outPath = join(ctx.workspaceDir, "linearized.pdf");
    await writeFile(inPath, unlinearized);

    try {
      await execFileAsync(BIN.qpdf, ["--warning-exit-0", "--linearize", inPath, outPath], { signal: ctx.signal, timeout: timeoutMs });
      const outputBuffer = await readFile(outPath);
      return {
        buffer: outputBuffer,
        watermarkType: hasImage ? "image" : "text",
        pageCount,
        watermarkedPagesCount: targetIndices.length,
        isLinearized: true,
        watermarkedSize: outputBuffer.length,
        originalSize: inputBuffer.length,
      };
    } catch {
      return {
        buffer: unlinearized,
        watermarkType: hasImage ? "image" : "text",
        pageCount,
        watermarkedPagesCount: targetIndices.length,
        isLinearized: false,
        watermarkedSize: unlinearized.length,
        originalSize: inputBuffer.length,
      };
    }
  }, { timeoutMs });
}

export async function handlePdfWatermark(req: Request, res: Response): Promise<void> {
  if (!req.file || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No PDF file uploaded for watermark");
    return;
  }
  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Uploaded file is not a valid PDF document");
    return;
  }

  const text = req.body.text !== undefined ? String(req.body.text) : "";
  let imageBuffer: Buffer | undefined;
  if ((req as any).files?.image?.[0]?.buffer) {
    imageBuffer = (req as any).files.image[0].buffer;
  } else if (req.body.imageBase64) {
    imageBuffer = Buffer.from(String(req.body.imageBase64).replace(/^data:image\/\w+;base64,/, ""), "base64");
  }

  if (!text.trim() && !imageBuffer) {
    apiError(res, 400, "EMPTY_WATERMARK", "Neither text nor image was provided for watermark");
    return;
  }

  try {
    const result = await applyWatermark(req.file.buffer, {
      text,
      imageBuffer,
      fontSize: req.body.fontSize !== undefined ? parseInt(String(req.body.fontSize), 10) : undefined,
      opacity: req.body.opacity !== undefined ? parseFloat(String(req.body.opacity)) : undefined,
      angle: req.body.angle !== undefined ? parseInt(String(req.body.angle), 10) : undefined,
      color: req.body.color !== undefined ? String(req.body.color) : undefined,
      pattern: req.body.pattern !== undefined ? String(req.body.pattern) : undefined,
      pages: req.body.pages !== undefined ? String(req.body.pages) : undefined,
      position: req.body.position !== undefined ? String(req.body.position) : undefined,
    });

    const rawName = req.file.originalname ?? "document.pdf";
    const baseName = pdfBaseName(rawName);
    const disposition = buildContentDisposition(`${baseName}_watermarked.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Watermark-Type": result.watermarkType,
      "X-Page-Count": String(result.pageCount),
      "X-Linearized": String(result.isLinearized),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Watermark-Type, X-Page-Count, X-Linearized",
    });
    res.send(result.buffer);
  } catch (err: unknown) {
    const code = (err as unknown as { code?: string })?.code;
    const msg = err instanceof Error ? err.message : "PDF watermark failed";
    if (code === "EMPTY_WATERMARK" || /empty.*watermark/i.test(msg)) {
      apiError(res, 400, "EMPTY_WATERMARK", msg);
      return;
    }
    apiError(res, 500, "WATERMARK_FAILED", msg);
  }
}
