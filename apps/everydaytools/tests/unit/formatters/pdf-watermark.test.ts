import { describe, it, expect } from 'vitest';
import {
  getWatermarkPresets,
  isWatermarkVisibleOnPage,
  calcWatermarkFontSize,
  AVAILABLE_ANGLES,
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
});
