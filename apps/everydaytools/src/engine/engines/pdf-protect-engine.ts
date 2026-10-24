import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { apiUrl } from '@/lib/apiBase';

export interface PdfProtectExecuteOptions extends ToolExecuteOptions {
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
  baseName?: string;
  isFr?: boolean;
}

export interface PdfProtectMetadata extends Record<string, unknown> {
  encryption: string;
  isLinearized: boolean;
  originalSize: number;
  protectedSize: number;
}

/**
 * Creates an enterprise-grade PDF Protect Engine contract adapter.
 */
export function createPdfProtectEngine(
  defaultOptions?: Partial<PdfProtectExecuteOptions>
): ToolEngineContract<File, PdfProtectExecuteOptions, Blob> {
  return {
    id: 'pdf-protect',
    name: 'Protect PDF',

    async execute(
      file: File,
      options?: PdfProtectExecuteOptions
    ): Promise<ToolResult<Blob>> {
      const merged = { ...defaultOptions, ...options };
      const signal = merged.signal;
      const onProgress = merged.onProgress;
      const isFr = merged.isFr ?? false;

      const rawUser = String(merged.userPassword ?? '');
      const rawOwner = String(merged.ownerPassword ?? '');

      if (!rawUser.trim() && !rawOwner.trim()) {
        throw new Error(
          isFr
            ? 'Veuillez définir un mot de passe pour protéger le document.'
            : 'Please provide a password to protect the document.'
        );
      }

      if (rawUser && rawOwner && rawUser === rawOwner) {
        throw new Error(
          isFr
            ? 'Le mot de passe utilisateur et le mot de passe propriétaire ne peuvent pas être identiques.'
            : 'User password and owner password cannot be identical.'
        );
      }

      if (rawUser.length > 128 || rawOwner.length > 128) {
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
      if (rawUser.trim()) {
        formData.append('userPassword', rawUser.trim());
      }
      if (rawOwner.trim()) {
        formData.append('ownerPassword', rawOwner.trim());
      }
      formData.append('allowPrinting', String(merged.allowPrinting !== false));
      formData.append('allowCopying', String(merged.allowCopying !== false));
      formData.append('allowModifying', String(merged.allowModifying === true));

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 50, stage: 'encrypting' });

      const res = await fetch(apiUrl('/api/tools/pdf-protect'), {
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
            (isFr ? 'Échec du chiffrement du PDF.' : 'PDF protection failed')
        );
      }

      onProgress?.({ percent: 85, stage: 'finalizing' });

      const blob = await res.blob();

      if (signal?.aborted) {
        throw new DOMException('Operation aborted', 'AbortError');
      }

      onProgress?.({ percent: 100, stage: 'complete' });

      const rawBase = merged.baseName ?? file.name.replace(/\.pdf$/i, '');
      const filename = `${rawBase}_protected.pdf`;

      const encHeader = res.headers.get('x-encryption') ?? 'AES-256';
      const linHeader = res.headers.get('x-linearized');
      const isLinearized = linHeader ? linHeader.toLowerCase() === 'true' : true;

      return {
        data: blob,
        filename,
        mimeType: 'application/pdf',
        originalSize: file.size,
        resultSize: blob.size,
        metadata: {
          encryption: encHeader,
          isLinearized,
          originalSize: file.size,
          protectedSize: blob.size,
        },
      };
    },
  };
}

export const pdfProtectEngine = createPdfProtectEngine();
