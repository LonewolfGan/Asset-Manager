import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export interface ConvertPdfaOptions {
  conformance?: "1b" | "2b" | "3b" | string;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
}

export interface ConvertPdfaResult {
  buffer: Buffer;
  pageCount: number;
  mimeType: string;
  conformance: string;
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

export async function convertPdfToPdfa(
  inputBuffer: Buffer,
  options?: ConvertPdfaOptions
): Promise<ConvertPdfaResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const rawConf = String(options?.conformance ?? "2b").toLowerCase().trim();
  const pdfaLevel = rawConf.startsWith("1") ? 1 : rawConf.startsWith("3") ? 3 : 2;
  const canonicalConf = pdfaLevel === 1 ? "1b" : pdfaLevel === 3 ? "3b" : "2b";
  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 120_000;

  return pool.run(
    async (ctx) => {
      const inputPath = join(ctx.workspaceDir, "input.pdf");
      const rawOutputPath = join(ctx.workspaceDir, "output_raw.pdf");

      await writeFile(inputPath, inputBuffer);

      await execFileAsync(
        BIN.gs,
        [
          `-dPDFA=${pdfaLevel}`,
          "-dBATCH",
          "-dNOPAUSE",
          "-dNOOUTERSAVE",
          "-dSAFER",
          "-sProcessColorModel=DeviceRGB",
          "-sColorConversionStrategy=RGB",
          "-sDEVICE=pdfwrite",
          "-sPDFACompatibilityPolicy=1",
          `-sOutputFile=${rawOutputPath}`,
          inputPath,
        ],
        { timeout: timeoutMs, signal: options?.signal }
      );

      const rawBytes = await readFile(rawOutputPath);
      const doc = await PDFDocument.load(rawBytes, { ignoreEncryption: true });
      const linearized = await linearizePdf(rawBytes);

      return {
        buffer: linearized,
        pageCount: doc.getPageCount(),
        mimeType: "application/pdf",
        conformance: canonicalConf,
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfToPdfa(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Invalid or corrupt PDF file");
    return;
  }

  const conformance = String(req.body?.conformance ?? "2b").toLowerCase().trim();
  const suffix = conformance.startsWith("1")
    ? "pdfa1b"
    : conformance.startsWith("3")
    ? "pdfa3b"
    : "pdfa2b";
  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "").trim() || "document";

  try {
    const result = await convertPdfToPdfa(req.file.buffer, { conformance });
    const disposition = buildContentDisposition(`${baseName}_${suffix}.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Page-Count",
    });
    res.send(result.buffer);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "PDF/A conversion failed";
    const isMissing = msg.includes("ENOENT");
    const isClient = /invalid|corrupt|empty|unsupported|zero pages|password|encrypted/i.test(msg);
    const status = isMissing ? 503 : isClient ? 400 : 500;
    const code = isMissing
      ? "BINARY_UNAVAILABLE"
      : isClient
      ? "INVALID_INPUT"
      : "CONVERSION_FAILED";

    apiError(res, status, code, isMissing ? "Ghostscript is not installed on this server." : msg);
  }
}
