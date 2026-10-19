import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateTxtFile,
  buildDocxFilename,
  convertTxtToDocx,
  triggerDownload,
} from '@/lib/txt-to-docx-logic';

describe('txt-to-docx-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Texte');
      expect(frSource.extension).toBe('txt');
      expect(frSource.subLabel).toBe('Texte Brut UTF-8');

      const enSource = getSourceFormat(false);
      expect(enSource.name).toBe('Text');
      expect(enSource.subLabel).toBe('Plain Text UTF-8');
    });

    it('returns correct target format metadata', () => {
      const target = getTargetFormat(true);
      expect(target.name).toBe('Word');
      expect(target.extension).toBe('docx');
      expect(target.subLabel).toBe('Microsoft Word');
    });
  });

  describe('validateTxtFile', () => {
    it('accepts valid txt files under 10MB', () => {
      const txtFile = new File(['Some notes'], 'notes.txt', { type: 'text/plain' });
      expect(validateTxtFile(txtFile, false)).toEqual({ isValid: true });

      const emptyTypeFile = new File(['Hello'], 'doc.txt', { type: '' });
      expect(validateTxtFile(emptyTypeFile, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'test.pdf', { type: 'application/pdf' });
      const result = validateTxtFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('texte (.txt)');
    });

    it('rejects files larger than 10MB', () => {
      const largeFile = new File([''], 'huge.txt', { type: 'text/plain' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      const result = validateTxtFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('10 MB');
    });
  });

  describe('buildDocxFilename', () => {
    it('replaces txt extensions with docx in upload mode', () => {
      const file = new File([''], 'notes.txt');
      expect(buildDocxFilename('upload', file, false)).toBe('notes.docx');
    });

    it('returns localized filename in paste mode', () => {
      expect(buildDocxFilename('paste', undefined, true)).toBe('texte-saisi.docx');
      expect(buildDocxFilename('paste', undefined, false)).toBe('pasted-text.docx');
    });
  });

  describe('convertTxtToDocx (100% In-Browser Execution)', () => {
    let fetchSpy: any;

    beforeEach(() => {
      fetchSpy = vi.spyOn(globalThis, 'fetch');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('converts file in upload mode without calling fetch or artificial delay', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      const textContent = 'Line 1: Hello World\nLine 2: EverydayTools in-browser DOCX';
      const file = new File([textContent], 'meeting-notes.txt', { type: 'text/plain' });

      const res = await convertTxtToDocx({
        mode: 'upload',
        file,
        isFr: false,
      });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(res.filename).toBe('meeting-notes.docx');
      expect(res.sizeBefore).toBe(file.size);
      expect(res.sizeAfter).toBeGreaterThan(100);
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.blob.type).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    });

    it('converts multiline text in paste mode without network requests', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      const text = 'First paragraph\r\nSecond paragraph with CRLF\rThird with CR';

      const res = await convertTxtToDocx({
        mode: 'paste',
        textInput: text,
        isFr: true,
      });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(res.filename).toBe('texte-saisi.docx');
      expect(res.sizeBefore).toBe(new Blob([text]).size);
      expect(res.sizeAfter).toBeGreaterThan(100);
      expect(res.blob.type).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    });

    it('throws localized error when upload mode has no file or empty content', async () => {
      await expect(
        convertTxtToDocx({ mode: 'upload', file: null, isFr: true })
      ).rejects.toThrow('Veuillez fournir du texte à convertir.');

      const emptyFile = new File(['   \n\t  '], 'empty.txt', { type: 'text/plain' });
      await expect(
        convertTxtToDocx({ mode: 'upload', file: emptyFile, isFr: false })
      ).rejects.toThrow('Please provide text to convert.');
    });

    it('throws localized error when paste mode has empty or whitespace text', async () => {
      await expect(
        convertTxtToDocx({ mode: 'paste', textInput: '', isFr: true })
      ).rejects.toThrow('Veuillez fournir du texte à convertir.');

      await expect(
        convertTxtToDocx({ mode: 'paste', textInput: '   \n  \r\n  ', isFr: false })
      ).rejects.toThrow('Please provide text to convert.');
    });

    it('uses custom errorFallback when provided and content is empty', async () => {
      await expect(
        convertTxtToDocx({
          mode: 'paste',
          textInput: '',
          errorFallback: 'Custom fallback error',
        })
      ).rejects.toThrow('Custom fallback error');
    });
  });

  describe('triggerDownload', () => {
    it('creates anchor and schedules URL.revokeObjectURL cleanup after 1000ms', () => {
      vi.useFakeTimers();
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const clickSpy = vi.fn();

      const origCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = origCreateElement(tagName);
        if (tagName === 'a') {
          el.click = clickSpy;
        }
        return el;
      });

      const blob = new Blob(['sample docx content']);
      triggerDownload(blob, 'export.docx');

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-url');

      vi.useRealTimers();
      vi.restoreAllMocks();
    });
  });
});
