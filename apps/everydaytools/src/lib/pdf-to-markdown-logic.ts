import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfToMarkdownResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  textOutput: string;
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
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Format CommonMark / GFM' : 'CommonMark / GFM',
});

const MAX_PDF_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function buildMarkdownFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '') + '.md';
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
        ? 'Le fichier dépasse la taille maximale autorisée de 100 Mo.'
        : 'File exceeds maximum allowed size of 100 MB.',
    };
  }

  return { isValid: true };
}

export async function convertPdfToMarkdown(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<PdfToMarkdownResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/pdf-to-markdown'), {
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
          ? 'Échec de la conversion en Markdown. Veuillez réessayer.'
          : 'Failed to convert to Markdown. Please try again.')
    );
  }

  const text = await res.text();
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const filename = buildMarkdownFilename(file.name);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: text,
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
