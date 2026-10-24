import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

const execFileAsync = promisify(execFile);

export interface ProtectPdfOptions {
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
}

export interface ProtectPdfResult {
  buffer: Buffer;
  encryption: "AES-256";
  isLinearized: boolean;
  originalSize: number;
  protectedSize: number;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
}

export async function protectPdf(
  inputBuffer: Buffer,
  options: ProtectPdfOptions = {}
): Promise<ProtectPdfResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const rawUser = String(options.userPassword ?? "");
  const rawOwner = String(options.ownerPassword ?? "");

  if (!rawUser.trim() && !rawOwner.trim()) {
    const err = new Error("At least one password (user or owner) is required.");
    (err as unknown as { code: string }).code = "MISSING_PARAM";
    throw err;
  }

  if (rawUser.length > 128 || rawOwner.length > 128) {
    const err = new Error("Password too long (max 128 characters).");
    (err as unknown as { code: string }).code = "INVALID_PARAM";
    throw err;
  }

  if (rawUser && rawOwner && rawUser === rawOwner) {
    const err = new Error("User password and owner password cannot be identical.");
    (err as unknown as { code: string }).code = "INVALID_PARAM";
    throw err;
  }

  const userPassword = rawUser;
  // If only user password is provided, auto-salt owner password to avoid ISO 32000-2 empty owner bypass
  const ownerPassword = rawOwner || `${userPassword}_o_et_${randomUUID().slice(0, 8)}`;
  const allowPrinting = options.allowPrinting !== false;
  const allowCopying = options.allowCopying !== false;
  const allowModifying = options.allowModifying === true;

  const pool = options.pool ?? defaultProcessPool;
  const timeoutMs = options.timeoutMs ?? 60_000;

  return pool.run(
    async (ctx) => {
      const inPath = join(ctx.workspaceDir, "input.pdf");
      const outPath = join(ctx.workspaceDir, "protected.pdf");

      await writeFile(inPath, inputBuffer);

      // Probe encryption via qpdf --is-encrypted (exit 0 = encrypted, exit 2 = not encrypted)
      try {
        await execFileAsync(BIN.qpdf, ["--is-encrypted", inPath], {
          signal: ctx.signal,
          timeout: 10_000,
        });
        const encErr = new Error("Document is already encrypted. Please unlock it first.");
        (encErr as unknown as { code: string }).code = "ALREADY_ENCRYPTED";
        throw encErr;
      } catch (probeErr: unknown) {
        if ((probeErr as unknown as { code?: string })?.code === "ALREADY_ENCRYPTED") {
          throw probeErr;
        }
        // Exit code 2 means not encrypted, continue
      }

      const args = [
        "--warning-exit-0",
        "--linearize",
        "--encrypt",
        userPassword,
        ownerPassword,
        "256",
        `--print=${allowPrinting ? "full" : "none"}`,
        `--extract=${allowCopying ? "y" : "n"}`,
        "--accessibility=y",
      ];

      if (allowModifying) {
        args.push("--modify-other=y", "--annotate=y", "--form=y", "--assemble=y");
      } else {
        args.push("--modify-other=n", "--annotate=n", "--form=n", "--assemble=n");
      }
      args.push("--", inPath, outPath);

      try {
        await execFileAsync(BIN.qpdf, args, { signal: ctx.signal, timeout: timeoutMs });
      } catch (execErr: unknown) {
        const stderr = execErr instanceof Error ? execErr.message : String(execErr);
        if (/already encrypted|invalid password|is encrypted/i.test(stderr)) {
          const encErr = new Error("Document is already encrypted. Please unlock it first.");
          (encErr as unknown as { code: string }).code = "ALREADY_ENCRYPTED";
          throw encErr;
        }
        throw execErr;
      }

      const outputBuffer = await readFile(outPath);

      return {
        buffer: outputBuffer,
        encryption: "AES-256",
        isLinearized: true,
        originalSize: inputBuffer.length,
        protectedSize: outputBuffer.length,
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfProtect(req: Request, res: Response): Promise<void> {
  if (!req.file || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No PDF file uploaded for protection");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Uploaded file is not a valid PDF document");
    return;
  }

  const userPassword = String(req.body.userPassword ?? req.body.password ?? "");
  const ownerPassword = String(req.body.ownerPassword ?? "");

  if (!userPassword.trim() && !ownerPassword.trim()) {
    apiError(res, 400, "MISSING_PARAM", "At least one password (user or owner) is required.");
    return;
  }

  if (userPassword.length > 128 || ownerPassword.length > 128) {
    apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters).");
    return;
  }

  if (userPassword && ownerPassword && userPassword === ownerPassword) {
    apiError(res, 400, "INVALID_PARAM", "User password and owner password cannot be identical.");
    return;
  }

  const allowPrinting = String(req.body.allowPrinting ?? "true") !== "false";
  const allowCopying = String(req.body.allowCopying ?? "true") !== "false";
  const allowModifying = String(req.body.allowModifying ?? "false") === "true";

  try {
    const result = await protectPdf(req.file.buffer, {
      userPassword,
      ownerPassword,
      allowPrinting,
      allowCopying,
      allowModifying,
    });

    const rawName = req.file.originalname ?? "document.pdf";
    const baseName = rawName.replace(/\.pdf$/i, "");
    const disposition = buildContentDisposition(`${baseName}_protected.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Encryption": "AES-256",
      "X-Linearized": "true",
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "Content-Disposition, X-Encryption, X-Linearized",
    });

    res.send(result.buffer);
  } catch (err: unknown) {
    const code = (err as unknown as { code?: string })?.code;
    const msg = err instanceof Error ? err.message : "PDF protection failed";

    if (code === "ALREADY_ENCRYPTED" || /already encrypted/i.test(msg)) {
      apiError(res, 400, "ALREADY_ENCRYPTED", msg);
      return;
    }
    if (code === "MISSING_PARAM" || /at least one password/i.test(msg)) {
      apiError(res, 400, "MISSING_PARAM", msg);
      return;
    }
    if (code === "INVALID_PARAM" || /identical|too long/i.test(msg)) {
      apiError(res, 400, "INVALID_PARAM", msg);
      return;
    }

    apiError(res, 500, "PROTECT_FAILED", msg);
  }
}
