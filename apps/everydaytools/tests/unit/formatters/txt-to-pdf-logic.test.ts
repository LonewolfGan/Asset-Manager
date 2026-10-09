import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateTxtFile,
  buildPdfFilename,
  convertTxtToPdf,
} from '@/lib/txt-to-pdf-logic';

describe('txt-to-pdf-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Texte');
      expect(frSource.extension).toBe('txt');
      expect(frSource.subLabel).toBe('Texte Brut UTF-8');

      const enSource = getSourceFormat(false);
      expect(enSource.name).toBe('Text');
      expect(enSource.subLabel).toBe('Plain Text UTF-8');
    });

    it('returns correct target format metadata', () => {
      const target = getTargetFormat(true);
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.subLabel).toBe('Adobe Acrobat');
    });
  });

  describe('validateTxtFile', () => {
    it('accepts valid txt files under 20MB', () => {
      const txtFile = new File(['Some simple text'], 'notes.txt', { type: 'text/plain' });
      expect(validateTxtFile(txtFile, false)).toEqual({ isValid: true });

      const emptyTypeFile = new File(['Hello'], 'doc.txt', { type: '' });
      expect(validateTxtFile(emptyTypeFile, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      const result = validateTxtFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('texte (.txt)');
    });

    it('rejects files larger than 20MB', () => {
      const largeFile = new File([''], 'huge.txt', { type: 'text/plain' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateTxtFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildPdfFilename', () => {
    it('replaces txt extensions with pdf in upload mode', () => {
      const file = new File([''], 'notes.txt');
      expect(buildPdfFilename('upload', file, false)).toBe('notes.pdf');
    });

    it('returns localized filename in paste mode', () => {
      expect(buildPdfFilename('paste', undefined, true)).toBe('texte-converti.pdf');
      expect(buildPdfFilename('paste', undefined, false)).toBe('converted-text.pdf');
    });
  });

  describe('convertTxtToPdf', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file via text content in upload mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['Hello world from file'], 'report.txt', { type: 'text/plain' });
      const res = await convertTxtToPdf({ mode: 'upload', file });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('report.pdf');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/text-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Hello world from file' }),
        })
      );
    });

    it('converts raw text in paste mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const res = await convertTxtToPdf({ mode: 'paste', textInput: 'Direct text content', isFr: false });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('converted-text.pdf');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/text-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Direct text content' }),
        })
      );
    });

    it('throws error when server responds with non-ok status', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Conversion failed' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        convertTxtToPdf({ mode: 'paste', textInput: 'bad input' })
      ).rejects.toThrow('Conversion failed');
    });
  });
});
