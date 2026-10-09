import { describe, it, expect } from 'vitest';
import {
  convertCsvToJson,
  convertJsonToCsv,
  validateCsvJsonFile,
  resolveConvertedFilename,
  getCsvFormat,
  getJsonFormat,
} from '@/lib/csv-json-conversion-logic';

describe('csv-json-conversion-logic', () => {
  it('converts valid CSV text to formatted JSON array', () => {
    const csv = 'id,nom,actif\n1,Alice,true\n2,Bob,false';
    const jsonStr = convertCsvToJson(csv, true);
    const parsed = JSON.parse(jsonStr);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(2);
    expect(parsed[0]).toEqual({ id: 1, nom: 'Alice', actif: true });
    expect(parsed[1]).toEqual({ id: 2, nom: 'Bob', actif: false });
  });

  it('throws descriptive error on invalid or empty CSV', () => {
    expect(() => convertCsvToJson('', true)).toThrow();
  });

  it('converts valid JSON array to standard CSV text', () => {
    const json = JSON.stringify([
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
    ]);
    const csvStr = convertJsonToCsv(json, true);

    expect(csvStr).toContain('id');
    expect(csvStr).toContain('name');
    expect(csvStr).toContain('role');
    expect(csvStr).toContain('Alice');
    expect(csvStr).toContain('Bob');
  });

  it('handles single JSON object by wrapping into a row', () => {
    const json = JSON.stringify({ id: 1, name: 'Solo' });
    const csvStr = convertJsonToCsv(json, true);

    expect(csvStr).toContain('id');
    expect(csvStr).toContain('Solo');
  });

  it('throws error when JSON array is empty or malformed', () => {
    expect(() => convertJsonToCsv('[]', true)).toThrow();
    expect(() => convertJsonToCsv('{ invalid json }', true)).toThrow();
  });

  it('validates files according to direction and size limit', () => {
    const csvFile = new File(['a,b'], 'data.csv', { type: 'text/csv' });
    expect(validateCsvJsonFile(csvFile, 'csv-to-json')).toEqual({ valid: true });

    const jsonFile = new File(['[]'], 'data.json', { type: 'application/json' });
    expect(validateCsvJsonFile(jsonFile, 'json-to-csv')).toEqual({ valid: true });

    const wrongFile = new File(['text'], 'data.pdf', { type: 'application/pdf' });
    expect(validateCsvJsonFile(wrongFile, 'csv-to-json')).toEqual({
      valid: false,
      error: 'unsupported_format',
    });

    const largeFile = new File([''], 'big.csv', { type: 'text/csv' });
    Object.defineProperty(largeFile, 'size', { value: 30 * 1024 * 1024 });
    expect(validateCsvJsonFile(largeFile, 'csv-to-json')).toEqual({
      valid: false,
      error: 'file_too_large',
    });
  });

  it('resolves output filenames accurately', () => {
    const csvFile = new File([''], 'users_export.csv');
    expect(
      resolveConvertedFilename('upload', csvFile, 'csv-to-json', true)
    ).toBe('users_export.json');

    const jsonFile = new File([''], 'config.json');
    expect(
      resolveConvertedFilename('upload', jsonFile, 'json-to-csv', true)
    ).toBe('config.csv');

    expect(
      resolveConvertedFilename('paste', null, 'csv-to-json', true)
    ).toBe('donnees-converties.json');
    expect(
      resolveConvertedFilename('paste', null, 'json-to-csv', false)
    ).toBe('converted-data.csv');
  });

  it('provides localized format metadata', () => {
    const csvFr = getCsvFormat(true);
    const jsonEn = getJsonFormat(false);
    expect(csvFr.extension).toBe('csv');
    expect(jsonEn.extension).toBe('json');
    expect(csvFr.color).toBe('#21A366');
    expect(jsonEn.color).toBe('#F5A623');
  });
});
