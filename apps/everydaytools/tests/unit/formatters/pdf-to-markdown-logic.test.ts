import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  buildMarkdownFilename,
  convertPdfToMarkdown,
  triggerDownload,
} from '@/lib/pdf-to-markdown-logic';

describe('pdf-to-markdown-logic', () => {
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

  describe('convertPdfToMarkdown', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts pdf to markdown result object', async () => {
      const mockFile = new File(['%PDF data'], 'paper.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        text: async () => '# Converted Paper\n\nSection 1 text',
      } as Response);

      const result = await convertPdfToMarkdown(mockFile, { isFr: false });

      expect(result.filename).toBe('paper.md');
      expect(result.textOutput).toBe('# Converted Paper\n\nSection 1 text');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws server error message if response is not ok', async () => {
      const mockFile = new File(['bad'], 'locked.pdf', { type: 'application/pdf' });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Password required' }),
      } as Response);

      await expect(
        convertPdfToMarkdown(mockFile, { isFr: true })
      ).rejects.toThrow('Password required');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor and triggers click for download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-md');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['# Markdown'], { type: 'text/markdown' });
      triggerDownload(blob, 'result.md');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-md');
    });
  });
});
