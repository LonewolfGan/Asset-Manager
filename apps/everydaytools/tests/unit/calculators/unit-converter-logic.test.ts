import { describe, it, expect } from 'vitest';
import {
  convertUnits,
  getFormulaExplanation,
  CATEGORY_ICONS,
} from '@/lib/unit-converter-logic';
import { UNIT_CATEGORIES } from '@/config/units.config';

describe('unit-converter-logic', () => {
  const lengthCategory = UNIT_CATEGORIES.find((c) => c.id === 'length')!;
  const tempCategory = UNIT_CATEGORIES.find((c) => c.id === 'temperature')!;

  describe('convertUnits', () => {
    it('returns empty string when input is empty or whitespace', () => {
      expect(convertUnits('', 'meter', 'kilometer', lengthCategory.units)).toBe('');
      expect(convertUnits('   ', 'meter', 'kilometer', lengthCategory.units)).toBe('');
    });

    it('returns "—" when input is not a number', () => {
      expect(convertUnits('abc', 'meter', 'kilometer', lengthCategory.units)).toBe('—');
    });

    it('returns "—" when source or target unit is unknown', () => {
      expect(convertUnits('10', 'unknown', 'kilometer', lengthCategory.units)).toBe('—');
      expect(convertUnits('10', 'meter', 'unknown', lengthCategory.units)).toBe('—');
    });

    it('converts units accurately within length category', () => {
      // 1000 meters = 1 kilometer
      const res = convertUnits('1000', 'meter', 'kilometer', lengthCategory.units, 'en-US');
      expect(res).toBe('1');

      // 1 meter = 100 centimeters
      const cmRes = convertUnits('1', 'meter', 'centimeter', lengthCategory.units, 'en-US');
      expect(cmRes).toBe('100');
    });

    it('handles commas as decimal points', () => {
      const res = convertUnits('1,5', 'kilometer', 'meter', lengthCategory.units, 'en-US');
      expect(res).toBe('1,500');
    });

    it('returns "0" when result value is 0', () => {
      const res = convertUnits('0', 'meter', 'kilometer', lengthCategory.units, 'en-US');
      expect(res).toBe('0');
    });

    it('formats exponential for extreme values', () => {
      // 1 light year to millimeters is huge
      const res = convertUnits('1', 'light-year', 'millimeter', lengthCategory.units, 'en-US');
      expect(res).toMatch(/e\+/i);
    });

    it('converts temperatures correctly (including non-proportional affine formulas)', () => {
      // 0 °C = 32 °F
      const cToF = convertUnits('0', 'celsius', 'fahrenheit', tempCategory.units, 'en-US');
      expect(cToF).toBe('32');

      // 100 °C = 212 °F
      const boiling = convertUnits('100', 'celsius', 'fahrenheit', tempCategory.units, 'en-US');
      expect(boiling).toBe('212');

      // 0 °C = 273.15 K
      const kelvin = convertUnits('0', 'celsius', 'kelvin', tempCategory.units, 'en-US');
      expect(kelvin).toBe('273.15');
    });
  });

  describe('getFormulaExplanation', () => {
    it('returns exact temperature formulas', () => {
      expect(
        getFormulaExplanation('temperature', 'celsius', 'fahrenheit', '°C', '°F', '32')
      ).toBe('°F = (°C × 9/5) + 32');

      expect(
        getFormulaExplanation('temperature', 'fahrenheit', 'celsius', '°F', '°C', '0')
      ).toBe('°C = (°F - 32) × 5/9');

      expect(
        getFormulaExplanation('temperature', 'celsius', 'kelvin', '°C', 'K', '273.15')
      ).toBe('K = °C + 273.15');

      expect(
        getFormulaExplanation('temperature', 'kelvin', 'celsius', 'K', '°C', '-273.15')
      ).toBe('°C = K - 273.15');

      expect(
        getFormulaExplanation('temperature', 'fahrenheit', 'kelvin', '°F', 'K', '255.37')
      ).toBe('K = (°F - 32) × 5/9 + 273.15');

      expect(
        getFormulaExplanation('temperature', 'kelvin', 'fahrenheit', 'K', '°F', '-459.67')
      ).toBe('°F = (K - 273.15) × 9/5 + 32');
    });

    it('returns standard direct rate equation for other categories', () => {
      const expl = getFormulaExplanation('length', 'meter', 'centimeter', 'm', 'cm', '100');
      expect(expl).toBe('1 m = 100 cm');
    });
  });

  describe('CATEGORY_ICONS', () => {
    it('contains an icon for every category in UNIT_CATEGORIES', () => {
      for (const cat of UNIT_CATEGORIES) {
        expect(CATEGORY_ICONS[cat.id]).toBeDefined();
      }
    });
  });
});
