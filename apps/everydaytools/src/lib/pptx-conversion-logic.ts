import type { ConversionFormat } from '@/components/conversion';

export type ImageTargetFormat = 'png' | 'jpg' | 'webp';

export const PPTX_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PowerPoint',
  extension: 'pptx',
  icon: '/icons/pptx.svg',
  color: '#D83B01',
  subLabel: isFr ? 'Présentation PPTX' : 'PPTX Presentation',
});

export const getTargetFormats = (
  isFr: boolean
): Record<ImageTargetFormat, ConversionFormat> => ({
  png: {
    name: isFr ? 'Images PNG' : 'PNG Images',
    extension: 'zip',
    icon: '/icons/png.svg',
    color: '#0066FF',
    subLabel: isFr ? 'Diapositives PNG sans perte (.zip)' : 'Lossless PNG slides (.zip)',
  },
  jpg: {
    name: isFr ? 'Images JPG' : 'JPG Images',
    extension: 'zip',
    icon: '/icons/jpg.svg',
    color: '#22A654',
    subLabel: isFr ? 'Diapositives JPG standard (.zip)' : 'Standard JPG slides (.zip)',
  },
  webp: {
    name: isFr ? 'Images WEBP' : 'WEBP Images',
    extension: 'zip',
    icon: '/icons/webp.svg',
    color: '#009688',
    subLabel: isFr ? 'Diapositives WEBP optimisées (.zip)' : 'Optimized WEBP slides (.zip)',
  },
});

export function validatePptxFile(
  file: File
): { valid: boolean; error?: 'unsupported_format' | 'file_too_large' } {
  const isPptx =
    file.name.toLowerCase().endsWith('.pptx') ||
    file.name.toLowerCase().endsWith('.ppt') ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    file.type === 'application/vnd.ms-powerpoint' ||
    file.type === '';

  if (!isPptx) {
    return { valid: false, error: 'unsupported_format' };
  }

  if (file.size > PPTX_MAX_FILE_SIZE) {
    return { valid: false, error: 'file_too_large' };
  }

  return { valid: true };
}

export function buildSlideFilename(
  baseName: string,
  slideIndex: number,
  format: ImageTargetFormat
): string {
  return `${baseName}_slide_${slideIndex}.${format}`;
}

export function buildSlideZipFilename(
  baseName: string,
  format: ImageTargetFormat
): string {
  return `${baseName}_slides_${format}.zip`;
}

export async function convertSlideFormat(
  pngDataUrl: string,
  targetFormat: ImageTargetFormat,
  quality = 0.92
): Promise<{ dataUrl: string; base64: string; blob: Blob }> {
  if (targetFormat === 'png') {
    const base64 = pngDataUrl.split(',')[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return { dataUrl: pngDataUrl, base64, blob };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('2D canvas context unavailable'));
        return;
      }
      if (targetFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : 'image/webp';
      const outputDataUrl = canvas.toDataURL(mimeType, quality);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image blob'));
            return;
          }
          const base64 = outputDataUrl.split(',')[1];
          resolve({ dataUrl: outputDataUrl, base64, blob });
        },
        mimeType,
        quality
      );
    };
    img.onerror = () => reject(new Error('Unable to load slide for conversion.'));
    img.src = pngDataUrl;
  });
}
