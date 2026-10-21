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

export const MARKDOWN_MIME_TYPE = "text/markdown; charset=utf-8";

export interface ConvertPdfToMarkdownOptions {
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
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

export async function convertPdfToMarkdown(
  inputBuffer: Buffer,
  options?: ConvertPdfToMarkdownOptions
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
      const outputMdPath = join(ctx.workspaceDir, "output.md");

      await writeFile(inputPdfPath, inputBuffer);

      const scriptPath = getPythonScriptPath("pdf_to_markdown.py");
      const args = ["--pdf", inputPdfPath, "--output", outputMdPath];

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
        throw new Error(`PDF to Markdown extraction failed: ${stderr || message}`);
      }

      return readFile(outputMdPath);
    },
    { timeoutMs }
  );
}

export async function handlePdfToMarkdown(req: Request, res: Response): Promise<void> {
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

  try {
    const mdBuffer = await convertPdfToMarkdown(req.file.buffer);

    const acceptHeader = req.headers.accept ?? "";
    if (acceptHeader.includes("application/json")) {
      res.json({ markdown: mdBuffer.toString("utf-8") });
      return;
    }

    res.set("Content-Type", MARKDOWN_MIME_TYPE);
    res.set("Content-Disposition", buildContentDisposition(`${baseName}.md`, "md"));
    res.set("Cache-Control", "no-store");
    res.send(mdBuffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF to Markdown extraction failed";
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
