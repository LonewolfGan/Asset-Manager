import type { Request, Response } from "express";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";
import { rotatePdfPages, type RotatePdfOptions } from "../pdf/pdf-transform-logic.js";
import { pdfBaseName } from "../pdf/guards.js";

export interface RotatePdfHandlerOptions {
  rotationDeg?: number;
  perPageRotations?: Record<number, number> | number[];
  pages?: string;
  baseName?: string;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
  workDir?: string;
}

export interface RotatePdfHandlerResult {
  buffer: Buffer;
  pageCount: number;
  rotatedCount: number;
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
 * High-fidelity PDF Rotate Engine handler executing under ProcessPool isolation.
 */
export async function rotatePdf(
  inputBuffer: Buffer,
  options?: RotatePdfHandlerOptions
): Promise<RotatePdfHandlerResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 120_000;

  const executeRotate = async (): Promise<RotatePdfHandlerResult> => {
    let srcPageCount = 0;
    try {
      const srcDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
      srcPageCount = srcDoc.getPageCount();
    } catch {
      srcPageCount = 0;
    }

    const transformOpts: RotatePdfOptions = {
      rotationDeg: options?.rotationDeg,
      perPageRotations: options?.perPageRotations,
      pages: options?.pages,
    };

    const res = await rotatePdfPages(inputBuffer, transformOpts);

    let rotatedCount = 0;
    if (options?.perPageRotations) {
      if (Array.isArray(options.perPageRotations)) {
        rotatedCount = options.perPageRotations.filter((d) => d && d % 360 !== 0).length;
      } else {
        rotatedCount = Object.values(options.perPageRotations).filter(
          (d) => typeof d === "number" && d % 360 !== 0
        ).length;
      }
    } else {
      const deg = options?.rotationDeg ?? 90;
      const targetPages = options?.pages && options.pages !== "all"
        ? options.pages.split(",").filter((p) => {
            const idx = parseInt(p.trim(), 10) - 1;
            return !isNaN(idx) && idx >= 0 && idx < srcPageCount;
          }).length
        : srcPageCount;
      rotatedCount = deg % 360 !== 0 ? targetPages : 0;
    }

    return {
      buffer: res.buffer,
      pageCount: res.pageCount,
      rotatedCount,
    };
  };

  if (options?.workDir) {
    return executeRotate();
  }

  return pool.run(async () => executeRotate(), { timeoutMs });
}

/**
 * Express HTTP handler for POST /convert/pdf-rotate (and legacy /tools/pdf-rotate)
 */
export async function handlePdfRotate(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = pdfBaseName(originalName);

  let rotationDeg: number | undefined;
  if (req.body.rotation !== undefined || req.body.rotationDeg !== undefined) {
    const parsed = parseInt(String(req.body.rotation ?? req.body.rotationDeg), 10);
    if (!isNaN(parsed)) rotationDeg = parsed;
  }

  let perPageRotations: Record<number, number> | undefined;
  if (req.body.perPageRotations) {
    try {
      perPageRotations =
        typeof req.body.perPageRotations === "string"
          ? JSON.parse(req.body.perPageRotations)
          : req.body.perPageRotations;
    } catch {
      perPageRotations = undefined;
    }
  }

  const pages = req.body.pages ? String(req.body.pages) : undefined;

  try {
    const result = await rotatePdf(req.file.buffer, {
      rotationDeg,
      perPageRotations,
      pages,
      baseName,
    });

    const filename = `${baseName}_rotated.pdf`;
    const disposition = buildContentDisposition(filename, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "X-Rotated-Count": String(result.rotatedCount),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Page-Count, X-Rotated-Count",
    });

    res.send(result.buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF Rotate failed";
    const isBadInput = /invalid|corrupt|empty|password|out of bounds/i.test(msg);

    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
