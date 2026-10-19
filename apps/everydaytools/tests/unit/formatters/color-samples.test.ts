import { describe, it, expect } from 'vitest';
import { COLOR_PRESETS } from '@/lib/color-samples';

describe('color-samples', () => {
  it('defines curated color presets with valid hex and names', () => {
    expect(COLOR_PRESETS.length).toBeGreaterThanOrEqual(6);
    for (const preset of COLOR_PRESETS) {
      expect(preset.nameFr).toBeDefined();
      expect(preset.nameEn).toBeDefined();
      expect(preset.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
