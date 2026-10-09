import { describe, it, expect } from 'vitest';
import {
  interpolatePresetSettings,
  getFilterFormatOptions,
} from '../../../src/lib/image-filters-export';
import { DEFAULT_FILTER_SETTINGS, AESTHETIC_PRESETS } from '../../../src/lib/image-filters-logic';

describe('image-filters-export', () => {
  it('provides format options with localized descriptions', () => {
    const frOptions = getFilterFormatOptions(true);
    expect(frOptions).toHaveLength(3);
    expect(frOptions[0].ext).toBe('png');
    expect(frOptions[0].description).toContain('Sans perte');

    const enOptions = getFilterFormatOptions(false);
    expect(enOptions[1].ext).toBe('jpg');
    expect(enOptions[1].description).toContain('Light & universal');
  });

  it('interpolates preset intensity accurately', () => {
    const portra = AESTHETIC_PRESETS.find((p) => p.id === 'portra-400')!;
    expect(portra).toBeDefined();

    // At 100%, settings should match the preset target
    const full = interpolatePresetSettings(portra, 100);
    expect(full.contrast).toBe(portra.settings.contrast);
    expect(full.sepia).toBe(portra.settings.sepia);

    // At 0%, settings should match default settings
    const zero = interpolatePresetSettings(portra, 0);
    expect(zero.contrast).toBe(DEFAULT_FILTER_SETTINGS.contrast);
    expect(zero.sepia).toBe(DEFAULT_FILTER_SETTINGS.sepia);

    // At 50%, settings should be halfway
    const half = interpolatePresetSettings(portra, 50);
    const expectedContrast = Math.round(
      DEFAULT_FILTER_SETTINGS.contrast + (portra.settings.contrast! - DEFAULT_FILTER_SETTINGS.contrast) * 0.5
    );
    expect(half.contrast).toBe(expectedContrast);
  });
});
