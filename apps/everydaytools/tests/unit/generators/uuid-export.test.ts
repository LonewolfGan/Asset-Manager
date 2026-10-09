import { describe, it, expect } from 'vitest';
import {
  buildUuidTextFileContent,
  buildUuidCsvFileContent,
  buildFormatOptions,
  getUuidExportFilename,
} from '@/lib/uuid-export-logic';

describe('uuid-export-logic', () => {
  const sampleUuids = [
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'c9b4e6d2-28e4-4d89-9e8c-8f123456789a',
  ];

  describe('buildUuidTextFileContent', () => {
    it('joins uuids with newlines', () => {
      expect(buildUuidTextFileContent(sampleUuids)).toBe(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479\nc9b4e6d2-28e4-4d89-9e8c-8f123456789a'
      );
    });

    it('handles empty list', () => {
      expect(buildUuidTextFileContent([])).toBe('');
    });
  });

  describe('buildUuidCsvFileContent', () => {
    it('creates valid CSV with header and 1-based index', () => {
      const csv = buildUuidCsvFileContent(sampleUuids);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('Index,UUID');
      expect(lines[1]).toBe('1,f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(lines[2]).toBe('2,c9b4e6d2-28e4-4d89-9e8c-8f123456789a');
    });
  });

  describe('buildFormatOptions', () => {
    it('builds standard v4 format options', () => {
      const opts = buildFormatOptions('v4', true, false, 'none');
      expect(opts).toEqual({
        version: 'v4',
        hyphens: true,
        uppercase: false,
        braces: false,
        quotes: false,
      });
    });

    it('normalizes nil version to v4 in options with braces', () => {
      const opts = buildFormatOptions('nil', false, true, 'braces');
      expect(opts).toEqual({
        version: 'v4',
        hyphens: false,
        uppercase: true,
        braces: true,
        quotes: false,
      });
    });

    it('sets quotes to true when enclosure is quotes', () => {
      const opts = buildFormatOptions('v7', true, false, 'quotes');
      expect(opts.quotes).toBe(true);
      expect(opts.braces).toBe(false);
    });
  });

  describe('getUuidExportFilename', () => {
    it('constructs predictable export filenames', () => {
      expect(getUuidExportFilename('v4', 10, 'txt')).toBe('uuids-v4-10.txt');
      expect(getUuidExportFilename('v7', 50, 'csv')).toBe('uuids-v7-50.csv');
      expect(getUuidExportFilename('nil', 1, 'json')).toBe('uuids-nil-1.json');
    });
  });
});
