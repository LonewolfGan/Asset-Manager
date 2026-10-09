import { describe, it, expect } from 'vitest';
import {
  getPdfUnlockSourceFormat,
  getPdfUnlockTargetFormat,
  validatePdfUnlockFile,
  buildUnlockedPdfFilename,
} from '@/lib/pdf-unlock-logic';

describe('pdf-unlock-logic', () => {
  it('provides localized format metadata for source and target', () => {
    const srcFr = getPdfUnlockSourceFormat(true);
    expect(srcFr.extension).toBe('pdf');
    expect(srcFr.name).toBe('PDF');
    expect(srcFr.subLabel).toBe('Document protégé');

    const srcEn = getPdfUnlockSourceFormat(false);
    expect(srcEn.subLabel).toBe('Protected document');

    const targetFr = getPdfUnlockTargetFormat(true);
    expect(targetFr.subLabel).toBe('Document déverrouillé');

    const targetEn = getPdfUnlockTargetFormat(false);
    expect(targetEn.subLabel).toBe('Unlocked document');
  });

  it('validates PDF files and detects invalid formats or oversized files', () => {
    const validFile = new File(['%PDF-1.4'], 'secured.pdf', { type: 'application/pdf' });
    expect(validatePdfUnlockFile(validFile)).toEqual({ valid: true });

    const nonPdf = new File(['plain'], 'secured.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(validatePdfUnlockFile(nonPdf)).toEqual({
      valid: false,
      error: 'unsupported_format',
    });

    const bigFile = new File(['%PDF-1.4'], 'huge_locked.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 55 * 1024 * 1024 });
    expect(validatePdfUnlockFile(bigFile)).toEqual({
      valid: false,
      error: 'file_too_large',
    });
  });

  it('builds standard unlocked filenames', () => {
    expect(buildUnlockedPdfFilename('confidential.pdf')).toBe('confidential_unlocked.pdf');
    expect(buildUnlockedPdfFilename('REPORT.PDF')).toBe('REPORT_unlocked.pdf');
    expect(buildUnlockedPdfFilename('document')).toBe('document_unlocked.pdf');
  });
});
