import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface RtfToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface RtfFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'RTF',
  extension: 'rtf',
  icon: '/icons/rtf.svg',
  color: '#D97706',
  subLabel: 'Rich Text Format',
});

export const getTargetFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

const MAX_RTF_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildPdfFilename(filename: string): string {
  return filename.replace(/\.rtf$/i, '.pdf');
}

export function validateRtfFile(
  selectedFile: File,
  isFr: boolean
): RtfFileValidationResult {
  const isRtf =
    selectedFile.name.toLowerCase().endsWith('.rtf') ||
    selectedFile.type === 'application/rtf' ||
    selectedFile.type === 'text/rtf' ||
    selectedFile.type === '';

  if (!isRtf) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document Rich Text Format (.rtf) valide.'
        : 'Please select a valid Rich Text Format (.rtf) document.',
    };
  }

  if (selectedFile.size > MAX_RTF_FILE_SIZE) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Fichier trop volumineux' : 'File too large',
      errorDesc: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds the maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export async function convertRtfToPdf(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<RtfToPdfResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('targetFormat', 'pdf');

  const [res] = await Promise.all([
    fetch(apiUrl('/api/tools/document-convert'), {
      method: 'POST',
      body: fd,
    }),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

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
          ? 'Échec de la conversion du document RTF en PDF. Veuillez vérifier votre fichier.'
          : 'Failed to convert RTF document to PDF. Please check your file.')
    );
  }

  const blob = await res.blob();
  const filename = buildPdfFilename(file.name);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openPreview(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
}
