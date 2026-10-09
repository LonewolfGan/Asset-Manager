import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateCsvFile,
  buildExcelFilename,
  convertCsvToExcel,
} from '@/lib/csv-to-excel-logic';

describe('csv-to-excel-logic', () => {
  describe('Format descriptors', () => {
    it('returns valid source format metadata for fr and en', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('CSV');
      expect(frSource.extension).toBe('csv');
      expect(frSource.subLabel).toBe('Données CSV Délimitées');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Delimited CSV Data');
    });

    it('returns valid target format metadata', () => {
      const target = getTargetFormat();
      expect(target.name).toBe('Excel');
      expect(target.extension).toBe('xlsx');
      expect(target.subLabel).toBe('Microsoft Excel XLSX');
    });
  });

  describe('validateCsvFile', () => {
    it('accepts valid csv, tsv, and txt files under 50MB', () => {
      const csvFile = new File(['a,b,c\n1,2,3'], 'data.csv', { type: 'text/csv' });
      expect(validateCsvFile(csvFile, false)).toEqual({ isValid: true });

      const tsvFile = new File(['a\tb\tc'], 'data.tsv', { type: 'text/tab-separated-values' });
      expect(validateCsvFile(tsvFile, true)).toEqual({ isValid: true });

      const txtFile = new File(['1,2,3'], 'data.txt', { type: 'text/plain' });
      expect(validateCsvFile(txtFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'data.pdf', { type: 'application/pdf' });
      const result = validateCsvFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('CSV');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.csv', { type: 'text/csv' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validateCsvFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('buildExcelFilename', () => {
    it('replaces csv/tsv/txt extensions with xlsx in upload mode', () => {
      const csvFile = new File([''], 'clients.csv');
      expect(buildExcelFilename('upload', csvFile)).toBe('clients.xlsx');

      const tsvFile = new File([''], 'export.tsv');
      expect(buildExcelFilename('upload', tsvFile)).toBe('export.xlsx');

      const txtFile = new File([''], 'dump.txt');
      expect(buildExcelFilename('upload', txtFile)).toBe('dump.xlsx');
    });

    it('returns localized fallback in paste mode', () => {
      expect(buildExcelFilename('paste', undefined, true)).toBe('donnees-export.xlsx');
      expect(buildExcelFilename('paste', undefined, false)).toBe('export-data.xlsx');
    });
  });

  describe('convertCsvToExcel', () => {
    it('converts valid CSV text to an Excel spreadsheet blob', async () => {
      const csv = 'Name,Age,Role\nAlice,30,Developer\nBob,25,Designer';
      const blob = await convertCsvToExcel(csv, false);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('converts semicolons and European CSV formats', async () => {
      const csv = 'Produit;Prix;Stock\nCafé;3.50;100\nThé;2.80;50';
      const blob = await convertCsvToExcel(csv, true);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('throws error when CSV contains no valid data', async () => {
      await expect(convertCsvToExcel('', false)).rejects.toThrow();
      await expect(convertCsvToExcel('\n   \n', true)).rejects.toThrow();
    });
  });
});
