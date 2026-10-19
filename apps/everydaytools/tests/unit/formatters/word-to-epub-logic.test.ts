import { describe, it, expect, vi, beforeEach } from 'vitest';
import mammoth from 'mammoth';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  buildEpubFilename,
  triggerDownload,
  convertWordToEpub,
} from '@/lib/word-to-epub-logic';

describe('word-to-epub-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata with tokenized color', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Word');
      expect(frSource.extension).toBe('docx');
      expect(frSource.icon).toBe('/icons/word.svg');
      expect(frSource.color).toBe('var(--accent, #2563eb)');
      expect(frSource.subLabel).toBe('Format Word (.docx)');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Word Format (.docx)');
    });

    it('returns correct target format metadata with tokenized color', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('EPUB');
      expect(frTarget.extension).toBe('epub');
      expect(frTarget.icon).toBe('/icons/epub.svg');
      expect(frTarget.color).toBe('var(--accent, #65a30d)');
      expect(frTarget.subLabel).toBe('eBook universel');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Universal eBook');
    });
  });

  describe('validateWordFile', () => {
    it('accepts valid docx and doc files under 50MB', () => {
      const docxFile = new File(['PK'], 'manuscript.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(validateWordFile(docxFile, false)).toEqual({ isValid: true });

      const docFile = new File(['DOC'], 'novel.doc', {
        type: 'application/msword',
      });
      expect(validateWordFile(docFile, true)).toEqual({ isValid: true });

      const nameOnlyFile = new File(['PK'], 'book.docx', { type: '' });
      expect(validateWordFile(nameOnlyFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'book.pdf', { type: 'application/pdf' });
      const result = validateWordFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Word (.docx ou .doc)');
      expect(result.errorTitle).toBe('Format non supporté');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validateWordFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
      expect(result.errorTitle).toBe('File too large');
    });
  });

  describe('buildEpubFilename', () => {
    it('replaces word extensions with epub and handles edge cases', () => {
      expect(buildEpubFilename('novel.docx')).toBe('novel.epub');
      expect(buildEpubFilename('draft.doc')).toBe('draft.epub');
      expect(buildEpubFilename('my.story.docx')).toBe('my.story.epub');
      expect(buildEpubFilename('.docx')).toBe('document.epub');
      expect(buildEpubFilename('')).toBe('document.epub');
    });
  });

  describe('triggerDownload', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('creates anchor, triggers download, and delays revokeObjectURL', () => {
      vi.useFakeTimers();
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-epub');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['epub content'], { type: 'application/epub+zip' });
      triggerDownload(blob, 'export.epub');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-epub');
      vi.useRealTimers();
    });
  });

  describe('convertWordToEpub', () => {
    it('converts word document and uses fallback title for nameless files', async () => {
      vi.spyOn(mammoth, 'convertToHtml').mockResolvedValue({ value: '<p>Content</p>', messages: [] });
      vi.spyOn(mammoth, 'extractRawText').mockResolvedValue({ value: 'Content', messages: [] });

      const mockFile = new File(['mock content'], '.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockFile as any).arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));

      const result = await convertWordToEpub(mockFile, true);
      expect(result.filename).toBe('document.epub');
      expect(result.blob).toBeInstanceOf(Blob);
    });
  });
});
