import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  buildPdfaFilename,
  convertPdfToPdfa,
} from '@/lib/pdf-to-pdfa-logic';

describe('pdf-to-pdfa-logic', () => {
  describe('format metadata', () => {
    it('returns localized source and target conversion formats', () => {
      const srcFr = getSourceFormat(true);
      expect(srcFr.name).toBe('PDF');
      expect(srcFr.extension).toBe('pdf');
      expect(srcFr.subLabel).toBe('Document Adobe Acrobat');
      expect(getSourceFormat(false).subLabel).toBe('Adobe Acrobat Document');

      const targetFr = getTargetFormat(true);
      expect(targetFr.name).toBe('PDF/A');
      expect(targetFr.subLabel).toBe('Archivage ISO 19005');
      expect(getTargetFormat(false).subLabel).toBe('ISO 19005 Archival');
    });
  });

  describe('buildPdfaFilename', () => {
    it('formats document name with _pdfa.pdf suffix', () => {
      expect(buildPdfaFilename('report.pdf')).toBe('report_pdfa.pdf');
      expect(buildPdfaFilename('archive.v1.0.pdf')).toBe('archive.v1.0_pdfa.pdf');
      expect(buildPdfaFilename('document')).toBe('document_pdfa.pdf');
    });
  });

  describe('validatePdfFile', () => {
    it('validates valid PDF files', () => {
      const valid = new File(['%PDF-1.7'], 'doc.pdf', { type: 'application/pdf' });
      expect(validatePdfFile(valid, true)).toEqual({ isValid: true });
    });

    it('rejects non-PDF files with localized error', () => {
      const text = new File(['hello'], 'document.txt', { type: 'text/plain' });
      const resFr = validatePdfFile(text, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.errorTitle).toBe('Format non supporté');
      expect(resFr.errorDesc).toBe('Veuillez sélectionner un document au format PDF valide.');

      const resEn = validatePdfFile(text, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.errorTitle).toBe('Unsupported format');
      expect(resEn.errorDesc).toBe('Please select a valid PDF document.');
    });

    it('rejects files larger than 50MB with localized error', () => {
      const big = new File([''], 'big.pdf', { type: 'application/pdf' });
      Object.defineProperty(big, 'size', { value: 51 * 1024 * 1024 });

      const resFr = validatePdfFile(big, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.errorTitle).toBe('Fichier trop volumineux');
      expect(resFr.errorDesc).toBe('Le fichier dépasse la taille maximale autorisée de 50 Mo.');

      const resEn = validatePdfFile(big, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.errorTitle).toBe('File too large');
      expect(resEn.errorDesc).toBe('File exceeds maximum allowed size of 50 MB.');
    });
  });

  describe('convertPdfToPdfa', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('converts PDF to PDF/A with zero artificial delays', async () => {
      const mockBlob = new Blob(['%PDF-1.7-pdfa-bytes'], { type: 'application/pdf' });
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      });
      vi.stubGlobal('fetch', fetchSpy);

      const file = new File(['%PDF-1.4'], 'input.pdf', { type: 'application/pdf' });
      const promise = convertPdfToPdfa(file, { isFr: false });

      // Zero artificial delay check
      expect(vi.getTimerCount()).toBe(0);

      const result = await promise;
      expect(result.blob).toBe(mockBlob);
      expect(result.filename).toBe('input_pdfa.pdf');
      expect(result.sizeBefore).toBe(file.size);
      expect(result.sizeAfter).toBe(mockBlob.size);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toContain('/api/tools/pdf-to-pdfa');
      expect(init.method).toBe('POST');
      expect(init.body).toBeInstanceOf(FormData);
    });

    it('handles server 400 and 500 error json properly', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Document is password protected.' }),
      }));
      const file = new File(['test'], 'locked.pdf', { type: 'application/pdf' });
      await expect(convertPdfToPdfa(file, { isFr: false })).rejects.toThrow('Document is password protected.');

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Ghostscript error' }),
      }));
      await expect(convertPdfToPdfa(file, { isFr: true })).rejects.toThrow('Ghostscript error');
    });

    it('falls back to localized default message when error response body is empty', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Not JSON'); },
      }));
      const file = new File(['test'], 'broken.pdf', { type: 'application/pdf' });
      await expect(convertPdfToPdfa(file, { isFr: true })).rejects.toThrow(
        'Échec de la conversion en PDF/A. Veuillez réessayer.'
      );
      await expect(convertPdfToPdfa(file, { isFr: false })).rejects.toThrow(
        'Failed to convert to PDF/A. Please try again.'
      );
    });
  });
});
