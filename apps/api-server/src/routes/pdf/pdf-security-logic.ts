import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { PDFDocument } from "pdf-lib";
import { BIN } from "../../lib/binaries.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";

const execFileAsync = promisify(execFile);

export interface ProtectPdfOptions {
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
}

export interface ProtectPdfResult {
  buffer: Buffer;
  encryption: "AES-256" | "RC4-128";
}

export interface UnlockPdfOptions {
  password?: string;
}

/**
 * Protects a PDF document using AES-256 (via QPDF) or RC4-128 (via pdf-lib fallback).
 */
export async function protectPdf(
  inputBuffer: Buffer,
  options: ProtectPdfOptions
): Promise<ProtectPdfResult> {
  if (
    !inputBuffer ||
    inputBuffer.length < 5 ||
    !inputBuffer.subarray(0, 5).equals(Buffer.from("%PDF-"))
  ) {
    throw new Error("Invalid or corrupted PDF buffer (missing %PDF- header)");
  }

  const rawUser = String(options.userPassword ?? "");
  const rawOwner = String(options.ownerPassword ?? "");

  if (!rawUser.trim() && !rawOwner.trim()) {
    throw new Error("At least one password (user or owner) is required.");
  }
  if (rawUser.length > 128 || rawOwner.length > 128) {
    throw new Error("Password too long (max 128 characters).");
  }
  if (rawUser && rawOwner && rawUser === rawOwner) {
    throw new Error("User password and owner password cannot be identical.");
  }

  const userPassword = rawUser;
  const ownerPassword = rawOwner;

  const allowPrinting = options.allowPrinting !== false;
  const allowCopying = options.allowCopying !== false;
  const allowModifying = options.allowModifying === true;
  const ownerPw = ownerPassword || `${userPassword}_o_et`;

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, inputBuffer);

    const args: string[] = [
      "--warning-exit-0",
      "--linearize",
      "--encrypt",
      userPassword,
      ownerPw,
      "256",
      `--print=${allowPrinting ? "full" : "none"}`,
      `--extract=${allowCopying ? "y" : "n"}`,
    ];

    if (allowModifying) {
      args.push("--modify-other=y", "--annotate=y", "--form=y", "--assemble=y");
    } else {
      args.push("--modify-other=n", "--annotate=n", "--form=n", "--assemble=n");
    }
    args.push("--", inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });
    const output = await readFile(outPath);
    return { buffer: output, encryption: "AES-256" };
  } catch (_qpdfErr) {
    // Fallback: pdf-lib (RC4-128)
    try {
      const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfBytes = await pdfDoc.save({
        userPassword: userPassword || undefined,
        ownerPassword: ownerPw,
        permissions: {
          printing: allowPrinting ? "highResolution" : undefined,
          modifying: allowModifying,
          copying: allowCopying,
          annotating: false,
          fillingForms: allowModifying,
          contentAccessibility: true,
          documentAssembly: false,
        },
      } as any);

      const linearized = await linearizePdf(Buffer.from(pdfBytes));
      return { buffer: linearized, encryption: "RC4-128" };
    } catch (fallbackErr) {
      throw new Error(
        fallbackErr instanceof Error ? fallbackErr.message : "Protection failed"
      );
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Unlocks / decrypts an encrypted PDF document with the supplied password.
 */
export async function unlockPdf(
  inputBuffer: Buffer,
  options: UnlockPdfOptions = {}
): Promise<Buffer> {
  if (
    !inputBuffer ||
    inputBuffer.length < 5 ||
    !inputBuffer.subarray(0, 5).equals(Buffer.from("%PDF-"))
  ) {
    throw new Error("Invalid or corrupted PDF buffer (missing %PDF- header)");
  }

  const password = String(options.password ?? "");
  if (password.length > 128) {
    throw new Error("Password too long (max 128 characters).");
  }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, inputBuffer);
    const args = ["--warning-exit-0", "--decrypt"];
    if (password) {
      args.push(`--password=${password}`);
    }
    args.push("--", inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });
    const output = await readFile(outPath);
    return await linearizePdf(output);
  } catch (qpdfErr) {
    const qMsg = qpdfErr instanceof Error ? qpdfErr.message.toLowerCase() : "";
    if (
      qMsg.includes("invalid password") ||
      qMsg.includes("password incorrect") ||
      qMsg.includes("invalid password or empty password")
    ) {
      throw new Error("Invalid password. Mot de passe incorrect. Veuillez vérifier et réessayer.");
    }

    // Fallback: pdf-lib
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfDoc = await PDFDocument.load(inputBuffer, {
        password: password || undefined,
        ignoreEncryption: !password,
      } as any);
      const pdfBytes = await pdfDoc.save();
      return await linearizePdf(Buffer.from(pdfBytes));
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      if (raw.toLowerCase().includes("password") || raw.toLowerCase().includes("encrypt")) {
        throw new Error("Mot de passe incorrect ou chiffrement non pris en charge.");
      }
      throw new Error(raw || "Unlock failed");
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
