import type { ConversionFormat } from '@/components/conversion';
import type { MetadataTag } from '@/lib/metadata-inspector';
import { formatBytes } from '@/lib/utils';
import { apiUrl } from '@/lib/apiBase';

export interface CleanResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  tagsBeforeCount: number;
}

export function getSourceDropzoneFormat(isFr: boolean): ConversionFormat {
  return {
    name: isFr ? 'Fichier' : 'File',
    extension: 'pdf',
    icon: '/icons/file.svg',
    color: '#52525B',
    subLabel: isFr ? 'Photo, Image ou PDF' : 'Photo, Image or PDF',
  };
}

export function getFileTargetFormat(file: File, isFr: boolean): ConversionFormat {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') {
    return {
      name: 'PDF',
      extension: 'pdf',
      icon: '/icons/pdf.svg',
      color: '#EC1C24',
      subLabel: isFr ? 'Document PDF Anonymisé' : 'Anonymized PDF Document',
    };
  }
  return {
    name: ext.toUpperCase() || 'Image',
    extension: ext || 'png',
    icon: '/icons/image.svg',
    color: '#FF6B35',
    subLabel: isFr ? 'Image Anonymisée' : 'Anonymized Image',
  };
}

export function filterInspectionTags(
  tags: MetadataTag[],
  activeFilter: 'all' | 'sensitive'
): MetadataTag[] {
  if (activeFilter === 'sensitive') {
    return tags.filter((t) => t.isSensitive);
  }
  return tags;
}

export function computeTelemetryDetails(
  file: File | null,
  imageDims: { w: number; h: number } | null,
  pageCount?: number
): string {
  if (!file) return '';
  if (imageDims) {
    return `${imageDims.w} × ${imageDims.h} px`;
  }
  if (pageCount) {
    return `${pageCount} page${pageCount > 1 ? 's' : ''}`;
  }
  return '';
}

export function buildResultMetadataText(
  sizeBefore: number,
  sizeAfter: number,
  isFr: boolean
): string {
  const base = isFr ? '0 métadonnée résiduelle' : '0 remaining metadata';
  const sizeText = formatBytes(sizeAfter);
  const diffText = sizeAfter < sizeBefore ? ` (-${formatBytes(sizeBefore - sizeAfter)})` : '';
  return `${base} · ${sizeText}${diffText}`;
}

export function cleanImageWithCanvas(
  imageFile: File,
  isFr: boolean = true
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error(isFr ? "Impossible de nettoyer l'image" : "Unable to clean image"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const mime = imageFile.type.startsWith('image/') ? imageFile.type : 'image/jpeg';
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(isFr ? "Erreur lors de la génération de l'image" : "Error generating image"));
        },
        mime === 'image/png' ? 'image/png' : mime === 'image/webp' ? 'image/webp' : 'image/jpeg',
        0.95
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(isFr ? "Erreur lors de la lecture de l'image" : "Error reading image"));
    };
    img.src = url;
  });
}

export async function cleanPdfMetadata(file: File): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const ab = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(ab, { ignoreEncryption: true });

  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  pages.forEach((p) => newDoc.addPage(p));

  newDoc.setTitle('');
  newDoc.setAuthor('');
  newDoc.setSubject('');
  newDoc.setKeywords([]);
  newDoc.setProducer('');
  newDoc.setCreator('');

  const bytes = await newDoc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function cleanImageMetadata(file: File, isFr: boolean): Promise<Blob> {
  let blob: Blob | null = null;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(apiUrl('/api/tools/image-metadata-clean'), {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      blob = await res.blob();
    }
  } catch {
    // Backend unreachable -> fall through to client-side canvas
  }

  if (!blob) {
    blob = await cleanImageWithCanvas(file, isFr);
  }

  return blob;
}
