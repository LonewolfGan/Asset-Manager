import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface WordToMarkdownResult {
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
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

const MAX_WORD_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

export function buildMarkdownFilename(filename: string): string {
  return filename.replace(/\.(docx?|doc)$/i, '.md');
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
        ? 'Le fichier dépasse la taille maximale autorisée de 30 Mo.'
        : 'File exceeds maximum allowed size of 30 MB.',
    };
  }

  return { isValid: true };
}

export async function convertWordToMarkdown(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<WordToMarkdownResult> {
  const { isFr, errorFallback } = options;
  const fd = new FormData();
  fd.append('file', file);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/word-to-markdown'), {
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

  const mdContent = await res.text();
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  const filename = buildMarkdownFilename(file.name);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: mdContent,
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
