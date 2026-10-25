import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export interface UnlockPdfOptions {
  password?: string;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
}

export interface UnlockPdfResult {
  buffer: Buffer;
  isDecrypted: boolean;
  isLinearized: boolean;
  originalSize: number;
  unlockedSize: number;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
}

export async function unlockPdf(
  inputBuffer: Buffer,
  options: UnlockPdfOptions = {}
): Promise<UnlockPdfResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const rawPassword = options.password !== undefined ? String(options.password) : "";

  if (rawPassword.length > 128) {
    const err = new Error("Password too long (max 128 characters).");
    (err as unknown as { code: string }).code = "INVALID_PARAM";
    throw err;
  }

  const pool = options.pool ?? defaultProcessPool;
  const timeoutMs = options.timeoutMs ?? 60_000;

  return pool.run(
    async (ctx) => {
      const inPath = join(ctx.workspaceDir, "input.pdf");
      const outPath = join(ctx.workspaceDir, "unlocked.pdf");

      await writeFile(inPath, inputBuffer);

      // Probe encryption via qpdf --is-encrypted (exit 0 = encrypted, exit 2 = not encrypted)
      try {
        await execFileAsync(BIN.qpdf, ["--is-encrypted", inPath], {
          signal: ctx.signal,
          timeout: 10_000,
        });
      } catch (probeErr: unknown) {
        const code = (probeErr as { code?: number | string })?.code;
        const status = (probeErr as { status?: number })?.status;
        if (code === 2 || status === 2) {
          const notEncErr = new Error("Document is not encrypted.");
          (notEncErr as unknown as { code: string }).code = "NOT_ENCRYPTED";
          throw notEncErr;
        }
        throw probeErr;
      }

      const args = ["--warning-exit-0", "--linearize", "--decrypt"];
      if (rawPassword) {
        args.push(`--password=${rawPassword}`);
      }
      args.push("--", inPath, outPath);

      try {
        await execFileAsync(BIN.qpdf, args, { signal: ctx.signal, timeout: timeoutMs });
      } catch (execErr: unknown) {
        const stderr = execErr instanceof Error ? execErr.message : String(execErr);
        const code = (execErr as { code?: number | string })?.code;
        const status = (execErr as { status?: number })?.status;
        if (/invalid password/i.test(stderr) || code === 2 || status === 2) {
          const passErr = new Error("Incorrect password.");
          (passErr as unknown as { code: string }).code = "INVALID_PASSWORD";
          throw passErr;
        }
        throw execErr;
      }

      const outputBuffer = await readFile(outPath);

      return {
        buffer: outputBuffer,
        isDecrypted: true,
        isLinearized: true,
        originalSize: inputBuffer.length,
        unlockedSize: outputBuffer.length,
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfUnlock(req: Request, res: Response): Promise<void> {
  if (!req.file || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No PDF file uploaded for unlock");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Uploaded file is not a valid PDF document");
    return;
  }

  const password = req.body.password !== undefined ? String(req.body.password) : "";

  if (password.length > 128) {
    apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters).");
    return;
  }

  try {
    const result = await unlockPdf(req.file.buffer, { password });

    const rawName = req.file.originalname ?? "document.pdf";
    const baseName = rawName.replace(/\.pdf$/i, "");
    const disposition = buildContentDisposition(`${baseName}_unlocked.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Decrypted": "true",
      "X-Linearized": "true",
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Decrypted, X-Linearized",
    });

    res.send(result.buffer);
  } catch (err: unknown) {
    const code = (err as unknown as { code?: string })?.code;
    const msg = err instanceof Error ? err.message : "PDF unlock failed";

    if (code === "NOT_ENCRYPTED" || /not encrypted/i.test(msg)) {
      apiError(res, 400, "NOT_ENCRYPTED", msg);
      return;
    }
    if (code === "INVALID_PASSWORD" || /invalid password|incorrect password/i.test(msg)) {
      apiError(res, 400, "INVALID_PASSWORD", msg);
      return;
    }
    if (code === "INVALID_PARAM" || /too long/i.test(msg)) {
      apiError(res, 400, "INVALID_PARAM", msg);
      return;
    }

    apiError(res, 500, "UNLOCK_FAILED", msg);
  }
}
