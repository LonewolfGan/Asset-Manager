import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getEpubSourceFormat,
  getWordTargetFormat,
  getPdfTargetFormat,
  validateEpubFile,
  convertEpub,
  triggerDownload,
} from '@/lib/epub-converter-logic';

describe('epub-converter-logic [TDD-Lock ECC]', () => {
  describe('Format descriptors', () => {
    it('returns correct source EPUB format metadata with tokenized color', () => {
      const frSource = getEpubSourceFormat(true);
      expect(frSource.name).toBe('EPUB');
      expect(frSource.extension).toBe('epub');
      expect(frSource.icon).toBe('/icons/epub.svg');
      expect(frSource.color).toBe('var(--accent, #8b5cf6)');
      expect(frSource.subLabel).toBe('Livre Numérique (.epub)');

      const enSource = getEpubSourceFormat(false);
      expect(enSource.subLabel).toBe('Digital E-Book (.epub)');
    });

    it('returns correct target Word format metadata with tokenized color', () => {
      const frTarget = getWordTargetFormat(true);
      expect(frTarget.name).toBe('Word');
      expect(frTarget.extension).toBe('docx');
      expect(frTarget.icon).toBe('/icons/word.svg');
      expect(frTarget.color).toBe('var(--accent, #2563eb)');
      expect(frTarget.subLabel).toBe('Format Word (.docx)');

      const enTarget = getWordTargetFormat(false);
      expect(enTarget.subLabel).toBe('Word Format (.docx)');
    });

    it('returns correct target PDF format metadata with tokenized color', () => {
      const frTarget = getPdfTargetFormat(true);
      expect(frTarget.name).toBe('PDF');
      expect(frTarget.extension).toBe('pdf');
      expect(frTarget.icon).toBe('/icons/pdf.svg');
      expect(frTarget.color).toBe('var(--accent, #dc2626)');
      expect(frTarget.subLabel).toBe('Document PDF (.pdf)');

      const enTarget = getPdfTargetFormat(false);
      expect(enTarget.subLabel).toBe('PDF Document (.pdf)');
    });
  });

  describe('validateEpubFile', () => {
    it('accepts valid EPUB files under 50MB', () => {
      const epubFile = new File(['PK'], 'book.epub', {
        type: 'application/epub+zip',
      });
      expect(validateEpubFile(epubFile, false)).toEqual({ isValid: true });

      const nameOnlyFile = new File(['PK'], 'manual.EPUB', { type: '' });
      expect(validateEpubFile(nameOnlyFile, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'book.pdf', { type: 'application/pdf' });
      const result = validateEpubFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.errorTitle).toBe('Format non supporté');
      expect(result.errorDesc).toContain('EPUB (.epub)');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.epub', {
        type: 'application/epub+zip',
      });
      Object.defineProperty(largeFile, 'size', { value: 55 * 1024 * 1024 });
      const result = validateEpubFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.errorTitle).toBe('File too large');
      expect(result.errorDesc).toContain('50 MB');
    });
  });

  describe('convertEpub', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts EPUB to Word docx successfully without artificial delay or invoking setTimeout', async () => {
      const mockFile = new File(['epub binary'], 'novel.epub', {
        type: 'application/epub+zip',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['docx binary'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      } as Response);
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const result = await convertEpub(mockFile, 'docx', { isFr: false });
      expect(result.filename).toBe('novel.docx');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('throws server error message if response is not ok', async () => {
      const mockFile = new File(['bad'], 'corrupted.epub', { type: 'application/epub+zip' });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid EPUB archive structure' }),
      } as Response);

      await expect(
        convertEpub(mockFile, 'docx', { isFr: true })
      ).rejects.toThrow('Invalid EPUB archive structure');
    });
  });

  describe('triggerDownload', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('delegates to downloadBlob and delays revokeObjectURL', () => {
      vi.useFakeTimers();
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-docx');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      triggerDownload(blob, 'export.docx');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-docx');
      vi.useRealTimers();
    });
  });
});
