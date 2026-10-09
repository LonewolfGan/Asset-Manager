import type { ConversionFormat } from '@/components/conversion';

export type Level = 'prepress' | 'ebook' | 'screen';

export interface CompressionPreset {
  id: Level;
  index: string;
  name: string;
  tag: string;
  ratio: number;
  gainLabel: string;
  description: string;
}

export const getPdfFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getPresets = (isFr: boolean): CompressionPreset[] => [
  {
    id: 'prepress',
    index: '01',
    name: isFr ? 'Légère' : 'Light',
    tag: isFr ? 'Qualité maximale' : 'Maximum quality',
    ratio: 0.75,
    gainLabel: '-25%',
    description: isFr
      ? 'Préserve la netteté intégrale des images et des textes.'
      : 'Preserves full sharpness of images and text.',
  },
  {
    id: 'ebook',
    index: '02',
    name: isFr ? 'Équilibrée' : 'Balanced',
    tag: isFr ? 'Recommandé' : 'Recommended',
    ratio: 0.4,
    gainLabel: '-60%',
    description: isFr
      ? 'Le meilleur équilibre pour partager rapidement par e-mail ou sur le web.'
      : 'Best balance for sharing quickly via email or web.',
  },
  {
    id: 'screen',
    index: '03',
    name: isFr ? 'Maximale' : 'Extreme',
    tag: isFr ? 'Poids minimum' : 'Minimum size',
    ratio: 0.2,
    gainLabel: '-80%',
    description: isFr
      ? 'Réduction poussée pour les documents très volumineux.'
      : 'Aggressive reduction for very large documents.',
  },
];

export const calculateEstimatedSize = (fileSize: number, ratio: number): number => {
  return Math.max(Math.round(fileSize * ratio), 1024);
};

export const calculateGain = (originalSize: number, compressedSize: number): number => {
  if (originalSize <= 0) return 0;
  return Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));
};

export const formatResultFilename = (originalName: string, isFr: boolean): string => {
  const suffix = isFr ? '_compresse.pdf' : '_compressed.pdf';
  if (/\.pdf$/i.test(originalName)) {
    return originalName.replace(/\.pdf$/i, suffix);
  }
  return `${originalName}${suffix}`;
};

export interface FileValidationInput {
  name: string;
  size: number;
  type: string;
}

export const validatePdfFile = (
  file: FileValidationInput,
  isFr: boolean
): { isValid: boolean; error?: string } => {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier PDF valide.'
        : 'Please select a valid PDF file.',
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
};
