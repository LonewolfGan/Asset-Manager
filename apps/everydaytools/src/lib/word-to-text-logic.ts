import mammoth from 'mammoth';
import { downloadBlob } from '@/lib/download';
import type { ConversionFormat } from '@/components/conversion';

export interface WordToTextResult {
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

export const getSourceFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: 'Microsoft Word',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Texte' : 'Text',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: 'var(--accent, #4b5563)',
  subLabel: isFr ? 'Texte Brut UTF-8' : 'Plain Text UTF-8',
});


const MAX_WORD_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildTextFilename(filename: string): string {
  return filename.replace(/\.(docx?|doc)$/i, '.txt');
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
        : 'Please select a valid Word document (.docx or .doc).',
    };
  }

  if (selectedFile.size > MAX_WORD_FILE_SIZE) {
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

export async function convertWordToText(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<WordToTextResult> {
  const { isFr, errorFallback } = options;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    const textContent = value ?? '';
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const filename = buildTextFilename(file.name);

    return {
      blob,
      filename,
      sizeAfter: blob.size,
      sizeBefore: file.size,
      textOutput: textContent,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : (errorFallback ??
            (isFr
              ? 'Échec de l’extraction du texte. Veuillez réessayer.'
              : 'Failed to extract text. Please try again.'));
    throw new Error(message);
  }
}

export function triggerDownload(blob: Blob, filename: string): void {
  downloadBlob(blob, filename);
}

