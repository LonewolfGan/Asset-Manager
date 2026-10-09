import { PDFDocument } from 'pdf-lib';
import type { ConversionFormat } from '@/components/conversion';

export const ALLOWED_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
  'gif',
  'tiff',
  'bmp',
  'heic',
  'heif',
  'svg',
];

export const MAX_IMAGE_TO_PDF_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB

export function getSourceImagesFormat(): ConversionFormat {
  return {
    name: 'Images',
    extension: 'jpg, png, webp, heic',
    icon: '/icons/jpg.svg',
    color: '#10B981',
    subLabel: 'JPG, PNG, WEBP, AVIF, HEIC, TIFF, BMP',
  };
}

export function getTargetPdfFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#EF4444',
    subLabel: isFr ? 'Document PDF Unique' : 'Single PDF Document',
  };
}

export function filterValidImageFiles(files: File[]): {
  validFiles: File[];
  invalidCount: number;
} {
  const validFiles = files.filter((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.includes(ext ?? '');
  });
  return {
    validFiles,
    invalidCount: files.length - validFiles.length,
  };
}

export function validateImageFiles(
  files: File[]
): { valid: boolean; error?: 'no_files' | 'files_too_large' } {
  if (files.length === 0) {
    return { valid: false, error: 'no_files' };
  }

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  if (totalBytes > MAX_IMAGE_TO_PDF_TOTAL_BYTES) {
    return { valid: false, error: 'files_too_large' };
  }

  return { valid: true };
}

export function buildCombinedPdfFilename(files: File[], isFr: boolean): string {
  if (files.length === 1) {
    return `${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`;
  }
  return isFr ? 'images_combine.pdf' : 'combined_images.pdf';
}

export async function normaliseToEmbeddable(
  file: File,
  convertEndpoint = '/api/convert/image'
): Promise<{ buffer: ArrayBuffer; mime: 'image/jpeg' | 'image/png' }> {
  if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
    return { buffer: await file.arrayBuffer(), mime: 'image/png' };
  }
  if (
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.name.toLowerCase().endsWith('.jpg') ||
    file.name.toLowerCase().endsWith('.jpeg')
  ) {
    return { buffer: await file.arrayBuffer(), mime: 'image/jpeg' };
  }

  // Convert other formats to JPEG via backend converter
  const form = new FormData();
  form.append('file', file);
  form.append('format', 'image/jpeg');
  form.append('quality', '0.92');

  const res = await fetch(convertEndpoint, { method: 'POST', body: form });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(
      err.error ?? `Impossible de convertir ${file.name} dans un format intégrable en PDF.`
    );
  }
  const buffer = await res.arrayBuffer();
  return { buffer, mime: 'image/jpeg' };
}

export async function generatePdfFromImages(
  files: File[],
  convertEndpoint?: string
): Promise<{ blob: Blob; totalSizeBefore: number }> {
  const pdfDoc = await PDFDocument.create();
  let totalSizeBefore = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalSizeBefore += file.size;

    const { buffer, mime } = await normaliseToEmbeddable(file, convertEndpoint);

    const img =
      mime === 'image/png'
        ? await pdfDoc.embedPng(buffer)
        : await pdfDoc.embedJpg(buffer);

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return { blob, totalSizeBefore };
}
