import type { ConversionFormat } from '@/components/conversion/types';

export interface FileResult {
  id: string;
  file: File;
  originalUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  blob?: Blob;
  compressedUrl?: string;
  error?: string;
  resultSize?: number;
}

export function extForMime(mime: string): string {
  const map: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'application/pdf': 'pdf',
  };
  return map[mime] ?? 'img';
}

export function getFormatInfo(
  mimeOrExt: string,
  fallbackLabel?: string,
  isFr: boolean = true
): ConversionFormat {
  const norm = mimeOrExt.toLowerCase().replace(/^\./, '');
  if (norm.includes('webp')) {
    return {
      name: fallbackLabel || 'WEBP',
      extension: 'webp',
      icon: '/icons/webp.svg',
      color: '#009688',
      subLabel: isFr ? 'Format Web Moderne' : 'Modern Web Format',
    };
  }
  if (norm.includes('png')) {
    return {
      name: fallbackLabel || 'PNG',
      extension: 'png',
      icon: '/icons/png.svg',
      color: '#0066FF',
      subLabel: isFr ? 'Format Sans Perte' : 'Lossless Format',
    };
  }
  if (norm.includes('jpeg') || norm.includes('jpg')) {
    return {
      name: fallbackLabel || 'JPG',
      extension: 'jpg',
      icon: '/icons/jpg.svg',
      color: '#22A654',
      subLabel: isFr ? 'Format Compressé' : 'Compressed Format',
    };
  }
  if (norm.includes('avif')) {
    return {
      name: fallbackLabel || 'AVIF',
      extension: 'avif',
      icon: '/icons/avif.svg',
      color: '#7C3AED',
      subLabel: isFr ? 'Compression Moderne' : 'Modern Compression',
    };
  }
  if (norm.includes('gif')) {
    return {
      name: fallbackLabel || 'GIF',
      extension: 'gif',
      icon: '/icons/gif.svg',
      color: '#EC4899',
      subLabel: isFr ? 'Format Graphique' : 'Graphics Format',
    };
  }
  if (norm.includes('tiff') || norm.includes('tif')) {
    return {
      name: fallbackLabel || 'TIFF',
      extension: 'tiff',
      icon: '/icons/tiff.svg',
      color: '#D97706',
      subLabel: isFr ? 'Image Haute Définition' : 'High Definition Image',
    };
  }
  if (norm.includes('svg')) {
    return {
      name: fallbackLabel || 'SVG',
      extension: 'svg',
      icon: '/icons/svg.svg',
      color: '#F59E0B',
      subLabel: isFr ? 'Graphique Vectoriel' : 'Vector Graphics',
    };
  }
  if (norm.includes('pdf')) {
    return {
      name: fallbackLabel || 'PDF',
      extension: 'pdf',
      icon: '/icons/pdf.svg',
      color: '#EC1C24',
      subLabel: isFr ? 'Document PDF' : 'PDF Document',
    };
  }
  if (norm.includes('heic') || norm.includes('heif')) {
    return {
      name: fallbackLabel || 'HEIC',
      extension: 'heic',
      icon: '/icons/heic.svg',
      color: '#0A84FF',
      subLabel: isFr ? 'Image Haute Efficacité Apple' : 'Apple High Efficiency Image',
    };
  }
  if (norm.includes('bmp')) {
    return {
      name: fallbackLabel || 'BMP',
      extension: 'bmp',
      icon: '/icons/png.svg',
      color: '#0066FF',
      subLabel: isFr ? 'Image Bitmap' : 'Bitmap Image',
    };
  }
  return {
    name: fallbackLabel || norm.toUpperCase(),
    extension: norm,
    icon: '/icons/png.svg',
    color: '#0066FF',
    subLabel: 'Image',
  };
}

export async function loadImageOnCanvas(src: string): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('Image load failed'));
    img.src = src;
  });
  const c = document.createElement('canvas');
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  c.getContext('2d')!.drawImage(img, 0, 0);
  return c;
}

export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const mime = file.type.toLowerCase();
  if (mime === 'image/heic' || mime === 'image/heif' || file.name.match(/\.(heic|heif)$/i)) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({ blob: file, toType: 'image/png', quality: 1 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const url = URL.createObjectURL(blob);
    const c = await loadImageOnCanvas(url);
    URL.revokeObjectURL(url);
    return c;
  }
  if (mime === 'image/avif') {
    const avif = await import('@jsquash/avif');
    const buf = await file.arrayBuffer();
    const imageData = await avif.decode(buf);
    if (!imageData) throw new Error('AVIF decode returned null');
    const c = document.createElement('canvas');
    c.width = imageData.width;
    c.height = imageData.height;
    c.getContext('2d')!.putImageData(imageData as ImageData, 0, 0);
    return c;
  }
  const url = URL.createObjectURL(file);
  const c = await loadImageOnCanvas(url);
  URL.revokeObjectURL(url);
  return c;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality = 0.92
): Promise<Blob> {
  if (mime === 'image/avif') {
    try {
      const result = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/avif', quality)
      );
      if (result && result.size > 0) return result;
    } catch {
      /* fall through to jsquash */
    }
    const avif = await import('@jsquash/avif');
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buf = await avif.encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buf], { type: 'image/avif' });
  }
  if (mime === 'application/pdf') {
    const jsPDF = (await import('jspdf')).jsPDF;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataUrl, 'JPEG', 0, 0, canvas.width, canvas.height);
    return pdf.output('blob');
  }
  if (mime === 'image/svg+xml') {
    const dataUrl = canvas.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
    return new Blob([svg], { type: 'image/svg+xml' });
  }
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(
      (b) => (b ? res(b) : rej(new Error('Canvas export failed'))),
      mime,
      quality
    )
  );
}

export async function createZipPackage(
  items: Array<{ file: File; blob: Blob }>,
  toExt: string
): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  for (let i = 0; i < items.length; i++) {
    const { file, blob } = items[i];
    const baseName = file.name.replace(/\.[^.]+$/, '');
    zip.file(`${baseName}_${i + 1}.${toExt}`, blob);
  }
  return zip.generateAsync({ type: 'blob' });
}
