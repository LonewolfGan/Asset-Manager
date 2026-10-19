import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateMarkdownFile,
  buildPdfFilename,
  convertMarkdownToPdf,
  getSourceFormat,
  getTargetFormat,
} from '@/lib/markdown-to-pdf-logic';

describe('markdown-to-pdf-logic (TDD)', () => {
  describe('format metadata', () => {
    it('returns valid source and target format definitions', () => {
      const srcEn = getSourceFormat(false);
      expect(srcEn.extension).toBe('md');
      expect(srcEn.subLabel).toBe('Markdown Syntax');

      const srcFr = getSourceFormat(true);
      expect(srcFr.subLabel).toBe('Syntaxe Markdown');

      const tgt = getTargetFormat();
      expect(tgt.extension).toBe('pdf');
      expect(tgt.name).toBe('PDF');
    });
  });

  describe('validateMarkdownFile', () => {
    it('accepts valid markdown and text extensions (.md, .markdown, .txt)', () => {
      const mdFile = new File(['# Title'], 'notes.md', { type: 'text/markdown' });
      expect(validateMarkdownFile(mdFile)).toEqual({ isValid: true });

      const markdownFile = new File(['# Title'], 'spec.markdown', { type: 'text/plain' });
      expect(validateMarkdownFile(markdownFile)).toEqual({ isValid: true });

      const txtFile = new File(['Title'], 'doc.txt', { type: 'text/plain' });
      expect(validateMarkdownFile(txtFile)).toEqual({ isValid: true });
    });

    it('rejects unsupported extensions with localized error messages', () => {
      const pdfFile = new File(['%PDF'], 'document.pdf', { type: 'application/pdf' });
      const resEn = validateMarkdownFile(pdfFile, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.error).toContain('Please select a valid Markdown');

      const resFr = validateMarkdownFile(pdfFile, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.error).toContain('Veuillez sélectionner un fichier Markdown');
    });

    it('rejects files larger than 20MB with localized error messages', () => {
      const largeFile = new File([''], 'huge.md', { type: 'text/markdown' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });

      const resEn = validateMarkdownFile(largeFile, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.error).toContain('20 MB');

      const resFr = validateMarkdownFile(largeFile, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.error).toContain('20 Mo');
    });
  });

  describe('buildPdfFilename', () => {
    it('derives pdf filename from original file name in upload mode', () => {
      const f1 = new File([''], 'technical-report.md');
      expect(buildPdfFilename('upload', f1)).toBe('technical-report.pdf');

      const f2 = new File([''], 'documentation.markdown');
      expect(buildPdfFilename('upload', f2)).toBe('documentation.pdf');

      const f3 = new File([''], 'notes.txt');
      expect(buildPdfFilename('upload', f3)).toBe('notes.pdf');
    });

    it('returns default filename in paste mode or when file is null', () => {
      expect(buildPdfFilename('paste', null)).toBe('document-markdown.pdf');
      expect(buildPdfFilename('upload', null)).toBe('document-markdown.pdf');
    });
  });

  describe('convertMarkdownToPdf (zero artificial delays)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('converts markdown text payload via POST JSON without artificial delay', async () => {
      const dummyPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
      const mockResponse = new Response(dummyPdfBytes, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      });

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal('fetch', fetchSpy);

      const promise = convertMarkdownToPdf({
        mode: 'paste',
        markdownInput: '# Title\n\nParagraph text.',
      });

      // Assert no timers are scheduled (zero artificial setTimeout)
      expect(vi.getTimerCount()).toBe(0);

      const result = await promise;
      expect(result.filename).toBe('document-markdown.pdf');
      expect(result.sizeAfter).toBe(dummyPdfBytes.length);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('converts uploaded file via multipart FormData without artificial delay', async () => {
      const dummyPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
      const mockResponse = new Response(dummyPdfBytes, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      });

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal('fetch', fetchSpy);

      const file = new File(['# Readme'], 'project-readme.md', { type: 'text/markdown' });
      const promise = convertMarkdownToPdf({
        mode: 'upload',
        file,
      });

      expect(vi.getTimerCount()).toBe(0);

      const result = await promise;
      expect(result.filename).toBe('project-readme.pdf');
      expect(result.sizeBefore).toBe(file.size);
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/markdown-to-pdf'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws meaningful error message on failed response', async () => {
      const errorJson = JSON.stringify({ message: 'HTML too large' });
      const mockResponse = new Response(errorJson, {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      await expect(
        convertMarkdownToPdf({
          mode: 'paste',
          markdownInput: 'Huge content',
        })
      ).rejects.toThrow('HTML too large');
    });
  });
});
