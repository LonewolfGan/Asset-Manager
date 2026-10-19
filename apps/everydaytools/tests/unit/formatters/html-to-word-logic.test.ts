import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  buildWordFilename,
  convertHtmlToWord,
  triggerDownload,
} from '@/lib/html-to-word-logic';

describe('html-to-word-logic [TDD-Lock ECC]', () => {
  describe('Format descriptors', () => {
    it('returns correct source HTML format metadata with tokenized color', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('HTML');
      expect(frSource.extension).toBe('html');
      expect(frSource.icon).toBe('/icons/html.svg');
      expect(frSource.color).toBe('var(--accent, #ea580c)');
      expect(frSource.subLabel).toBe('Fichier Web HTML5');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('HTML5 Web File');
    });

    it('returns correct target Word format metadata with tokenized color', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('Word');
      expect(frTarget.extension).toBe('docx');
      expect(frTarget.icon).toBe('/icons/word.svg');
      expect(frTarget.color).toBe('var(--accent, #2563eb)');
      expect(frTarget.subLabel).toBe('Format Word (.docx)');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Word Format (.docx)');
    });
  });

  describe('buildWordFilename', () => {
    it('replaces .html or .htm extension with .docx', () => {
      expect(buildWordFilename('report.html')).toBe('report.docx');
      expect(buildWordFilename('page.HTM')).toBe('page.docx');
      expect(buildWordFilename('archive.HTML')).toBe('archive.docx');
      expect(buildWordFilename('document.final.html')).toBe('document.final.docx');
    });

    it('falls back to "document.docx" for empty or extension-only names', () => {
      expect(buildWordFilename('.html')).toBe('document.docx');
      expect(buildWordFilename('   .htm')).toBe('document.docx');
      expect(buildWordFilename('')).toBe('document.docx');
    });
  });

  describe('validateHtmlFile', () => {
    it('accepts valid HTML files under 50MB', () => {
      const htmlFile = new File(['<!DOCTYPE html><html><body>Test</body></html>'], 'page.html', {
        type: 'text/html',
      });
      expect(validateHtmlFile(htmlFile, false)).toEqual({ isValid: true });

      const htmFile = new File(['<h1>Test</h1>'], 'index.htm', { type: '' });
      expect(validateHtmlFile(htmFile, true)).toEqual({ isValid: true });
    });

    it('rejects non-HTML files with bilingual messages', () => {
      const txtFile = new File(['plain text'], 'notes.txt', { type: 'text/plain' });
      const enRes = validateHtmlFile(txtFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('Unsupported format');
      expect(enRes.errorDesc).toContain('HTML');

      const frRes = validateHtmlFile(txtFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Format non supporté');
      expect(frRes.errorDesc).toContain('HTML');
    });

    it('rejects files larger than 50MB with bilingual messages', () => {
      const largeFile = new File(['<html></html>'], 'huge.html', { type: 'text/html' });
      Object.defineProperty(largeFile, 'size', { value: 55 * 1024 * 1024 });

      const enRes = validateHtmlFile(largeFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');

      const frRes = validateHtmlFile(largeFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
    });
  });

  describe('convertHtmlToWord', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('converts HTML to Word docx successfully without artificial delay or invoking setTimeout', async () => {
      const mockBlob = new Blob(['docx content'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const file = new File(['<p>Hello</p>'], 'article.html', { type: 'text/html' });
      const res = await convertHtmlToWord(file, { isFr: false });

      expect(res.filename).toBe('article.docx');
      expect(res.sizeBefore).toBe(file.size);
      expect(res.sizeAfter).toBe(mockBlob.size);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tools/document-convert'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('throws server error message if response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server conversion error' }),
      });

      const file = new File(['<bad html>'], 'broken.html', { type: 'text/html' });
      await expect(convertHtmlToWord(file, { isFr: false })).rejects.toThrow(
        'Server conversion error'
      );
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

      const blob = new Blob(['test content'], { type: 'application/octet-stream' });
      triggerDownload(blob, 'output.docx');

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
