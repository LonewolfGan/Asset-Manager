import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  buildHtmlFilename,
  convertWordToHtml,
  triggerDownload,
} from '@/lib/word-to-html-logic';

describe('word-to-html-logic', () => {
  describe('Format descriptors', () => {
    it('returns valid source format metadata', () => {
      const sourceFr = getSourceFormat(true);
      expect(sourceFr.name).toBe('Word');
      expect(sourceFr.extension).toBe('docx');
      expect(sourceFr.icon).toBe('/icons/word.svg');
      expect(sourceFr.color).toBe('#185ABD');
      expect(sourceFr.subLabel).toBe('Format Word (.docx)');

      const sourceEn = getSourceFormat(false);
      expect(sourceEn.subLabel).toBe('Word Format (.docx)');
    });

    it('returns valid target format metadata', () => {
      const targetFr = getTargetFormat(true);
      expect(targetFr.name).toBe('HTML');
      expect(targetFr.extension).toBe('html');
      expect(targetFr.icon).toBe('/icons/html.svg');
      expect(targetFr.color).toBe('#E34F26');
      expect(targetFr.subLabel).toBe('Code Web HTML5');

      const targetEn = getTargetFormat(false);
      expect(targetEn.subLabel).toBe('HTML5 Web Code');
    });
  });

  describe('buildHtmlFilename', () => {
    it('replaces .docx or .doc with .html', () => {
      expect(buildHtmlFilename('report.docx')).toBe('report.html');
      expect(buildHtmlFilename('DOCUMENT.DOC')).toBe('DOCUMENT.html');
      expect(buildHtmlFilename('my.notes.docx')).toBe('my.notes.html');
    });
  });

  describe('validateWordFile', () => {
    it('accepts valid docx and doc files under 50MB', () => {
      const docx = new File(['mock'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(validateWordFile(docx, false)).toEqual({ isValid: true });

      const doc = new File(['mock'], 'test.doc', {
        type: 'application/msword',
      });
      expect(validateWordFile(doc, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdf = new File(['%PDF'], 'document.pdf', { type: 'application/pdf' });
      const frRes = validateWordFile(pdf, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Format non supporté');
      expect(frRes.errorDesc).toContain('Word');

      const enRes = validateWordFile(pdf, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('Unsupported format');
    });

    it('rejects files larger than 50MB', () => {
      const large = new File(['mock'], 'big.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      Object.defineProperty(large, 'size', { value: 55 * 1024 * 1024 });

      const frRes = validateWordFile(large, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
      expect(frRes.errorDesc).toContain('50 Mo');

      const enRes = validateWordFile(large, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');
      expect(enRes.errorDesc).toContain('50 MB');
    });
  });

  describe('convertWordToHtml', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts word file to html result object', async () => {
      const mockFile = new File(['word content'], 'article.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ html: '<article><h1>Title</h1><p>Hello world</p></article>' }),
      } as Response);

      const result = await convertWordToHtml(mockFile, { isFr: false });

      expect(result.filename).toBe('article.html');
      expect(result.textOutput).toBe('<article><h1>Title</h1><p>Hello world</p></article>');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws server error message if response is not ok', async () => {
      const mockFile = new File(['bad'], 'corrupted.docx', { type: 'application/msword' });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Unable to parse document' }),
      } as Response);

      await expect(
        convertWordToHtml(mockFile, { isFr: true })
      ).rejects.toThrow('Unable to parse document');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor and clicks it to trigger download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-html');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['<h1>Hi</h1>'], { type: 'text/html' });
      triggerDownload(blob, 'export.html');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-html');
    });
  });
});
