import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  convertPdfToText,
  downloadPdfToTextResult,
  type PdfToTextResult,
} from '@/lib/pdf-to-text-logic';

describe('pdf-to-text-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('PDF');
      expect(frSource.extension).toBe('pdf');
      expect(frSource.icon).toBe('/icons/pdf.svg');
      expect(frSource.color).toBe('#EC1C24');
      expect(frSource.subLabel).toBe('Document Adobe Acrobat');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Adobe Acrobat Document');
    });

    it('returns correct target format metadata', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('TXT');
      expect(frTarget.extension).toBe('txt');
      expect(frTarget.icon).toBe('/icons/txt.svg');
      expect(frTarget.color).toBe('#4B5563');
      expect(frTarget.subLabel).toBe('Texte brut UTF-8');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('UTF-8 Plain Text');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid pdf files under 100MB', () => {
      const pdfFile = new File(['%PDF-1.4 sample content'], 'sample.pdf', {
        type: 'application/pdf',
      });
      expect(validatePdfFile(pdfFile, false)).toEqual({ isValid: true });

      const nameOnlyPdf = new File(['%PDF'], 'document.pdf', { type: '' });
      expect(validatePdfFile(nameOnlyPdf, true)).toEqual({ isValid: true });
    });

    it('rejects non-pdf files with localized error', () => {
      const txtFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });
      const frRes = validatePdfFile(txtFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.error).toBe(
        'Veuillez sélectionner un document au format PDF valide.'
      );

      const enRes = validatePdfFile(txtFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.error).toBe('Please select a valid PDF document.');
    });

    it('rejects files exceeding 100MB', () => {
      const hugeFile = new File([''], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(hugeFile, 'size', {
        value: 101 * 1024 * 1024,
      });

      const frRes = validatePdfFile(hugeFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.error).toBe(
        'Le fichier dépasse la taille maximale autorisée de 100 Mo.'
      );

      const enRes = validatePdfFile(hugeFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.error).toBe('File exceeds maximum allowed size of 100 MB.');
    });
  });

  describe('convertPdfToText', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('extracts plain text and constructs result object', async () => {
      const mockFile = new File(['%PDF fake data'], 'report.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: 'Extracted content from PDF' }),
      } as Response);

      const result = await convertPdfToText(mockFile, { isFr: false });

      expect(result.filename).toBe('report.txt');
      expect(result.textOutput).toBe('Extracted content from PDF');
      expect(result.sizeBefore).toBe(mockFile.size);
      expect(result.sizeAfter).toBeGreaterThan(0);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('throws server error message if response not ok', async () => {
      const mockFile = new File(['bad pdf'], 'corrupt.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'PDF is password protected' }),
      } as Response);

      await expect(
        convertPdfToText(mockFile, { isFr: true })
      ).rejects.toThrow('PDF is password protected');
    });

    it('throws localized fallback error when response error is empty', async () => {
      const mockFile = new File(['bad pdf'], 'corrupt.pdf', {
        type: 'application/pdf',
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response);

      await expect(
        convertPdfToText(mockFile, { isFr: true })
      ).rejects.toThrow("Échec de l'extraction du texte. Veuillez réessayer.");
    });
  });

  describe('downloadPdfToTextResult', () => {
    it('creates download anchor and clicks it', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const mockResult: PdfToTextResult = {
        blob: new Blob(['hello world'], { type: 'text/plain' }),
        filename: 'test.txt',
        sizeBefore: 100,
        sizeAfter: 11,
        textOutput: 'hello world',
      };

      const onAfterDownload = vi.fn();
      downloadPdfToTextResult(mockResult, onAfterDownload);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockResult.blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
      expect(onAfterDownload).toHaveBeenCalled();
    });
  });
});
