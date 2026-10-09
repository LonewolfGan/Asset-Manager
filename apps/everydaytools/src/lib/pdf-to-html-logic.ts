import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfToHtmlResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  htmlOutput: string;
}

export interface PdfFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: '#E34F26',
  subLabel: isFr ? 'Page web HTML5' : 'HTML5 Webpage',
});

const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildHtmlFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '') + '.html';
}

export function validatePdfFile(
  selectedFile: File,
  isFr: boolean
): PdfFileValidationResult {
  const isPdf =
    selectedFile.type === 'application/pdf' ||
    selectedFile.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
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

export async function convertPdfToHtml(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<PdfToHtmlResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/tools/pdf-to-html'), {
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
          ? 'Échec de la conversion en HTML. Veuillez réessayer.'
          : 'Failed to convert to HTML. Please try again.')
    );
  }

  const htmlText = await res.text();
  const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
  const filename = buildHtmlFilename(file.name);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    htmlOutput: htmlText,
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
