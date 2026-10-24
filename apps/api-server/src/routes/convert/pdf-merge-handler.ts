import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export interface MergePdfOptions {
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
  workDir?: string;
}

export interface MergePdfResult {
  buffer: Buffer;
  pageCount: number;
  mergedCount: number;
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
 * Merges multiple PDF buffers using QPDF with Fast Web View linearization,
 * falling back to pdf-lib if exotic PDF features prevent CLI processing.
 */
export async function mergePdf(
  inputBuffers: Buffer[],
  options?: MergePdfOptions
): Promise<MergePdfResult> {
  if (!inputBuffers || inputBuffers.length < 2) {
    throw new Error("At least 2 PDF documents are required for merge.");
  }

  for (let i = 0; i < inputBuffers.length; i++) {
    const buf = inputBuffers[i];
    if (!buf || buf.length === 0) {
      throw new Error(`Invalid or empty PDF buffer at index ${i}`);
    }
    if (!isValidPdfHeader(buf)) {
      throw new Error(`Invalid or corrupt PDF buffer at index ${i}: missing %PDF- header`);
    }
  }

  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 120_000;

  const runMergeInDir = async (workspaceDir: string, signal?: AbortSignal): Promise<MergePdfResult> => {
    const filePaths: string[] = [];
    const pageArgs: string[] = [];

    for (let i = 0; i < inputBuffers.length; i++) {
      const p = join(workspaceDir, `input_${i}.pdf`);
      await writeFile(p, inputBuffers[i]);
      filePaths.push(p);
      pageArgs.push(p, "1-z");
    }

    const outPath = join(workspaceDir, "merged_linearized.pdf");
    let qpdfSuccess = false;

    try {
      await execFileAsync(
        BIN.qpdf,
        [
          "--warning-exit-0",
          "--empty",
          "--pages",
          ...pageArgs,
          "--",
          "--linearize",
          "--object-streams=generate",
          outPath,
        ],
        { signal, timeout: timeoutMs }
      );
      qpdfSuccess = true;
    } catch {
      // Fall back to in-memory pdf-lib merge
    }

    if (qpdfSuccess) {
      const mergedBuf = await readFile(outPath);
      if (mergedBuf.length > 0 && isValidPdfHeader(mergedBuf)) {
        let count = 0;
        try {
          const doc = await PDFDocument.load(mergedBuf, { ignoreEncryption: true });
          count = doc.getPageCount();
        } catch {
          count = 0;
        }
        return {
          buffer: mergedBuf,
          pageCount: count,
          mergedCount: inputBuffers.length,
        };
      }
    }

    // Fallback: pdf-lib assembly
    const mergedDoc = await PDFDocument.create();
    for (const buf of inputBuffers) {
      const srcDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const page of pages) {
        mergedDoc.addPage(page);
      }
    }

    const rawBytes = await mergedDoc.save();
    return {
      buffer: Buffer.from(rawBytes),
      pageCount: mergedDoc.getPageCount(),
      mergedCount: inputBuffers.length,
    };
  };

  if (options?.workDir) {
    return runMergeInDir(options.workDir, options.signal);
  }

  return pool.run(async (ctx) => runMergeInDir(ctx.workspaceDir, ctx.signal), {
    timeoutMs,
  });
}

/**
 * HTTP handler for POST /convert/pdf-merge (and legacy /tools/pdf-merge)
 */
export async function handlePdfMerge(req: Request, res: Response): Promise<void> {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length < 2) {
    apiError(res, 400, "MISSING_FILES", "At least 2 PDF files are required.");
    return;
  }

  try {
    const buffers = files.map((f) => f.buffer);
    const result = await mergePdf(buffers);

    const rawFilename = typeof req.body?.filename === "string" ? req.body.filename.trim() : "";
    const filename = rawFilename ? (rawFilename.toLowerCase().endsWith(".pdf") ? rawFilename : `${rawFilename}.pdf`) : "merged_document.pdf";
    const disposition = buildContentDisposition(filename, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "X-Merged-Count": String(result.mergedCount),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Page-Count, X-Merged-Count",
    });

    res.send(result.buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF Merge failed";
    const isBadInput =
      /invalid|corrupt|empty|password|fewer than 2|at least 2/i.test(msg);

    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
