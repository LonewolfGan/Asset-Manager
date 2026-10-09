import type { ConversionFormat } from '@/components/conversion';

export const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'jpg',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'JPEG, PNG, WebP, AVIF',
};

export type Mode = 'pixels' | 'percentage' | 'presets';

export interface StandardPreset {
  id: string;
  name: string;
  w: number;
  h: number;
  ratio: string;
  category: string;
}

export interface ResizeResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  finalW: number;
  finalH: number;
}

export const getStandardPresets = (isFr: boolean): StandardPreset[] => [
  { id: 'fhd', name: 'Full HD (16:9)', w: 1920, h: 1080, ratio: '16:9', category: isFr ? 'Écran' : 'Screen' },
  { id: 'hd', name: 'HD (16:9)', w: 1280, h: 720, ratio: '16:9', category: isFr ? 'Écran' : 'Screen' },
  { id: 'square', name: isFr ? 'Carré (1:1)' : 'Square (1:1)', w: 1080, h: 1080, ratio: '1:1', category: 'Social' },
  { id: 'portrait', name: 'Portrait (4:5)', w: 1080, h: 1350, ratio: '4:5', category: 'Social' },
  { id: 'story', name: 'Story / Reel (9:16)', w: 1080, h: 1920, ratio: '9:16', category: 'Social' },
  { id: 'banner', name: isFr ? 'Bannière Web (1.91:1)' : 'Web Banner (1.91:1)', w: 1200, h: 630, ratio: '1.91:1', category: 'Web' },
  { id: 'avatar', name: isFr ? 'Avatar / Profil (1:1)' : 'Avatar / Profile (1:1)', w: 512, h: 512, ratio: '1:1', category: isFr ? 'Profil' : 'Profile' },
  { id: 'thumb', name: isFr ? 'Miniature (3:2)' : 'Thumbnail (3:2)', w: 600, h: 400, ratio: '3:2', category: 'Web' },
];

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

export function calculateVisualScaleFactor(targetW: number, origW: number): number {
  if (origW <= 0 || targetW <= 0) return 1;
  const ratio = targetW / origW;
  if (ratio >= 1) {
    return Math.min(1.12, 1 + Math.log10(ratio) * 0.22);
  } else {
    return Math.max(0.45, Math.sqrt(ratio));
  }
}

export function validateImageFile(file: File, isFr: boolean): string | null {
  const isImage =
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp|avif)$/i.test(file.name);

  if (!isImage) {
    return isFr
      ? 'Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP, AVIF).'
      : 'Please select a valid image file (JPEG, PNG, WebP, AVIF).';
  }

  if (file.size > 50 * 1024 * 1024) {
    return isFr
      ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
      : 'The file exceeds the maximum allowed size of 50 MB.';
  }

  return null;
}

export interface SocialPreset {
  id: string;
  category: 'instagram' | 'youtube' | 'web' | 'twitter' | 'linkedin';
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  { id: 'ig-square', category: 'instagram', name: 'Instagram Carré', width: 1080, height: 1080, aspectRatio: '1:1' },
  { id: 'ig-portrait', category: 'instagram', name: 'Instagram Portrait', width: 1080, height: 1350, aspectRatio: '4:5' },
  { id: 'ig-story', category: 'instagram', name: 'Story / Reel / TikTok', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'yt-thumb', category: 'youtube', name: 'YouTube Miniature', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: 'yt-banner', category: 'youtube', name: 'YouTube Bannière', width: 2560, height: 1440, aspectRatio: '16:9' },
  { id: 'web-fhd', category: 'web', name: 'Web Full HD 1080p', width: 1920, height: 1080, aspectRatio: '16:9' },
  { id: 'web-2k', category: 'web', name: 'Web 2K QHD', width: 2560, height: 1440, aspectRatio: '16:9' },
  { id: 'web-4k', category: 'web', name: 'Web 4K UHD', width: 3840, height: 2160, aspectRatio: '16:9' },
  { id: 'tw-header', category: 'twitter', name: 'X / Twitter Bannière', width: 1500, height: 500, aspectRatio: '3:1' },
  { id: 'tw-post', category: 'twitter', name: 'X / Twitter Post', width: 1200, height: 675, aspectRatio: '16:9' },
];

export function calculateLockedDimensions(
  changedDimension: 'width' | 'height',
  newValue: number,
  origW: number,
  origH: number
): { width: number; height: number } {
  if (origW <= 0 || origH <= 0 || newValue <= 0) {
    return {
      width: changedDimension === 'width' ? newValue : origW,
      height: changedDimension === 'height' ? newValue : origH,
    };
  }

  const ratio = origW / origH;

  if (changedDimension === 'width') {
    return {
      width: newValue,
      height: Math.max(1, Math.round(newValue / ratio)),
    };
  } else {
    return {
      width: Math.max(1, Math.round(newValue * ratio)),
      height: newValue,
    };
  }
}

export function calculatePercentageDimensions(
  origW: number,
  origH: number,
  percentage: number
): { width: number; height: number } {
  const pct = Math.max(1, Math.min(1000, percentage)) / 100;
  return {
    width: Math.max(1, Math.round(origW * pct)),
    height: Math.max(1, Math.round(origH * pct)),
  };
}
