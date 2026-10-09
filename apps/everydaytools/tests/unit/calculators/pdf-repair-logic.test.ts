import { describe, it, expect } from 'vitest';
import {
  getPdfRepairSourceFormat,
  getPdfRepairTargetFormat,
  validatePdfRepairFile,
  buildRepairedPdfFilename,
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
});
