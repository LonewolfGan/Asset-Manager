import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultProcessPool } from "../../lib/process-pool.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export interface ConvertPdfToWordOptions {
  timeoutMs?: number;
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
 * Converts a PDF buffer into a high-fidelity DOCX buffer using PyMuPDF / pdf2docx
 * in an isolated ephemeral workspace managed by ProcessPool.
 */
export async function convertPdfToWord(
  inputBuffer: Buffer,
  options?: ConvertPdfToWordOptions
): Promise<Buffer> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF header: file does not match PDF signature");
  }

  const timeoutMs = options?.timeoutMs ?? 120_000;

  return defaultProcessPool.run(
    async (ctx) => {
      const inputPdfPath = join(ctx.workspaceDir, "input.pdf");
      const outputDocxPath = join(ctx.workspaceDir, "output.docx");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_word.py");

      try {
        await execFileAsync(
          BIN.python3,
          [scriptPath, "--pdf", inputPdfPath, "--docx", outputDocxPath],
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
        throw new Error(`PDF to Word conversion failed: ${errorMsg}`);
      }

      const docxBuffer = await readFile(outputDocxPath);
      if (!docxBuffer || docxBuffer.length === 0) {
        throw new Error("Conversion failed to produce a valid DOCX output buffer");
      }

      return docxBuffer;
    },
    { timeoutMs }
  );
}

/**
 * Express HTTP handler for POST /convert/pdf-to-word
 */
export async function handlePdfToWord(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "");

  try {
    const docxBuffer = await convertPdfToWord(req.file.buffer);

    res.set("Content-Type", DOCX_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.docx`, "docx"));
    res.set("Cache-Control", "no-store");
    res.send(docxBuffer);
  } catch (err) {
    apiError(
      res,
      500,
      "CONVERSION_FAILED",
      err instanceof Error ? err.message : "PDF to Word conversion failed"
    );
  }
}
