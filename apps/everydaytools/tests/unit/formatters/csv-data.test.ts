import { describe, it, expect } from 'vitest';
import {
  detectDelimiter,
  parseCsvRows,
  parseCsvToTable,
  tableToCsv,
  tableToJson,
  jsonToTable,
  filterAndSortTabularRows,
  paginateTabularRows,
} from '@/lib/csv-data-logic';

describe('CSV Data & Table Logic', () => {
  it('correctly auto-detects comma delimiter', () => {
    const csv = 'name,age,city\nAlice,30,Paris';
    expect(detectDelimiter(csv)).toBe(',');
  });

  it('correctly auto-detects semicolon delimiter', () => {
    const csv = 'Nom;Prénom;Ville\nDupont;Jean;Lyon';
    expect(detectDelimiter(csv)).toBe(';');
  });

  it('correctly auto-detects tab delimiter', () => {
    const csv = 'id\tscore\tstatus\n1\t98\tpass';
    expect(detectDelimiter(csv)).toBe('\t');
  });

  it('handles quotes and escaped quotes in cells properly', () => {
    const csv = 'id,title,desc\n1,"Hello, World","He said ""Great!"""';
    const rows = parseCsvRows(csv, ',');
    expect(rows.length).toBe(2);
    expect(rows[1][1]).toBe('Hello, World');
    expect(rows[1][2]).toBe('He said "Great!"');
  });

  it('converts CSV to structured table', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const table = parseCsvToTable(csv);
    expect(table.headers).toEqual(['a', 'b', 'c']);
    expect(table.rows).toEqual([['1', '2', '3'], ['4', '5', '6']]);
    expect(table.rowCount).toBe(2);
    expect(table.colCount).toBe(3);
  });

  it('converts table to JSON with automatic type inference (numbers, booleans)', () => {
    const headers = ['name', 'age', 'active'];
    const rows = [['Alice', '30', 'true'], ['Bob', '25', 'false']];
    const json = tableToJson(headers, rows);
    expect(json).toEqual([
      { name: 'Alice', age: 30, active: true },
      { name: 'Bob', age: 25, active: false },
    ]);
  });

  it('bidirectionally converts JSON to table and back', () => {
    const originalJson = JSON.stringify([
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ]);
    const { headers, rows } = jsonToTable(originalJson);
    expect(headers).toContain('id');
    expect(headers).toContain('title');
    expect(rows.length).toBe(2);
  });

  it('serializes table back to CSV escaping cells when necessary', () => {
    const headers = ['title', 'notes'];
    const rows = [['Meeting, 10am', 'Discuss "Quarterly" goals']];
    const csv = tableToCsv(headers, rows, ',');
    expect(csv).toContain('"Meeting, 10am"');
    expect(csv).toContain('"Discuss ""Quarterly"" goals"');
  });

  it('filters rows by search term across all columns', () => {
    const rows = [
      ['Alex', 'Paris', 'Engineer'],
      ['Sophie', 'Lyon', 'Designer'],
      ['Thomas', 'Bordeaux', 'Manager'],
    ];
    const filtered = filterAndSortTabularRows(rows, 'paris', null, null);
    expect(filtered.length).toBe(1);
    expect(filtered[0].row[0]).toBe('Alex');
    expect(filtered[0].originalIndex).toBe(0);

    const filteredPartial = filterAndSortTabularRows(rows, 'sign', null, null);
    expect(filteredPartial.length).toBe(1);
    expect(filteredPartial[0].row[0]).toBe('Sophie');
  });

  it('sorts numeric and text columns correctly', () => {
    const rows = [
      ['Item B', '100'],
      ['Item A', '25'],
      ['Item C', '10'],
    ];

    // Alphabetical sort asc
    const sortedTextAsc = filterAndSortTabularRows(rows, '', 0, 'asc');
    expect(sortedTextAsc.map((r) => r.row[0])).toEqual(['Item A', 'Item B', 'Item C']);

    // Numeric sort asc
    const sortedNumAsc = filterAndSortTabularRows(rows, '', 1, 'asc');
    expect(sortedNumAsc.map((r) => r.row[1])).toEqual(['10', '25', '100']);

    // Numeric sort desc
    const sortedNumDesc = filterAndSortTabularRows(rows, '', 1, 'desc');
    expect(sortedNumDesc.map((r) => r.row[1])).toEqual(['100', '25', '10']);
  });

  it('paginates tabular rows with bounds checking', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    expect(paginateTabularRows(items, 1, 3)).toEqual(['a', 'b', 'c']);
    expect(paginateTabularRows(items, 2, 3)).toEqual(['d', 'e', 'f']);
    expect(paginateTabularRows(items, 3, 3)).toEqual(['g']);
    expect(paginateTabularRows(items, 4, 3)).toEqual([]);
    expect(paginateTabularRows(items, 0, 3)).toEqual(['a', 'b', 'c']);
  });
});
