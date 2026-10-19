import { describe, it, expect } from 'vitest';
import {
  convertUnits,
  getFormulaExplanation,
  CATEGORY_ICONS,
  getPopularPresetsForCategory,
  POPULAR_UNIT_PRESETS,
} from './unit-converter-logic';
import { UNIT_CATEGORIES } from '@/config/units.config';

describe('unit-converter-logic (co-located tests)', () => {
  const lengthCategory = UNIT_CATEGORIES.find((c) => c.id === 'length')!;

  it('converts units properly', () => {
    const res = convertUnits('1000', 'meter', 'kilometer', lengthCategory.units, 'en-US');
    expect(res).toBe('1');
  });

  it('provides quick presets for length category', () => {
    const presets = getPopularPresetsForCategory('length');
    expect(presets.length).toBeGreaterThanOrEqual(3);
    expect(presets[0].fromUnit).toBe('kilometer');
    expect(presets[0].toUnit).toBe('mile');
  });
});
