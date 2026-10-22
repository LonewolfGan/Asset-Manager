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

export interface ConvertPdfToImageOptions {
  format?: "png" | "jpeg" | "jpg" | "webp";
  dpi?: number;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
}

export interface ConvertPdfToImageResult {
  buffer: Buffer;
  isArchive: boolean;
  mimeType: string;
  extension: string;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

export async function convertPdfToImage(
  inputBuffer: Buffer,
  options?: ConvertPdfToImageOptions
): Promise<ConvertPdfToImageResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF header: file does not match PDF signature");
  }

  const rawFormat = (options?.format ?? "png").toLowerCase().trim();
  const format = rawFormat === "jpg" ? "jpeg" : (rawFormat as "png" | "jpeg" | "webp");
  const dpi = Math.max(72, Math.min(600, options?.dpi ?? 150));
  const timeoutMs = options?.timeoutMs ?? 120_000;
  const pool = options?.pool ?? defaultProcessPool;

  return pool.run(
    async (ctx) => {
      const inputPdfPath = join(ctx.workspaceDir, "input.pdf");
      const outputPath = join(ctx.workspaceDir, "output.bin");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_image.py");
      const args = [
        "--pdf", inputPdfPath,
        "--output", outputPath,
        "--format", format,
        "--dpi", String(dpi),
      ];

      try {
        await execFileAsync(BIN.python3, [scriptPath, ...args], {
          signal: options?.signal ?? ctx.signal,
          timeout: timeoutMs,
          maxBuffer: 50 * 1024 * 1024,
        });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr || "";
        const message = err instanceof Error ? err.message : "Unknown Python error";
        if (/encrypted|password-protected/i.test(stderr)) {
          throw new Error("PDF document is encrypted or password-protected");
        }
        if (/zero pages/i.test(stderr)) {
          throw new Error("PDF document contains zero pages");
        }
        throw new Error(`PDF to Image rendering failed: ${stderr || message}`);
      }

      const outputBuffer = await readFile(outputPath);
      // Check if output is a ZIP archive (PK\x03\x04)
      const isZip =
        outputBuffer.length >= 4 &&
        outputBuffer[0] === 0x50 &&
        outputBuffer[1] === 0x4b &&
        outputBuffer[2] === 0x03 &&
        outputBuffer[3] === 0x04;

      if (isZip) {
        return {
          buffer: outputBuffer,
          isArchive: true,
          mimeType: "application/zip",
          extension: "zip",
        };
      }

      const mimeType = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
      return {
        buffer: outputBuffer,
        isArchive: false,
        mimeType,
        extension: format,
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfToImage(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Invalid or corrupt PDF file");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "").trim() || "document";
  const requestedFormat = (req.body?.format ?? "png").toLowerCase().trim();
  const requestedDpi = parseInt(req.body?.dpi ?? "150", 10) || 150;

  try {
    const result = await convertPdfToImage(req.file.buffer, {
      format: requestedFormat,
      dpi: requestedDpi,
    });

    const filename = result.isArchive ? `${baseName}_images` : baseName;
    res.set("Content-Type", result.mimeType);
    res.set("Content-Disposition", buildContentDisposition(filename, result.extension));
    res.set("Cache-Control", "no-store");
    res.send(result.buffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Rendering failed";
    if (/encrypted|password-protected/i.test(message)) {
      apiError(res, 400, "PDF_ENCRYPTED", message);
      return;
    }
    if (/zero pages/i.test(message)) {
      apiError(res, 400, "PDF_EMPTY", message);
      return;
    }
    apiError(res, 500, "CONVERSION_FAILED", message);
  }
}
