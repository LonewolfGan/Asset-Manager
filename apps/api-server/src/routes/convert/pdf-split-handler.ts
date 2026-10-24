import type { Request, Response } from "express";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";
import { splitPdfDocument, type SplitPdfOptions } from "../pdf/pdf-transform-logic.js";
import { pdfBaseName } from "../pdf/guards.js";

export interface SplitPdfHandlerOptions {
  mode?: "every" | "range" | "extract" | string;
  ranges?: string;
  pages?: number[];
  mergeOutput?: boolean;
  baseName?: string;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
  workDir?: string;
}

export interface SplitPdfHandlerResult {
  buffer: Buffer;
  isZip: boolean;
  segmentCount: number;
  pageCount: number;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 && // F
    buffer[4] === 0x2d    // -
  );
}

/**
 * High-fidelity PDF Split Engine handler executing under ProcessPool isolation.
 */
export async function splitPdf(
  inputBuffer: Buffer,
  options?: SplitPdfHandlerOptions
): Promise<SplitPdfHandlerResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 120_000;

  let rangesStr = options?.ranges ?? "";
  if (!rangesStr && options?.pages && options.pages.length > 0) {
    rangesStr = options.pages.join(", ");
  }

  const rawMode = String(options?.mode ?? (rangesStr ? "ranges" : "every")).toLowerCase();
  const mode: "every" | "ranges" =
    rawMode === "range" || rawMode === "ranges" || rawMode === "extract" || (Boolean(rangesStr) && rawMode !== "every")
      ? "ranges"
      : "every";

  const mergeOutput = Boolean(options?.mergeOutput);
  const baseName = options?.baseName ?? "document";

  const executeSplit = async (): Promise<SplitPdfHandlerResult> => {
    let srcPageCount = 0;
    try {
      const srcDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
      srcPageCount = srcDoc.getPageCount();
    } catch {
      srcPageCount = 0;
    }

    const transformOpts: SplitPdfOptions = {
      mode,
      rangesStr,
      mergeOutput,
      baseName,
    };

    const res = await splitPdfDocument(inputBuffer, transformOpts);
    let finalPageCount = srcPageCount;

    if (!res.isZip) {
      try {
        const outDoc = await PDFDocument.load(res.buffer, { ignoreEncryption: true });
        finalPageCount = outDoc.getPageCount();
      } catch {
        finalPageCount = res.segmentCount;
      }
    }

    return {
      buffer: res.buffer,
      isZip: res.isZip,
      segmentCount: res.segmentCount,
      pageCount: finalPageCount,
    };
  };

  if (options?.workDir) {
    return executeSplit();
  }

  return pool.run(async () => executeSplit(), { timeoutMs });
}

/**
 * Express HTTP handler for POST /convert/pdf-split (and legacy /tools/pdf-split)
 */
export async function handlePdfSplit(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = pdfBaseName(originalName);

  const mode = String(req.body.mode ?? "every");
  const ranges = String(req.body.ranges ?? req.body.rangesStr ?? "");
  const mergeOutput = String(req.body.merge ?? req.body.mergeOutput ?? "false") === "true";

  try {
    const result = await splitPdf(req.file.buffer, {
      mode,
      ranges,
      mergeOutput,
      baseName,
    });

    const ext = result.isZip ? "zip" : "pdf";
    const filename = `${baseName}_${result.isZip ? "split" : "extracted"}.${ext}`;
    const contentType = result.isZip ? "application/zip" : "application/pdf";
    const disposition = buildContentDisposition(filename, ext);

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "X-Segment-Count": String(result.segmentCount),
      "X-Is-Zip": String(result.isZip),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Page-Count, X-Segment-Count, X-Is-Zip",
    });

    res.send(result.buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF Split failed";
    const isBadInput =
      /invalid|corrupt|empty|password|out of bounds|no valid/i.test(msg);

    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
