import { describe, it, expect } from 'vitest';
import {
  formatPageNumberLabel,
  getPositionOptions,
  getFormatOptions,
  type PdfNumberPosition,
} from '@/lib/pdf-page-numbers-logic';

describe('PDF Page Numbers Logic', () => {
  describe('formatPageNumberLabel', () => {
    it('formats plain number format {n}', () => {
      const label = formatPageNumberLabel({
        format: '{n}',
        previewPage: 1,
        startNum: 1,
        skipFirst: false,
        totalPages: 5,
        isFr: true,
      });
      expect(label).toBe('1');

      const labelP3 = formatPageNumberLabel({
        format: '{n}',
        previewPage: 3,
        startNum: 1,
        skipFirst: false,
        totalPages: 5,
        isFr: true,
      });
      expect(labelP3).toBe('3');
    });

    it('respects custom start number offset', () => {
      const label = formatPageNumberLabel({
        format: '{n}',
        previewPage: 1,
        startNum: 10,
        skipFirst: false,
        totalPages: 5,
        isFr: true,
      });
      expect(label).toBe('10');

      const labelP2 = formatPageNumberLabel({
        format: '{n}',
        previewPage: 2,
        startNum: 10,
        skipFirst: false,
        totalPages: 5,
        isFr: true,
      });
      expect(labelP2).toBe('11');
    });

    it('formats Page {n} and {n}/{total}', () => {
      const pageN = formatPageNumberLabel({
        format: 'Page {n}',
        previewPage: 4,
        startNum: 1,
        skipFirst: false,
        totalPages: 10,
        isFr: true,
      });
      expect(pageN).toBe('Page 4');

      const slashTotal = formatPageNumberLabel({
        format: '{n}/{total}',
        previewPage: 4,
        startNum: 1,
        skipFirst: false,
        totalPages: 10,
        isFr: true,
      });
      expect(slashTotal).toBe('4/10');
    });

    it('formats Page {n} of {total} in FR and EN', () => {
      const frLabel = formatPageNumberLabel({
        format: 'Page {n} of {total}',
        previewPage: 2,
        startNum: 1,
        skipFirst: false,
        totalPages: 8,
        isFr: true,
      });
      expect(frLabel).toBe('Page 2 sur 8');

      const enLabel = formatPageNumberLabel({
        format: 'Page {n} of {total}',
        previewPage: 2,
        startNum: 1,
        skipFirst: false,
        totalPages: 8,
        isFr: false,
      });
      expect(enLabel).toBe('Page 2 of 8');
    });

    it('handles skipFirst (cover page exclusion)', () => {
      // Page 1 should return null when skipFirst is true
      const cover = formatPageNumberLabel({
        format: '{n}',
        previewPage: 1,
        startNum: 1,
        skipFirst: true,
        totalPages: 10,
        isFr: true,
      });
      expect(cover).toBeNull();

      // Page 2 should be numbered as 1, with total count reduced to 9
      const page2 = formatPageNumberLabel({
        format: '{n}/{total}',
        previewPage: 2,
        startNum: 1,
        skipFirst: true,
        totalPages: 10,
        isFr: true,
      });
      expect(page2).toBe('1/9');
    });
  });

  describe('position and format options', () => {
    it('returns all 6 geometric positions with proper labels', () => {
      const options = getPositionOptions({}, true);
      expect(options.length).toBe(6);
      const ids = options.map((o) => o.id);
      expect(ids).toEqual([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]);
      expect(options[0].shortLabel).toBe('Haut G.');
    });

    it('returns all 4 numbering formats with locale strings', () => {
      const optionsFr = getFormatOptions(true);
      expect(optionsFr.length).toBe(4);
      expect(optionsFr.find((o) => o.id === 'Page {n} of {total}')?.label).toBe('Page 1 sur 10...');

      const optionsEn = getFormatOptions(false);
      expect(optionsEn.find((o) => o.id === 'Page {n} of {total}')?.label).toBe('Page 1 of 10...');
    });
  });
});
