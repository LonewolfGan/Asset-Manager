import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface SupportedLanguage {
  code: string;
  label: string;
}

export interface OcrResult {
  text: string;
  filename: string;
  blob: Blob;
  sizeBefore: number;
  sizeAfter: number;
  wordCount: number;
  charCount: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSupportedLanguages = (isFr: boolean): SupportedLanguage[] => [
  { code: 'fra+eng', label: isFr ? 'Français & Anglais (Auto)' : 'French & English (Auto)' },
  { code: 'fra', label: isFr ? 'Français' : 'French' },
  { code: 'eng', label: isFr ? 'Anglais' : 'English' },
  { code: 'spa', label: isFr ? 'Espagnol' : 'Spanish' },
  { code: 'deu', label: isFr ? 'Allemand' : 'German' },
  { code: 'ita', label: isFr ? 'Italien' : 'Italian' },
  { code: 'por', label: isFr ? 'Portugais' : 'Portuguese' },
];

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Image' : 'Image',
  extension: 'png, jpg, webp',
  icon: '/icons/image.svg',
  color: '#10B981',
  subLabel: 'JPG, PNG, WEBP, TIFF, BMP, GIF',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Texte' : 'Text',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#4B5563',
  subLabel: isFr ? 'Texte brut extrait (UTF-8)' : 'Extracted raw text (UTF-8)',
});

export function validateImageFile(selectedFile: File, isFr = false): FileValidationResult {
  const isImage =
    selectedFile.type.startsWith('image/') ||
    /\.(jpe?g|png|webp|bmp|tiff?|gif)$/i.test(selectedFile.name);

  if (!isImage) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, TIFF, BMP, GIF).'
        : 'Please select a valid image file (JPG, PNG, WEBP, TIFF, BMP, GIF).',
    };
  }

  if (selectedFile.size > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? "L'image dépasse la taille maximale autorisée de 20 Mo."
        : 'Image exceeds maximum allowed size of 20 MB.',
    };
  }

  return { isValid: true };
}

export function buildOcrFilename(originalName: string, isFr = false): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '') || 'ocr_extracted';
  return `${baseName}${isFr ? '_texte.txt' : '_text.txt'}`;
}

export function calculateOcrStats(text: string): { wordCount: number; charCount: number } {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  return { wordCount, charCount };
}

export async function performImageOcr(options: {
  file: File;
  lang: string;
  onProgress?: (progress: number) => void;
  errorFallback?: string;
  isFr?: boolean;
}): Promise<OcrResult> {
  const { file, lang, onProgress, errorFallback, isFr = false } = options;
  let extractedText = '';

  // 1. First attempt: Server-side OCR
  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('lang', lang);

    const res = await fetch(apiUrl('/api/extract/ocr'), {
      method: 'POST',
      body: fd,
    });

    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as { text?: string };
      if (data.text && data.text.trim()) {
        extractedText = data.text.trim();
      }
    }
  } catch {
    // Server call failed; proceed smoothly to browser client-side fallback
  }

  // 2. Client-side fallback: Tesseract.js in WebWorker
  if (!extractedText) {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          onProgress?.(Math.round(m.progress * 100));
        }
      },
    });

    const ret = await worker.recognize(file);
    await worker.terminate();
    extractedText = ret.data.text?.trim() || '';
  }

  if (!extractedText) {
    throw new Error(
      errorFallback ??
        (isFr
          ? "Aucun texte n'a pu être extrait de cette image."
          : 'No text could be extracted from this image.')
    );
  }

  const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
  const filename = buildOcrFilename(file.name, isFr);
  const { wordCount, charCount } = calculateOcrStats(extractedText);

  return {
    text: extractedText,
    filename,
    blob,
    sizeBefore: file.size,
    sizeAfter: blob.size,
    wordCount,
    charCount,
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
