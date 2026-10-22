import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';
import { buildPdfaFilename } from '@/lib/pdf-to-pdfa-logic';

export interface PdfToPdfaExecuteOptions extends ToolExecuteOptions {
  conformance?: '1b' | '2b' | '3b';
}

/**
 * Creates an enterprise-grade PDF to PDF/A Engine contract adapter.
 */
export function createPdfToPdfaEngine(
  defaultOptions?: PdfToPdfaExecuteOptions
): ToolEngineContract<File, PdfToPdfaExecuteOptions, Blob> {
  return {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',

    async execute(file: File, options?: PdfToPdfaExecuteOptions): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const conf = mergedOptions.conformance ?? '2b';

      const fd = new FormData();
      fd.append('file', file);
      fd.append('conformance', conf);

      const res = await fetch(apiUrl('/api/convert/pdf-to-pdfa'), {
        method: 'POST',
        body: fd,
        signal: options?.signal,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(err.message ?? err.error ?? 'PDF to PDF/A conversion failed');
      }

      const blob = await res.blob();
      const filename = buildPdfaFilename(file.name, conf);

      return {
        data: blob,
        filename,
        originalSize: file.size,
        resultSize: blob.size,
        mimeType: 'application/pdf',
      };
    },
  };
}

export const pdfToPdfaEngine = createPdfToPdfaEngine();
