import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface WordToHtmlResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  textOutput: string;
}

export interface WordFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: '#E34F26',
  subLabel: isFr ? 'Code Web HTML5' : 'HTML5 Web Code',
});

const MAX_WORD_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildHtmlFilename(filename: string): string {
  return filename.replace(/\.(docx?|doc)$/i, '.html');
}

export function validateWordFile(
  selectedFile: File,
  isFr: boolean
): WordFileValidationResult {
  const isWord =
    selectedFile.name.toLowerCase().endsWith('.docx') ||
    selectedFile.name.toLowerCase().endsWith('.doc') ||
    selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    selectedFile.type === 'application/msword';

  if (!isWord) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document Word (.docx ou .doc) valide.'
        : 'Please select a valid Word (.docx or .doc) document.',
    };
  }

  if (selectedFile.size > MAX_WORD_FILE_SIZE) {
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

export async function convertWordToHtml(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<WordToHtmlResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/docx-to-html'), {
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

  const data = (await res.json().catch(() => null)) as { html?: string } | null;
  const htmlContent = data?.html ?? '';
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = buildHtmlFilename(file.name);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: htmlContent,
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
