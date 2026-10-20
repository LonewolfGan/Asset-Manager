import { PDFDocument, degrees } from "pdf-lib";
import { zipSync } from "fflate";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { parsePageRanges } from "./guards.js";

export interface PdfTransformResult {
  buffer: Buffer;
  pageCount: number;
}

export interface SplitPdfOptions {
  mode?: "every" | "ranges";
  rangesStr?: string;
  mergeOutput?: boolean;
  baseName?: string;
}

export interface SplitPdfResult {
  buffer: Buffer;
  isZip: boolean;
  segmentCount: number;
}

export interface RotatePdfOptions {
  rotationDeg?: number;
  pages?: string;
  perPageRotations?: Record<string | number, number> | number[];
}

/**
 * Reorders PDF pages based on an array of 1-based page numbers.
 */
export async function reorderPdfPages(
  inputBuffer: Buffer,
  pageIndices1Based: number[]
): Promise<PdfTransformResult> {
  if (!inputBuffer || inputBuffer.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const src = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const numPages = src.getPageCount();

  const valid0BasedIndices = pageIndices1Based
    .map((p) => p - 1)
    .filter((i) => Number.isFinite(i) && i >= 0 && i < numPages);

  if (valid0BasedIndices.length === 0) {
    throw new Error(
      "No valid page indices. Pages must be 1-based integers within document range."
    );
  }

  const dest = await PDFDocument.create();
  const copied = await dest.copyPages(src, valid0BasedIndices);
  for (const page of copied) {
    dest.addPage(page);
  }

  const pdfBytes = await dest.save();
  const linearized = await linearizePdf(Buffer.from(pdfBytes));
  return { buffer: linearized, pageCount: copied.length };
}

/**
 * Merges multiple PDF buffers into a single linearized document.
 */
export async function mergePdfDocuments(
  inputBuffers: Buffer[]
): Promise<PdfTransformResult> {
  if (!inputBuffers || inputBuffers.length < 2) {
    throw new Error("At least 2 PDF documents are required for merge.");
  }

  const merged = await PDFDocument.create();
  for (const buf of inputBuffers) {
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  const pdfBytes = await merged.save();
  const linearized = await linearizePdf(Buffer.from(pdfBytes));
  return { buffer: linearized, pageCount: merged.getPageCount() };
}

/**
 * Splits a PDF document by pages or custom page ranges into a single PDF or a ZIP archive.
 */
export async function splitPdfDocument(
  inputBuffer: Buffer,
  options: SplitPdfOptions = {}
): Promise<SplitPdfResult> {
  if (!inputBuffer || inputBuffer.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const mode = options.mode ?? "every";
  const rangesStr = options.rangesStr ?? "";
  const mergeOutput = options.mergeOutput ?? false;
  const baseName = options.baseName ?? "document";

  const src = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const numPages = src.getPageCount();

  let segments: number[][];
  if (mode === "every") {
    segments = Array.from({ length: numPages }, (_, i) => [i]);
  } else {
    segments = parsePageRanges(rangesStr, numPages);
    if (segments.length === 0) {
      throw new Error("Invalid or empty page range. Use format like '1-3, 5, 7-9'.");
    }
  }

  if (segments.length === 1 || (mergeOutput && mode !== "every")) {
    const out = await PDFDocument.create();
    const allIndices = segments.flat();
    const pages = await out.copyPages(src, allIndices);
    for (const page of pages) {
      out.addPage(page);
    }
    const bytes = await out.save();
    const linearized = await linearizePdf(Buffer.from(bytes));
    return { buffer: linearized, isZip: false, segmentCount: segments.length };
  }

  const zipEntries: Record<string, Uint8Array> = {};
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, seg);
    for (const page of pages) {
      out.addPage(page);
    }
    const bytes = await out.save();
    // Note: Individual segment PDFs inside the ZIP are not individually linearized
    // to prevent spawning N sequential QPDF child processes, keeping response latency minimal.
    const fname =
      seg.length === 1
        ? `${baseName}_part_${i + 1}_page_${seg[0] + 1}.pdf`
        : `${baseName}_part_${i + 1}_pages_${seg[0] + 1}-${seg[seg.length - 1] + 1}.pdf`;
    zipEntries[fname] = new Uint8Array(bytes);
  }

  const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
  return { buffer: zipBuf, isZip: true, segmentCount: segments.length };
}

/**
 * Rotates pages across a PDF document with Fast Web View linearization.
 */
export async function rotatePdfPages(
  inputBuffer: Buffer,
  options: RotatePdfOptions = {}
): Promise<PdfTransformResult> {
  if (!inputBuffer || inputBuffer.length < 5) {
    throw new Error("Invalid or empty PDF buffer");
  }

  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const rotationDeg = Number.isFinite(options.rotationDeg) ? (options.rotationDeg as number) : 90;
  const pageList = String(options.pages ?? "all");

  let perPageMap: Record<number, number> | null = null;
  if (options.perPageRotations) {
    perPageMap = {};
    if (Array.isArray(options.perPageRotations)) {
      options.perPageRotations.forEach((deg, idx) => {
        if (Number.isFinite(deg) && deg % 360 !== 0) {
          perPageMap![idx] = deg;
        }
      });
    } else if (typeof options.perPageRotations === "object") {
      for (const [k, v] of Object.entries(options.perPageRotations)) {
        const idx = parseInt(k, 10);
        if (!isNaN(idx) && Number.isFinite(v)) {
          perPageMap[idx] = v;
        }
      }
    }
  }

  if (options.perPageRotations !== undefined) {
    if (perPageMap) {
      for (const [idxStr, deg] of Object.entries(perPageMap)) {
        const idx = Number(idxStr);
        if (idx >= 0 && idx < totalPages) {
          const current = pages[idx].getRotation().angle;
          pages[idx].setRotation(degrees(((current + (deg % 360)) % 360 + 360) % 360));
        }
      }
    }
  } else {
    const pageIndices =
      pageList === "all"
        ? Array.from({ length: totalPages }, (_, i) => i)
        : pageList
            .split(",")
            .map((s) => parseInt(s.trim(), 10) - 1)
            .filter((i) => !isNaN(i) && i >= 0 && i < totalPages);

    for (const idx of pageIndices) {
      const current = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees(((current + (rotationDeg % 360)) % 360 + 360) % 360));
    }
  }

  const pdfBytes = await pdfDoc.save();
  const linearized = await linearizePdf(Buffer.from(pdfBytes));
  return { buffer: linearized, pageCount: totalPages };
}
