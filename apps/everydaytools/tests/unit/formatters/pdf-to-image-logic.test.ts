import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getFormatConfigs,
  validatePdfFile,
  buildOutputFilename,
} from '@/lib/pdf-to-image-logic';

describe('pdf-to-image-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('PDF');
      expect(frSource.extension).toBe('pdf');
      expect(frSource.subLabel).toBe('Document source');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Source document');
    });

    it('returns all 3 supported image format configurations (PNG, JPG, WEBP)', () => {
      const configs = getFormatConfigs(true);
      expect(Object.keys(configs)).toEqual(['png', 'jpeg', 'webp']);
      expect(configs.png.name).toBe('PNG');
      expect(configs.jpeg.name).toBe('JPG');
      expect(configs.webp.name).toBe('WEBP');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid pdf files under 50MB', () => {
      const pdfFile = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' });
      expect(validatePdfFile(pdfFile, false)).toEqual({ isValid: true });

      const nameOnlyPdf = new File(['%PDF'], 'presentation.pdf', { type: '' });
      expect(validatePdfFile(nameOnlyPdf, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const imgFile = new File([''], 'test.png', { type: 'image/png' });
      const result = validatePdfFile(imgFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('PDF valide');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validatePdfFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('buildOutputFilename', () => {
    it('builds zip filename for multi-page zip responses', () => {
      expect(buildOutputFilename('manual.pdf', 'png', true)).toBe('manual_png_images.zip');
      expect(buildOutputFilename('report.pdf', 'jpeg', true)).toBe('report_jpg_images.zip');
    });

    it('builds single image filename for single-page image responses', () => {
      expect(buildOutputFilename('slide.pdf', 'webp', false)).toBe('slide_page_1.webp');
      expect(buildOutputFilename('contract.pdf', 'jpeg', false)).toBe('contract_page_1.jpg');
    });
  });
});
