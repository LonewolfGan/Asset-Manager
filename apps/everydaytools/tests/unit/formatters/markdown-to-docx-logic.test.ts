import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateMarkdownFile,
  buildDocxFilename,
  convertMarkdownToDocx,
  triggerDownload,
} from '@/lib/markdown-to-docx-logic';

describe('markdown-to-docx-logic [TDD RED]', () => {
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
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('Word');
      expect(frTarget.extension).toBe('docx');
      expect(frTarget.color).toBe('var(--accent, #2563eb)');
      expect(frTarget.subLabel).toBe('Document Microsoft Word (.docx)');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Microsoft Word Document (.docx)');
      expect(enTarget.color).toBe('var(--accent, #2563eb)');
    });
  });

  describe('validateMarkdownFile', () => {
    it('accepts valid md, markdown, and txt files under 10MB', () => {
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

    it('rejects files larger than 10MB', () => {
      const largeFile = new File([''], 'huge.md', { type: 'text/markdown' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      const result = validateMarkdownFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10 MB');
    });
  });

  describe('buildDocxFilename', () => {
    it('replaces md extensions with docx in upload mode', () => {
      const file = new File([''], 'report.md');
      expect(buildDocxFilename('upload', file)).toBe('report.docx');

      const mdExtFile = new File([''], 'doc.markdown');
      expect(buildDocxFilename('upload', mdExtFile)).toBe('doc.docx');

      const txtExtFile = new File([''], 'notes.txt');
      expect(buildDocxFilename('upload', txtExtFile)).toBe('notes.docx');
    });

    it('handles files with no extension cleanly', () => {
      const file = new File([''], 'document');
      expect(buildDocxFilename('upload', file)).toBe('document.docx');
    });

    it('returns document-markdown.docx in paste mode', () => {
      expect(buildDocxFilename('paste', undefined)).toBe('document-markdown.docx');
    });
  });

  describe('convertMarkdownToDocx', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file via FormData in upload mode without artificial delay or invoking setTimeout', async () => {
      const mockBlob = new Blob(['docx-binary'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const file = new File(['# Header'], 'readme.md', { type: 'text/markdown' });
      const res = await convertMarkdownToDocx({ mode: 'upload', file });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('readme.docx');
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/markdown-to-docx'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('converts raw markdown via JSON in paste mode', async () => {
      const mockBlob = new Blob(['docx-binary'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const res = await convertMarkdownToDocx({
        mode: 'paste',
        markdownInput: '# Raw Title',
      });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('document-markdown.docx');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/convert/markdown-to-docx'),
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
        json: vi.fn().mockResolvedValue({ message: 'Conversion failed' }),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        convertMarkdownToDocx({ mode: 'paste', markdownInput: 'bad input' })
      ).rejects.toThrow('Conversion failed');
    });
  });

  describe('triggerDownload', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('triggers download with delayed URL revocation', () => {
      const createObjectURLSpy = vi.fn().mockReturnValue('blob:test-docx');
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

      const mockBlob = new Blob(['docx-binary'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      triggerDownload(mockBlob, 'document.docx');

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(clickSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Revocation should NOT happen immediately
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      // Fast forward timers by 1000ms
      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-docx');
    });
  });
});
