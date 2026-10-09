import { describe, it, expect } from 'vitest';
import {
  filterAndSortRows,
  createBlankTable,
  createSampleTable,
  parseCsvString,
  generateCsvBlob,
} from '@/lib/csv-editor-logic';

describe('csv-editor-logic', () => {
  describe('filterAndSortRows', () => {
    const rows = [
      ['Charlie', '30', 'Paris'],
      ['Alice', '25', 'Lyon'],
      ['Bob', '35', 'Marseille'],
    ];

    it('returns all indexed rows when no filter or sort is applied', () => {
      const result = filterAndSortRows(rows, '', null);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ row: ['Charlie', '30', 'Paris'], originalIndex: 0 });
      expect(result[1]).toEqual({ row: ['Alice', '25', 'Lyon'], originalIndex: 1 });
      expect(result[2]).toEqual({ row: ['Bob', '35', 'Marseille'], originalIndex: 2 });
    });

    it('filters rows based on case-insensitive substring search', () => {
      const result = filterAndSortRows(rows, 'lyon', null);
      expect(result).toHaveLength(1);
      expect(result[0].row[0]).toBe('Alice');
      expect(result[0].originalIndex).toBe(1);
    });

    it('sorts rows alphabetically ascending and descending', () => {
      const asc = filterAndSortRows(rows, '', { colIndex: 0, direction: 'asc' });
      expect(asc.map((r) => r.row[0])).toEqual(['Alice', 'Bob', 'Charlie']);

      const desc = filterAndSortRows(rows, '', { colIndex: 0, direction: 'desc' });
      expect(desc.map((r) => r.row[0])).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('sorts rows numerically when values are numbers', () => {
      const asc = filterAndSortRows(rows, '', { colIndex: 1, direction: 'asc' });
      expect(asc.map((r) => r.row[0])).toEqual(['Alice', 'Charlie', 'Bob']);

      const desc = filterAndSortRows(rows, '', { colIndex: 1, direction: 'desc' });
      expect(desc.map((r) => r.row[0])).toEqual(['Bob', 'Charlie', 'Alice']);
    });
  });

  describe('table creation helpers', () => {
    it('creates blank table with expected columns and rows', () => {
      const blank = createBlankTable(true);
      expect(blank.headers).toHaveLength(4);
      expect(blank.rows).toHaveLength(5);
      expect(blank.documentName).toBe('nouveau_tableau');
    });

    it('creates sample table with localized content', () => {
      const sampleFr = createSampleTable(true);
      expect(sampleFr.headers.length).toBeGreaterThan(0);
      expect(sampleFr.rows.length).toBeGreaterThan(0);

      const sampleEn = createSampleTable(false);
      expect(sampleEn.documentName).toBe('sample_data');
    });
  });

  describe('csv serialization & parsing', () => {
    it('parses csv string accurately', () => {
      const csv = 'Name,Age\nJohn,28\nJane,32';
      const parsed = parseCsvString(csv);
      expect(parsed.headers).toEqual(['Name', 'Age']);
      expect(parsed.rows).toHaveLength(2);
      expect(parsed.rows[0]).toEqual(['John', '28']);
    });

    it('generates csv blob with specified delimiter', async () => {
      const headers = ['A', 'B'];
      const rows = [['1', '2']];
      const blob = generateCsvBlob(headers, rows, ';');
      expect(blob.type).toBe('text/csv;charset=utf-8');
      const text = await blob.text();
      expect(text).toContain('A;B');
      expect(text).toContain('1;2');
    });
  });
});
