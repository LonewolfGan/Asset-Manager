import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to Word Engine contract adapter connecting the unified
 * reactive workflow hook with the dedicated server conversion pipeline.
 */
export const pdfToWordEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-word',
  name: 'PDF to Word Engine',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-word'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? 'PDF to Word conversion failed');
    }

    const blob = await res.blob();
    const filename = file.name.replace(/\.pdf$/i, '.docx');

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  },
};
