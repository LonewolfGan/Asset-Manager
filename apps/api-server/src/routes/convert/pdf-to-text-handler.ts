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

export const TEXT_MIME_TYPE = "text/plain; charset=utf-8";

export interface ConvertPdfToTextOptions {
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
 * Extracts plain text from a PDF buffer inside an isolated ProcessPool workspace.
 */
export async function convertPdfToText(
  inputBuffer: Buffer,
  options?: ConvertPdfToTextOptions
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
      const outputTxtPath = join(ctx.workspaceDir, "output.txt");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_text.py");
      const args = ["--pdf", inputPdfPath, "--output", outputTxtPath];

      try {
        await execFileAsync(
          BIN.python3,
          [scriptPath, ...args],
          {
            signal: ctx.signal,
            timeout: timeoutMs,
            maxBuffer: 50 * 1024 * 1024,
          }
        );
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr || "";
        const message = err instanceof Error ? err.message : "Unknown Python error";
        if (/encrypted|password-protected/i.test(stderr)) {
          throw new Error("PDF document is encrypted or password-protected");
        }
        if (/zero pages/i.test(stderr)) {
          throw new Error("PDF document contains zero pages");
        }
        throw new Error(`PDF to Text extraction failed: ${stderr || message}`);
      }

      const txtBuffer = await readFile(outputTxtPath);
      return txtBuffer;
    },
    { timeoutMs }
  );
}

/**
 * Express HTTP handler for POST /convert/pdf-to-text
 */
export async function handlePdfToText(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "").trim() || "document";

  try {
    const textBuffer = await convertPdfToText(req.file.buffer);

    // Support Accept: application/json for backward compatibility
    const acceptHeader = req.headers.accept ?? "";
    if (acceptHeader.includes("application/json")) {
      res.json({ text: textBuffer.toString("utf-8") });
      return;
    }

    res.set("Content-Type", TEXT_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.txt`, "txt"));
    res.set("Cache-Control", "no-store");
    res.send(textBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF to Text extraction failed";
    const isBadInput =
      /invalid|corrupt|empty|encrypted|password|zero pages|syntax error|damaged|broken|failed to open|no objects|filedataerror/i.test(
        msg
      );
    apiError(
      res,
      isBadInput ? 400 : 500,
      isBadInput ? "INVALID_PDF" : "CONVERSION_FAILED",
      msg
    );
  }
}
