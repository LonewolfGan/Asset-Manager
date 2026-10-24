import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir, readdir } from "fs/promises";
import { join, basename } from "path";
import sharp from "sharp";
import { zipSync } from "fflate";
import { PDFDocument } from "pdf-lib";
import { BIN } from "../../lib/binaries.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { createColorManagedPipeline, getOptimizedJpegOptions } from "../images/image-helpers.js";

const execFileAsync = promisify(execFile);

export type SupportedImageFormat = "png" | "jpeg" | "webp" | "avif" | "tiff" | "gif";

export interface RasterizePdfOptions {
  format?: SupportedImageFormat | string;
  dpi?: number;
  baseName?: string;
}

export interface RasterizePdfResult {
  isZip: boolean;
  buffer: Buffer;
  mime: string;
  ext: string;
  pageCount: number;
}

export interface ConvertPdfaOptions {
  conformance?: "1b" | "2b" | "3b" | string;
}

export interface ConvertPdfaResult {
  buffer: Buffer;
  pageCount: number;
}

export interface ImageInputItem {
  buffer: Buffer;
  mime?: string;
  name?: string;
}

export interface ImagesToPdfResult {
  buffer: Buffer;
  pageCount: number;
}

/**
 * Transcodes a raw rasterized image buffer into the requested format with Pareto quality settings.
 */
async function transcodeRaster(
  buf: Buffer,
  format: SupportedImageFormat
): Promise<{ data: Buffer; mime: string; ext: string }> {
  const p = createColorManagedPipeline(buf);
  switch (format) {
    case "jpeg":
      return { data: await p.jpeg(getOptimizedJpegOptions(90)).toBuffer(), mime: "image/jpeg", ext: "jpg" };
    case "webp":
      return { data: await p.webp({ quality: 85, effort: 4, smartSubsample: true }).toBuffer(), mime: "image/webp", ext: "webp" };
    case "avif":
      return { data: await p.avif({ quality: 75, effort: 3 }).toBuffer(), mime: "image/avif", ext: "avif" };
    case "tiff":
      return { data: await p.tiff({ compression: "deflate" }).toBuffer(), mime: "image/tiff", ext: "tiff" };
    case "gif":
      return { data: await p.gif().toBuffer(), mime: "image/gif", ext: "gif" };
    case "png":
    default:
      return { data: await p.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer(), mime: "image/png", ext: "png" };
  }
}

/**
 * Rasterizes PDF pages to images using Ghostscript vector rendering and Sharp transcoding.
 */
