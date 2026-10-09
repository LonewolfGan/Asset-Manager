import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff' | 'gif';

export const IMAGE_FORMATS: ImageFormat[] = ['png', 'jpeg', 'webp', 'avif', 'tiff', 'gif'];

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
  avif: {
    name: 'AVIF',
    extension: 'avif',
    icon: '/icons/avif.svg',
    color: '#7C3AED',
    subLabel: isFr ? 'Haute compression moderne' : 'Modern high compression',
  },
  tiff: {
    name: 'TIFF',
    extension: 'tiff',
    icon: '/icons/tiff.svg',
    color: '#D97706',
    subLabel: isFr ? 'Archivage & impression pro' : 'Archival & pro printing',
  },
  gif: {
    name: 'GIF',
    extension: 'gif',
    icon: '/icons/gif.svg',
    color: '#EC4899',
    subLabel: isFr ? 'Graphique standard' : 'Standard graphic format',
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

export async function convertPdfToImages(
  file: File,
  format: ImageFormat,
  errorFallback?: string
): Promise<PdfToImageResult> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('format', format);

  const [res] = await Promise.all([
    fetch(apiUrl('/api/tools/pdf-to-images'), {
      method: 'POST',
      body: fd,
    }),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as {
      message?: string;
      error?: unknown;
    };
    const msg =
      typeof err.message === 'string'
        ? err.message
        : typeof err.error === 'string'
        ? err.error
        : errorFallback ?? 'Failed to convert PDF to images.';
    throw new Error(msg);
  }

  const blob = await res.blob();
  const isZip = blob.type === 'application/zip';
  const filename = buildOutputFilename(file.name, format, isZip);

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    isZip,
  };
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
