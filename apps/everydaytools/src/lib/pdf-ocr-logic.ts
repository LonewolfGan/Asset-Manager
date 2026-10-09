import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface SupportedLanguage {
  code: string;
  label: string;
}

export const getSupportedLanguages = (
  isFr: boolean,
  tc: {
    langAll?: string;
    langFra?: string;
    langEng?: string;
    langSpa?: string;
    langDeu?: string;
  } = {}
): SupportedLanguage[] => [
  { code: 'eng+fra', label: tc.langAll ?? (isFr ? 'Français & Anglais (Auto)' : 'French & English (Auto)') },
  { code: 'fra', label: tc.langFra ?? (isFr ? 'Français' : 'French') },
  { code: 'eng', label: tc.langEng ?? (isFr ? 'Anglais' : 'English') },
  { code: 'spa', label: tc.langSpa ?? (isFr ? 'Espagnol' : 'Spanish') },
  { code: 'deu', label: tc.langDeu ?? (isFr ? 'Allemand' : 'German') },
  { code: 'ita', label: isFr ? 'Italien' : 'Italian' },
  { code: 'por', label: isFr ? 'Portugais' : 'Portuguese' },
];

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document PDF scanné' : 'Scanned PDF document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Texte' : 'Text',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#64748B',
  subLabel: isFr ? 'Texte brut extrait (.txt)' : 'Extracted raw text (.txt)',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePdfOcrFile(file: File, isFr: boolean): FileValidationResult {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export function buildPdfOcrFilename(fileName: string, isFr = false): string {
  const baseName = fileName.replace(/\.[^/.]+$/, '') || 'pdf_ocr';
  return `${baseName}${isFr ? '_texte.txt' : '_text.txt'}`;
}

export function calculateOcrStats(text: string): { wordCount: number; charCount: number } {
  const clean = text.trim();
  const wordCount = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const charCount = clean ? text.length : 0;
  return { wordCount, charCount };
}

export async function performPdfOcr(
  file: File,
  lang: string,
  isFr = false,
  fallbackError = 'Failed to extract text from PDF document.'
): Promise<{ text: string; totalPages?: number }> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('lang', lang);

  const res = await fetch(apiUrl('/api/tools/pdf-ocr'), {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? fallbackError);
  }

  const data = (await res.json()) as {
    text: string;
    totalPages?: number;
    lang?: string;
    method?: string;
  };

  const extractedText = data.text?.trim() || '';

  if (!extractedText) {
    throw new Error(
      isFr
        ? 'Aucun texte n’a pu être extrait de ce document PDF. Le document ne contient peut-être pas de texte lisible.'
        : 'No text could be extracted from this PDF document. The document may not contain readable text.'
    );
  }

  return {
    text: extractedText,
    totalPages: data.totalPages,
  };
}
