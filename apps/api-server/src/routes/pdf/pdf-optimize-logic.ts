import { PDFDocument } from "pdf-lib";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir, stat } from "fs/promises";
import { join } from "path";
import { BIN } from "../../lib/binaries.js";

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
 * Combines Ghostscript bicubic downsampling, qpdf Fast Web View linearization & flate recompression,
 * and pdf-lib metadata stripping to find the smallest valid PDF representation.
 */
export async function compressPdfBuffer(
  input: Buffer,
  options: CompressPdfOptions = {}
): Promise<CompressPdfResult> {
  if (!input || input.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const levelParam = String(options.level ?? "recommended").toLowerCase();
  const preset = COMPRESS_PRESETS[levelParam] ?? COMPRESS_PRESETS["recommended"];

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });

  const inPath = join(workDir, "input.pdf");
  const gsOutPath = join(workDir, "gs_out.pdf");
  const qpdfOutPath = join(workDir, "final.pdf");

  let finalBuffer: Buffer = input;

  try {
    await writeFile(inPath, input);

    // Stage 1: Ghostscript bicubic downsampling & font compression
    const gsArgs = [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      "-sDEVICE=pdfwrite",
      `-dPDFSETTINGS=${preset.pdfSettings}`,
      "-dCompatibilityLevel=1.6",
      "-dDownsampleColorImages=true",
      "-dColorImageDownsampleType=/Bicubic",
      `-dColorImageResolution=${preset.colorRes}`,
      "-dDownsampleGrayImages=true",
      "-dGrayImageDownsampleType=/Bicubic",
      `-dGrayImageResolution=${preset.grayRes}`,
      "-dDownsampleMonoImages=true",
      "-dMonoImageDownsampleType=/Subsample",
      `-dMonoImageResolution=${preset.monoRes}`,
      "-dPassThroughJPEGImages=false",
      "-dDetectDuplicateImages=true",
      "-dCompressFonts=true",
    ];

    if (preset.forceDct) {
      gsArgs.push(
        "-dAutoFilterColorImages=false",
        "-dColorImageFilter=/DCTEncode",
        "-dAutoFilterGrayImages=false",
        "-dGrayImageFilter=/DCTEncode"
      );
    }

    gsArgs.push(`-sOutputFile=${gsOutPath}`, inPath);

    let gsSuccess = false;
    try {
      await execFileAsync(BIN.gs, gsArgs, { timeout: 90_000 });
      const gsStat = await stat(gsOutPath);
      if (gsStat.size > 0) gsSuccess = true;
    } catch {
      // Continue to qpdf
    }

    const stage1File = gsSuccess ? gsOutPath : inPath;

    // Stage 2: QPDF Fast Web View linearization & object streams
    let qpdfSuccess = false;
    try {
      await execFileAsync(BIN.qpdf, [
        "--warning-exit-0",
        "--linearize",
        "--object-streams=generate",
        "--recompress-flate",
        stage1File,
        qpdfOutPath,
      ], { timeout: 60_000 });
      const qpdfStat = await stat(qpdfOutPath);
      if (qpdfStat.size > 0) qpdfSuccess = true;
    } catch {
      // Continue
    }

    // Select the best candidate
    const candidates: Buffer[] = [input];
    if (gsSuccess) {
      try {
        const gsBuf = await readFile(gsOutPath);
        if (gsBuf.length > 0) candidates.push(gsBuf);
      } catch {}
    }
    if (qpdfSuccess) {
      try {
        const qpdfBuf = await readFile(qpdfOutPath);
        if (qpdfBuf.length > 0) candidates.push(qpdfBuf);
      } catch {}
    }

    candidates.sort((a, b) => a.length - b.length);
    finalBuffer = candidates[0];

    // Stage 3: Fallback metadata stripping if no gain achieved
    if (finalBuffer.length >= input.length) {
      try {
        const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true });
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer("EverydayTools");
        pdfDoc.setCreator("EverydayTools");
        const stripped = Buffer.from(await pdfDoc.save({ useObjectStreams: true }));
        if (stripped.length < finalBuffer.length) {
          finalBuffer = stripped;
        }
      } catch {}
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }

  if (finalBuffer.length > input.length) {
    finalBuffer = input;
  }

  const gain = Math.max(0, Math.round((1 - finalBuffer.length / input.length) * 100));

  return {
    buffer: finalBuffer,
    originalSize: input.length,
    compressedSize: finalBuffer.length,
    gain,
  };
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
