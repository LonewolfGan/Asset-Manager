import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateMarkdownFile,
  buildPdfFilename,
  convertMarkdownToPdf,
  triggerDownload,
  openPdfPreview,
} from '@/lib/markdown-to-pdf-logic';

describe('markdown-to-pdf-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata with tokenized color', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Markdown');
      expect(frSource.extension).toBe('md');
      expect(frSource.color).toBe('var(--accent, #0284c7)');
      expect(frSource.subLabel).toBe('Syntaxe Markdown');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Markdown Syntax');
      expect(enSource.color).toBe('var(--accent, #0284c7)');
    });

    it('returns correct target format metadata with tokenized color', () => {
      const target = getTargetFormat();
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.color).toBe('var(--accent, #dc2626)');
      expect(target.subLabel).toBe('Adobe Acrobat');
    });
  });

  describe('validateMarkdownFile', () => {
    it('accepts valid md, markdown, and txt files under 20MB', () => {
      const mdFile = new File(['# Title'], 'notes.md', { type: 'text/markdown' });
      expect(validateMarkdownFile(mdFile, false)).toEqual({ isValid: true });

      const markdownFile = new File(['# Title'], 'notes.markdown', { type: 'text/plain' });
      expect(validateMarkdownFile(markdownFile, true)).toEqual({ isValid: true });

      const txtFile = new File(['Some notes'], 'notes.txt', { type: 'text/plain' });
      expect(validateMarkdownFile(txtFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats including empty MIME binaries', () => {
      const pdfFile = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      const result = validateMarkdownFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Markdown');

      const binFile = new File(['binary data'], 'archive.bin', { type: '' });
      const binResult = validateMarkdownFile(binFile, false);
      expect(binResult.isValid).toBe(false);
      expect(binResult.error).toContain('Markdown');
    });

    it('rejects files larger than 20MB', () => {
      const largeFile = new File([''], 'huge.md', { type: 'text/markdown' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateMarkdownFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildPdfFilename', () => {
    it('replaces md extensions with pdf in upload mode', () => {
      const file = new File([''], 'report.md');
      expect(buildPdfFilename('upload', file, false)).toBe('report.pdf');

      const mdExtFile = new File([''], 'doc.markdown');
      expect(buildPdfFilename('upload', mdExtFile, false)).toBe('doc.pdf');
    });

    it('returns document-markdown.pdf in paste mode', () => {
      expect(buildPdfFilename('paste', undefined, true)).toBe('document-markdown.pdf');
      expect(buildPdfFilename('paste', undefined, false)).toBe('document-markdown.pdf');
    });
  });

  describe('convertMarkdownToPdf', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file via FormData in upload mode without artificial delay or invoking setTimeout', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const file = new File(['# Header'], 'readme.md', { type: 'text/markdown' });
      const res = await convertMarkdownToPdf({ mode: 'upload', file });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('readme.pdf');
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/markdown-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('converts raw markdown via JSON in paste mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const res = await convertMarkdownToPdf({ mode: 'paste', markdownInput: '# Raw Title' });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('document-markdown.pdf');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/markdown-to-pdf'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: '# Raw Title' }),
        })
      );
    });

    it('throws error when server responds with non-ok status', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Markdown parsing error' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        convertMarkdownToPdf({ mode: 'paste', markdownInput: 'fail' })
      ).rejects.toThrow('Markdown parsing error');
    });
  });

  describe('triggerDownload & openPdfPreview', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('triggers download with delayed URL revocation', () => {
      const createObjectURLSpy = vi.fn().mockReturnValue('blob:test-pdf');
      const revokeObjectURLSpy = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLSpy;
      globalThis.URL.revokeObjectURL = revokeObjectURLSpy;

      const clickSpy = vi.fn();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'a') {
          el.click = clickSpy;
        }
        return el;
      });

      const mockBlob = new Blob(['%PDF-test'], { type: 'application/pdf' });
      triggerDownload(mockBlob, 'output.pdf');

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(clickSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Revocation should NOT happen immediately
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      // Fast forward timers by 1000ms
      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-pdf');
    });

    it('opens PDF preview in new window and cleans up delayed', () => {
      const createObjectURLSpy = vi.fn().mockReturnValue('blob:test-pdf-preview');
      const revokeObjectURLSpy = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLSpy;
      globalThis.URL.revokeObjectURL = revokeObjectURLSpy;

      const windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue({} as any);

      const mockBlob = new Blob(['%PDF-preview'], { type: 'application/pdf' });
      openPdfPreview(mockBlob);

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(windowOpenSpy).toHaveBeenCalledWith(
        'blob:test-pdf-preview',
        '_blank',
        'noopener,noreferrer'
      );

      expect(revokeObjectURLSpy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(10000);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-pdf-preview');
    });
  });
});
