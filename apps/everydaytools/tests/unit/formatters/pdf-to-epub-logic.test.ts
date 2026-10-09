import { describe, it, expect, vi } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
} from '@/lib/pdf-to-epub-logic';

describe('pdf-to-epub-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('PDF');
      expect(frSource.extension).toBe('pdf');
      expect(frSource.subLabel).toBe('Document Adobe Acrobat');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Adobe Acrobat Document');
    });

    it('returns correct target format metadata', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('EPUB');
      expect(frTarget.extension).toBe('epub');
      expect(frTarget.subLabel).toBe('Livre numérique ePub');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Flowable EPUB E-Book');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid pdf files under 50MB', () => {
      const pdfFile = new File(['%PDF-1.4'], 'book.pdf', { type: 'application/pdf' });
      expect(validatePdfFile(pdfFile, false)).toEqual({ isValid: true });

      const nameOnlyPdf = new File(['%PDF'], 'document.pdf', { type: '' });
      expect(validatePdfFile(nameOnlyPdf, true)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const docxFile = new File(['PK'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const result = validatePdfFile(docxFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('PDF');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validatePdfFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });
});
