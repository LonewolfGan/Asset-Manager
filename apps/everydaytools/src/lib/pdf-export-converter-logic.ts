import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfExportConvertResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface PdfExportValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getPdfSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document PDF (.pdf)' : 'PDF Document (.pdf)',
});

export const getOdtTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'ODT',
  extension: 'odt',
  icon: '/icons/odt.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Document OpenDocument (.odt)' : 'OpenDocument Text (.odt)',
});

export const getRtfTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'RTF',
  extension: 'rtf',
  icon: '/icons/rtf.svg',
  color: '#6366F1',
  subLabel: isFr ? 'Texte Enrichi (.rtf)' : 'Rich Text Format (.rtf)',
});

const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function validatePdfDocumentFile(
  selectedFile: File,
  isFr: boolean
): PdfExportValidationResult {
  const isPdf =
    selectedFile.name.toLowerCase().endsWith('.pdf') ||
    selectedFile.type === 'application/pdf';

  if (!isPdf) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document PDF (.pdf) valide.'
        : 'Please select a valid PDF (.pdf) file.',
    };
  }

  if (selectedFile.size > MAX_PDF_FILE_SIZE) {
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

export async function convertPdfToDoc(
  file: File,
  targetFormat: 'odt' | 'rtf',
  options: { isFr: boolean; errorFallback?: string }
): Promise<PdfExportConvertResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('targetFormat', targetFormat);

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
          ? `Échec de la conversion en document ${targetFormat.toUpperCase()}. Veuillez vérifier votre fichier PDF.`
          : `Failed to convert to ${targetFormat.toUpperCase()}. Please check your PDF file.`)
    );
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}.${targetFormat}`;

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
