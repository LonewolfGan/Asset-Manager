import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatFileSize,
  buildStatisticalReport,
  buildJsonStatisticsPayload,
} from '@/lib/word-counter-export-logic';
import type { DetailedTextStats } from '@/lib/word-counter-logic';

describe('word-counter-export-logic', () => {
  describe('formatDuration', () => {
    it('formats 0 or negative seconds as 0 s', () => {
      expect(formatDuration(0)).toBe('0 s');
      expect(formatDuration(-5)).toBe('0 s');
    });

    it('formats seconds only', () => {
      expect(formatDuration(42)).toBe('42 s');
    });

    it('formats exact minutes', () => {
      expect(formatDuration(120)).toBe('2 min');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(135)).toBe('2 min 15 s');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes in French and English', () => {
      expect(formatFileSize(500, true)).toBe('500 o');
      expect(formatFileSize(500, false)).toBe('500 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(2048, true)).toBe('2.0 Ko');
      expect(formatFileSize(2048, false)).toBe('2.0 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(5 * 1024 * 1024, true)).toBe('5.0 Mo');
      expect(formatFileSize(5 * 1024 * 1024, false)).toBe('5.0 MB');
    });
  });

  describe('buildStatisticalReport', () => {
    const sampleStats: DetailedTextStats = {
      words: 100,
      characters: 600,
      charactersNoSpaces: 500,
      sentences: 8,
      paragraphs: 3,
      lines: 10,
      avgWordLength: 5,
      readingTimeSec: 30,
      speakingTimeSec: 50,
      topKeywords: [{ word: 'test', count: 5, percentage: 5 }],
    };

    it('builds French markdown report with key metrics', () => {
      const report = buildStatisticalReport(sampleStats, true);
      expect(report).toContain("Rapport d'analyse textuelle");
      expect(report).toContain('Mots : 100');
      expect(report).toContain('Phrases : 8');
      expect(report).toContain('Paragraphes : 3');
      expect(report).toContain('- test : 5 occurrences (5%)');
    });

    it('builds English markdown report with key metrics', () => {
      const report = buildStatisticalReport(sampleStats, false);
      expect(report).toContain('Text analysis report');
      expect(report).toContain('Words : 100');
      expect(report).toContain('Sentences : 8');
    });
  });

  describe('buildJsonStatisticsPayload', () => {
    it('creates formatted json string containing timestamp and stats', () => {
      const sampleStats: DetailedTextStats = {
        words: 50,
        characters: 250,
        charactersNoSpaces: 200,
        sentences: 4,
        paragraphs: 2,
        lines: 5,
        avgWordLength: 4,
        readingTimeSec: 15,
        speakingTimeSec: 25,
        topKeywords: [],
      };
      const json = buildJsonStatisticsPayload(sampleStats);
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed.stats.words).toBe(50);
    });
  });
});
