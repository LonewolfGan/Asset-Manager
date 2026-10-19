import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  getPdfRepairSourceFormat,
  getPdfRepairTargetFormat,
  validatePdfRepairFile,
  buildRepairedPdfFilename,
  repairPdfDocument,
} from '@/lib/pdf-repair-logic';

describe('pdf-repair-logic', () => {
  it('provides localized format descriptors', () => {
    const srcFr = getPdfRepairSourceFormat(true);
    expect(srcFr.extension).toBe('pdf');
    expect(srcFr.name).toBe('PDF');
    expect(srcFr.subLabel).toBe('Document à réparer');

    const srcEn = getPdfRepairSourceFormat(false);
    expect(srcEn.subLabel).toBe('Document to repair');

    const targetFr = getPdfRepairTargetFormat(true);
    expect(targetFr.subLabel).toBe('Structure XREF reconstruite');
  });

  it('validates PDF files and detects invalid formats or oversized files', () => {
    const validFile = new File(['%PDF-1.4'], 'contract.pdf', { type: 'application/pdf' });
    expect(validatePdfRepairFile(validFile)).toEqual({ valid: true });

    const nonPdf = new File(['text'], 'notes.txt', { type: 'text/plain' });
    expect(validatePdfRepairFile(nonPdf)).toEqual({
      valid: false,
      error: 'unsupported_format',
    });

    const bigFile = new File(['%PDF-1.4'], 'heavy.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 60 * 1024 * 1024 });
    expect(validatePdfRepairFile(bigFile)).toEqual({
      valid: false,
      error: 'file_too_large',
    });
  });

  it('builds standard repaired filenames', () => {
    expect(buildRepairedPdfFilename('broken.pdf')).toBe('broken_repaired.pdf');
    expect(buildRepairedPdfFilename('my_document.PDF')).toBe('my_document_repaired.pdf');
    expect(buildRepairedPdfFilename('corrupted')).toBe('corrupted_repaired.pdf');
  });

  describe('repairPdfDocument', () => {
    let validPdfFile: File;
    const corruptFile = new File(['corrupted-non-pdf-bytes'], 'broken.pdf', {
      type: 'application/pdf',
    });

    beforeEach(async () => {
      const pdf = await PDFDocument.create();
      pdf.addPage([100, 100]);
      const bytes = await pdf.save();
      validPdfFile = new File([bytes], 'valid.pdf', { type: 'application/pdf' });
    });

    it('prioritizes client-side repair and does not invoke fetch when client succeeds', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => new Blob(['remote-blob']),
      });
      vi.stubGlobal('fetch', fetchSpy);

      const result = await repairPdfDocument(validPdfFile, 'https://backend/api/pdf/repair');

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.size).toBeGreaterThan(0);
      expect(result.pageCount).toBe(1);
      expect(fetchSpy).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it('falls back to endpointUrl when client-side parsing fails', async () => {
      const serverBlob = new Blob(['%PDF-repaired-by-qpdf'], { type: 'application/pdf' });
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => serverBlob,
      });
      vi.stubGlobal('fetch', fetchSpy);

      const result = await repairPdfDocument(corruptFile, 'https://backend/api/pdf/repair');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://backend/api/pdf/repair',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(result.blob).toBe(serverBlob);

      vi.unstubAllGlobals();
    });

    it('throws when both client-side and remote server repair fail', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      vi.stubGlobal('fetch', fetchSpy);

      await expect(
        repairPdfDocument(corruptFile, 'https://backend/api/pdf/repair')
      ).rejects.toThrow('La réparation du document a échoué.');

      vi.unstubAllGlobals();
    });

    it('throws when server returns a 200 OK response with an empty 0-byte blob', async () => {
      const emptyBlob = new Blob([], { type: 'application/pdf' });
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => emptyBlob,
      });
      vi.stubGlobal('fetch', fetchSpy);

      await expect(
        repairPdfDocument(corruptFile, 'https://backend/api/pdf/repair')
      ).rejects.toThrow('La réparation du document a échoué.');

      vi.unstubAllGlobals();
    });

    it('throws when client-side fails and no endpointUrl is provided', async () => {
      await expect(repairPdfDocument(corruptFile)).rejects.toThrow(
        'La réparation du document a échoué.'
      );
    });
  });
});


