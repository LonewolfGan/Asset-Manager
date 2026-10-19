import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  buildPdfFilename,
  convertHtmlToPdf,
} from '@/lib/html-to-pdf-logic';

describe('html-to-pdf-logic', () => {
  describe('Format descriptors and design tokens', () => {
    it('returns tokenized source format metadata compliant with design system', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('HTML');
      expect(frSource.extension).toBe('html');
      expect(frSource.subLabel).toBe('Document HTML5');
      expect(frSource.color).toBe('var(--accent, #ea580c)');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('HTML5 Document');
      expect(enSource.color).toBe('var(--accent, #ea580c)');
    });

    it('returns tokenized target format metadata compliant with design system', () => {
      const target = getTargetFormat();
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.subLabel).toBe('Adobe Acrobat');
      expect(target.color).toBe('var(--accent, #dc2626)');
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

    it('rejects unsupported file formats with bilingual errors', () => {
      const docxFile = new File(['some text'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const frResult = validateHtmlFile(docxFile, true);
      expect(frResult.isValid).toBe(false);
      expect(frResult.error).toContain('HTML');

      const enResult = validateHtmlFile(docxFile, false);
      expect(enResult.isValid).toBe(false);
      expect(enResult.error).toContain('HTML');
    });

    it('rejects files larger than 2MB with bilingual errors', () => {
      const largeFile = new File([''], 'huge.html', { type: 'text/html' });
      Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 });
      
      const enResult = validateHtmlFile(largeFile, false);
      expect(enResult.isValid).toBe(false);
      expect(enResult.error).toContain('2 MB');

      const frResult = validateHtmlFile(largeFile, true);
      expect(frResult.isValid).toBe(false);
      expect(frResult.error).toContain('2 Mo');
    });

    it('rejects invalid binary files without extension', () => {
      const binFile = new File(['binary'], 'test', { type: 'application/octet-stream' });
      const result = validateHtmlFile(binFile, false);
      expect(result.isValid).toBe(false);
    });
  });

  describe('buildPdfFilename', () => {
    it('replaces html extensions with pdf in upload mode', () => {
      const file = new File([''], 'report.html');
      expect(buildPdfFilename('upload', file, false)).toBe('report.pdf');

      const htmFile = new File([''], 'invoice.htm');
      expect(buildPdfFilename('upload', htmFile, false)).toBe('invoice.pdf');

      const dottedFile = new File([''], 'annual.financial.report.xhtml');
      expect(buildPdfFilename('upload', dottedFile, false)).toBe('annual.financial.report.pdf');
    });

    it('falls back to default name if file in upload mode has no base name', () => {
      const dotOnlyFile = new File([''], '.html');
      expect(buildPdfFilename('upload', dotOnlyFile, false)).toBe('document.pdf');
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
          body: JSON.stringify({ html: '<h1>Raw HTML</h1>' }),
        })
      );
    });

    it('throws error when file is missing in upload mode', async () => {
      await expect(
        convertHtmlToPdf({ mode: 'upload' })
      ).rejects.toThrow('No file provided for upload conversion');
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

    it('executes immediately without artificial setTimeout delays', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['<h1>Test</h1>'], 'test.html', { type: 'text/html' });
      await convertHtmlToPdf({ mode: 'upload', file });
      await convertHtmlToPdf({ mode: 'paste', htmlInput: '<h1>Raw</h1>' });

      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });
  });
});
