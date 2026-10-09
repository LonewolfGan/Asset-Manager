import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  getSupportedLanguages,
  validatePdfOcrFile,
  buildPdfOcrFilename,
  calculateOcrStats,
  performPdfOcr,
} from '@/lib/pdf-ocr-logic';

describe('pdf-ocr-logic', () => {
  describe('Format descriptors and languages', () => {
    it('returns valid source and target formats', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('PDF');
      expect(frSource.subLabel).toBe('Document PDF scanné');

      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('Texte');
      expect(frTarget.extension).toBe('txt');

      const enTarget = getTargetFormat(false);
      expect(enTarget.name).toBe('Text');
    });

    it('returns supported languages list with default labels', () => {
      const langs = getSupportedLanguages(true);
      expect(langs.length).toBeGreaterThanOrEqual(5);
      expect(langs.some((l) => l.code === 'eng+fra')).toBe(true);
      expect(langs.some((l) => l.code === 'fra')).toBe(true);
    });
  });

  describe('validatePdfOcrFile', () => {
    it('accepts valid PDF files under 50MB', () => {
      const pdfFile = new File(['%PDF-1.5'], 'document.pdf', { type: 'application/pdf' });
      expect(validatePdfOcrFile(pdfFile, false)).toEqual({ isValid: true });
    });

    it('rejects non-PDF files', () => {
      const imageFile = new File(['image'], 'scan.png', { type: 'image/png' });
      const result = validatePdfOcrFile(imageFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('PDF');
    });

    it('rejects files exceeding 50MB', () => {
      const largeFile = new File([''], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validatePdfOcrFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('buildPdfOcrFilename', () => {
    it('generates localized text filenames based on original PDF name', () => {
      expect(buildPdfOcrFilename('rapport_annuel.pdf', true)).toBe('rapport_annuel_texte.txt');
      expect(buildPdfOcrFilename('annual_report.pdf', false)).toBe('annual_report_text.txt');
      expect(buildPdfOcrFilename('scan', true)).toBe('scan_texte.txt');
    });
  });

  describe('calculateOcrStats', () => {
    it('calculates correct word and character counts', () => {
      const stats = calculateOcrStats('Reconnaissance optique de caractères 2026');
      expect(stats.wordCount).toBe(5);
      expect(stats.charCount).toBe(41);
    });

    it('handles empty text', () => {
      const stats = calculateOcrStats('   ');
      expect(stats.wordCount).toBe(0);
      expect(stats.charCount).toBe(0);
    });
  });

  describe('performPdfOcr', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('sends file and language to endpoint and returns extracted text', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          text: 'Extracted text sample',
          totalPages: 2,
        }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      const result = await performPdfOcr(file, 'fra', false);

      expect(result.text).toBe('Extracted text sample');
      expect(result.totalPages).toBe(2);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/pdf-ocr'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('throws error when server responds with non-ok status', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'OCR engine timeout' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      await expect(performPdfOcr(file, 'eng', false)).rejects.toThrow('OCR engine timeout');
    });

    it('throws error when no text could be extracted', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ text: '   ' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      await expect(performPdfOcr(file, 'eng', true)).rejects.toThrow('Aucun texte');
    });
  });
});
