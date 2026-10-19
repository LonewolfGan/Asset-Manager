import { describe, it, expect } from 'vitest';
import { WORD_COUNTER_SAMPLES, type WordCounterSample } from '@/lib/word-counter-samples';

describe('word-counter-samples', () => {
  it('defines curated text samples with French and English labels and valid content', () => {
    expect(WORD_COUNTER_SAMPLES.length).toBeGreaterThanOrEqual(3);

    for (const sample of WORD_COUNTER_SAMPLES) {
      expect(sample.id).toBeDefined();
      expect(sample.labelFr).toBeDefined();
      expect(sample.labelEn).toBeDefined();
      expect(sample.content.trim().length).toBeGreaterThan(50);
    }
  });

  it('contains expected domain samples (Editorial, Tech, Speech)', () => {
    const ids = WORD_COUNTER_SAMPLES.map((s) => s.id);
    expect(ids).toContain('editorial');
    expect(ids).toContain('tech');
    expect(ids).toContain('speech');
  });
});
