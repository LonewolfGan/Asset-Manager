import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getFormatConfigs,
  validatePdfFile,
  buildOutputFilename,
  convertPdfToImages,
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

    it('returns all 6 supported image format configurations', () => {
      const configs = getFormatConfigs(true);
      expect(Object.keys(configs)).toEqual(['png', 'jpeg', 'webp', 'avif', 'tiff', 'gif']);
      expect(configs.png.name).toBe('PNG');
      expect(configs.jpeg.name).toBe('JPG');
      expect(configs.webp.name).toBe('WEBP');
      expect(configs.avif.name).toBe('AVIF');
      expect(configs.tiff.name).toBe('TIFF');
      expect(configs.gif.name).toBe('GIF');
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

  describe('convertPdfToImages', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts pdf to zip when multiple pages are returned', async () => {
      const mockZipBlob = new Blob(['PK\x03\x04'], { type: 'application/zip' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockZipBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'book.pdf', { type: 'application/pdf' });
      const res = await convertPdfToImages(file, 'png');

      expect(res.blob).toBe(mockZipBlob);
      expect(res.isZip).toBe(true);
      expect(res.filename).toBe('book_png_images.zip');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/pdf-to-images'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('converts pdf to single image when single image is returned', async () => {
      const mockImgBlob = new Blob(['image-bytes'], { type: 'image/png' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockImgBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'single.pdf', { type: 'application/pdf' });
      const res = await convertPdfToImages(file, 'png');

      expect(res.blob).toBe(mockImgBlob);
      expect(res.isZip).toBe(false);
      expect(res.filename).toBe('single_page_1.png');
    });

    it('throws error when server responds with non-ok status', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Conversion engine crashed' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['%PDF'], 'broken.pdf', { type: 'application/pdf' });
      await expect(convertPdfToImages(file, 'png')).rejects.toThrow('Conversion engine crashed');
    });
  });
});
