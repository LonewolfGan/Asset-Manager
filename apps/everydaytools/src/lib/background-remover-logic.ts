export interface ColorPreset {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'gradient';
  gradientCss?: string;
  category: 'neutral' | 'pastel' | 'vibrant';
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'white', name: 'Blanc E-commerce', value: '#ffffff', type: 'color', category: 'neutral' },
  { id: 'black', name: 'Noir Studio', value: '#0f172a', type: 'color', category: 'neutral' },
  { id: 'gray-light', name: 'Gris Clair', value: '#f1f5f9', type: 'color', category: 'neutral' },
  { id: 'gray-warm', name: 'Gris Chaud', value: '#e2e8f0', type: 'color', category: 'neutral' },
  { id: 'blue-soft', name: 'Bleu Doux', value: '#dbeafe', type: 'color', category: 'pastel' },
  { id: 'emerald-soft', name: 'Menthe Pastelle', value: '#d1fae5', type: 'color', category: 'pastel' },
  { id: 'amber-soft', name: 'Sable Chaud', value: '#fef3c7', type: 'color', category: 'pastel' },
  { id: 'rose-soft', name: 'Rose Poudré', value: '#ffe4e6', type: 'color', category: 'pastel' },
  {
    id: 'grad-sunset',
    name: 'Coucher de Soleil',
    value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    type: 'gradient',
    gradientCss: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    category: 'vibrant',
  },
  {
    id: 'grad-ocean',
    name: 'Océan Pacifique',
    value: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    type: 'gradient',
    gradientCss: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    category: 'vibrant',
  },
  {
    id: 'grad-violet',
    name: 'Aurore Violette',
    value: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    type: 'gradient',
    gradientCss: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    category: 'vibrant',
  },
];

export type BackgroundMode = 'transparent' | 'color' | 'image' | 'gradient' | 'blur';

export interface ExportSettings {
  mode: BackgroundMode;
  color?: string;
  gradientId?: string;
}

export type CompositeBackground =
  | string
  | { type: 'color'; color: string }
  | { type: 'image'; source: Blob | string }
  | ExportSettings;

export function getOutputFilename(originalName: string, mode: BackgroundMode | string): string {
  const base = originalName.replace(/\.[^/.]+$/, '');
  if (mode === 'transparent') return `${base}_nobg.png`;
  if (mode === 'gradient') return `${base}_gradient.png`;
  if (mode === 'blur') return `${base}_portrait_blur.png`;
  if (mode === 'image') return `${base}_custom_bg.png`;
  return `${base}_colored.png`;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Erreur de chargement d’image'));
    img.src = src;
  });
}

async function decodeSource(source: Blob | string): Promise<{ img: ImageBitmap | HTMLImageElement; w: number; h: number }> {
  if (typeof source !== 'string' && typeof createImageBitmap === 'function') {
    const img = await createImageBitmap(source);
    return { img, w: img.width, h: img.height };
  }
  const src = typeof source === 'string' ? source : URL.createObjectURL(source);
  const img = await loadImage(src);
  if (typeof source !== 'string') {
    URL.revokeObjectURL(src);
  }
  return { img, w: img.naturalWidth || img.width, h: img.naturalHeight || img.height };
}

export async function compositeImage(
  cutoutSource: Blob | string,
  bg: CompositeBackground
): Promise<Blob> {
  const cutout = await decodeSource(cutoutSource);
  const w = cutout.w;
  const h = cutout.h;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible d’initialiser le contexte Canvas');

  // 1. Draw Background
  if (typeof bg === 'object' && 'type' in bg && bg.type === 'image') {
    const bgDecoded = await decodeSource(bg.source);
    const scale = Math.max(w / bgDecoded.w, h / bgDecoded.h);
    const drawW = bgDecoded.w * scale;
    const drawH = bgDecoded.h * scale;
    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2;
    ctx.drawImage(bgDecoded.img, drawX, drawY, drawW, drawH);
  } else {
    const color = typeof bg === 'string' ? bg : (bg.color || '#ffffff');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Draw Cutout Subject on top
  ctx.drawImage(cutout.img, 0, 0, w, h);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Erreur lors de la génération de l’image'));
    }, 'image/png');
  });
}

import type { ConversionFormat } from '@/components/conversion';

export const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'png',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'PNG, JPEG, WebP',
};

export type ItemStatus = 'pending' | 'processing' | 'done' | 'error';

export interface QueueItem {
  id: string;
  file: File;
  status: ItemStatus;
  previewUrl: string;
  resultUrl?: string;
  resultBlob?: Blob;
  dims?: { w: number; h: number };
  error?: string;
}

export type ViewMode = 'split' | 'cutout' | 'original';

export type BackdropType = 'transparent' | 'white' | 'dark' | 'neutral' | 'custom' | 'image';

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function getStageBackgroundStyle(
  viewMode: ViewMode,
  backdropType: BackdropType,
  customColor: string,
  customBgUrl: string | null
): React.CSSProperties {
  if (viewMode === 'original') {
    return { backgroundColor: '#f8f9fa' };
  }
  if (backdropType === 'white') return { backgroundColor: '#ffffff' };
  if (backdropType === 'dark') return { backgroundColor: '#18181b' };
  if (backdropType === 'neutral') return { backgroundColor: '#f4f4f5' };
  if (backdropType === 'custom') return { backgroundColor: customColor };
  if (backdropType === 'image' && customBgUrl) {
    return {
      backgroundImage: `url(${customBgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return {
    backgroundImage:
      'repeating-conic-gradient(rgba(0,0,0,0.06) 0% 25%, transparent 0% 50%)',
    backgroundSize: '18px 18px',
    backgroundPosition: '0 0, 9px 9px',
  };
}
