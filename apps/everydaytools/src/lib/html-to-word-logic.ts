import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface HtmlToWordResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface HtmlFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: 'var(--accent, #ea580c)',
  subLabel: isFr ? 'Fichier Web HTML5' : 'HTML5 Web File',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

const MAX_HTML_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildWordFilename(filename: string): string {
  const base = filename.replace(/\.(html?|htm)$/i, '').trim() || 'document';
  return `${base}.docx`;
}

export function validateHtmlFile(
  selectedFile: File,
  isFr: boolean
): HtmlFileValidationResult {
  const isHtml =
    selectedFile.name.toLowerCase().endsWith('.html') ||
    selectedFile.name.toLowerCase().endsWith('.htm') ||
    selectedFile.type === 'text/html';

  if (!isHtml) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document HTML (.html ou .htm) valide.'
        : 'Please select a valid HTML (.html or .htm) file.',
    };
  }

  if (selectedFile.size > MAX_HTML_FILE_SIZE) {
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

export async function convertHtmlToWord(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<HtmlToWordResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('targetFormat', 'docx');

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
          ? 'Échec de la conversion en document Word. Veuillez vérifier votre code HTML.'
          : 'Failed to convert to Word document. Please check your HTML.')
    );
  }

  const blob = await res.blob();
  const filename = buildWordFilename(file.name);

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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
