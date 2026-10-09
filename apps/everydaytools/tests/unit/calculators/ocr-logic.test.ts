import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  getSupportedLanguages,
  validateImageFile,
  buildOcrFilename,
  calculateOcrStats,
} from '@/lib/ocr-logic';

describe('ocr-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Image');
      expect(frSource.subLabel).toContain('JPG, PNG');

      const enSource = getSourceFormat(false);
      expect(enSource.name).toBe('Image');
    });

    it('returns correct target format metadata', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('Texte');
      expect(frTarget.extension).toBe('txt');
      expect(frTarget.subLabel).toContain('brut');

      const enTarget = getTargetFormat(false);
      expect(enTarget.name).toBe('Text');
      expect(enTarget.subLabel).toContain('Extracted');
    });
  });

  describe('Supported languages', () => {
    it('returns 7 languages with proper translations', () => {
      const frLangs = getSupportedLanguages(true);
      expect(frLangs).toHaveLength(7);
      expect(frLangs[0].code).toBe('fra+eng');
      expect(frLangs[0].label).toContain('Français');

      const enLangs = getSupportedLanguages(false);
      expect(enLangs[0].label).toContain('French');
    });
  });

  describe('validateImageFile', () => {
    it('accepts valid image formats under 20MB', () => {
      const pngFile = new File([''], 'scan.png', { type: 'image/png' });
      expect(validateImageFile(pngFile, false)).toEqual({ isValid: true });

      const jpgFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(jpgFile, true)).toEqual({ isValid: true });

      const webpFile = new File([''], 'image.webp', { type: 'image/webp' });
      expect(validateImageFile(webpFile, false)).toEqual({ isValid: true });
    });

    it('rejects non-image formats', () => {
      const pdfFile = new File(['%PDF'], 'document.pdf', { type: 'application/pdf' });
      const result = validateImageFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('image valide');
    });

    it('rejects images larger than 20MB', () => {
      const largeFile = new File([''], 'huge.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateImageFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildOcrFilename', () => {
    it('builds localized txt output filename', () => {
      expect(buildOcrFilename('scan.png', true)).toBe('scan_texte.txt');
      expect(buildOcrFilename('invoice.jpeg', false)).toBe('invoice_text.txt');
      expect(buildOcrFilename('', true)).toBe('ocr_extracted_texte.txt');
    });
  });

  describe('calculateOcrStats', () => {
    it('calculates word and character counts correctly', () => {
      const stats = calculateOcrStats('Hello world from EverydayTools OCR');
      expect(stats.wordCount).toBe(5);
      expect(stats.charCount).toBe(34);
    });

    it('handles empty or whitespace strings', () => {
      const stats = calculateOcrStats('   \n  \t ');
      expect(stats.wordCount).toBe(0);
      expect(stats.charCount).toBe(8);
    });
  });
});
