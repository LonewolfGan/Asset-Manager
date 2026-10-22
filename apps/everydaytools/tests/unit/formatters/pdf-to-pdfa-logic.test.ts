import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  getConformanceOptions,
  buildPdfaFilename,
  validatePdfFile,
} from '@/lib/pdf-to-pdfa-logic';

describe('pdf-to-pdfa-logic', () => {
  it('provides correct source format descriptors', () => {
    const formatFr = getSourceFormat(true);
    expect(formatFr.name).toBe('PDF');
    expect(formatFr.extension).toBe('pdf');
    expect(formatFr.color).toBe('#EC1C24');
    expect(formatFr.subLabel).toBe('Document Adobe Acrobat');

    const formatEn = getSourceFormat(false);
    expect(formatEn.subLabel).toBe('Adobe Acrobat Document');
  });

  it('provides correct target format descriptors', () => {
    const formatFr = getTargetFormat(true);
    expect(formatFr.name).toBe('PDF/A');
    expect(formatFr.extension).toBe('pdf');
    expect(formatFr.color).toBe('#1D4ED8');
    expect(formatFr.subLabel).toBe('Archivage ISO 19005');

    const formatEn = getTargetFormat(false);
    expect(formatEn.subLabel).toBe('ISO 19005 Archival');
  });

  it('provides conformance options with PDF/A-2b, 1b and 3b', () => {
    const optionsFr = getConformanceOptions(true);
    expect(optionsFr.map((o) => o.id)).toEqual(['2b', '1b', '3b']);
    expect(optionsFr[0].badge).toBe('Recommandé');

    const optionsEn = getConformanceOptions(false);
    expect(optionsEn[0].badge).toBe('Recommended');
  });

  it('transforms pdf filenames to append conformance suffix', () => {
    expect(buildPdfaFilename('contract.pdf', '2b')).toBe('contract_pdfa2b.pdf');
    expect(buildPdfaFilename('ARCHIVE.PDF', '1b')).toBe('ARCHIVE_pdfa1b.pdf');
    expect(buildPdfaFilename('invoice.pdf', '3b')).toBe('invoice_pdfa3b.pdf');
  });

  it('validates supported pdf files correctly', () => {
    const validFile = new File(['mock content'], 'contract.pdf', {
      type: 'application/pdf',
    });
    const result = validatePdfFile(validFile, false);
    expect(result.isValid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const invalidFile = new File(['mock content'], 'image.png', {
      type: 'image/png',
    });
    const result = validatePdfFile(invalidFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Format non supporté');
  });

  it('rejects files exceeding 50MB limit', () => {
    const oversizedFile = new File([''], 'huge.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const result = validatePdfFile(oversizedFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Fichier trop volumineux');
  });
});
