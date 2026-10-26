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

export interface PageNumbersOptions {
  position?: "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right" | string;
  format?: string;
  startFrom?: number;
  skipFirst?: boolean;
  fontSize?: number;
  margin?: number;
  color?: string;
  pool?: ProcessPool;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface PageNumbersResult {
  buffer: Buffer;
  pageCount: number;
  numberedCount: number;
  isLinearized: boolean;
  originalSize: number;
  resultSize: number;
}

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
];

export function toRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) return String(num);
  let rem = num, res = "";
  for (const [val, sym] of ROMAN_MAP) {
    while (rem >= val) { res += sym; rem -= val; }
  }
  return res;
}

function isValidPdfHeader(buf: Buffer): boolean {
  return Boolean(buf && buf.length >= 5 && buf.subarray(0, 5).equals(Buffer.from("%PDF-")));
}

function parseColor(col?: string): RGB {
  if (!col) return rgb(0, 0, 0);
  const s = col.toLowerCase().trim();
  if (s === "black" || s === "#000000" || s === "#000") return rgb(0, 0, 0);
  if (s === "red" || s === "#ff0000") return rgb(0.9, 0.1, 0.1);
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
  return rgb(0, 0, 0);
}

function calculateCoordinates(
  pos: string, W: number, H: number, rot: number, textWidth: number, S: number, M: number
): { x: number; y: number; drawAngle: number } {
  const isRotated = rot === 90 || rot === 270;
  const Wv = isRotated ? H : W, Hv = isRotated ? W : H;
  let Xv = (Wv - textWidth) / 2, Yv = M;

  if (pos === "bottom-left") { Xv = M; Yv = M; }
  else if (pos === "bottom-center") { Xv = (Wv - textWidth) / 2; Yv = M; }
  else if (pos === "bottom-right") { Xv = Wv - M - textWidth; Yv = M; }
  else if (pos === "top-left") { Xv = M; Yv = Hv - M - S; }
  else if (pos === "top-center") { Xv = (Wv - textWidth) / 2; Yv = Hv - M - S; }
  else if (pos === "top-right") { Xv = Wv - M - textWidth; Yv = Hv - M - S; }

  if (rot === 90) return { x: W - Yv, y: Xv, drawAngle: 90 };
  if (rot === 180) return { x: W - Xv, y: H - Yv, drawAngle: 180 };
  if (rot === 270) return { x: Yv, y: H - Xv, drawAngle: 270 };
  return { x: Xv, y: Yv, drawAngle: 0 };
}

export async function addPageNumbers(
  inputBuffer: Buffer,
  options: PageNumbersOptions = {}
): Promise<PageNumbersResult> {
  if (!inputBuffer || inputBuffer.length === 0) throw new Error("Invalid or empty PDF buffer");
  if (!isValidPdfHeader(inputBuffer)) throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");

  const pool = options.pool ?? defaultProcessPool;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const position = options.position ?? "bottom-center";
  const format = options.format ?? "{n} / {total}";
  const startFrom = typeof options.startFrom === "number" && !isNaN(options.startFrom) ? options.startFrom : 1;
  const skipFirst = Boolean(options.skipFirst);
  const fontSize = typeof options.fontSize === "number" && options.fontSize > 0 ? options.fontSize : 11;
  const margin = typeof options.margin === "number" && !isNaN(options.margin) ? options.margin : 36;
  const col = parseColor(options.color);

  return pool.run(async (ctx) => {
    const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pageCount = pdfDoc.getPageCount();
    let numberedCount = 0;

    for (let i = 0; i < pageCount; i++) {
      if (skipFirst && i === 0) continue;
      const page = pdfDoc.getPage(i);
      const { width: W, height: H } = page.getSize();
      const rot = ((page.getRotation().angle % 360) + 360) % 360;
      const currentNum = startFrom + (skipFirst ? i - 1 : i);

      const rawText = format
        .replace(/\{n\}/g, String(currentNum))
        .replace(/\{total\}/g, String(pageCount))
        .replace(/\{roman\}/g, toRoman(currentNum).toLowerCase())
        .replace(/\{ROMAN\}/g, toRoman(currentNum).toUpperCase());

      const textToDraw = sanitizeWinAnsi(rawText);
      const textWidth = font.widthOfTextAtSize(textToDraw, fontSize);
      const { x, y, drawAngle } = calculateCoordinates(position, W, H, rot, textWidth, fontSize, margin);

      page.drawText(textToDraw, { x, y, size: fontSize, font, color: col, rotate: degrees(drawAngle) });
      numberedCount++;
    }

    const unlinearized = Buffer.from(await pdfDoc.save());
    const inPath = join(ctx.workspaceDir, "unlinearized.pdf");
    const outPath = join(ctx.workspaceDir, "linearized.pdf");
    await writeFile(inPath, unlinearized);

    try {
      await execFileAsync(BIN.qpdf, ["--warning-exit-0", "--linearize", inPath, outPath], {
        signal: ctx.signal, timeout: timeoutMs
      });
      const outputBuffer = await readFile(outPath);
      return {
        buffer: outputBuffer, pageCount, numberedCount, isLinearized: true,
        originalSize: inputBuffer.length, resultSize: outputBuffer.length,
      };
    } catch {
      return {
        buffer: unlinearized, pageCount, numberedCount, isLinearized: false,
        originalSize: inputBuffer.length, resultSize: unlinearized.length,
      };
    }
  }, { timeoutMs });
}

export async function handlePdfPageNumbers(req: Request, res: Response): Promise<void> {
  if (!req.file || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No PDF file uploaded for page numbering");
    return;
  }
  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Uploaded file is not a valid PDF document");
    return;
  }

  try {
    const rawSkipFirst = req.body.skipFirst;
    const skipFirst = typeof rawSkipFirst === "boolean" ? rawSkipFirst : String(rawSkipFirst ?? "false").toLowerCase() === "true";

    const result = await addPageNumbers(req.file.buffer, {
      position: req.body.position !== undefined ? String(req.body.position) : undefined,
      format: req.body.format !== undefined ? String(req.body.format) : undefined,
      startFrom: req.body.startFrom !== undefined ? parseInt(String(req.body.startFrom), 10) : undefined,
      skipFirst,
      fontSize: req.body.fontSize !== undefined ? parseInt(String(req.body.fontSize), 10) : undefined,
      margin: req.body.margin !== undefined ? parseInt(String(req.body.margin), 10) : undefined,
      color: req.body.color !== undefined ? String(req.body.color) : undefined,
    });

    const rawName = req.file.originalname ?? "document.pdf";
    const baseName = pdfBaseName(rawName);
    const disposition = buildContentDisposition(`${baseName}_numbered.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "X-Numbered-Pages-Count": String(result.numberedCount),
      "X-Linearized": String(result.isLinearized),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Page-Count, X-Numbered-Pages-Count, X-Linearized",
    });
    res.send(result.buffer);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Page numbering failed";
    apiError(res, 500, "PAGE_NUMBERS_FAILED", msg);
  }
}
