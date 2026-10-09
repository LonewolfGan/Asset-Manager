import type { ConversionFormat } from '../components/conversion/types';

export const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'jpg',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'JPEG, PNG, WebP, AVIF',
};

export interface CropPreset {
  id: string;
  name: string;
  ratio: number | null;
  description: string;
}

export const CROP_ASPECT_PRESETS: CropPreset[] = [
  { id: 'free', name: 'Libre', ratio: null, description: 'Recadrage libre personnalisé' },
  { id: '1-1', name: '1:1 Carré', ratio: 1, description: 'Instagram Post / Photo de profil' },
  { id: '4-5', name: '4:5 Portrait', ratio: 4 / 5, description: 'Instagram Feed Portrait' },
  { id: '16-9', name: '16:9 Paysage', ratio: 16 / 9, description: 'YouTube / Écran / TV' },
  { id: '9-16', name: '9:16 Story', ratio: 9 / 16, description: 'TikTok / Reels / Shorts' },
  { id: '4-3', name: '4:3 Standard', ratio: 4 / 3, description: 'Format photo / iPad' },
  { id: '3-2', name: '3:2 Reflex', ratio: 3 / 2, description: 'Format reflex 35mm' },
];

export interface AspectPreset {
  id: string;
  name: string;
  sub?: string;
  ratio: number | null;
}

export const getAspectPresets = (isFr: boolean): AspectPreset[] => [
  { id: 'free', name: isFr ? 'Libre' : 'Free', sub: isFr ? 'Personnalisé' : 'Custom', ratio: null },
  { id: '1-1', name: '1:1', sub: isFr ? 'Carré' : 'Square', ratio: 1 },
  { id: '16-9', name: '16:9', sub: isFr ? 'Paysage' : 'Landscape', ratio: 16 / 9 },
  { id: '9-16', name: '9:16', sub: 'Story', ratio: 9 / 16 },
  { id: '4-5', name: '4:5', sub: 'Portrait', ratio: 4 / 5 },
  { id: '4-3', name: '4:3', sub: 'Standard', ratio: 4 / 3 },
  { id: '3-2', name: '3:2', sub: isFr ? 'Reflex' : 'Classic', ratio: 3 / 2 },
  { id: '2-3', name: '2:3', sub: isFr ? 'Affiche' : 'Poster', ratio: 2 / 3 },
];

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function clampCropRect(
  rect: CropRect,
  boundsW: number,
  boundsH: number
): CropRect {
  const w = Math.max(10, Math.min(rect.w, boundsW));
  const h = Math.max(10, Math.min(rect.h, boundsH));
  const x = Math.max(0, Math.min(rect.x, boundsW - w));
  const y = Math.max(0, Math.min(rect.y, boundsH - h));

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  };
}

export function getDefaultCropRect(
  containerW: number,
  containerH: number,
  ratio: number | null
): CropRect {
  if (containerW <= 0 || containerH <= 0) return { x: 0, y: 0, w: 100, h: 100 };

  let targetW = containerW * 0.8;
  let targetH = containerH * 0.8;

  if (ratio) {
    if (targetW / ratio <= targetH) {
      targetH = targetW / ratio;
    } else {
      targetW = targetH * ratio;
    }
  }

  const x = (containerW - targetW) / 2;
  const y = (containerH - targetH) / 2;

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(targetW),
    h: Math.round(targetH),
  };
}

export function adjustCropWithRatio(
  rect: CropRect,
  ratio: number,
  boundsW: number,
  boundsH: number
): CropRect {
  let w = rect.w;
  let h = Math.round(w / ratio);

  if (h > boundsH) {
    h = boundsH;
    w = Math.round(h * ratio);
  }
  if (w > boundsW) {
    w = boundsW;
    h = Math.round(w / ratio);
  }

  const x = Math.max(0, Math.min(rect.x, boundsW - w));
  const y = Math.max(0, Math.min(rect.y, boundsH - h));

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  };
}

export function calculateGcd(a: number, b: number): number {
  return b === 0 ? a : calculateGcd(b, a % b);
}

export function getAspectRatioLabel(w: number, h: number): string {
  if (!w || !h || w <= 0 || h <= 0) return '—';
  const gcd = calculateGcd(Math.round(w), Math.round(h));
  const rw = Math.round(w) / gcd;
  const rh = Math.round(h) / gcd;
  const commonRatios: Record<string, string> = {
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
    '1:1': '1:1',
    '3:2': '3:2',
    '2:3': '2:3',
    '4:5': '4:5',
    '5:4': '5:4',
    '21:9': '21:9',
  };
  const key = `${rw}:${rh}`;
  if (commonRatios[key]) return commonRatios[key];
  const decimal = (w / h).toFixed(2);
  return `${decimal}:1`;
}

export function centerCropRect(rect: CropRect, boundsW: number, boundsH: number): CropRect {
  const x = Math.max(0, Math.min(Math.round((boundsW - rect.w) / 2), boundsW - rect.w));
  const y = Math.max(0, Math.min(Math.round((boundsH - rect.h) / 2), boundsH - rect.h));
  return {
    x,
    y,
    w: rect.w,
    h: rect.h,
  };
}

export function maximizeCropRect(boundsW: number, boundsH: number, ratio: number | null): CropRect {
  if (boundsW <= 0 || boundsH <= 0) return { x: 0, y: 0, w: 100, h: 100 };
  if (!ratio) {
    return { x: 0, y: 0, w: boundsW, h: boundsH };
  }

  let w = boundsW;
  let h = Math.round(w / ratio);

  if (h > boundsH) {
    h = boundsH;
    w = Math.round(h * ratio);
  }

  const x = Math.round((boundsW - w) / 2);
  const y = Math.round((boundsH - h) / 2);

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    w: Math.min(w, boundsW),
    h: Math.min(h, boundsH),
  };
}

export function computeSwapOrientation(
  crop: CropRect,
  aspectRatio: number | null,
  origW: number,
  origH: number
): { crop: CropRect; aspectRatio: number } | null {
  if (origW <= 0 || origH <= 0) return null;
  const currentRatio = aspectRatio ?? crop.w / crop.h;
  if (currentRatio === 1) return null;

  const newRatio = 1 / currentRatio;
  let newW = crop.h;
  let newH = crop.w;
  if (newW > origW) {
    newW = origW;
    newH = Math.round(newW / newRatio);
  }
  if (newH > origH) {
    newH = origH;
    newW = Math.round(newH * newRatio);
  }

  const centered = centerCropRect(
    { x: 0, y: 0, w: Math.round(newW), h: Math.round(newH) },
    origW,
    origH
  );

  return { crop: centered, aspectRatio: newRatio };
}
