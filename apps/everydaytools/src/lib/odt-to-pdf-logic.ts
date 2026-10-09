import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface OdtToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface OdtFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'ODT',
  extension: 'odt',
  icon: '/icons/odt.svg',
  color: '#0D9488',
  subLabel: 'OpenDocument Text',
});

export const getTargetFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

const MAX_ODT_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildPdfFilename(filename: string): string {
  return filename.replace(/\.odt$/i, '.pdf');
}

export function validateOdtFile(
  selectedFile: File,
  isFr: boolean
): OdtFileValidationResult {
  const isOdt =
    selectedFile.name.toLowerCase().endsWith('.odt') ||
    selectedFile.type === 'application/vnd.oasis.opendocument.text' ||
    selectedFile.type === '';

  if (!isOdt) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un fichier OpenDocument Text (.odt) valide.'
        : 'Please select a valid OpenDocument Text (.odt) file.',
    };
  }

  if (selectedFile.size > MAX_ODT_FILE_SIZE) {
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

export async function convertOdtToPdf(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<OdtToPdfResult> {
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
          ? 'Échec de la conversion du document ODT en PDF. Veuillez vérifier votre fichier.'
          : 'Failed to convert ODT document to PDF. Please check your file.')
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
