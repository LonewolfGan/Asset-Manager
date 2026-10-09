import { describe, it, expect } from 'vitest';
import {
  getUrlByteStats,
  getConversionPlaceholder,
  buildUrlComponentsJsonPayload,
} from '@/lib/url-export-logic';

describe('URL Export and Helper Logic', () => {
  it('calculates character count and UTF-8 byte size correctly', () => {
    const text = 'https://example.com/search?q=café';
    const stats = getUrlByteStats(text);
    expect(stats.chars).toBe(text.length);
    expect(stats.bytes).toBe(new TextEncoder().encode(text).length);
    expect(stats.bytes).toBeGreaterThan(stats.chars); // 'é' is 2 bytes in UTF-8
  });

  it('provides localized input placeholders for encode and decode modes', () => {
    const encFr = getConversionPlaceholder('encode', true);
    expect(encFr).toContain('Collez ou déposez votre URL');

    const encEn = getConversionPlaceholder('encode', false);
    expect(encEn).toContain('Paste or drop your raw URL');

    const decFr = getConversionPlaceholder('decode', true);
    expect(decFr).toContain('Collez votre chaîne URL encodée');

    const decEn = getConversionPlaceholder('decode', false);
    expect(decEn).toContain('Paste your encoded URL string');
  });

  it('builds JSON payload for URL components inspection', () => {
    const inspection = {
      isValid: true,
      protocol: 'https:',
      host: 'example.com',
      pathname: '/search',
      params: [{ key: 'q', value: 'café' }],
    };
    const jsonStr = buildUrlComponentsJsonPayload(inspection);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.host).toBe('example.com');
    expect(parsed.params[0].key).toBe('q');
  });
});
