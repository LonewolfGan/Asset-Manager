import mammoth from 'mammoth';
import { downloadBlob } from '@/lib/download';
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
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: 'var(--accent, #ea580c)',
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

  try {
    const arrayBuffer = await file.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { value: htmlContent } = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        convertImage: mammoth.images.imgElement((element: any) =>
          element.read('base64').then((imageBuffer: string) => ({
            src: `data:${element.contentType};base64,${imageBuffer}`,
          }))
        ),
      }
    );

    const safeHtml = htmlContent ?? '';
    const blob = new Blob([safeHtml], { type: 'text/html;charset=utf-8' });
    const filename = buildHtmlFilename(file.name);

    return {
      blob,
      filename,
      sizeBefore: file.size,
      sizeAfter: blob.size,
      textOutput: safeHtml,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : (errorFallback ??
            (isFr
              ? 'Échec de la conversion en HTML. Veuillez réessayer.'
              : 'Failed to convert to HTML. Please try again.'));
    throw new Error(message);
  }
}

export function triggerDownload(blob: Blob, filename: string): void {
  downloadBlob(blob, filename);
}
