import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  buildPdfFilename,
  convertHtmlToPdf,
} from '@/lib/html-to-pdf-logic';

describe('html-to-pdf-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('HTML');
      expect(frSource.extension).toBe('html');
      expect(frSource.subLabel).toBe('Document HTML5');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('HTML5 Document');
    });

    it('returns correct target format metadata', () => {
      const target = getTargetFormat();
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.subLabel).toBe('Adobe Acrobat');
    });
  });

  describe('validateHtmlFile', () => {
    it('accepts valid html, htm, and xhtml files under 20MB', () => {
      const htmlFile = new File(['<h1>Test</h1>'], 'test.html', { type: 'text/html' });
      expect(validateHtmlFile(htmlFile, false)).toEqual({ isValid: true });

      const htmFile = new File(['<p>Test</p>'], 'test.htm', { type: 'text/html' });
      expect(validateHtmlFile(htmFile, true)).toEqual({ isValid: true });

      const xhtmlFile = new File(['<div>Test</div>'], 'test.xhtml', { type: 'application/xhtml+xml' });
      expect(validateHtmlFile(xhtmlFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const txtFile = new File(['some text'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const result = validateHtmlFile(txtFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('HTML');
    });

    it('rejects files larger than 20MB', () => {
      const largeFile = new File([''], 'huge.html', { type: 'text/html' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateHtmlFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildPdfFilename', () => {
    it('replaces html extensions with pdf in upload mode', () => {
      const file = new File([''], 'report.html');
      expect(buildPdfFilename('upload', file, false)).toBe('report.pdf');

      const htmFile = new File([''], 'invoice.htm');
      expect(buildPdfFilename('upload', htmFile, false)).toBe('invoice.pdf');
    });

    it('returns localized filenames in paste mode', () => {
      expect(buildPdfFilename('paste', undefined, true)).toBe('document-web.pdf');
      expect(buildPdfFilename('paste', undefined, false)).toBe('web-document.pdf');
    });
  });

  describe('convertHtmlToPdf', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file via FormData in upload mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['<h1>Test</h1>'], 'test.html', { type: 'text/html' });
      const blob = await convertHtmlToPdf({ mode: 'upload', file });

      expect(blob).toBe(mockBlob);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/html-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('converts raw HTML via JSON in paste mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const blob = await convertHtmlToPdf({ mode: 'paste', htmlInput: '<h1>Raw HTML</h1>' });

      expect(blob).toBe(mockBlob);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/html-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: '<h1>Raw HTML' + '</h1>' }),
        })
      );
    });

    it('throws error when server responds with non-ok status', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Rendering engine failed' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        convertHtmlToPdf({ mode: 'paste', htmlInput: '<p>fail</p>' })
      ).rejects.toThrow('Rendering engine failed');
    });
  });
});
