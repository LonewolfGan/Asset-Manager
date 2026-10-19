import type { ConversionFormat } from '@/components/conversion/types';

export const MAX_WORD_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: 'var(--accent, #dc2626)',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export interface WordValidationResult {
  valid: boolean;
  error?: string;
}

export function validateWordFile(file: File, isFr: boolean): WordValidationResult {
  const nameLower = (file.name || '').toLowerCase();
  const isWordExt = nameLower.endsWith('.docx') || nameLower.endsWith('.doc');
  const isWordMime =
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword';

  if (!isWordExt && !isWordMime) {
    return {
      valid: false,
      error: isFr
        ? 'Veuillez sélectionner un document Word (.docx ou .doc) valide.'
        : 'Please select a valid Word (.docx or .doc) document.',
    };
  }

  if (file.size > MAX_WORD_FILE_SIZE) {
    return {
      valid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds maximum allowed size of 50 MB.',
    };
  }

  return { valid: true };
}

export function generatePdfFileName(wordFileName: string): string {
  if (!wordFileName) return 'document.pdf';
  if (/\.(docx|doc)$/i.test(wordFileName)) {
    return wordFileName.replace(/\.(docx|doc)$/i, '.pdf');
  }
  return `${wordFileName}.pdf`;
}
