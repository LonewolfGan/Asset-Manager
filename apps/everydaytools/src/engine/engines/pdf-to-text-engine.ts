import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to plain text (UTF-8) Engine contract adapter connecting the
 * unified reactive workflow hook with the dedicated server extraction pipeline.
 */
export const pdfToTextEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-text',
  name: 'PDF to Text Engine',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-text'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      throw new Error(err.message ?? err.error ?? 'PDF to Text extraction failed');
    }

    const blob = await res.blob();
    const filename = file.name.replace(/\.pdf$/i, '.txt');

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'text/plain; charset=utf-8',
    };
  },
};
