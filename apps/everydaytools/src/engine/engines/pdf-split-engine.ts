import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { splitPdfFile, type Tranche } from '@/lib/pdf-split-logic';

export interface PdfSplitExecuteOptions extends ToolExecuteOptions {
  mode?: 'extract' | 'split';
  selectedPages?: number[];
  extractAsSinglePdf?: boolean;
  tranches?: { from: number; to: number }[] | Tranche[];
  baseName?: string;
}

export interface PdfSplitMetadata extends Record<string, unknown> {
  isZip: boolean;
  segmentCount: number;
  originalSize: number;
  outputSize: number;
}

/**
 * Creates an in-browser PDF Split Engine complying with ToolEngineContract.
 */
export function createPdfSplitEngine(
  defaultOptions?: Partial<PdfSplitExecuteOptions>
): ToolEngineContract<File, PdfSplitExecuteOptions, Blob> {
  return {
    id: 'pdf-split',
    name: 'Split PDF',

    async execute(
      file: File,
      options?: PdfSplitExecuteOptions
    ): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const signal = mergedOptions.signal;
      const onProgress = mergedOptions.onProgress;

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      const mode = mergedOptions.mode ?? 'extract';

      if (mode === 'extract' && mergedOptions.selectedPages !== undefined && mergedOptions.selectedPages.length === 0) {
        throw new Error('No valid pages selected for extraction.');
      }

      if (mode === 'split' && mergedOptions.tranches !== undefined && mergedOptions.tranches.length === 0) {
        throw new Error('No split tranches specified.');
      }

      onProgress?.({ percent: 10, stage: 'reading' });

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 40, stage: 'splitting' });

      const baseName = mergedOptions.baseName ?? file.name.replace(/\.[^/.]+$/, '');
      const result = await splitPdfFile(file, {
        mode,
        selectedPages: mergedOptions.selectedPages,
        extractAsSinglePdf: mergedOptions.extractAsSinglePdf,
        tranches: mergedOptions.tranches as { from: number; to: number }[] | undefined,
        baseName,
      });

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 100, stage: 'complete' });

      const filename = result.isZip ? `${baseName}_split.zip` : `${baseName}_extracted.pdf`;
      const mimeType = result.isZip ? 'application/zip' : 'application/pdf';

      return {
        data: result.blob,
        filename,
        mimeType,
        resultSize: result.blob.size,
        originalSize: file.size,
        metadata: {
          isZip: result.isZip,
          segmentCount: result.segmentCount,
          originalSize: file.size,
          outputSize: result.blob.size,
        },
      };
    },
  };
}

export const pdfSplitEngine = createPdfSplitEngine();
