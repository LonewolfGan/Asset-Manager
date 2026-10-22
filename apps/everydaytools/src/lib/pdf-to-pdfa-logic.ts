import type { ConversionFormat } from '@/components/conversion';

export type PdfaConformance = '1b' | '2b' | '3b';

export interface ConformanceOption {
  id: PdfaConformance;
  label: string;
  badge: string;
  description: string;
}

export const getConformanceOptions = (isFr: boolean): ConformanceOption[] => [
  {
    id: '2b',
    label: 'PDF/A-2b',
    badge: isFr ? 'Recommandé' : 'Recommended',
    description: isFr
      ? 'Archivage moderne ISO 19005-2 avec graphiques vectoriels et transparences'
      : 'Modern ISO 19005-2 archival preserving vectors and transparency',
  },
  {
    id: '1b',
    label: 'PDF/A-1b',
    badge: 'ISO 19005-1',
    description: isFr
      ? 'Format d’archivage hérité à compatibilité maximale'
      : 'Legacy archival format ensuring maximal cross-viewer baseline',
  },
  {
    id: '3b',
    label: 'PDF/A-3b',
    badge: 'ISO 19005-3',
    description: isFr
      ? 'Archivage étendu autorisant l’incorporation de fichiers joints (XML, factures Factur-X)'
      : 'Extended archival allowing embedded file attachments (XML, Factur-X)',
  },
];

export interface PdfFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF/A',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#1D4ED8',
  subLabel: isFr ? 'Archivage ISO 19005' : 'ISO 19005 Archival',
});

const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function buildPdfaFilename(filename: string, conformance: PdfaConformance = '2b'): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  const suffix = conformance === '1b' ? 'pdfa1b' : conformance === '3b' ? 'pdfa3b' : 'pdfa2b';
  return `${base}_${suffix}.pdf`;
}

export function validatePdfFile(
  selectedFile: File,
  isFr: boolean
): PdfFileValidationResult {
  const isPdf =
    selectedFile.type === 'application/pdf' ||
    selectedFile.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (selectedFile.size > MAX_PDF_FILE_SIZE) {
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
