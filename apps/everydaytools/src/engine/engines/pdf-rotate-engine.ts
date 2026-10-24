import { PDFDocument, degrees } from 'pdf-lib';
import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';

export interface PdfRotateExecuteOptions extends ToolExecuteOptions {
  rotationDeg?: number;
  pageRotations?: Record<number, number>;
  baseName?: string;
}

export interface PdfRotateMetadata extends Record<string, unknown> {
  pageCount: number;
  rotatedCount: number;
  rotationDeg?: number;
  filename: string;
  originalSize: number;
  outputSize: number;
}

/**
 * Creates an in-browser PDF Rotate Engine complying with ToolEngineContract.
 */
export function createPdfRotateEngine(
  defaultOptions?: Partial<PdfRotateExecuteOptions>
): ToolEngineContract<File, PdfRotateExecuteOptions, Blob> {
  return {
    id: 'pdf-rotate',
    name: 'Rotate PDF',

    async execute(
      file: File,
      options?: PdfRotateExecuteOptions
    ): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const signal = mergedOptions.signal;
      const onProgress = mergedOptions.onProgress;

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 10, stage: 'reading' });

      const arrayBuffer = await file.arrayBuffer();

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      onProgress?.({ percent: 50, stage: 'rotating' });

      let rotatedCount = 0;
      const pageRotations = mergedOptions.pageRotations;

      if (pageRotations && Object.keys(pageRotations).length > 0) {
        for (const [idxStr, delta] of Object.entries(pageRotations)) {
          const idx = Number(idxStr);
          if (idx >= 0 && idx < totalPages && Number.isFinite(delta)) {
            const page = pages[idx];
            const current = page.getRotation().angle;
            const target = ((current + (delta % 360)) % 360 + 360) % 360;
            page.setRotation(degrees(target));
            if (delta % 360 !== 0) rotatedCount++;
          }
        }
      } else {
        const delta = mergedOptions.rotationDeg ?? 90;
        for (const page of pages) {
          const current = page.getRotation().angle;
          const target = ((current + (delta % 360)) % 360 + 360) % 360;
          page.setRotation(degrees(target));
        }
        rotatedCount = delta % 360 !== 0 ? totalPages : 0;
      }

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 85, stage: 'serializing' });
      const pdfBytes = await pdfDoc.save();

      onProgress?.({ percent: 100, stage: 'complete' });

      const baseName = mergedOptions.baseName ?? file.name.replace(/\.pdf$/i, '');
      const filename = `${baseName}_rotated.pdf`;
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

      return {
        data: blob,
        filename,
        mimeType: 'application/pdf',
        resultSize: blob.size,
        originalSize: file.size,
        metadata: {
          pageCount: totalPages,
          rotatedCount,
          rotationDeg: mergedOptions.rotationDeg,
          filename,
          originalSize: file.size,
          outputSize: blob.size,
        },
      };
    },
  };
}

export const pdfRotateEngine = createPdfRotateEngine();
