import { describe, it, expect } from 'vitest';
import {
  POPULAR_UNIT_PRESETS,
  getPopularPresetsForCategory,
} from '@/lib/unit-converter-logic';

describe('unit-popular-presets (TDD RED Phase)', () => {
  it('exposes popular unit presets for primary categories', () => {
    expect(POPULAR_UNIT_PRESETS.length).toBeDefined();
    expect(POPULAR_UNIT_PRESETS.temperature).toBeDefined();
    expect(POPULAR_UNIT_PRESETS.mass).toBeDefined();
    expect(POPULAR_UNIT_PRESETS.digital).toBeDefined();
  });

  it('retrieves presets by category ID and returns empty array for unknown category', () => {
    const lengthPresets = getPopularPresetsForCategory('length');
    expect(lengthPresets.length).toBeGreaterThanOrEqual(3);

    const kmToMi = lengthPresets.find((p) => p.id === 'km-to-mi');
    expect(kmToMi).toBeDefined();
    expect(kmToMi?.fromUnit).toBe('kilometer');
    expect(kmToMi?.toUnit).toBe('mile');

    const unknown = getPopularPresetsForCategory('non-existent');
    expect(unknown).toEqual([]);
  });

  it('includes bilingual labels for UI pills', () => {
    const tempPresets = getPopularPresetsForCategory('temperature');
    const cToF = tempPresets.find((p) => p.id === 'c-to-f');
    expect(cToF).toBeDefined();
    expect(cToF?.label).toContain('Celsius to Fahrenheit');
    expect(cToF?.labelFr).toContain('Celsius en Fahrenheit');
  });
});
