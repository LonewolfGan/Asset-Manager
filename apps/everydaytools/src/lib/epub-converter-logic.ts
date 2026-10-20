import { apiUrl } from '@/lib/apiBase';
import { downloadBlob } from '@/lib/download';
import type { ConversionFormat } from '@/components/conversion';

export interface EpubConvertResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface EpubValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getEpubSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'EPUB',
  extension: 'epub',
  icon: '/icons/epub.svg',
  color: 'var(--accent, #8b5cf6)',
  subLabel: isFr ? 'Livre Numérique (.epub)' : 'Digital E-Book (.epub)',
});

export const getWordTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getPdfTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: 'var(--accent, #dc2626)',
  subLabel: isFr ? 'Document PDF (.pdf)' : 'PDF Document (.pdf)',
});

const MAX_EPUB_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function validateEpubFile(
  selectedFile: File,
  isFr: boolean
): EpubValidationResult {
  const isEpub =
    selectedFile.name.toLowerCase().endsWith('.epub') ||
    selectedFile.type === 'application/epub+zip';

  if (!isEpub) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un fichier e-book EPUB (.epub) valide.'
        : 'Please select a valid EPUB e-book (.epub) file.',
    };
  }

  if (selectedFile.size > MAX_EPUB_FILE_SIZE) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Fichier trop volumineux' : 'File too large',
      errorDesc: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export async function convertEpub(
  file: File,
  targetFormat: 'docx' | 'pdf',
  options: { isFr: boolean; errorFallback?: string }
): Promise<EpubConvertResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('targetFormat', targetFormat);

  const res = await fetch(apiUrl('/api/tools/document-convert'), {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(
      errJson.message ??
        errJson.error ??
        errorFallback ??
        (isFr
          ? `Échec de la conversion en ${targetFormat.toUpperCase()}. Veuillez vérifier votre fichier EPUB.`
          : `Failed to convert to ${targetFormat.toUpperCase()}. Please check your EPUB file.`)
    );
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.epub$/i, '').trim() || 'document';
  const filename = `${baseName}.${targetFormat}`;

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  downloadBlob(blob, filename);
}
