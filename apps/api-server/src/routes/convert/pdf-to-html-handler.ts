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

export const HTML_MIME_TYPE = "text/html; charset=utf-8";

export interface ConvertPdfToHtmlOptions {
  timeoutMs?: number;
  pool?: ProcessPool;
  title?: string;
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
 * Converts a PDF buffer into a responsive, high-fidelity, self-contained HTML5
 * document using PyMuPDF 2.0 SVG container inside an isolated ProcessPool workspace.
 */
export async function convertPdfToHtml(
  inputBuffer: Buffer,
  options?: ConvertPdfToHtmlOptions
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
      const outputHtmlPath = join(ctx.workspaceDir, "output.html");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_html.py");
      const args = ["--pdf", inputPdfPath, "--html", outputHtmlPath];
      if (options?.title) {
        args.push("--title", options.title);
      }

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
        throw new Error(`PDF to HTML conversion failed: ${stderr || message}`);
      }

      const htmlBuffer = await readFile(outputHtmlPath);
      if (!htmlBuffer || htmlBuffer.length === 0) {
        throw new Error("Conversion failed to produce a valid HTML output buffer");
      }

      return htmlBuffer;
    },
    { timeoutMs }
  );
}

/**
 * Express HTTP handler for POST /convert/pdf-to-html
 */
export async function handlePdfToHtml(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "").trim() || "document";

  try {
    const htmlBuffer = await convertPdfToHtml(req.file.buffer, { title: baseName });

    res.set("Content-Type", HTML_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.html`, "html"));
    res.set("Cache-Control", "no-store");
    res.send(htmlBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF to HTML conversion failed";
    const isBadInput =
      /invalid|corrupt|empty|encrypted|password|zero pages|syntax error|damaged|broken/i.test(
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
