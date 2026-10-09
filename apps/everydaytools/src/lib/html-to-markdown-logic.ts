import type { ConversionFormat } from '@/components/conversion';

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: '#E34F26',
  subLabel: isFr ? 'Document HTML5' : 'HTML5 Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateHtmlInputFile(file: File, isFr: boolean): FileValidationResult {
  const isHtml =
    file.name.toLowerCase().endsWith('.html') ||
    file.name.toLowerCase().endsWith('.htm') ||
    file.name.toLowerCase().endsWith('.xhtml') ||
    file.type === 'text/html' ||
    file.type === 'application/xhtml+xml' ||
    file.type === 'text/plain' ||
    file.type === '';

  if (!isHtml) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier HTML (.html, .htm) valide.'
        : 'Please select a valid HTML file (.html, .htm).',
    };
  }

  if (file.size > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 20 Mo.'
        : 'File exceeds the maximum allowed size of 20 MB.',
    };
  }

  return { isValid: true };
}

export function buildMarkdownFilename(originalName?: string): string {
  if (!originalName || !originalName.trim()) {
    return 'document.md';
  }
  return originalName.replace(/\.(html?|xhtml)$/i, '.md');
}

export async function convertHtmlToMarkdown(rawHtml: string): Promise<string> {
  const TurndownModule = await import('turndown');
  const TurndownService = TurndownModule.default ?? TurndownModule;

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });

  return turndown.turndown(rawHtml);
}
