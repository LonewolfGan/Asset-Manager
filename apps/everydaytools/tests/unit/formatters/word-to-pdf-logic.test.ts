import { describe, it, expect } from 'vitest';
import {
  validateWordFile,
  generatePdfFileName,
  getSourceFormat,
  getTargetFormat,
  MAX_WORD_FILE_SIZE,
} from '@/lib/word-to-pdf-logic';

describe('word-to-pdf-logic [TDD-Lock ECC]', () => {
  describe('validateWordFile', () => {
    it('accepts valid .docx file', () => {
      const file = new File(['mock content'], 'rapport-annuel.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const resFr = validateWordFile(file, true);
      const resEn = validateWordFile(file, false);

      expect(resFr.valid).toBe(true);
      expect(resFr.error).toBeUndefined();
      expect(resEn.valid).toBe(true);
    });

    it('accepts valid legacy .doc file', () => {
      const file = new File(['mock content'], 'contrat.doc', {
        type: 'application/msword',
      });
      const res = validateWordFile(file, true);
      expect(res.valid).toBe(true);
    });

    it('accepts file with uppercase extension .DOCX or .DOC', () => {
      const file = new File(['mock content'], 'SPECIFICATION.DOCX', {
        type: '',
      });
      const res = validateWordFile(file, false);
      expect(res.valid).toBe(true);
    });

    it('rejects unsupported file extensions with bilingual error message', () => {
      const file = new File(['mock content'], 'photo.png', {
        type: 'image/png',
      });
      const resFr = validateWordFile(file, true);
      const resEn = validateWordFile(file, false);

      expect(resFr.valid).toBe(false);
      expect(resFr.error).toMatch(/docx.*doc/i);
      expect(resEn.valid).toBe(false);
      expect(resEn.error).toMatch(/valid Word/i);
    });

    it('rejects file larger than MAX_WORD_FILE_SIZE (50 MB) with bilingual message', () => {
      const oversizedFile = {
        name: 'gros-document.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: MAX_WORD_FILE_SIZE + 1024,
      } as unknown as File;

      const resFr = validateWordFile(oversizedFile, true);
      const resEn = validateWordFile(oversizedFile, false);

      expect(resFr.valid).toBe(false);
      expect(resFr.error).toMatch(/50 Mo/);
      expect(resEn.valid).toBe(false);
      expect(resEn.error).toMatch(/50 MB/);
    });
  });

  describe('generatePdfFileName', () => {
    it('replaces .docx extension with .pdf', () => {
      expect(generatePdfFileName('document.docx')).toBe('document.pdf');
      expect(generatePdfFileName('DOCUMENT.DOCX')).toBe('DOCUMENT.pdf');
    });

    it('replaces .doc extension with .pdf', () => {
      expect(generatePdfFileName('archives.doc')).toBe('archives.pdf');
      expect(generatePdfFileName('NOTE.DOC')).toBe('NOTE.pdf');
    });

    it('handles files with multiple dots', () => {
      expect(generatePdfFileName('mon.projet.v2.docx')).toBe('mon.projet.v2.pdf');
    });

    it('appends .pdf if no recognized Word extension', () => {
      expect(generatePdfFileName('document')).toBe('document.pdf');
    });
  });

  describe('getSourceFormat and getTargetFormat', () => {
    it('returns compliant format configurations without raw non-standard hex', () => {
      const source = getSourceFormat(true);
      const target = getTargetFormat(true);

      expect(source.name).toBe('Word');
      expect(source.extension).toBe('docx');
      expect(source.icon).toBe('/icons/word.svg');
      expect(source.color).toContain('var(--accent');

      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.icon).toBe('/icons/pdf.svg');
      expect(target.color).toContain('var(--accent');
    });

    it('localizes sublabels correctly in French and English', () => {
      const sourceFr = getSourceFormat(true);
      const sourceEn = getSourceFormat(false);
      const targetFr = getTargetFormat(true);
      const targetEn = getTargetFormat(false);

      expect(sourceFr.subLabel).toBe('Format Word (.docx)');
      expect(sourceEn.subLabel).toBe('Word Format (.docx)');
      expect(targetFr.subLabel).toBe('Document Adobe Acrobat');
      expect(targetEn.subLabel).toBe('Adobe Acrobat Document');
    });
  });
});
