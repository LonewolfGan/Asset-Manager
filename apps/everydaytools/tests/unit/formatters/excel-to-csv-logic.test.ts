import { describe, it, expect, vi } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateExcelFile,
  convertExcelToCsv,
} from '@/lib/excel-to-csv-logic';

describe('excel-to-csv-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata with design tokens', () => {
      const source = getSourceFormat(true);
      expect(source.name).toBe('Excel');
      expect(source.extension).toBe('xlsx');
      expect(source.subLabel).toBe('Microsoft Excel');
      expect(source.color).toContain('var(--accent');
    });

    it('returns correct target format metadata with design tokens', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('CSV');
      expect(frTarget.extension).toBe('csv');
      expect(frTarget.subLabel).toBe('Données délimitées');
      expect(frTarget.color).toContain('var(--accent');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Comma-Separated');
    });
  });

  describe('validateExcelFile', () => {
    it('accepts valid xlsx, xls, and ods files under 50MB', () => {
      const xlsxFile = new File([''], 'data.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      expect(validateExcelFile(xlsxFile, false)).toEqual({ isValid: true });

      const xlsFile = new File([''], 'data.xls', {
        type: 'application/vnd.ms-excel',
      });
      expect(validateExcelFile(xlsFile, true)).toEqual({ isValid: true });

      const odsFile = new File([''], 'data.ods', { type: '' });
      expect(validateExcelFile(odsFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats and mentions OpenDocument in error message', () => {
      const pdfFile = new File(['%PDF'], 'table.pdf', { type: 'application/pdf' });
      const frResult = validateExcelFile(pdfFile, true);
      expect(frResult.isValid).toBe(false);
      expect(frResult.error).toContain('OpenDocument');
      expect(frResult.error).toContain('.ods');

      const enResult = validateExcelFile(pdfFile, false);
      expect(enResult.isValid).toBe(false);
      expect(enResult.error).toContain('OpenDocument');
      expect(enResult.error).toContain('.ods');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.xlsx', { type: 'application/vnd.ms-excel' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validateExcelFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('convertExcelToCsv', () => {
    it('converts an excel workbook buffer to csv format', async () => {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet([
        ['Name', 'Age'],
        ['Alice', 30],
        ['Bob', 25],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      const wbBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      const fakeFile = new File([wbBuf], 'company.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const res = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'Employees',
      });

      expect(res.filename).toBe('company.csv');
      expect(res.textOutput).toContain('Name,Age');
      expect(res.textOutput).toContain('Alice,30');
      expect(res.textOutput).toContain('Bob,25');
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.sizeAfter).toBeGreaterThan(0);
    });

    it('converts with custom delimiter (semicolon and tab)', async () => {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet([
        ['Country', 'Capital'],
        ['France', 'Paris'],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Geographie');
      const wbBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      const fakeFile = new File([wbBuf], 'geo.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const resSemicolon = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'Geographie',
        delimiter: ';',
      });
      expect(resSemicolon.textOutput).toContain('Country;Capital');
      expect(resSemicolon.textOutput).toContain('France;Paris');

      const resTab = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'Geographie',
        delimiter: '\t',
      });
      expect(resTab.textOutput).toContain('Country\tCapital');
    });

    it('sanitizes sheet names with special characters when multiple sheets exist', async () => {
      const XLSX = await import('xlsx');
      const ws1 = XLSX.utils.aoa_to_sheet([['A'], [1]]);
      const ws2 = XLSX.utils.aoa_to_sheet([['B'], [2]]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');
      XLSX.utils.book_append_sheet(wb, ws2, 'Rapport Q1 2026');
      const wbBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      const fakeFile = new File([wbBuf], 'financials.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const res = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'Rapport Q1 2026',
      });

      expect(res.filename).toBe('financials_Rapport_Q1_2026.csv');
    });

    it('handles gracefully a workbook with non-existent or corrupted target sheet', async () => {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet([['A'], [1]]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ValidSheet');
      const wbBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      const fakeFile = new File([wbBuf], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const res = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'MissingSheet',
      });

      expect(res.textOutput).toBe('');
      expect(res.blob).toBeInstanceOf(Blob);
    });
  });
});
