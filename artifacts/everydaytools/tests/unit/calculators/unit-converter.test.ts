import { describe, it, expect } from 'vitest';
import { convert } from '@/lib/unit-converter-logic';

describe('Unit Converter — Length', () => {
  it('1 km = 1000 m', () => expect(convert(1, 'km', 'm')).toBe(1000));
  it('1 mi ≈ 1.60934 km', () => expect(convert(1, 'mi', 'km')).toBeCloseTo(1.60934, 3));
  it('1 in = 2.54 cm', () => expect(convert(1, 'in', 'cm')).toBeCloseTo(2.54, 2));
  it('1 ft = 30.48 cm', () => expect(convert(1, 'ft', 'cm')).toBeCloseTo(30.48, 2));
  it('1 yd = 0.9144 m', () => expect(convert(1, 'yd', 'm')).toBeCloseTo(0.9144, 4));
  it('0 km = 0 m', () => expect(convert(0, 'km', 'm')).toBe(0));
  it('negative values work', () => expect(convert(-5, 'km', 'm')).toBe(-5000));
});

describe('Unit Converter — Temperature', () => {
  it('0°C = 32°F', () => expect(convert(0, 'C', 'F')).toBe(32));
  it('100°C = 212°F', () => expect(convert(100, 'C', 'F')).toBe(212));
  it('0°C = 273.15 K', () => expect(convert(0, 'C', 'K')).toBeCloseTo(273.15, 2));
  it('-40°C = -40°F', () => expect(convert(-40, 'C', 'F')).toBe(-40));
  it('32°F = 0°C', () => expect(convert(32, 'F', 'C')).toBe(0));
  it('absolute zero: -273.15°C ≈ 0 K', () => expect(convert(-273.15, 'C', 'K')).toBeCloseTo(0, 1));
});

describe('Unit Converter — Weight', () => {
  it('1 kg = 1000 g', () => expect(convert(1, 'kg', 'g')).toBe(1000));
  it('1 lb ≈ 453.592 g', () => expect(convert(1, 'lb', 'g')).toBeCloseTo(453.592, 2));
  it('1 oz ≈ 28.3495 g', () => expect(convert(1, 'oz', 'g')).toBeCloseTo(28.3495, 2));
});

describe('Unit Converter — Volume', () => {
  it('1 L = 1000 mL', () => expect(convert(1, 'L', 'mL')).toBe(1000));
  it('1 gal ≈ 3.78541 L', () => expect(convert(1, 'gal', 'L')).toBeCloseTo(3.78541, 3));
  it('1 cup ≈ 236.588 mL', () => expect(convert(1, 'cup', 'mL')).toBeCloseTo(236.588, 2));
});

describe('Unit Converter — Digital Storage', () => {
  it('1 GB = 1024 MB', () => expect(convert(1, 'GB', 'MB')).toBe(1024));
  it('1 TB = 1024 GB', () => expect(convert(1, 'TB', 'GB')).toBe(1024));
  it('1 MB = 1024 KB', () => expect(convert(1, 'MB', 'KB')).toBe(1024));
});

describe('Unit Converter — edge cases', () => {
  it('same unit returns same value', () => expect(convert(42, 'm', 'm')).toBe(42));
  it('unknown unit returns 0', () => expect(convert(1, 'xyz', 'abc')).toBe(0));
});
