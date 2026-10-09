import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateMarkdownFile,
  buildPdfFilename,
  convertMarkdownToPdf,
} from '@/lib/markdown-to-pdf-logic';

describe('markdown-to-pdf-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Markdown');
      expect(frSource.extension).toBe('md');
      expect(frSource.subLabel).toBe('Syntaxe Markdown');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Markdown Syntax');
    });

    it('returns correct target format metadata', () => {
      const target = getTargetFormat();
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
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

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      const result = validateMarkdownFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Markdown');
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

    it('converts file via FormData in upload mode', async () => {
      const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };
      (globalThis.fetch as any).mockResolvedValue(mockResponse);

      const file = new File(['# Header'], 'readme.md', { type: 'text/markdown' });
      const res = await convertMarkdownToPdf({ mode: 'upload', file });

      expect(res.blob).toBe(mockBlob);
      expect(res.filename).toBe('readme.pdf');
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
});
