import type { ConversionFormat } from '@/components/conversion';

export type WatermarkPattern = 'repeat' | 'single';
export type WatermarkPagesScope = 'all' | 'first';
export type WatermarkAngle = 0 | 45 | -45;

export const BASE_SOURCE_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document source',
};

export const BASE_TARGET_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#FF6B35',
  subLabel: 'Document filigrané',
};

export const PRESET_TEXTS_FR = ['CONFIDENTIEL', 'BROUILLON', 'COPIE', 'SPÉCIMEN', 'URGENT'] as const;
export const PRESET_TEXTS_EN = ['CONFIDENTIAL', 'DRAFT', 'COPY', 'SAMPLE', 'URGENT'] as const;
export const AVAILABLE_ANGLES: WatermarkAngle[] = [0, 45, -45];

/**
 * Returns localized preset watermark words
 */
export function getWatermarkPresets(isFr: boolean): string[] {
  return isFr ? [...PRESET_TEXTS_FR] : [...PRESET_TEXTS_EN];
}

/**
 * Determines if watermark should be shown on the given page
 */
export function isWatermarkVisibleOnPage(
  pagesScope: WatermarkPagesScope,
  previewPage: number
): boolean {
  return pagesScope === 'all' || previewPage === 1;
}

/**
 * Calculates scaled font size for canvas/live preview based on pattern
 */
export function calcWatermarkFontSize(
  baseFontSize: number,
  pattern: WatermarkPattern
): number {
  if (pattern === 'repeat') {
    return Math.max(9, Math.round(baseFontSize * 0.2));
  }
  return Math.max(12, Math.round(baseFontSize * 0.42));
}
