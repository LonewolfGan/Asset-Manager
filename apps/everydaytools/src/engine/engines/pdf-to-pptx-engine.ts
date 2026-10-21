import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

/**
 * High-fidelity PDF to PowerPoint (.pptx) Engine contract adapter connecting the
 * unified reactive workflow hook with the dedicated server conversion pipeline.
 */
export const pdfToPptxEngine: ToolEngineContract<File, ToolExecuteOptions, Blob> = {
  id: 'pdf-to-pptx',
  name: 'PDF to PowerPoint Engine',

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/convert/pdf-to-pptx'), {
      method: 'POST',
      body: fd,
      signal: options?.signal,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? 'PDF to PowerPoint conversion failed');
    }

    const blob = await res.blob();
    const filename = file.name.replace(/\.pdf$/i, '.pptx');

    return {
      data: blob,
      filename,
      originalSize: file.size,
      resultSize: blob.size,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
  },
};
