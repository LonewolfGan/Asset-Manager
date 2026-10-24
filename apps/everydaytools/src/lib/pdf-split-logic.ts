import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export interface Tranche {
  id: string;
  from: number;
  to: number;
  label?: string;
}

/**
 * Format sorted array of pages [1, 2, 3, 5] -> "1-3, 5"
 */
export function formatPagesToRangeString(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
      prev = current;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}

/**
 * Parse range string: "1-3, 5" -> [1, 2, 3, 5]
 */
export function parseRangeStringToPages(str: string, maxPages: number): number[] {
  const result = new Set<number>();
  const normalized = str.replace(/\s*-\s*/g, '-');
  const parts = normalized.split(/[,;\s]+/).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [fromStr, toStr] = part.split('-');
      const from = parseInt(fromStr, 10);
      const to = parseInt(toStr, 10);
      if (!isNaN(from) && !isNaN(to)) {
        const start = Math.max(1, Math.min(from, to));
        const end = Math.min(maxPages, Math.max(from, to));
        for (let p = start; p <= end; p++) {
          result.add(p);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) {
        result.add(p);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

/**
 * Returns array of odd page numbers up to total
 */
export function selectOddPages(total: number): number[] {
  const list: number[] = [];
  for (let i = 1; i <= total; i += 2) {
    list.push(i);
  }
  return list;
}

/**
 * Returns array of even page numbers up to total
 */
export function selectEvenPages(total: number): number[] {
  const list: number[] = [];
  for (let i = 2; i <= total; i += 2) {
    list.push(i);
  }
  return list;
}

/**
 * Generates batch slices of fixed page chunk size
 */
export function generateBatchSlices(totalPages: number, chunkSize: number): Tranche[] {
  const slices: Tranche[] = [];
  const safeChunk = Math.max(1, chunkSize);
  let currentFrom = 1;

  while (currentFrom <= totalPages) {
    const currentTo = Math.min(totalPages, currentFrom + safeChunk - 1);
    slices.push({
      id: `slice-${currentFrom}-${currentTo}`,
      from: currentFrom,
      to: currentTo,
    });
    currentFrom = currentTo + 1;
  }

  return slices;
}

export interface SplitPdfOptions {
  mode: 'extract' | 'split';
  selectedPages?: number[];
  extractAsSinglePdf?: boolean;
  tranches?: { from: number; to: number }[];
  baseName?: string;
}

export interface SplitPdfResult {
  blob: Blob;
  isZip: boolean;
  segmentCount: number;
}

/**
 * Splits or extracts pages from a PDF document 100% in-browser using pdf-lib and jszip.
 * Zero upload, instantaneous execution, privacy guaranteed.
 */
export async function splitPdfFile(
  file: File,
  options: SplitPdfOptions
): Promise<SplitPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const src = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = src.getPageCount();
  const baseName = options.baseName ?? file.name.replace(/\.[^/.]+$/, '');

  let segments: number[][] = [];

  if (options.mode === 'extract') {
    const rawPages = options.selectedPages ?? [];
    const valid0Based = rawPages
      .filter((p) => p >= 1 && p <= totalPages)
      .map((p) => p - 1);

    if (valid0Based.length === 0) {
      throw new Error('No valid pages selected for extraction.');
    }

    if (options.extractAsSinglePdf) {
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, valid0Based);
      for (const p of pages) {
        out.addPage(p);
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      return { blob, isZip: false, segmentCount: 1 };
    }

    segments = valid0Based.map((p) => [p]);
  } else {
    const rawTranches = options.tranches ?? [];
    if (rawTranches.length === 0) {
      throw new Error('No split tranches specified.');
    }
    for (const tr of rawTranches) {
      const from = Math.max(1, Math.min(tr.from, tr.to));
      const to = Math.min(totalPages, Math.max(tr.from, tr.to));
      const tranchePages: number[] = [];
      for (let p = from; p <= to; p++) {
        tranchePages.push(p - 1);
      }
      if (tranchePages.length > 0) {
        segments.push(tranchePages);
      }
    }
    if (segments.length === 0) {
      throw new Error('No valid tranches specified.');
    }
  }

  const zip = new JSZip();
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, seg);
    for (const p of pages) {
      out.addPage(p);
    }
    const bytes = await out.save();
    const fname =
      seg.length === 1
        ? `${baseName}_p${seg[0] + 1}.pdf`
        : `${baseName}_p${seg[0] + 1}-${seg[seg.length - 1] + 1}.pdf`;
    zip.file(fname, bytes);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { blob: zipBlob, isZip: true, segmentCount: segments.length };
}

