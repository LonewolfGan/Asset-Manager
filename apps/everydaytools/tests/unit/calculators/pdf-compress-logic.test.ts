import { describe, it, expect } from 'vitest';
import {
  getPdfFormat,
  getPresets,
  calculateEstimatedSize,
  calculateGain,
  formatResultFilename,
  validatePdfFile,
  type Level,
} from '@/lib/pdf-compress-logic';

describe('pdf-compress-logic', () => {
  describe('getPdfFormat', () => {
    it('returns French sublabel when isFr is true', () => {
      const format = getPdfFormat(true);
      expect(format.name).toBe('PDF');
      expect(format.extension).toBe('pdf');
      expect(format.subLabel).toBe('Document Adobe Acrobat');
      expect(format.color).toBe('#EC1C24');
    });

    it('returns English sublabel when isFr is false', () => {
      const format = getPdfFormat(false);
      expect(format.subLabel).toBe('Adobe Acrobat Document');
    });
  });

  describe('getPresets', () => {
    it('provides three compression levels with expected ratios', () => {
      const presets = getPresets(true);
      expect(presets).toHaveLength(3);
      expect(presets.map((p) => p.id)).toEqual(['prepress', 'ebook', 'screen']);
      expect(presets.find((p) => p.id === 'prepress')?.ratio).toBe(0.75);
      expect(presets.find((p) => p.id === 'ebook')?.ratio).toBe(0.4);
      expect(presets.find((p) => p.id === 'screen')?.ratio).toBe(0.2);
    });

    it('localizes names, tags and descriptions correctly in French and English', () => {
      const frPresets = getPresets(true);
      const enPresets = getPresets(false);

      expect(frPresets[0].name).toBe('Légère');
      expect(enPresets[0].name).toBe('Light');

      expect(frPresets[1].name).toBe('Équilibrée');
      expect(enPresets[1].name).toBe('Balanced');

      expect(frPresets[2].name).toBe('Maximale');
      expect(enPresets[2].name).toBe('Extreme');
    });
  });

  describe('calculateEstimatedSize', () => {
    it('calculates estimated size with minimum lower bound of 1024 bytes', () => {
      expect(calculateEstimatedSize(10_000_000, 0.4)).toBe(4_000_000);
      expect(calculateEstimatedSize(100, 0.2)).toBe(1024);
    });
  });

  describe('calculateGain', () => {
    it('computes reduction percentage between original and compressed size', () => {
      expect(calculateGain(10_000, 4_000)).toBe(60);
      expect(calculateGain(10_000, 10_000)).toBe(0);
      expect(calculateGain(10_000, 12_000)).toBe(0);
      expect(calculateGain(0, 100)).toBe(0);
    });
  });

  describe('formatResultFilename', () => {
    it('appends _compresse in French and _compressed in English before .pdf extension', () => {
      expect(formatResultFilename('rapport.pdf', true)).toBe('rapport_compresse.pdf');
      expect(formatResultFilename('contract.PDF', false)).toBe('contract_compressed.pdf');
      expect(formatResultFilename('document', true)).toBe('document_compresse.pdf');
    });
  });

  describe('validatePdfFile', () => {
    it('accepts valid PDF file under 50 MB', () => {
      const valid = validatePdfFile(
        { name: 'doc.pdf', size: 1024 * 1024, type: 'application/pdf' },
        true
      );
      expect(valid.isValid).toBe(true);
      expect(valid.error).toBeUndefined();
    });

    it('rejects non-PDF files', () => {
      const invalid = validatePdfFile(
        { name: 'photo.jpg', size: 1024, type: 'image/jpeg' },
        true
      );
      expect(invalid.isValid).toBe(false);
      expect(invalid.error).toBe('Veuillez sélectionner un fichier PDF valide.');
    });

    it('rejects files larger than 50 MB', () => {
      const tooLarge = validatePdfFile(
        { name: 'huge.pdf', size: 55 * 1024 * 1024, type: 'application/pdf' },
        false
      );
      expect(tooLarge.isValid).toBe(false);
      expect(tooLarge.error).toBe('File exceeds maximum allowed size of 50 MB.');
    });
  });
});
