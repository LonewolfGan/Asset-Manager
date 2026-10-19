import { describe, it, expect, vi, beforeEach } from 'vitest';
import mammoth from 'mammoth';
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
      expect(sourceFr.color).toBe('var(--accent, #2563eb)');
      expect(sourceFr.subLabel).toBe('Format Word (.docx)');

      const sourceEn = getSourceFormat(false);
      expect(sourceEn.subLabel).toBe('Word Format (.docx)');
    });

    it('returns valid target format metadata', () => {
      const targetFr = getTargetFormat(true);
      expect(targetFr.name).toBe('Markdown');
      expect(targetFr.extension).toBe('md');
      expect(targetFr.icon).toBe('/icons/markdown.svg');
      expect(targetFr.color).toBe('var(--accent, #0284c7)');
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
      expect(buildMarkdownFilename('.docx')).toBe('document.md');
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

    it('converts docx to markdown in-browser via mammoth and turndown without network calls or timer delays', async () => {
      const mockFile = new File(['word content'], 'article.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const fakeBuffer = new ArrayBuffer(16);
      vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(fakeBuffer);

      const convertSpy = vi.spyOn(mammoth, 'convertToHtml').mockResolvedValue({
        value: '<h1>Article Title</h1><p>Hello world in markdown</p>',
        messages: [],
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const result = await convertWordToMarkdown(mockFile, { isFr: false });

      expect(convertSpy).toHaveBeenCalledWith(
        { arrayBuffer: fakeBuffer },
        expect.objectContaining({ convertImage: expect.any(Function) })
      );
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(result.filename).toBe('article.md');
      expect(result.textOutput).toBe('# Article Title\n\nHello world in markdown');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBe(new Blob(['# Article Title\n\nHello world in markdown']).size);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('text/markdown;charset=utf-8');
    });

    it('configures mammoth image converter to transform embedded images to base64 data URLs', async () => {
      const mockFile = new File(['mock docx'], 'doc-images.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(new ArrayBuffer(8));

      let imageConverterFn: any = null;
      vi.spyOn(mammoth, 'convertToHtml').mockImplementation(async (_input, options: any) => {
        imageConverterFn = options?.convertImage;
        return { value: '<p>document with image</p>', messages: [] };
      });

      await convertWordToMarkdown(mockFile, { isFr: false });

      expect(typeof imageConverterFn).toBe('function');

      const fakeElement = {
        contentType: 'image/png',
        read: vi.fn().mockResolvedValue('iVBORw0KGgoAAAANSUhEUgAA'),
      };
      const convertedImage = await imageConverterFn(fakeElement);
      expect(fakeElement.read).toHaveBeenCalledWith('base64');
      expect(convertedImage[0].tag.attributes).toEqual({
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA',
      });
    });

    it('handles in-browser conversion failure with localized error message', async () => {
      const mockFile = new File(['corrupted content'], 'broken.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(new ArrayBuffer(8));
      vi.spyOn(mammoth, 'convertToHtml').mockRejectedValue(new Error('Corrupt zip archive'));

      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      await expect(convertWordToMarkdown(mockFile, { isFr: true })).rejects.toThrow(
        'Corrupt zip archive'
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('falls back to custom errorFallback or localized default if mammoth rejects without message', async () => {
      const mockFile = new File(['bad'], 'test.docx');
      vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(new ArrayBuffer(4));
      vi.spyOn(mammoth, 'convertToHtml').mockRejectedValue('Unknown raw failure');

      await expect(
        convertWordToMarkdown(mockFile, { isFr: true, errorFallback: 'Erreur personnalisée' })
      ).rejects.toThrow('Erreur personnalisée');

      await expect(
        convertWordToMarkdown(mockFile, { isFr: false })
      ).rejects.toThrow('Failed to convert to Markdown. Please try again.');

      await expect(
        convertWordToMarkdown(mockFile, { isFr: true })
      ).rejects.toThrow('Échec de la conversion en Markdown. Veuillez réessayer.');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor, clicks it, and revokes object URL with delay', () => {
      vi.useFakeTimers();
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
      expect(revokeObjectURLMock).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-md');
      vi.useRealTimers();
    });
  });
});
