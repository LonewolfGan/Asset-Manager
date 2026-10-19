import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  buildMarkdownFilename,
  convertPdfToMarkdown,
  triggerDownload,
} from '@/lib/pdf-to-markdown-logic';

const mockGetDocument = vi.fn();
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: (...args: any[]) => mockGetDocument(...args),
}));

describe('pdf-to-markdown-logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockGetDocument.mockReset();
  });

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
      expect(targetFr.name).toBe('Markdown');
      expect(targetFr.extension).toBe('md');
      expect(targetFr.icon).toBe('/icons/markdown.svg');
      expect(targetFr.color).toBe('#0284C7');
      expect(targetFr.subLabel).toBe('Format CommonMark / GFM');

      const targetEn = getTargetFormat(false);
      expect(targetEn.subLabel).toBe('CommonMark / GFM');
    });
  });

  describe('buildMarkdownFilename', () => {
    it('replaces extension with .md', () => {
      expect(buildMarkdownFilename('article.pdf')).toBe('article.md');
      expect(buildMarkdownFilename('DOCUMENT.PDF')).toBe('DOCUMENT.md');
      expect(buildMarkdownFilename('complex.name.pdf')).toBe('complex.name.md');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid pdf files under 100MB', () => {
      const pdf = new File(['%PDF-1.5 content'], 'sample.pdf', {
        type: 'application/pdf',
      });
      expect(validatePdfFile(pdf, false)).toEqual({ isValid: true });

      const nameOnlyPdf = new File(['%PDF'], 'document.pdf', { type: '' });
      expect(validatePdfFile(nameOnlyPdf, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const txt = new File(['hello'], 'document.txt', { type: 'text/plain' });
      const frRes = validatePdfFile(txt, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Format non supporté');
      expect(frRes.errorDesc).toContain('PDF');

      const enRes = validatePdfFile(txt, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('Unsupported format');
    });

    it('rejects files larger than 100MB', () => {
      const large = new File(['mock'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(large, 'size', { value: 101 * 1024 * 1024 });

      const frRes = validatePdfFile(large, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
      expect(frRes.errorDesc).toContain('100 Mo');

      const enRes = validatePdfFile(large, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');
      expect(enRes.errorDesc).toContain('100 MB');
    });
  });

  describe('convertPdfToMarkdown (In-Browser pdfjs-dist)', () => {
    it('extracts text to structured markdown without fetch or artificial delay', async () => {
      const mockFile = new File(['%PDF-1.7 sample data'], 'sample.pdf', {
        type: 'application/pdf',
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      mockGetDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue({
            getTextContent: vi.fn().mockResolvedValue({
              items: [
                { str: 'Document Title', transform: [20, 0, 0, 20, 10, 200] },
                { str: 'Subtitle Section', transform: [15, 0, 0, 15, 10, 160] },
                { str: 'This is the first paragraph.', transform: [12, 0, 0, 12, 10, 120] },
                { str: '• First bullet item', transform: [12, 0, 0, 12, 10, 90] },
                { str: '• Second bullet item', transform: [12, 0, 0, 12, 10, 75] },
              ],
            }),
          }),
        }),
      });

      const result = await convertPdfToMarkdown(mockFile, { isFr: false });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(result.filename).toBe('sample.md');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);

      expect(result.textOutput).toContain('# Document Title');
      expect(result.textOutput).toContain('## Subtitle Section');
      expect(result.textOutput).toContain('This is the first paragraph.');
      expect(result.textOutput).toContain('- First bullet item');
      expect(result.textOutput).toContain('- Second bullet item');
    });

    it('extracts multi-page documents cleanly', async () => {
      const mockFile = new File(['%PDF-1.7 multipage'], 'multi.pdf', {
        type: 'application/pdf',
      });

      mockGetDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 2,
          getPage: vi.fn().mockImplementation((pageNum: number) => {
            if (pageNum === 1) {
              return Promise.resolve({
                getTextContent: vi.fn().mockResolvedValue({
                  items: [{ str: 'Page One Heading', transform: [20, 0, 0, 20, 10, 100] }],
                }),
              });
            }
            return Promise.resolve({
              getTextContent: vi.fn().mockResolvedValue({
                items: [{ str: 'Page Two Heading', transform: [20, 0, 0, 20, 10, 100] }],
              }),
            });
          }),
        }),
      });

      const result = await convertPdfToMarkdown(mockFile, { isFr: false });
      expect(result.textOutput).toContain('# Page One Heading');
      expect(result.textOutput).toContain('# Page Two Heading');
    });

    it('throws localized error when document contains no extractable text', async () => {
      const emptyFile = new File(['%PDF empty'], 'empty.pdf', { type: 'application/pdf' });

      mockGetDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue({
            getTextContent: vi.fn().mockResolvedValue({ items: [] }),
          }),
        }),
      });

      await expect(
        convertPdfToMarkdown(emptyFile, { isFr: true })
      ).rejects.toThrow('Aucun texte extractible trouvé dans ce document PDF.');

      await expect(
        convertPdfToMarkdown(emptyFile, { isFr: false })
      ).rejects.toThrow('No extractable text found in this PDF document.');
    });
  });

  describe('triggerDownload', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('triggers click and defers URL.revokeObjectURL cleanup by 1000ms', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-md-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['# Markdown content'], { type: 'text/markdown' });
      triggerDownload(blob, 'result.md');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Revoke must NOT be called synchronously
      expect(revokeObjectURLMock).not.toHaveBeenCalled();

      // Advance by 1000ms
      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-md-url');
    });
  });
});
