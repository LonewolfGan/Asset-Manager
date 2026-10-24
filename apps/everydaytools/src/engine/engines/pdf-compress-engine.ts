import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';
import { formatResultFilename, calculateGain, type Level } from '@/lib/pdf-compress-logic';

export interface PdfCompressMetadata extends Record<string, unknown> {
  originalSize: number;
  compressedSize: number;
  sizeBefore: number;
  sizeAfter: number;
  gain: number;
  level: string;
}

export interface PdfCompressExecuteOptions extends ToolExecuteOptions {
  level?: Level | string;
  isFr?: boolean;
}

/**
 * Creates an enterprise-grade PDF Compress Engine contract adapter.
 */
export function createPdfCompressEngine(
  defaultOptions?: PdfCompressExecuteOptions
): ToolEngineContract<File, PdfCompressExecuteOptions, Blob> {
  return {
    id: 'pdf-compress',
    name: 'Compress PDF',

    async execute(file: File, options?: PdfCompressExecuteOptions): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const level = mergedOptions.level ?? 'recommended';
      const isFr = mergedOptions.isFr ?? false;

      options?.onProgress?.({ percent: 15, stage: 'reading' });

      const fd = new FormData();
      fd.append('file', file);
      fd.append('level', level);

      options?.onProgress?.({ percent: 30, stage: 'compressing' });

      const res = await fetch(apiUrl('/api/tools/pdf-compress'), {
        method: 'POST',
        body: fd,
        signal: options?.signal,
      });

      options?.onProgress?.({ percent: 70, stage: 'optimizing' });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(
          err.message ??
            err.error ??
            (isFr ? 'Échec de la compression.' : 'PDF compression failed')
        );
      }

      const blob = await res.blob();
      options?.onProgress?.({ percent: 90, stage: 'finalizing' });

      const headerOrig = res.headers.get('X-Original-Size');
      const headerComp = res.headers.get('X-Compressed-Size');
      const headerGain = res.headers.get('X-Compression-Gain');

      const originalSize = headerOrig ? parseInt(headerOrig, 10) : file.size;
      const compressedSize = headerComp ? parseInt(headerComp, 10) : blob.size;
      const parsedGain = headerGain ? parseInt(headerGain, 10) : NaN;
      const gain = Number.isFinite(parsedGain) ? parsedGain : calculateGain(originalSize, compressedSize);

      const filename = formatResultFilename(file.name, isFr);
      options?.onProgress?.({ percent: 100, stage: 'completed' });

      return {
        data: blob,
        filename,
        originalSize,
        resultSize: compressedSize,
        mimeType: 'application/pdf',
        metadata: {
          originalSize,
          compressedSize,
          sizeBefore: originalSize,
          sizeAfter: compressedSize,
          gain,
          level,
        } as PdfCompressMetadata,
      };
    },
  };
}

export const pdfCompressEngine = createPdfCompressEngine();
