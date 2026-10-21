import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to EPUB Engine contract adapter connecting the
 * unified reactive workflow hook with the dedicated server extraction pipeline.
 */
export const pdfToEpubEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-epub',
  name: 'PDF to EPUB',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-epub'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      throw new Error(err.message ?? err.error ?? 'PDF to EPUB conversion failed');
    }

    const blob = await res.blob();
    const filename = `${file.name.replace(/\.pdf$/i, '')}.epub`;

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'application/epub+zip',
    };
  },
};
