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

export const PPTX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";

export interface ConvertPdfToPptxOptions {
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
 * Converts a PDF buffer into a high-fidelity editable PPTX buffer using PyMuPDF 2.0
 * and python-pptx in an isolated ephemeral workspace managed by ProcessPool.
 */
export async function convertPdfToPptx(
  inputBuffer: Buffer,
  options?: ConvertPdfToPptxOptions
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
      const outputPptxPath = join(ctx.workspaceDir, "output.pptx");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_pptx.py");

      try {
        await execFileAsync(
          BIN.python3,
          [scriptPath, "--pdf", inputPdfPath, "--pptx", outputPptxPath],
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
        throw new Error(`PDF to PowerPoint conversion failed: ${errorMsg}`);
      }

      const pptxBuffer = await readFile(outputPptxPath);
      if (!pptxBuffer || pptxBuffer.length === 0) {
        throw new Error("Conversion failed to produce a valid PPTX output buffer");
      }

      return pptxBuffer;
    },
    { timeoutMs }
  );
}

/**
 * Express HTTP handler for POST /convert/pdf-to-pptx
 */
export async function handlePdfToPptx(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "presentation.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "");

  try {
    const pptxBuffer = await convertPdfToPptx(req.file.buffer);

    res.set("Content-Type", PPTX_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.pptx`, "pptx"));
    res.set("Cache-Control", "no-store");
    res.send(pptxBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF to PowerPoint conversion failed";
    const isBadInput = /invalid|corrupt|empty/i.test(msg);
    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
