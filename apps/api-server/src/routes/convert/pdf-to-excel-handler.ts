import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface ConvertPdfToExcelOptions {
  timeoutMs?: number;
  pool?: ProcessPool;
}

/**
 * Validates whether the given buffer has valid PDF magic header (%PDF-).
 */
function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  // %PDF- magic bytes: 0x25, 0x50, 0x44, 0x46, 0x2D
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

/**
 * Converts a PDF buffer into a high-fidelity XLSX buffer using PyMuPDF 2.0 / openpyxl
 * in an isolated ephemeral workspace managed by ProcessPool.
 */
export async function convertPdfToExcel(
  inputBuffer: Buffer,
  options?: ConvertPdfToExcelOptions
): Promise<Buffer> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF header: file does not match PDF signature");
  }

  const timeoutMs = options?.timeoutMs ?? 120_000;
  const pool = options?.pool ?? defaultProcessPool;

  return pool.run(
    async (ctx) => {
      const inputPdfPath = join(ctx.workspaceDir, "input.pdf");
      const outputXlsxPath = join(ctx.workspaceDir, "output.xlsx");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_excel.py");

      try {
        await execFileAsync(
          BIN.python3,
          [scriptPath, "--pdf", inputPdfPath, "--xlsx", outputXlsxPath],
          {
            signal: ctx.signal,
            timeout: timeoutMs,
            maxBuffer: 50 * 1024 * 1024,
          }
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? (err as { stderr?: string }).stderr || err.message
            : "Unknown Python execution error";
        throw new Error(`PDF to Excel conversion failed: ${errorMsg}`);
      }

      const xlsxBuffer = await readFile(outputXlsxPath);
      if (!xlsxBuffer || xlsxBuffer.length === 0) {
        throw new Error("Conversion failed to produce a valid XLSX output buffer");
      }

      return xlsxBuffer;
    },
    { timeoutMs }
  );
}

/**
 * Express HTTP handler for POST /convert/pdf-to-excel
 */
export async function handlePdfToExcel(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "");

  try {
    const xlsxBuffer = await convertPdfToExcel(req.file.buffer);

    res.set("Content-Type", EXCEL_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.xlsx`, "xlsx"));
    res.set("Cache-Control", "no-store");
    res.send(xlsxBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF to Excel conversion failed";
    const isBadInput = /invalid|corrupt|empty/i.test(msg);
    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