export async function rasterizePdfToImages(
  inputBuffer: Buffer,
  options: RasterizePdfOptions = {}
): Promise<RasterizePdfResult> {
  if (!inputBuffer || inputBuffer.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const rawFormat = String(options.format ?? "png").toLowerCase();
  const format: SupportedImageFormat =
    rawFormat === "jpeg" || rawFormat === "jpg"
      ? "jpeg"
      : rawFormat === "webp"
      ? "webp"
      : rawFormat === "avif"
      ? "avif"
      : rawFormat === "tiff" || rawFormat === "tif"
      ? "tiff"
      : rawFormat === "gif"
      ? "gif"
      : "png";

  const dpi = Math.min(300, Math.max(72, Number(options.dpi) || 150));
  const gsDevice = format === "jpeg" ? "jpeg" : "png16m";
  const gsExt = format === "jpeg" ? "jpg" : "png";
  const baseName = options.baseName ?? "document";

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPattern = join(workDir, `page-%d.${gsExt}`);

  try {
    await writeFile(inPath, inputBuffer);
    await execFileAsync(
      BIN.gs,
      [
        "-dNOPAUSE",
        "-dBATCH",
        "-dSAFER",
        `-sDEVICE=${gsDevice}`,
        `-r${dpi}`,
        `-sOutputFile=${outPattern}`,
        inPath,
      ],
      { timeout: 120_000 }
    );

    const allFiles = await readdir(workDir);
    const imgFiles = allFiles
      .filter((f) => f.startsWith("page-") && f.endsWith(`.${gsExt}`))
      .sort((a, b) => {
        const n = (s: string) => parseInt(s.replace("page-", "").replace(`.${gsExt}`, ""), 10) || 0;
        return n(a) - n(b);
      });

    if (imgFiles.length === 0) {
      throw new Error("Ghostscript did not produce any image output. Check that the PDF is valid.");
    }

    if (imgFiles.length === 1) {
      const rawBuf = await readFile(join(workDir, imgFiles[0]));
      const { data, mime, ext } = await transcodeRaster(rawBuf, format);
      return { isZip: false, buffer: data, mime, ext, pageCount: 1 };
    }

    const safeBase = basename(baseName).replace(/[^a-zA-Z0-9._-]/g, "_") || "document";
    const zipEntries: Record<string, Uint8Array> = {};
    let finalExt = "png";
    for (let i = 0; i < imgFiles.length; i++) {
      const f = imgFiles[i];
      const pageNum = f.replace("page-", "").replace(`.${gsExt}`, "");
      const rawBuf = await readFile(join(workDir, f));
      const { data, ext } = await transcodeRaster(rawBuf, format);
      finalExt = ext;
      zipEntries[`${safeBase}_page_${pageNum}.${ext}`] = new Uint8Array(data);
    }

    const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
    return {
      isZip: true,
      buffer: zipBuf,
      mime: "application/zip",
      ext: "zip",
      pageCount: imgFiles.length,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Converts a standard PDF into a PDF/A standard document (1b, 2b, or 3b).
 */
export async function convertPdfToPdfa(
  inputBuffer: Buffer,
  options: ConvertPdfaOptions = {}
): Promise<ConvertPdfaResult> {
  if (!inputBuffer || inputBuffer.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const conformance = String(options.conformance ?? "2b").toLowerCase();
  const pdfaLevel = conformance.startsWith("1") ? 1 : conformance.startsWith("3") ? 3 : 2;

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const rawOutputPath = join(workDir, "output_raw.pdf");

  try {
    await writeFile(inputPath, inputBuffer);
    await execFileAsync(
      BIN.gs,
      [
        `-dPDFA=${pdfaLevel}`,
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-dSAFER",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sDEVICE=pdfwrite",
        "-dPDFACompatibilityPolicy=1",
        `-sOutputFile=${rawOutputPath}`,
        inputPath,
      ],
      { timeout: 120_000 }
    );

    const rawBytes = await readFile(rawOutputPath);
    const doc = await PDFDocument.load(rawBytes, { ignoreEncryption: true });
    const linearized = await linearizePdf(rawBytes);
    return { buffer: linearized, pageCount: doc.getPageCount() };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Combines one or more image buffers into a unified, linearized PDF document.
 */
export async function convertImagesToPdf(
  images: ImageInputItem[]
): Promise<ImagesToPdfResult> {
  if (!images || images.length === 0) {
    throw new Error("At least 1 image is required for PDF generation.");
  }

  const pdfDoc = await PDFDocument.create();

  for (const item of images) {
    const pipeline = createColorManagedPipeline(item.buffer);
    const meta = await pipeline.metadata();

    let embeddableBuf: Buffer;
    let isPng = false;

    if (meta.format === "png" && meta.hasAlpha) {
      embeddableBuf = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      isPng = true;
    } else {
      embeddableBuf = await pipeline
        .jpeg(getOptimizedJpegOptions(92))
        .toBuffer();
    }

    const embedded = isPng
      ? await pdfDoc.embedPng(embeddableBuf)
      : await pdfDoc.embedJpg(embeddableBuf);

    const page = pdfDoc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const linearized = await linearizePdf(Buffer.from(pdfBytes));
  return { buffer: linearized, pageCount: images.length };
}
