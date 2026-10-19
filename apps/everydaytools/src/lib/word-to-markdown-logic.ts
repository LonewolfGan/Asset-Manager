import mammoth from 'mammoth';
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
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: 'var(--accent, #0284c7)',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

const MAX_WORD_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

export function buildMarkdownFilename(filename: string): string {
  const base = filename.replace(/\.docx?$/i, '').trim();
  const clean = base.length > 0 ? base : 'document';
  return clean.endsWith('.md') ? clean : `${clean}.md`;
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

    const TurndownModule = await import('turndown');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TurndownService = (TurndownModule.default ?? TurndownModule) as any;
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*',
    });
    const markdown = turndown.turndown(htmlContent ?? '');

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const filename = buildMarkdownFilename(file.name);

    return {
      blob,
      filename,
      sizeBefore: file.size,
      sizeAfter: blob.size,
      textOutput: markdown,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : (errorFallback ??
            (isFr
              ? 'Échec de la conversion en Markdown. Veuillez réessayer.'
              : 'Failed to convert to Markdown. Please try again.'));
    throw new Error(message);
  }
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
