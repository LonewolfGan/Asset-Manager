import type { ConversionFormat } from '@/components/conversion';

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: 'var(--accent, #ea580c)',
  subLabel: isFr ? 'Document HTML5' : 'HTML5 Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: 'var(--accent, #0284c7)',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateHtmlInputFile(file: File, isFr: boolean): FileValidationResult {
  const hasHtmlExt = /\.(html?|xhtml)$/i.test(file.name);
  const hasHtmlMime = file.type === 'text/html' || file.type === 'application/xhtml+xml';
  const isHtml = hasHtmlExt || hasHtmlMime;

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
  const base = originalName?.replace(/\.(html?|xhtml)$/i, '').trim();
  return `${base || 'document'}.md`;
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
