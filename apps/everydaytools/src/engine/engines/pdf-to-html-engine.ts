import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to responsive HTML5 Engine contract adapter connecting the
 * unified reactive workflow hook with the dedicated server conversion pipeline.
 */
export const pdfToHtmlEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-html',
  name: 'PDF to HTML5 Engine',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-html'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? 'PDF to HTML conversion failed');
    }

    const blob = await res.blob();
    const filename = file.name.replace(/\.pdf$/i, '.html');

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'text/html; charset=utf-8',
    };
  },
};
