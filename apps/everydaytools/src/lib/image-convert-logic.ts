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

export interface SvgDimensions {
  width: number;
  height: number;
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

function parseSvgUnit(val: string): number | null {
  const trimmed = val.trim();
  if (/^\d+(\.\d+)?%$/.test(trimmed)) return null;
  const match = trimmed.match(/^([\d.]+)(px|pt|cm|mm|in)?$/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (isNaN(num) || num <= 0) return null;
  const unit = (match[2] || 'px').toLowerCase();
  switch (unit) {
    case 'pt': return num * (96 / 72);
    case 'cm': return num * (96 / 2.54);
    case 'mm': return num * (96 / 25.4);
    case 'in': return num * 96;
    default: return num;
  }
}

export function parseSvgDimensions(svgText: string): SvgDimensions {
  const fallback: SvgDimensions = { width: 800, height: 600 };
  if (!svgText || typeof svgText !== 'string') return fallback;

  const svgTagMatch = svgText.match(/<svg\b([^>]*)>/i);
  if (!svgTagMatch) return fallback;
  const tagAttrs = svgTagMatch[1];

  const wMatch = tagAttrs.match(/\bwidth=["']([^"']+)["']/i);
  const hMatch = tagAttrs.match(/\bheight=["']([^"']+)["']/i);
  const explicitW = wMatch ? parseSvgUnit(wMatch[1]) : null;
  const explicitH = hMatch ? parseSvgUnit(hMatch[1]) : null;

  if (explicitW && explicitH) {
    return { width: explicitW, height: explicitH };
  }

  const vbMatch = tagAttrs.match(/\bviewBox=["']([^"']+)["']/i);
  if (vbMatch) {
    const parts = vbMatch[1].trim().split(/[\s,]+/).map(parseFloat);
    if (parts.length >= 4) {
      const vbW = parts[2];
      const vbH = parts[3];
      if (vbW > 0 && vbH > 0) {
        return {
          width: explicitW ?? vbW,
          height: explicitH ?? vbH,
        };
      }
    }
  }

  return {
    width: explicitW ?? fallback.width,
    height: explicitH ?? fallback.height,
  };
}

export function canConvertClientSide(fromMime: string, toMime: string, fileSize: number): boolean {
  const MAX_CLIENT_SIZE = 15 * 1024 * 1024; // 15 MB
  if (fileSize > MAX_CLIENT_SIZE) return false;
  const normFrom = fromMime.toLowerCase();
  const normTo = toMime.toLowerCase();
  if (normFrom.includes('heic') || normFrom.includes('heif') || normFrom.includes('tiff') || normFrom.includes('tif')) {
    return false;
  }
  const supportedTargets = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  return supportedTargets.includes(normTo);
}

const FORMAT_CONFIGS: Array<{
  match: string[];
  ext: string;
  defaultName: string;
  icon: string;
  color: string;
  fr: string;
  en: string;
}> = [
  { match: ['webp'], ext: 'webp', defaultName: 'WEBP', icon: '/icons/webp.svg', color: '#009688', fr: 'Format Web Moderne', en: 'Modern Web Format' },
  { match: ['png'], ext: 'png', defaultName: 'PNG', icon: '/icons/png.svg', color: '#0066FF', fr: 'Format Sans Perte', en: 'Lossless Format' },
  { match: ['jpeg', 'jpg'], ext: 'jpg', defaultName: 'JPG', icon: '/icons/jpg.svg', color: '#22A654', fr: 'Format Compressé', en: 'Compressed Format' },
  { match: ['avif'], ext: 'avif', defaultName: 'AVIF', icon: '/icons/avif.svg', color: '#7C3AED', fr: 'Compression Moderne', en: 'Modern Compression' },
  { match: ['gif'], ext: 'gif', defaultName: 'GIF', icon: '/icons/gif.svg', color: '#EC4899', fr: 'Format Graphique', en: 'Graphics Format' },
  { match: ['tiff', 'tif'], ext: 'tiff', defaultName: 'TIFF', icon: '/icons/tiff.svg', color: '#D97706', fr: 'Image Haute Définition', en: 'High Definition Image' },
  { match: ['svg'], ext: 'svg', defaultName: 'SVG', icon: '/icons/svg.svg', color: '#F59E0B', fr: 'Graphique Vectoriel', en: 'Vector Graphics' },
  { match: ['pdf'], ext: 'pdf', defaultName: 'PDF', icon: '/icons/pdf.svg', color: '#EC1C24', fr: 'Document PDF', en: 'PDF Document' },
  { match: ['heic', 'heif'], ext: 'heic', defaultName: 'HEIC', icon: '/icons/heic.svg', color: '#0A84FF', fr: 'Image Haute Efficacité Apple', en: 'Apple High Efficiency Image' },
  { match: ['bmp'], ext: 'bmp', defaultName: 'BMP', icon: '/icons/png.svg', color: '#0066FF', fr: 'Image Bitmap', en: 'Bitmap Image' },
];

export function getFormatInfo(
  mimeOrExt: string,
  fallbackLabel?: string,
  isFr: boolean = true
): ConversionFormat {
  const norm = mimeOrExt.toLowerCase().replace(/^\./, '');
  const found = FORMAT_CONFIGS.find((f) => f.match.some((m) => norm.includes(m)));
  if (found) {
    return {
      name: fallbackLabel || found.defaultName,
      extension: found.ext,
      icon: found.icon,
      color: found.color,
      subLabel: isFr ? found.fr : found.en,
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
  if (mime === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    let text = '';
    if (typeof file.text === 'function') {
      text = await file.text();
    } else {
      text = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => res('');
        reader.readAsText(file);
      });
    }
    const { width, height } = parseSvgDimensions(text);
    const blob = new Blob([text], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('SVG load failed'));
      img.src = url;
    });
    URL.revokeObjectURL(url);
    const c = document.createElement('canvas');
    c.width = Math.round(width);
    c.height = Math.round(height);
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
    }
    return c;
  }
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
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    const page = doc.addPage([canvas.width, canvas.height]);
    const pngDataUrl = canvas.toDataURL('image/png');
    const pngBytes = Uint8Array.from(atob(pngDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
    const embedded = await doc.embedPng(pngBytes);
    page.drawImage(embedded, { x: 0, y: 0, width: canvas.width, height: canvas.height });
    const pdfBytes = await doc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
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
