import { describe, it, expect } from 'vitest';
import {
  PASSWORD_PRESETS,
  type PasswordPreset,
  getPresetById,
} from '@/lib/password-generator-presets';

describe('Password Generator Presets (TDD RED Phase)', () => {
  it('exposes a curated list of presets with distinct security profiles', () => {
    expect(PASSWORD_PRESETS.length).toBeGreaterThanOrEqual(5);

    const ids = PASSWORD_PRESETS.map((p) => p.id);
    expect(ids).toContain('web-login');
    expect(ids).toContain('high-security');
    expect(ids).toContain('pin-4');
    expect(ids).toContain('pin-6');
    expect(ids).toContain('passphrase-memorable');
    expect(ids).toContain('api-key');
  });

  it('retrieves preset by valid ID and falls back gracefully', () => {
    const webLogin = getPresetById('web-login');
    expect(webLogin).toBeDefined();
    expect(webLogin?.mode).toBe('random');
    if (webLogin?.mode === 'random') {
      expect(webLogin.length).toBe(16);
      expect(webLogin.uppercase).toBe(true);
      expect(webLogin.numbers).toBe(true);
      expect(webLogin.symbols).toBe(true);
    }

    const nonExistent = getPresetById('unknown-preset-id');
    expect(nonExistent).toBeUndefined();
  });

  it('defines PIN-4 and PIN-6 as numbers-only random presets', () => {
    const pin4 = getPresetById('pin-4');
    expect(pin4).toBeDefined();
    if (pin4?.mode === 'random') {
      expect(pin4.length).toBe(4);
      expect(pin4.numbers).toBe(true);
      expect(pin4.uppercase).toBe(false);
      expect(pin4.lowercase).toBe(false);
      expect(pin4.symbols).toBe(false);
    }

    const pin6 = getPresetById('pin-6');
    expect(pin6).toBeDefined();
    if (pin6?.mode === 'random') {
      expect(pin6.length).toBe(6);
      expect(pin6.numbers).toBe(true);
    }
  });

  it('defines passphrase-memorable as a 4-word diceware preset', () => {
    const pass = getPresetById('passphrase-memorable');
    expect(pass).toBeDefined();
    expect(pass?.mode).toBe('passphrase');
    if (pass?.mode === 'passphrase') {
      expect(pass.wordCount).toBe(4);
      expect(pass.separator).toBe('-');
      expect(pass.capitalizeWords).toBe(true);
      expect(pass.includeNumberInPassphrase).toBe(true);
    }
  });
});
