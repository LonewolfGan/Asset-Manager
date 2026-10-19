import { describe, it, expect, vi } from 'vitest';
import {
  generatePassword,
  calculateStrength,
  generatePassphrase,
  getTextSizeClass,
} from '@/lib/password-generator-logic';

describe('Password Generator — length', () => {
  for (const len of [8, 12, 16, 32, 64]) {
    it(`generates ${len} chars`, () => {
      const pw = generatePassword({ length: len, uppercase: true, lowercase: true, numbers: true, symbols: true });
      expect(pw).toHaveLength(len);
    });
  }
});

describe('Password Generator — character sets', () => {
  it('uppercase only: no lowercase', () => {
    const pw = generatePassword({ length: 50, uppercase: true, lowercase: false, numbers: false, symbols: false });
    expect(pw).toMatch(/[A-Z]/);
    expect(pw).not.toMatch(/[a-z]/);
  });

  it('numbers only', () => {
    const pw = generatePassword({ length: 50, uppercase: false, lowercase: false, numbers: true, symbols: false });
    expect(pw).toMatch(/[0-9]/);
  });

  it('symbols included when requested', () => {
    const pw = generatePassword({ length: 50, uppercase: false, lowercase: false, numbers: false, symbols: true });
    expect(pw).toMatch(/[^a-zA-Z0-9]/);
  });
});

describe('Password Generator — randomness', () => {
  it('rarely generates two identical passwords', () => {
    const a = generatePassword({ length: 16, uppercase: true, numbers: true, symbols: true });
    const b = generatePassword({ length: 16, uppercase: true, numbers: true, symbols: true });
    // Not strictly impossible but overwhelmingly unlikely for 16-char passwords
    expect(a).not.toBe(b);
  });

  it('uses crypto.getRandomValues', () => {
    const spy = vi.spyOn(global.crypto, 'getRandomValues');
    generatePassword({ length: 16, uppercase: true, numbers: true, symbols: true });
    expect(spy).toHaveBeenCalled();
  });
});

describe('Password Strength', () => {
  it('8 lowercase chars = weak', () => {
    expect(calculateStrength('aaaaaaaa')).toBe('weak');
  });

  it('16 mixed chars = strong', () => {
    expect(calculateStrength('aB3!aB3!aB3!aB3!')).toBe('strong');
  });

  it('very long complex password = exceptional', () => {
    // 30+ chars with full charset → entropy > 128
    expect(calculateStrength('aB3!aB3!aB3!aB3!aB3!aB3!aB3!aB3!')).toBe('exceptional');
  });

  it('single digit = weak', () => {
    expect(calculateStrength('1')).toBe('weak');
  });
});

describe('Passphrase Generator & Sizing (Phase RED)', () => {
  it('generates passphrase with exact word count and custom separator', () => {
    const phrase = generatePassphrase({
      wordCount: 4,
      separator: '.',
      capitalizeWords: false,
      includeNumberInPassphrase: false,
    });
    const parts = phrase.split('.');
    expect(parts).toHaveLength(4);
    expect(parts.every((p: string) => p.length > 0)).toBe(true);
  });

  it('capitalizes words and appends number when requested', () => {
    const phrase = generatePassphrase({
      wordCount: 3,
      separator: '-',
      capitalizeWords: true,
      includeNumberInPassphrase: true,
    });
    const parts = phrase.split('-');
    expect(parts).toHaveLength(4); // 3 words + 1 number
    expect(parts[0][0]).toMatch(/[A-Z]/);
    expect(parts[3]).toMatch(/^[0-9]+$/);
  });

  it('returns appropriate responsive text size class based on password length', () => {
    expect(getTextSizeClass(10)).toContain('text-3xl');
    expect(getTextSizeClass(20)).toContain('text-2xl');
    expect(getTextSizeClass(30)).toContain('text-xl');
    expect(getTextSizeClass(50)).toContain('text-lg');
  });
});

describe('Entropy & Crack Time Estimation (TDD RED Phase)', () => {
  it('calculates entropy bits according to character pool diversity', async () => {
    const { calculateEntropyBits } = await import('@/lib/password-generator-logic');
    // 8 lowercase letters: 8 * log2(26) ≈ 37.6 bits
    const entropy1 = calculateEntropyBits('abcdefgh');
    expect(entropy1).toBeGreaterThanOrEqual(37);
    expect(entropy1).toBeLessThanOrEqual(38);

    // 16 chars with 4 pools: 16 * log2(94) ≈ 104.8 bits
    const entropy2 = calculateEntropyBits('Ab1!Ab1!Ab1!Ab1!');
    expect(entropy2).toBeGreaterThanOrEqual(104);
  });

  it('estimates realistic cracking time for both offline fast attack and online throttled attack', async () => {
    const { estimateCrackTime } = await import('@/lib/password-generator-logic');
    // Low entropy
    const weakTime = estimateCrackTime(30, false);
    expect(weakTime.offlineFast).toMatch(/instant|seconds/i);

    // High entropy (> 100 bits)
    const strongTime = estimateCrackTime(120, false);
    expect(strongTime.offlineFast).toMatch(/centuries|millennia|years/i);
    expect(strongTime.onlineThrottled).toMatch(/centuries|millennia/i);

    // French localization
    const strongTimeFr = estimateCrackTime(120, true);
    expect(strongTimeFr.offlineFast).toMatch(/siècles|millénaires|années/i);
  });

  it('ensures calculateVaultStrength returns design-system compliant tokens without arbitrary hex', async () => {
    const { calculateVaultStrength } = await import('@/lib/password-generator-logic');
    const result = calculateVaultStrength({
      mode: 'random',
      wordCount: 4,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      length: 24,
      labels: {
        weak: 'Faible',
        fair: 'Moyen',
        strong: 'Fort',
        exceptional: 'Exceptionnel',
      },
    });

    expect(result.level).toBe(4);
    expect(result.color.toUpperCase()).not.toContain('#FF6B35');
    expect(result.color.toUpperCase()).not.toContain('#FF8255');
    expect(result.stroke.toUpperCase()).not.toContain('#FF6B35');
    expect(result.stroke).toContain('var(--accent');
  });
});

