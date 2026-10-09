import { describe, it, expect } from 'vitest';
import {
  AESTHETIC_PRESETS,
  DEFAULT_FILTER_SETTINGS,
  buildCssFilterString,
} from '../../../src/lib/image-filters-logic';

describe('image-filters-logic', () => {
  it('defines curated aesthetic presets including vintage, bw and golden hour', () => {
    expect(AESTHETIC_PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(AESTHETIC_PRESETS.some((p) => p.id === 'vintage-70')).toBe(true);
    expect(AESTHETIC_PRESETS.some((p) => p.id === 'bw-dramatic')).toBe(true);
  });

  it('builds valid CSS filter strings from settings', () => {
    expect(buildCssFilterString(DEFAULT_FILTER_SETTINGS)).toBe('none');

    const custom = {
      ...DEFAULT_FILTER_SETTINGS,
      brightness: 120,
      grayscale: 50,
      contrast: 130,
    };
    const css = buildCssFilterString(custom);
    expect(css).toContain('brightness(120%)');
    expect(css).toContain('grayscale(50%)');
    expect(css).toContain('contrast(130%)');
  });
});
