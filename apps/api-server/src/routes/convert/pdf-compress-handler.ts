import type { Request, Response } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "./convert-image.js";

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
  timeoutMs?: number;
  pool?: ProcessPool;
  signal?: AbortSignal;
}

export interface CompressPdfResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  gain: number;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 && // F
    buffer[4] === 0x2d    // -
  );
}

export async function compressPdf(
  inputBuffer: Buffer,
  options?: CompressPdfOptions
): Promise<CompressPdfResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF buffer: missing %PDF- header");
  }

  const rawLevel = String(options?.level ?? "recommended").toLowerCase().trim();
  const preset = COMPRESS_PRESETS[rawLevel] ?? COMPRESS_PRESETS["recommended"];
  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 120_000;

  return pool.run(
    async (ctx) => {
      const inPath = join(ctx.workspaceDir, "input.pdf");
      const gsOutPath = join(ctx.workspaceDir, "gs_out.pdf");
      const qpdfOutPath = join(ctx.workspaceDir, "final.pdf");

      await writeFile(inPath, inputBuffer);

      // Stage 1: Ghostscript bicubic downsampling & font compression
      const gsArgs = [
        "-dNOPAUSE",
        "-dBATCH",
        "-dSAFER",
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
        await execFileAsync(BIN.gs, gsArgs, { signal: ctx.signal, timeout: timeoutMs });
        gsSuccess = true;
      } catch {
        // Fall back to qpdf or original
      }

      const stage1File = gsSuccess ? gsOutPath : inPath;

      // Stage 2: QPDF Fast Web View linearization & object streams
      let qpdfSuccess = false;
      try {
        await execFileAsync(
          BIN.qpdf,
          [
            "--warning-exit-0",
            "--linearize",
            "--object-streams=generate",
            "--recompress-flate",
            stage1File,
            qpdfOutPath,
          ],
          { signal: ctx.signal, timeout: 60_000 }
        );
        qpdfSuccess = true;
      } catch {
        // Continue
      }

      // Collect candidates
      const candidates: Buffer[] = [inputBuffer];

      if (gsSuccess) {
        try {
          const gsBuf = await readFile(gsOutPath);
          if (gsBuf.length > 0 && isValidPdfHeader(gsBuf)) candidates.push(gsBuf);
        } catch {}
      }

      if (qpdfSuccess) {
        try {
          const qpdfBuf = await readFile(qpdfOutPath);
          if (qpdfBuf.length > 0 && isValidPdfHeader(qpdfBuf)) candidates.push(qpdfBuf);
        } catch {}
      }

      // Select smallest candidate
      candidates.sort((a, b) => a.length - b.length);
      let finalBuffer = candidates[0];

      // Stage 3: Fallback metadata stripping if no gain achieved
      if (finalBuffer.length >= inputBuffer.length) {
        try {
          const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
          pdfDoc.setTitle("");
          pdfDoc.setAuthor("");
          pdfDoc.setSubject("");
          pdfDoc.setKeywords([]);
          pdfDoc.setProducer("EverydayTools");
          pdfDoc.setCreator("EverydayTools");
          const stripped = Buffer.from(await pdfDoc.save({ useObjectStreams: true }));
          if (stripped.length > 0 && stripped.length < finalBuffer.length) {
            finalBuffer = stripped;
          }
        } catch {}
      }

      // Inviolable non-regression rule: never return a larger file
      if (finalBuffer.length >= inputBuffer.length) {
        finalBuffer = inputBuffer;
      }

      const gain = Math.max(0, Math.round((1 - finalBuffer.length / inputBuffer.length) * 100));

      return {
        buffer: finalBuffer,
        originalSize: inputBuffer.length,
        compressedSize: finalBuffer.length,
        gain,
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfCompress(req: Request, res: Response): Promise<void> {
  if (!req.file || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No PDF file uploaded for compression");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Uploaded file is not a valid PDF document");
    return;
  }

  try {
    const level = String(req.body.level ?? req.body.quality ?? "recommended");
    const result = await compressPdf(req.file.buffer, { level });

    const rawName = req.file.originalname ?? "document.pdf";
    const baseName = rawName.replace(/\.pdf$/i, "");
    const disposition = buildContentDisposition(`${baseName}_compressed.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Original-Size": String(result.originalSize),
      "X-Compressed-Size": String(result.compressedSize),
      "X-Compression-Gain": String(result.gain),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
    });

    res.send(result.buffer);
  } catch (err) {
    apiError(
      res,
      500,
      "COMPRESSION_FAILED",
      err instanceof Error ? err.message : "PDF compression failed"
    );
  }
}
