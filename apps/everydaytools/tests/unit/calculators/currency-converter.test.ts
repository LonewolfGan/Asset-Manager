import { describe, it, expect } from 'vitest';
import {
  convertCurrency,
  getDirectRate,
  generateQuickConversions,
  formatCurrencyAmount,
  parseCurrencyAmount,
  formatConvertedValue,
  POPULAR_PAIRS,
} from '../../../src/lib/currency-converter-logic';

describe('Currency Converter Logic', () => {
  const mockRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155.5,
  };

  it('correctly converts 100 USD to EUR', () => {
    const result = convertCurrency(100, 'USD', 'EUR', mockRates);
    expect(result).toBe(92);
  });

  it('correctly converts between two non-USD currencies (EUR to GBP)', () => {
    // 100 EUR / 0.92 * 0.79 = 85.86956...
    const result = convertCurrency(100, 'EUR', 'GBP', mockRates);
    expect(result).toBeCloseTo(85.8696, 2);
  });

  it('returns identical amount when converting same currency', () => {
    const result = convertCurrency(250, 'EUR', 'EUR', mockRates);
    expect(result).toBe(250);
  });

  it('handles zero amount gracefully', () => {
    const result = convertCurrency(0, 'USD', 'JPY', mockRates);
    expect(result).toBe(0);
  });

  it('returns null for missing currency or invalid rate', () => {
    const result = convertCurrency(100, 'XYZ', 'EUR', mockRates);
    expect(result).toBeNull();
  });

  it('computes correct direct rate between pairs', () => {
    const rateUsdEur = getDirectRate('USD', 'EUR', mockRates);
    expect(rateUsdEur).toBe(0.92);

    const rateEurUsd = getDirectRate('EUR', 'USD', mockRates);
    // 1 / 0.92 = 1.086956...
    expect(rateEurUsd).toBeCloseTo(1.087, 2);
  });

  it('generates multi-tier conversion tables accurately', () => {
    const tiers = [1, 10, 100];
    const conversions = generateQuickConversions('USD', 'EUR', mockRates, tiers);

    expect(conversions).toHaveLength(3);
    expect(conversions[0]).toEqual({ fromAmount: 1, toAmount: 0.92 });
    expect(conversions[1]).toEqual({ fromAmount: 10, toAmount: 9.2 });
    expect(conversions[2]).toEqual({ fromAmount: 100, toAmount: 92 });
  });

  it('has valid popular currency pairs defined', () => {
    expect(POPULAR_PAIRS.length).toBeGreaterThanOrEqual(6);
    expect(POPULAR_PAIRS[0]).toHaveProperty('from');
    expect(POPULAR_PAIRS[0]).toHaveProperty('to');
    expect(POPULAR_PAIRS[0]).toHaveProperty('label');
  });

  it('formats currency amounts cleanly', () => {
    const formatted = formatCurrencyAmount(1234.56, 'en-US');
    expect(formatted).toContain('1,234.56');
  });

  it('parses string amounts with commas or dots correctly', () => {
    expect(parseCurrencyAmount('100')).toBe(100);
    expect(parseCurrencyAmount('100,50')).toBe(100.5);
    expect(parseCurrencyAmount(' 25.75 ')).toBe(25.75);
    expect(parseCurrencyAmount('invalid')).toBe(0);
    expect(parseCurrencyAmount('')).toBe(0);
  });

  it('formats converted values with proper fallbacks', () => {
    expect(formatConvertedValue(0, 'USD', 'EUR', mockRates, 'en-US', '')).toBe('0.00');
    expect(formatConvertedValue(100, 'USD', 'EUR', mockRates, 'en-US', '100')).toBe('92.00');
    expect(formatConvertedValue(100, 'INVALID', 'EUR', mockRates, 'en-US', '100')).toBe('—');
  });
});
