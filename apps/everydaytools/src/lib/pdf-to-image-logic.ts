import type { ConversionFormat } from '@/components/conversion';
import { downloadBlob } from '@/lib/download';

export type ImageFormat = 'png' | 'jpeg' | 'webp';

export const IMAGE_FORMATS: ImageFormat[] = ['png', 'jpeg', 'webp'];

export interface PdfToImageResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
  isZip: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document source' : 'Source document',
});

export const getFormatConfigs = (isFr: boolean): Record<ImageFormat, ConversionFormat> => ({
  png: {
    name: 'PNG',
    extension: 'png',
    icon: '/icons/png.svg',
    color: '#0066FF',
    subLabel: isFr ? 'Format universel sans perte' : 'Lossless universal format',
  },
  jpeg: {
    name: 'JPG',
    extension: 'jpg',
    icon: '/icons/jpg.svg',
    color: '#22A654',
    subLabel: isFr ? 'Format standard compressé' : 'Standard compressed format',
  },
  webp: {
    name: 'WEBP',
    extension: 'webp',
    icon: '/icons/webp.svg',
    color: '#009688',
    subLabel: isFr ? 'Format web moderne & léger' : 'Lightweight modern web format',
  },
});

export function validatePdfFile(selectedFile: File, isFr = false): FileValidationResult {
  const isPdf =
    selectedFile.type === 'application/pdf' ||
    selectedFile.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (selectedFile.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export function buildOutputFilename(
  originalName: string,
  format: ImageFormat,
  isZip: boolean
): string {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const base = originalName.replace(/\.[^/.]+$/, '');
  return isZip ? `${base}_${ext}_images.zip` : `${base}_page_1.${ext}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  downloadBlob(blob, filename);
}
