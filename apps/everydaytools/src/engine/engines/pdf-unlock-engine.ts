import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

export interface PdfUnlockExecuteOptions extends ToolExecuteOptions {
  password?: string;
  baseName?: string;
  isFr?: boolean;
}

export interface PdfUnlockMetadata extends Record<string, unknown> {
  isDecrypted: boolean;
  isLinearized: boolean;
  originalSize: number;
  unlockedSize: number;
}

/**
 * Creates an enterprise-grade PDF Unlock Engine contract adapter.
 */
export function createPdfUnlockEngine(
  defaultOptions?: Partial<PdfUnlockExecuteOptions>
): ToolEngineContract<File, PdfUnlockExecuteOptions, Blob> {
  return {
    id: 'pdf-unlock',
    name: 'Unlock PDF',

    async execute(
      file: File,
      options?: PdfUnlockExecuteOptions
    ): Promise<ToolResult<Blob>> {
      const merged = { ...defaultOptions, ...options };
      const signal = merged.signal;
      const onProgress = merged.onProgress;
      const isFr = merged.isFr ?? false;

      const rawPassword = merged.password !== undefined ? String(merged.password) : '';

      if (rawPassword.length > 128) {
        throw new Error(
          isFr
            ? 'Le mot de passe est trop long (maximum 128 caractères).'
            : 'Password too long (max 128 characters).'
        );
      }

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 10, stage: 'reading' });

      const formData = new FormData();
      formData.append('file', file);
      if (rawPassword) {
        formData.append('password', rawPassword);
      }

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 50, stage: 'decrypting' });

      const res = await fetch(apiUrl('/api/tools/pdf-unlock'), {
        method: 'POST',
        body: formData,
        signal,
      });

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(
          errorData.message ??
            errorData.error ??
            (isFr ? 'Échec du déverrouillage du PDF.' : 'PDF unlock failed')
        );
      }

      onProgress?.({ percent: 85, stage: 'finalizing' });

      const blob = await res.blob();

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 100, stage: 'complete' });

      const rawBase = merged.baseName ?? file.name.replace(/\.pdf$/i, '');
      const filename = `${rawBase}_unlocked.pdf`;

      const decHeader = res.headers.get('x-decrypted');
      const isDecrypted = decHeader ? decHeader.toLowerCase() === 'true' : true;

      const linHeader = res.headers.get('x-linearized');
      const isLinearized = linHeader ? linHeader.toLowerCase() === 'true' : true;

      return {
        data: blob,
        filename,
        mimeType: 'application/pdf',
        originalSize: file.size,
        resultSize: blob.size,
        metadata: {
          isDecrypted,
          isLinearized,
          originalSize: file.size,
          unlockedSize: blob.size,
        },
      };
    },
  };
}

export const pdfUnlockEngine = createPdfUnlockEngine();
