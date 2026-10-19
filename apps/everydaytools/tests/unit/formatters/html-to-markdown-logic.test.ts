import { describe, it, expect, vi } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlInputFile,
  buildMarkdownFilename,
  convertHtmlToMarkdown,
  triggerDownload,
} from '@/lib/html-to-markdown-logic';

describe('html-to-markdown-logic [TDD-Lock ECC]', () => {
  describe('Format descriptors', () => {
    it('returns valid source format metadata with tokenized color for fr and en', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('HTML');
      expect(frSource.extension).toBe('html');
      expect(frSource.icon).toBe('/icons/html.svg');
      expect(frSource.color).toBe('var(--accent, #ea580c)');
      expect(frSource.subLabel).toBe('Document HTML5');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('HTML5 Document');
    });

    it('returns valid target format metadata with tokenized color for fr and en', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('Markdown');
      expect(frTarget.extension).toBe('md');
      expect(frTarget.icon).toBe('/icons/markdown.svg');
      expect(frTarget.color).toBe('var(--accent, #0284c7)');
      expect(frTarget.subLabel).toBe('Syntaxe Markdown');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Markdown Syntax');
    });
  });

  describe('validateHtmlInputFile', () => {
    it('accepts valid html, htm, and xhtml files under 20MB', () => {
      const htmlFile = new File(['<h1>Test</h1>'], 'test.html', { type: 'text/html' });
      expect(validateHtmlInputFile(htmlFile, false)).toEqual({ isValid: true });

      const htmFile = new File(['<p>Test</p>'], 'test.htm', { type: 'text/html' });
      expect(validateHtmlInputFile(htmFile, true)).toEqual({ isValid: true });

      const xhtmlFile = new File(['<div>Test</div>'], 'test.xhtml', { type: 'application/xhtml+xml' });
      expect(validateHtmlInputFile(xhtmlFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats including plain text or generic bin files', () => {
      const pdfFile = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' });
      expect(validateHtmlInputFile(pdfFile, true).isValid).toBe(false);

      const txtFile = new File(['plain text'], 'notes.txt', { type: 'text/plain' });
      expect(validateHtmlInputFile(txtFile, true).isValid).toBe(false);

      const binFile = new File(['binary'], 'data.bin', { type: '' });
      expect(validateHtmlInputFile(binFile, false).isValid).toBe(false);
    });

    it('rejects files larger than 20MB', () => {
      const largeFile = new File([''], 'huge.html', { type: 'text/html' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateHtmlInputFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildMarkdownFilename', () => {
    it('replaces html extensions with md', () => {
      expect(buildMarkdownFilename('page.html')).toBe('page.md');
      expect(buildMarkdownFilename('article.htm')).toBe('article.md');
      expect(buildMarkdownFilename('doc.xhtml')).toBe('doc.md');
    });

    it('defaults to document.md when no filename or empty extension is provided', () => {
      expect(buildMarkdownFilename()).toBe('document.md');
      expect(buildMarkdownFilename('')).toBe('document.md');
      expect(buildMarkdownFilename('.html')).toBe('document.md');
      expect(buildMarkdownFilename('   .htm')).toBe('document.md');
    });
  });

  describe('convertHtmlToMarkdown', () => {
    it('converts basic HTML elements to clean markdown', async () => {
      const html = '<h1>Hello World</h1><p>This is <strong>bold</strong> and <em>italic</em>.</p>';
      const md = await convertHtmlToMarkdown(html);
      expect(md).toContain('# Hello World');
      expect(md).toContain('**bold**');
      expect(md).toContain('*italic*');
    });

    it('converts unordered lists with hyphens', async () => {
      const html = '<ul><li>Alpha</li><li>Beta</li></ul>';
      const md = await convertHtmlToMarkdown(html);
      expect(md).toMatch(/-\s+Alpha/);
      expect(md).toMatch(/-\s+Beta/);
    });

    it('converts code blocks to fenced markdown code blocks', async () => {
      const html = '<pre><code>const a = 1;</code></pre>';
      const md = await convertHtmlToMarkdown(html);
      expect(md).toContain('```');
      expect(md).toContain('const a = 1;');
    });
  });

  describe('triggerDownload', () => {
    it('creates object URL, appends link, clicks, and schedules delayed revocation', () => {
      vi.useFakeTimers();
      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:mock-url');
      const revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['# Markdown content'], { type: 'text/markdown' });
      triggerDownload(blob, 'export.md');

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      // Fast forward timers
      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
      vi.useRealTimers();
    });
  });
});
