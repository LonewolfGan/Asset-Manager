import { describe, it, expect } from 'vitest';
import { calculatePercentage, percentageOf, percentageChange } from '@/lib/percentage-logic';

describe('Percentage Calculator', () => {
  it('20% of 150 = 30', () => expect(percentageOf(20, 150)).toBe(30));
  it('percentageOf(0, 150) = 0', () => expect(percentageOf(0, 150)).toBe(0));
  it('percentageOf(100, 200) = 200', () => expect(percentageOf(100, 200)).toBe(200));

  it('30 is what % of 150 = 20', () => expect(calculatePercentage(30, 150)).toBe(20));
  it('handles 0 denominator gracefully', () => expect(calculatePercentage(30, 0)).toBeNull());
  it('0 is 0% of 100', () => expect(calculatePercentage(0, 100)).toBe(0));

  it('% change from 100 to 150 = +50', () => expect(percentageChange(100, 150)).toBe(50));
  it('% change from 150 to 100 ≈ -33.33', () => expect(percentageChange(150, 100)).toBeCloseTo(-33.33, 2));
  it('% change from 100 to 100 = 0', () => expect(percentageChange(100, 100)).toBe(0));
  it('handles 0 base gracefully', () => expect(percentageChange(0, 100)).toBe(0));
});
