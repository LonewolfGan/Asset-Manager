import { PDFDocument } from 'pdf-lib';
import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';

export interface PdfMergeExecuteOptions extends ToolExecuteOptions {
  filename?: string;
}

export interface PdfMergeMetadata extends Record<string, unknown> {
  totalSize: number;
  pageCount: number;
  mergedCount: number;
  filename: string;
}

function sanitizeFilename(name: string | undefined, fallback: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return fallback;
  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
}

/**
 * High-fidelity client-side PDF Merge Engine using pdf-lib.
 * Operates 100% in-browser with zero upload latency and total privacy.
 */
export const pdfMergeEngine: ToolEngineContract<
  File[],
  PdfMergeExecuteOptions,
  Blob
> = {
  id: 'pdf-merge',
  name: 'Merge PDF',

  async execute(
    files: File[],
    options?: PdfMergeExecuteOptions
  ): Promise<ToolResult<Blob>> {
    const signal = options?.signal;
    const onProgress = options?.onProgress;

    if (!files || files.length < 2) {
      throw new Error('At least 2 PDF files are required for merging.');
    }

    if (signal?.aborted) {
      throw new DOMException('Operation aborted', 'AbortError');
    }

    onProgress?.({ percent: 10, stage: 'reading' });

    const mergedDoc = await PDFDocument.create();
    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {
      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      const file = files[i];
      totalSize += file.size;

      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageIndices = doc.getPageIndices();
      const copiedPages = await mergedDoc.copyPages(doc, pageIndices);

      for (const page of copiedPages) {
        mergedDoc.addPage(page);
      }

      const percent = Math.min(60, 10 + Math.round((50 * (i + 1)) / files.length));
      onProgress?.({ percent, stage: 'merging' });
    }

    if (signal?.aborted) {
      throw new DOMException('Operation aborted', 'AbortError');
    }

    onProgress?.({ percent: 80, stage: 'serializing' });
    const mergedBytes = await mergedDoc.save();

    onProgress?.({ percent: 100, stage: 'done' });

    const filename = sanitizeFilename(options?.filename, 'merged_document.pdf');
    const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
    const pageCount = mergedDoc.getPageCount();

    return {
      data: blob,
      filename,
      mimeType: 'application/pdf',
      resultSize: blob.size,
      originalSize: totalSize,
      metadata: {
        totalSize,
        pageCount,
        mergedCount: files.length,
        filename,
      },
    };
  },
};

export function createPdfMergeEngine(
  defaultOptions?: PdfMergeExecuteOptions
): ToolEngineContract<File[], PdfMergeExecuteOptions, Blob> {
  return {
    ...pdfMergeEngine,
    execute: (files: File[], options?: PdfMergeExecuteOptions) =>
      pdfMergeEngine.execute(files, { ...defaultOptions, ...options }),
  };
}
