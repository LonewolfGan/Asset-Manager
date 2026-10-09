import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfToTextResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  textOutput: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'TXT',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#4B5563',
  subLabel: isFr ? 'Texte brut UTF-8' : 'UTF-8 Plain Text',
});

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export function validatePdfFile(
  file: File,
  isFr: boolean
): { isValid: boolean; error?: string } {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 100 Mo.'
        : 'File exceeds maximum allowed size of 100 MB.',
    };
  }

  return { isValid: true };
}

export async function convertPdfToText(
  file: File,
  options: {
    isFr: boolean;
    errorFallback?: string;
  }
): Promise<PdfToTextResult> {
  const { isFr, errorFallback } = options;
  const defaultErrorMessage = isFr
    ? "Échec de l'extraction du texte. Veuillez réessayer."
    : 'Failed to extract text. Please try again.';

  const fd = new FormData();
  fd.append('file', file);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/pdf-to-text'), {
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
      errJson.message ?? errJson.error ?? errorFallback ?? defaultErrorMessage
    );
  }

  const data = (await res.json()) as { text?: string };
  const rawText = data.text ?? '';
  const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, '') + '.txt',
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: rawText,
  };
}

export function downloadPdfToTextResult(
  result: PdfToTextResult,
  onAfterDownload?: () => void
): void {
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (onAfterDownload) {
    onAfterDownload();
  }
}
