import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type HtmlToPdfMode = 'upload' | 'paste';

export interface HtmlToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: 'var(--accent, #ea580c)',
  subLabel: isFr ? 'Document HTML5' : 'HTML5 Document',
});

export const getTargetFormat = (): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: 'var(--accent, #dc2626)',
  subLabel: 'Adobe Acrobat',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateHtmlFile(file: File, isFr: boolean): FileValidationResult {
  const lowerName = file.name.toLowerCase();
  const hasValidExt =
    lowerName.endsWith('.html') ||
    lowerName.endsWith('.htm') ||
    lowerName.endsWith('.xhtml');

  const hasValidMime =
    file.type === 'text/html' ||
    file.type === 'application/xhtml+xml' ||
    file.type === 'text/plain' ||
    file.type === '';

  if (!hasValidExt || !hasValidMime) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier HTML (.html, .htm, .xhtml) valide.'
        : 'Please select a valid HTML file (.html, .htm, .xhtml).',
    };
  }

  if (file.size > 2 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 2 Mo.'
        : 'File exceeds the maximum allowed size of 2 MB.',
    };
  }

  return { isValid: true };
}

export function buildPdfFilename(
  mode: HtmlToPdfMode,
  file?: File,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    const baseName = file.name.replace(/\.(html?|xhtml)$/i, '').trim();
    const safeBase = baseName || 'document';
    return `${safeBase}.pdf`;
  }
  return isFr ? 'document-web.pdf' : 'web-document.pdf';
}

export interface ConvertHtmlToPdfParams {
  mode: HtmlToPdfMode;
  file?: File;
  htmlInput?: string;
  fallbackError?: string;
}

export async function convertHtmlToPdf({
  mode,
  file,
  htmlInput = '',
  fallbackError,
}: ConvertHtmlToPdfParams): Promise<Blob> {
  let res: Response;

  if (mode === 'upload') {
    if (!file) {
      throw new Error('No file provided for upload conversion');
    }
    const fd = new FormData();
    fd.append('file', file);

    res = await fetch(apiUrl('/api/tools/html-to-pdf'), {
      method: 'POST',
      body: fd,
    });
  } else {
    const bodyContent = { html: htmlInput };

    res = await fetch(apiUrl('/api/tools/html-to-pdf'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyContent),
    });
  }

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(
      errJson.message ??
        errJson.error ??
        fallbackError ??
        'Failed to convert HTML document to PDF. Please try again.'
    );
  }

  return res.blob();
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
