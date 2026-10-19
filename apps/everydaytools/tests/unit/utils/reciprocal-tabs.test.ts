import { describe, it, expect } from 'vitest';
import { getReciprocalTabs } from '@/lib/reciprocal-tools';

describe('getReciprocalTabs (TDD)', () => {
  it('returns null for tools without reciprocal mapping', () => {
    expect(getReciprocalTabs('pdf-compress', true)).toBeNull();
  });

  it('provides stable tab order for csv-to-json and json-to-csv', () => {
    const csvToJsonTabs = getReciprocalTabs('csv-to-json', false);
    expect(csvToJsonTabs).not.toBeNull();
    expect(csvToJsonTabs![0].label).toBe('CSV → JSON');
    expect(csvToJsonTabs![0].isActive).toBe(true);
    expect(csvToJsonTabs![0].sourceFormat).toBe('csv');
    expect(csvToJsonTabs![1].label).toBe('JSON → CSV');
    expect(csvToJsonTabs![1].isActive).toBe(false);
    expect(csvToJsonTabs![1].sourceFormat).toBe('json');

    const jsonToCsvTabs = getReciprocalTabs('json-to-csv', false);
    expect(jsonToCsvTabs).not.toBeNull();
    expect(jsonToCsvTabs![0].label).toBe('CSV → JSON');
    expect(jsonToCsvTabs![0].isActive).toBe(false);
    expect(jsonToCsvTabs![0].sourceFormat).toBe('csv');
    expect(jsonToCsvTabs![1].label).toBe('JSON → CSV');
    expect(jsonToCsvTabs![1].isActive).toBe(true);
    expect(jsonToCsvTabs![1].sourceFormat).toBe('json');
  });

  it('provides stable tab order for word-to-pdf and pdf-to-word', () => {
    const wordToPdf = getReciprocalTabs('word-to-pdf', true);
    expect(wordToPdf![0].label).toBe('Word → PDF');
    expect(wordToPdf![0].isActive).toBe(true);
    expect(wordToPdf![1].label).toBe('PDF → Word');
    expect(wordToPdf![1].isActive).toBe(false);

    const pdfToWord = getReciprocalTabs('pdf-to-word', true);
    expect(pdfToWord![0].label).toBe('Word → PDF');
    expect(pdfToWord![0].isActive).toBe(false);
    expect(pdfToWord![1].label).toBe('PDF → Word');
    expect(pdfToWord![1].isActive).toBe(true);
  });
});
