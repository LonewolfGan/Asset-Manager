import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  getWatermarkPresets,
  isWatermarkVisibleOnPage,
  calcWatermarkFontSize,
  AVAILABLE_ANGLES,
  applyWatermarkToPdf,
} from '@/lib/pdf-watermark-logic';

describe('PDF Watermark Logic', () => {
  describe('getWatermarkPresets', () => {
    it('returns French preset texts when isFr is true', () => {
      const presets = getWatermarkPresets(true);
      expect(presets).toContain('CONFIDENTIEL');
      expect(presets).toContain('BROUILLON');
      expect(presets).toContain('COPIE');
      expect(presets).toContain('SPÉCIMEN');
      expect(presets).toContain('URGENT');
    });

    it('returns English preset texts when isFr is false', () => {
      const presets = getWatermarkPresets(false);
      expect(presets).toContain('CONFIDENTIAL');
      expect(presets).toContain('DRAFT');
      expect(presets).toContain('COPY');
      expect(presets).toContain('SAMPLE');
      expect(presets).toContain('URGENT');
    });
  });

  describe('isWatermarkVisibleOnPage', () => {
    it('is visible on all pages when pagesScope is all', () => {
      expect(isWatermarkVisibleOnPage('all', 1)).toBe(true);
      expect(isWatermarkVisibleOnPage('all', 2)).toBe(true);
      expect(isWatermarkVisibleOnPage('all', 10)).toBe(true);
    });

    it('is only visible on page 1 when pagesScope is first', () => {
      expect(isWatermarkVisibleOnPage('first', 1)).toBe(true);
      expect(isWatermarkVisibleOnPage('first', 2)).toBe(false);
      expect(isWatermarkVisibleOnPage('first', 5)).toBe(false);
    });
  });

  describe('calcWatermarkFontSize', () => {
    it('scales font size for repeat pattern with lower bound', () => {
      const size1 = calcWatermarkFontSize(48, 'repeat');
      expect(size1).toBe(Math.max(9, Math.round(48 * 0.2)));

      const sizeLow = calcWatermarkFontSize(16, 'repeat');
      expect(sizeLow).toBe(9); // 16 * 0.2 = 3.2, clamped to 9
    });

    it('scales font size for single centered pattern with lower bound', () => {
      const size1 = calcWatermarkFontSize(48, 'single');
      expect(size1).toBe(Math.max(12, Math.round(48 * 0.42)));

      const sizeLow = calcWatermarkFontSize(16, 'single');
      expect(sizeLow).toBe(12); // 16 * 0.42 = 6.72, clamped to 12
    });
  });

  describe('AVAILABLE_ANGLES', () => {
    it('contains standard 0, 45, and -45 degrees', () => {
      expect(AVAILABLE_ANGLES).toEqual([0, 45, -45]);
    });
  });

  describe('applyWatermarkToPdf (In-Browser TDD RED)', () => {
    async function createTestPdf(pageCount: number): Promise<File> {
      const doc = await PDFDocument.create();
      for (let i = 0; i < pageCount; i++) {
        doc.addPage([595, 842]);
      }
      const bytes = await doc.save();
      return new File([bytes], 'source.pdf', { type: 'application/pdf' });
    }

    it('applies single centered watermark to PDF pages and returns valid Blob', async () => {
      const file = await createTestPdf(2);
      const blob = await applyWatermarkToPdf(file, {
        text: 'CONFIDENTIAL',
        fontSize: 48,
        opacity: 0.3,
        colorHex: '#888888',
        angle: 45,
        pagesScope: 'all',
        pattern: 'single',
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');

      const stampedDoc = await PDFDocument.load(await blob.arrayBuffer());
      expect(stampedDoc.getPageCount()).toBe(2);
    });

    it('applies repeat watermark only to first page when pagesScope is first', async () => {
      const file = await createTestPdf(3);
      const blob = await applyWatermarkToPdf(file, {
        text: 'SAMPLE',
        fontSize: 32,
        opacity: 0.2,
        colorHex: '#EC1C24',
        angle: -45,
        pagesScope: 'first',
        pattern: 'repeat',
      });

      expect(blob).toBeInstanceOf(Blob);
      const stampedDoc = await PDFDocument.load(await blob.arrayBuffer());
      expect(stampedDoc.getPageCount()).toBe(3);
    });
  });
});

