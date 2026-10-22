import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

export interface PdfToImageExecuteOptions extends ToolExecuteOptions {
  format?: 'png' | 'jpeg' | 'webp';
  dpi?: number;
}

/**
 * Creates a high-fidelity PDF to Image Engine contract adapter with configurable default options.
 */
export function createPdfToImageEngine(
  defaultOptions?: PdfToImageExecuteOptions
): ToolEngineContract<File, PdfToImageExecuteOptions, Blob> {
  return {
    id: 'pdf-to-image',
    name: 'PDF to Image',

    async execute(file: File, options?: PdfToImageExecuteOptions): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const fd = new FormData();
      fd.append('file', file);
      if (mergedOptions.format) {
        fd.append('format', mergedOptions.format);
      }
      if (mergedOptions.dpi) {
        fd.append('dpi', String(mergedOptions.dpi));
      }

      const res = await fetch(apiUrl('/api/convert/pdf-to-image'), {
        method: 'POST',
        body: fd,
        signal: options?.signal,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(err.message ?? err.error ?? 'PDF to Image conversion failed');
      }

      const blob = await res.blob();
      const contentType = res.headers.get('content-type') ?? blob.type;
      const isZip = contentType.includes('zip') || contentType.includes('octet-stream');
      const baseName = file.name.replace(/\.pdf$/i, '').trim() || 'document';
      const ext = mergedOptions.format ?? 'png';
      const filename = isZip ? `${baseName}_images.zip` : `${baseName}.${ext}`;

      return {
        data: blob,
        filename,
        originalSize: file.size,
        resultSize: blob.size,
        mimeType: isZip ? 'application/zip' : `image/${ext}`,
      };
    },
  };
}

export const pdfToImageEngine = createPdfToImageEngine();
