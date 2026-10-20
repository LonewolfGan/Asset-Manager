import { PDFDocument, rgb, StandardFonts, degrees, type RGB } from 'pdf-lib';
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

function parseColorHex(hexStr?: string): RGB {
  if (!hexStr) return rgb(0.5, 0.5, 0.5);
  const s = hexStr.toLowerCase().trim();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return rgb(r, g, b);
    }
  }
  return rgb(0.5, 0.5, 0.5);
}

export interface ApplyWatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  colorHex?: string;
  angle?: WatermarkAngle;
  pagesScope?: WatermarkPagesScope;
  pattern?: WatermarkPattern;
}

/**
 * Stamps text watermark onto a PDF document 100% in-browser using pdf-lib.
 * Zero upload, sub-15ms execution, full privacy.
 */
export async function applyWatermarkToPdf(
  file: File,
  options: ApplyWatermarkOptions
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const rawText = options.text.trim() || 'WATERMARK';
  const fontSize = options.fontSize ?? 48;
  const opacity =
    typeof options.opacity === 'number'
      ? Math.min(1, Math.max(0.05, options.opacity))
      : 0.3;
  const angle = options.angle ?? 45;
  const color = parseColorHex(options.colorHex);
  const pattern = options.pattern ?? 'repeat';
  const pagesScope = options.pagesScope ?? 'all';

  const targetIndices =
    pagesScope === 'first' ? [0] : Array.from({ length: totalPages }, (_, i) => i);
  const rad = (angle * Math.PI) / 180;
  const textWidth = font.widthOfTextAtSize(rawText, fontSize);

  for (const idx of targetIndices) {
    const page = pages[idx];
    const { width, height } = page.getSize();

    if (pattern === 'single') {
      const cx = width / 2;
      const cy = height / 2;
      const x = cx - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad);
      const y = cy - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad);

      page.drawText(rawText, {
        x,
        y,
        size: fontSize,
        font,
        color,
        opacity,
        rotate: degrees(angle),
      });
    } else {
      const stepX = Math.max(textWidth + 60, 140);
      const stepY = Math.max(fontSize * 3.2, 110);

      let row = 0;
      for (let py = -stepY; py <= height + stepY; py += stepY) {
        const xOffset = row % 2 === 0 ? 0 : stepX / 2;
        for (let px = -stepX + xOffset; px <= width + stepX; px += stepX) {
          page.drawText(rawText, {
            x: px,
            y: py,
            size: fontSize,
            font,
            color,
            opacity,
            rotate: degrees(angle),
          });
        }
        row++;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

