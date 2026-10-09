import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  buildHtmlFilename,
  convertPdfToHtml,
  triggerDownload,
} from '@/lib/pdf-to-html-logic';

describe('pdf-to-html-logic', () => {
  describe('Format descriptors', () => {
    it('returns valid source format metadata', () => {
      const sourceFr = getSourceFormat(true);
      expect(sourceFr.name).toBe('PDF');
      expect(sourceFr.extension).toBe('pdf');
      expect(sourceFr.icon).toBe('/icons/pdf.svg');
      expect(sourceFr.color).toBe('#EC1C24');
      expect(sourceFr.subLabel).toBe('Document Adobe Acrobat');

      const sourceEn = getSourceFormat(false);
      expect(sourceEn.subLabel).toBe('Adobe Acrobat Document');
    });

    it('returns valid target format metadata', () => {
      const targetFr = getTargetFormat(true);
      expect(targetFr.name).toBe('HTML');
      expect(targetFr.extension).toBe('html');
      expect(targetFr.icon).toBe('/icons/html.svg');
      expect(targetFr.color).toBe('#E34F26');
      expect(targetFr.subLabel).toBe('Page web HTML5');

      const targetEn = getTargetFormat(false);
      expect(targetEn.subLabel).toBe('HTML5 Webpage');
    });
  });

  describe('buildHtmlFilename', () => {
    it('replaces extension with .html', () => {
      expect(buildHtmlFilename('document.pdf')).toBe('document.html');
      expect(buildHtmlFilename('REPORT.PDF')).toBe('REPORT.html');
      expect(buildHtmlFilename('my.resume.pdf')).toBe('my.resume.html');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid pdf files under 50MB', () => {
      const pdf = new File(['%PDF-1.4 content'], 'document.pdf', {
        type: 'application/pdf',
      });
      expect(validatePdfFile(pdf, false)).toEqual({ isValid: true });

      const nameOnlyPdf = new File(['%PDF'], 'invoice.pdf', { type: '' });
      expect(validatePdfFile(nameOnlyPdf, true)).toEqual({ isValid: true });
    });

    it('rejects non-pdf files with localized errors', () => {
      const docx = new File(['PK'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const frRes = validatePdfFile(docx, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Format non supporté');
      expect(frRes.errorDesc).toContain('PDF');

      const enRes = validatePdfFile(docx, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('Unsupported format');
    });

    it('rejects files larger than 50MB', () => {
      const large = new File(['big pdf'], 'big.pdf', { type: 'application/pdf' });
      Object.defineProperty(large, 'size', { value: 51 * 1024 * 1024 });

      const frRes = validatePdfFile(large, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
      expect(frRes.errorDesc).toContain('50 Mo');

      const enRes = validatePdfFile(large, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');
      expect(enRes.errorDesc).toContain('50 MB');
    });
  });

  describe('convertPdfToHtml', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts pdf to html result object', async () => {
      const mockFile = new File(['%PDF mock content'], 'doc.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        text: async () => '<!DOCTYPE html><html><body><h1>Document</h1></body></html>',
      } as Response);

      const result = await convertPdfToHtml(mockFile, { isFr: false });

      expect(result.filename).toBe('doc.html');
      expect(result.htmlOutput).toBe(
        '<!DOCTYPE html><html><body><h1>Document</h1></body></html>'
      );
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws server error message if response is not ok', async () => {
      const mockFile = new File(['corrupted'], 'corrupt.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Corrupt PDF file' }),
      } as Response);

      await expect(
        convertPdfToHtml(mockFile, { isFr: true })
      ).rejects.toThrow('Corrupt PDF file');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor and triggers click for download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-html');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['<html></html>'], { type: 'text/html' });
      triggerDownload(blob, 'export.html');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-html');
    });
  });
});
