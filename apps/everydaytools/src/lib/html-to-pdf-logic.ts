import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: '#E34F26',
  subLabel: isFr ? 'Document HTML5' : 'HTML5 Document',
});

export const getTargetFormat = (): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateHtmlFile(file: File, isFr: boolean): FileValidationResult {
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

export function buildPdfFilename(
  mode: 'upload' | 'paste',
  file?: File,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.(html?|xhtml)$/i, '.pdf');
  }
  return isFr ? 'document-web.pdf' : 'web-document.pdf';
}

export interface ConvertHtmlToPdfParams {
  mode: 'upload' | 'paste';
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

    const [response] = await Promise.all([
      fetch(apiUrl('/api/tools/html-to-pdf'), {
        method: 'POST',
        body: fd,
      }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
    res = response;
  } else {
    const bodyContent = { html: htmlInput };

    const [response] = await Promise.all([
      fetch(apiUrl('/api/tools/html-to-pdf'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
      }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
    res = response;
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
