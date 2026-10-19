import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  getSourceFormat,
  getTargetFormat,
  validateTxtFile,
  buildPdfFilename,
  convertTxtToPdf,
  sanitizeWinAnsi,
  triggerDownload,
  openPdfPreview,
} from '@/lib/txt-to-pdf-logic';

describe('txt-to-pdf-logic (TDD Client-Side Repatriation)', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
    setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.subLabel).toBe('Adobe Acrobat');
    });
  });

  describe('validateTxtFile', () => {
    it('accepts valid txt files under 20MB', () => {
      const txtFile = new File(['Some simple text'], 'notes.txt', { type: 'text/plain' });
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

    it('rejects files larger than 20MB', () => {
      const largeFile = new File([''], 'huge.txt', { type: 'text/plain' });
      Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });
      const result = validateTxtFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('20 MB');
    });
  });

  describe('buildPdfFilename', () => {
    it('replaces txt extensions with pdf in upload mode', () => {
      const file = new File([''], 'notes.txt');
      expect(buildPdfFilename('upload', file, false)).toBe('notes.pdf');
    });

    it('returns localized filename in paste mode', () => {
      expect(buildPdfFilename('paste', undefined, true)).toBe('texte-converti.pdf');
      expect(buildPdfFilename('paste', undefined, false)).toBe('converted-text.pdf');
    });
  });

  describe('sanitizeWinAnsi', () => {
    it('preserves valid ASCII, French accents, quotes, and punctuation', () => {
      const input = 'Café & résumé: « Hello » — €100 “good” ‘test’ • 100%';
      const sanitized = sanitizeWinAnsi(input);
      expect(sanitized).toBe(input);
    });

    it('converts tabs to spaces and normalizes newlines', () => {
      const input = 'Column1\tColumn2\r\nLine2';
      const sanitized = sanitizeWinAnsi(input);
      expect(sanitized).toBe('Column1    Column2\nLine2');
    });

    it('replaces unsupported emojis and non-Latin unicode characters with ?', () => {
      const input = 'Hello 🚀 Привет 世界!';
      const sanitized = sanitizeWinAnsi(input);
      expect(sanitized).toBe('Hello ? ?????? ??!');
    });
  });

  describe('convertTxtToPdf (In-Browser Execution)', () => {
    it('converts uploaded text file directly in browser without fetch or artificial delay', async () => {
      const file = new File(['Rapport de production 2026\nContenu valide.'], 'test.txt', {
        type: 'text/plain',
      });

      const res = await convertTxtToPdf({ mode: 'upload', file });

      expect(res.filename).toBe('test.pdf');
      expect(res.sizeBefore).toBe(file.size);
      expect(res.sizeAfter).toBeGreaterThan(0);
      expect(res.blob.type).toBe('application/pdf');

      // Assert zero backend fetch and zero artificial delay
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();

      // Assert PDF header magic bytes %PDF-
      const buffer = await res.blob.arrayBuffer();
      const header = new TextDecoder().decode(buffer.slice(0, 5));
      expect(header).toBe('%PDF-');

      // Verify valid PDF document structure via pdf-lib
      const loadedDoc = await PDFDocument.load(buffer);
      expect(loadedDoc.getPageCount()).toBe(1);
    });

    it('converts pasted text into vector PDF in browser without fetch', async () => {
      const text = 'EverydayTools Document Studio — Quick note converted in-browser.';
      const res = await convertTxtToPdf({ mode: 'paste', textInput: text, isFr: true });

      expect(res.filename).toBe('texte-converti.pdf');
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();

      const buffer = await res.blob.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer);
      expect(loadedDoc.getPageCount()).toBe(1);
    });

    it('paginates multi-page text into multiple pages', async () => {
      const repeatedText = Array.from({ length: 120 }, (_, i) => `Ligne ${i + 1} de documentation technique exhaustive.`).join('\n');
      const res = await convertTxtToPdf({
        mode: 'paste',
        textInput: repeatedText,
        fontSize: 11,
        lineSpacing: 1.5,
        margin: 48,
      });

      const buffer = await res.blob.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer);
      expect(loadedDoc.getPageCount()).toBeGreaterThan(1);
    });

    it('honors typography options (orientation, fontFamily, fontSize)', async () => {
      const text = 'Landscape document with TimesRoman font';
      const res = await convertTxtToPdf({
        mode: 'paste',
        textInput: text,
        orientation: 'landscape',
        fontFamily: 'TimesRoman',
        fontSize: 14,
        margin: 36,
      });

      const buffer = await res.blob.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer);
      const page = loadedDoc.getPage(0);
      const { width, height } = page.getSize();
      expect(width).toBeGreaterThan(height); // Landscape: width ~841.89 > height ~595.28
    });

    it('handles empty input gracefully by producing a valid 1-page PDF', async () => {
      const res = await convertTxtToPdf({ mode: 'paste', textInput: '' });
      expect(res.blob).toBeInstanceOf(Blob);

      const buffer = await res.blob.arrayBuffer();
      const loadedDoc = await PDFDocument.load(buffer);
      expect(loadedDoc.getPageCount()).toBe(1);
    });
  });

  describe('Download & Preview helpers', () => {
    it('triggers download with 1000ms revoke delay', () => {
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/test');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

      const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      triggerDownload(blob, 'result.pdf');

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

      // Fast-forward 1000ms
      const callback = setTimeoutSpy.mock.calls.find((c) => c[1] === 1000)?.[0] as () => void;
      expect(callback).toBeDefined();
      callback();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/test');
    });

    it('opens PDF preview in new window', () => {
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/preview');
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      openPdfPreview(blob);

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(windowOpenSpy).toHaveBeenCalledWith('blob:http://localhost/preview', '_blank');
    });
  });
});
