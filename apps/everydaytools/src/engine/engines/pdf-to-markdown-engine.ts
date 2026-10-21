import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to Markdown Engine contract adapter connecting the
 * unified reactive workflow hook with the dedicated server extraction pipeline.
 */
export const pdfToMarkdownEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-markdown',
  name: 'PDF to Markdown',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-markdown'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      throw new Error(err.message ?? err.error ?? 'PDF to Markdown conversion failed');
    }

    const blob = await res.blob();
    const filename = `${file.name.replace(/\.pdf$/i, '')}.md`;

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'text/markdown; charset=utf-8',
    };
  },
};
