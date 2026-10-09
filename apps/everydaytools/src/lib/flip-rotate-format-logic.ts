import type { ConversionFormat } from '@/components/conversion';
import { normalizeRotation } from '@/lib/flip-rotate-logic';

export const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'png',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'PNG, JPEG, WebP, AVIF, TIFF',
};

export type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export const FORMAT_OPTIONS: { label: string; value: OutputFormat; ext: string }[] = [
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPEG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
];

export function resolveDefaultOutputFormat(mimeType: string): OutputFormat {
  if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
    return mimeType;
  }
  return 'image/png';
}

export function calcManualRotationDelta(
  startRotation: number,
  startPointerAngle: number,
  currentPointerAngle: number,
  isShiftKey: boolean
): number {
  const delta = currentPointerAngle - startPointerAngle;
  let raw = startRotation + delta;
  let normalized = Math.round(raw);

  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;

  if (isShiftKey) {
    normalized = Math.round(normalized / 15) * 15;
  }

  return normalized;
}

export function buildFlipRotateFormData(
  file: File,
  rotation: number,
  flipH: boolean,
  flipV: boolean,
  outputFormat: OutputFormat
): FormData {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('rotation', String(Math.round(normalizeRotation(rotation))));
  fd.append('flipH', String(flipH));
  fd.append('flipV', String(flipV));
  fd.append('outputFormat', outputFormat);
  return fd;
}
