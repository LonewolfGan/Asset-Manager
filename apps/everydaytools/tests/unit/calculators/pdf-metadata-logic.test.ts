import { describe, it, expect } from 'vitest';
import {
  formatDate,
  inferTitleFromFilename,
  cleanTag,
  QUICK_TAG_SUGGESTIONS,
  LANGUAGE_OPTIONS,
} from '../../../src/lib/pdf-metadata-logic';

describe('pdf-metadata-logic', () => {
  it('formats dates localized or returns fallback for invalid/empty dates', () => {
    expect(formatDate(null, true)).toBe('Non spécifiée');
    expect(formatDate(undefined, false)).toBe('Not specified');
    expect(formatDate(new Date('invalid'), true)).toBe('Non spécifiée');

    const sampleDate = new Date('2026-04-15T12:00:00Z');
    const frFormatted = formatDate(sampleDate, true);
    expect(frFormatted).toContain('2026');

    const enFormatted = formatDate(sampleDate, false);
    expect(enFormatted).toContain('2026');
  });

  it('infers capitalized clean title from filename', () => {
    expect(inferTitleFromFilename('rapport-annuel-2026.pdf')).toBe('Rapport annuel 2026');
    expect(inferTitleFromFilename('contrat_commercial_final.PDF')).toBe('Contrat commercial final');
    expect(inferTitleFromFilename('whitepaper.pdf')).toBe('Whitepaper');
  });

  it('cleans tags by trimming whitespace and punctuation', () => {
    expect(cleanTag('  confidentiel, ')).toBe('confidentiel');
    expect(cleanTag(',finance,')).toBe('finance');
    expect(cleanTag('   ')).toBe('');
  });

  it('provides comprehensive quick suggestions and language options', () => {
    expect(QUICK_TAG_SUGGESTIONS.length).toBeGreaterThanOrEqual(6);
    expect(LANGUAGE_OPTIONS.some((opt) => opt.value === 'fr-FR')).toBe(true);
    expect(LANGUAGE_OPTIONS.some((opt) => opt.value === 'en-US')).toBe(true);
  });
});
