import { PDFDocument } from "pdf-lib";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir, stat } from "fs/promises";
import { join } from "path";
import { BIN } from "../../lib/binaries.js";
import { compressPdf } from "../convert/pdf-compress-handler.js";

const execFileAsync = promisify(execFile);

export type CompressLevel =
  | "extreme"
  | "screen"
  | "recommended"
  | "ebook"
  | "low"
  | "printer"
  | "prepress";

export interface CompressPreset {
  pdfSettings: string;
  colorRes: number;
  grayRes: number;
  monoRes: number;
  forceDct: boolean;
}

export const COMPRESS_PRESETS: Record<string, CompressPreset> = {
  extreme: { pdfSettings: "/screen", colorRes: 80, grayRes: 80, monoRes: 150, forceDct: true },
  screen: { pdfSettings: "/screen", colorRes: 80, grayRes: 80, monoRes: 150, forceDct: true },
  recommended: { pdfSettings: "/ebook", colorRes: 144, grayRes: 144, monoRes: 200, forceDct: false },
  ebook: { pdfSettings: "/ebook", colorRes: 144, grayRes: 144, monoRes: 200, forceDct: false },
  low: { pdfSettings: "/printer", colorRes: 240, grayRes: 240, monoRes: 300, forceDct: false },
  printer: { pdfSettings: "/printer", colorRes: 240, grayRes: 240, monoRes: 300, forceDct: false },
  prepress: { pdfSettings: "/prepress", colorRes: 300, grayRes: 300, monoRes: 300, forceDct: false },
};

export interface CompressPdfOptions {
  level?: CompressLevel | string;
}

export interface CompressPdfResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  gain: number;
}

/**
 * Universal Multi-Stage PDF Compression Engine.
 * Delegates to ProcessPool-isolated compressPdf implementation with Ghostscript 10,
 * QPDF Fast Web View linearization, and non-regression size clamping.
 */
export async function compressPdfBuffer(
  input: Buffer,
  options: CompressPdfOptions = {}
): Promise<CompressPdfResult> {
  return compressPdf(input, options);
}

/**
 * Dual-Engine PDF Repair Studio Engine.
 * Recovers corrupted or unreadable PDF structures using qpdf structural rebuild
 * and Ghostscript PostScript interpretation fallback.
 */
export async function repairPdfBuffer(input: Buffer): Promise<Buffer> {
  if (!input || input.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });

  const inputPath = join(workDir, "input.pdf");
  const outputPath = join(workDir, "repaired.pdf");

  try {
    await writeFile(inputPath, input);

    let success = false;

    // Stage 1: qpdf recovery & linearization
    try {
      await execFileAsync(
        BIN.qpdf,
        ["--warning-exit-0", "--linearize", inputPath, outputPath],
        { timeout: 60_000 }
      );
      const s = await stat(outputPath);
      if (s.size > 0) success = true;
    } catch {
      // Try Ghostscript recovery
    }

    // Stage 2: Ghostscript PostScript interpreter rebuild
    if (!success) {
      try {
        await execFileAsync(
          BIN.gs,
          [
            "-dSAFER",
            "-o", outputPath,
            "-sDEVICE=pdfwrite",
            "-dPDFSETTINGS=/prepress",
            inputPath,
          ],
          { timeout: 120_000 }
        );
        const s = await stat(outputPath);
        if (s.size > 0) success = true;
      } catch {
        // Try pdf-lib fallback
      }
    }

    // Stage 3: pdf-lib recovery fallback
    if (!success) {
      try {
        const doc = await PDFDocument.load(input, { ignoreEncryption: true });
        const saved = await doc.save();
        if (saved && saved.length > 0) {
          return Buffer.from(saved);
        }
      } catch {
        // Exhausted
      }
      throw new Error("Unable to repair PDF structure with recovery tools.");
    }

    return await readFile(outputPath);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
