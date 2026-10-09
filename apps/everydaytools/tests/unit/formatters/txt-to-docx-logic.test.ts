import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateTxtFile,
  buildDocxFilename,
  convertTxtToDocx,
} from '@/lib/txt-to-docx-logic';

describe('txt-to-docx-logic', () => {
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
      expect(target.name).toBe('Word');
      expect(target.extension).toBe('docx');
      expect(target.subLabel).toBe('Microsoft Word');
    });
  });

  describe('validateTxtFile', () => {
    it('accepts valid txt files under 10MB', () => {
      const txtFile = new File(['Some notes'], 'notes.txt', { type: 'text/plain' });
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

    it('rejects files larger than 10MB', () => {
      const largeFile = new File([''], 'huge.txt', { type: 'text/plain' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      const result = validateTxtFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10 MB');
    });
  });

  describe('buildDocxFilename', () => {
    it('replaces txt extensions with docx in upload mode', () => {
      const file = new File([''], 'notes.txt');
      expect(buildDocxFilename('upload', file, false)).toBe('notes.docx');
    });

    it('returns localized filename in paste mode', () => {
      expect(buildDocxFilename('paste', undefined, true)).toBe('texte-saisi.docx');
      expect(buildDocxFilename('paste', undefined, false)).toBe('pasted-text.docx');
    });
  });

  describe('convertTxtToDocx', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file via FormData in upload mode', async () => {
      const mockBlob = new Blob(['PK\x03\x04'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['Hello world from file'], 'report.txt', { type: 'text/plain' });
      const res = await convertTxtToDocx({ mode: 'upload', file });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('report.docx');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/txt-to-docx'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('converts raw text in paste mode', async () => {
      const mockBlob = new Blob(['PK\x03\x04'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const res = await convertTxtToDocx({ mode: 'paste', textInput: 'Direct text content', isFr: false });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('pasted-text.docx');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/txt-to-docx'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
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
        convertTxtToDocx({ mode: 'paste', textInput: 'bad input' })
      ).rejects.toThrow('Conversion failed');
    });
  });
});
