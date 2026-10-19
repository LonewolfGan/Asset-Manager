import { describe, it, expect } from 'vitest';
import { LOREM_PRESETS } from '../../../src/lib/lorem-samples';

describe('lorem-samples presets', () => {
  it('defines valid curated presets with unit, count, and flavor', () => {
    expect(LOREM_PRESETS.length).toBeGreaterThanOrEqual(4);
    for (const preset of LOREM_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.labelFr).toBeDefined();
      expect(preset.labelEn).toBeDefined();
      expect(['paragraphs', 'sentences', 'words', 'lists']).toContain(preset.unit);
      expect(preset.count).toBeGreaterThan(0);
      expect(['classic', 'tech', 'culinary', 'business']).toContain(preset.flavor);
    }
  });
});
