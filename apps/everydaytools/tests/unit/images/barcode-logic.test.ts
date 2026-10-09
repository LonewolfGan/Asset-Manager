import { describe, it, expect } from 'vitest';
import {
  calculateEanCheckDigit,
  getEanCountry,
  validateBarcode,
  getSymbologies,
} from '../../../src/lib/barcode-logic';

describe('barcode-logic', () => {
  it('calculateEanCheckDigit computes correct checksum for EAN-13, UPC-A, and EAN-8', () => {
    // 400638133393 -> 1
    expect(calculateEanCheckDigit('400638133393')).toBe(1);
    // 01234567890 -> 5
    expect(calculateEanCheckDigit('01234567890')).toBe(5);
    // 9638507 -> 4
    expect(calculateEanCheckDigit('9638507')).toBe(4);
  });

  it('getEanCountry identifies country from prefix accurately in French and English', () => {
    expect(getEanCountry('3001234567890', true)).toBe('France');
    expect(getEanCountry('4006381333931', true)).toBe('Allemagne');
    expect(getEanCountry('4006381333931', false)).toBe('Germany');
    expect(getEanCountry('7601234567890', true)).toBe('Suisse');
    expect(getEanCountry('012345678905', true)).toBe('USA & Canada');
  });

  it('validateBarcode handles EAN-13 validation and auto-fixing', () => {
    // Valid 13-digit
    const valid = validateBarcode('EAN13', '4006381333931', true);
    expect(valid.isValid).toBe(true);
    expect(valid.status).toBe('valid');
    expect(valid.country).toBe('Allemagne');

    // 12-digit needs check digit
    const needsCheck = validateBarcode('EAN13', '400638133393', true);
    expect(needsCheck.isValid).toBe(false);
    expect(needsCheck.status).toBe('needs_check');
    expect(needsCheck.autoFix).toBe('4006381333931');
    expect(needsCheck.expectedKey).toBe(1);

    // Wrong check digit
    const wrongKey = validateBarcode('EAN13', '4006381333939', true);
    expect(wrongKey.isValid).toBe(false);
    expect(wrongKey.status).toBe('wrong_key');
    expect(wrongKey.autoFix).toBe('4006381333931');

    // Non-digits
    const nonDigits = validateBarcode('EAN13', '4006381333ABC', true);
    expect(nonDigits.isValid).toBe(false);
    expect(nonDigits.status).toBe('error');
  });

  it('validateBarcode handles UPC and EAN-8 auto-fixing', () => {
    // UPC 11-digit
    const upc11 = validateBarcode('UPC', '01234567890', true);
    expect(upc11.status).toBe('needs_check');
    expect(upc11.autoFix).toBe('012345678905');

    // EAN-8 7-digit
    const ean8 = validateBarcode('EAN8', '9638507', true);
    expect(ean8.status).toBe('needs_check');
    expect(ean8.autoFix).toBe('96385074');
  });

  it('validateBarcode validates Code39 and Pharmacode bounds', () => {
    expect(validateBarcode('CODE39', 'PALLET-420-A', true).isValid).toBe(true);
    expect(validateBarcode('CODE39', 'lowercase_not_allowed', true).isValid).toBe(false);

    expect(validateBarcode('pharmacode', '12345', true).isValid).toBe(true);
    expect(validateBarcode('pharmacode', '2', true).isValid).toBe(false);
    expect(validateBarcode('pharmacode', '200000', true).isValid).toBe(false);
  });

  it('getSymbologies returns the 8 official symbologies', () => {
    const list = getSymbologies(true);
    expect(list).toHaveLength(8);
    expect(list.map((s) => s.id)).toEqual([
      'EAN13',
      'UPC',
      'CODE128',
      'EAN8',
      'CODE39',
      'ITF14',
      'pharmacode',
      'codabar',
    ]);
  });
});
