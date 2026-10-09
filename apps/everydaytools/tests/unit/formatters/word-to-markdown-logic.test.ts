import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  buildMarkdownFilename,
  convertWordToMarkdown,
  triggerDownload,
} from '@/lib/word-to-markdown-logic';

describe('word-to-markdown-logic', () => {
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
      expect(targetFr.name).toBe('Markdown');
      expect(targetFr.extension).toBe('md');
      expect(targetFr.icon).toBe('/icons/markdown.svg');
      expect(targetFr.color).toBe('#0284C7');
      expect(targetFr.subLabel).toBe('Syntaxe Markdown');

      const targetEn = getTargetFormat(false);
      expect(targetEn.subLabel).toBe('Markdown Syntax');
    });
  });

  describe('buildMarkdownFilename', () => {
    it('replaces .docx or .doc with .md', () => {
      expect(buildMarkdownFilename('readme.docx')).toBe('readme.md');
      expect(buildMarkdownFilename('NOTES.DOC')).toBe('NOTES.md');
      expect(buildMarkdownFilename('my.article.docx')).toBe('my.article.md');
    });
  });

  describe('validateWordFile', () => {
    it('accepts valid docx and doc files under 30MB', () => {
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

    it('rejects files larger than 30MB', () => {
      const large = new File(['mock'], 'big.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      Object.defineProperty(large, 'size', { value: 35 * 1024 * 1024 });

      const frRes = validateWordFile(large, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
      expect(frRes.errorDesc).toContain('30 Mo');

      const enRes = validateWordFile(large, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');
      expect(enRes.errorDesc).toContain('30 MB');
    });
  });

  describe('convertWordToMarkdown', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts word file to markdown result object', async () => {
      const mockFile = new File(['word content'], 'article.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        text: async () => '# Article Title\n\nHello world in markdown',
      } as Response);

      const result = await convertWordToMarkdown(mockFile, { isFr: false });

      expect(result.filename).toBe('article.md');
      expect(result.textOutput).toBe('# Article Title\n\nHello world in markdown');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws server error message if response is not ok', async () => {
      const mockFile = new File(['bad'], 'corrupted.docx', { type: 'application/msword' });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Corrupt docx file' }),
      } as Response);

      await expect(
        convertWordToMarkdown(mockFile, { isFr: true })
      ).rejects.toThrow('Corrupt docx file');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor and clicks it to trigger download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-md');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['# Heading'], { type: 'text/markdown' });
      triggerDownload(blob, 'export.md');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-md');
    });
  });
});
