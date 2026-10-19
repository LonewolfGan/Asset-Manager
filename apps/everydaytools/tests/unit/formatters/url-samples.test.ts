import { describe, it, expect } from 'vitest';
import { URL_SAMPLES, type UrlSample } from '@/lib/url-samples';

describe('url-samples', () => {
  it('provides structured presets with valid sample URLs', () => {
    expect(URL_SAMPLES.length).toBeGreaterThanOrEqual(3);
    for (const sample of URL_SAMPLES) {
      expect(sample.id).toBeDefined();
      expect(sample.titleFr).toBeDefined();
      expect(sample.titleEn).toBeDefined();
      expect(sample.url).toBeTruthy();
      expect(sample.url.length).toBeGreaterThan(10);
    }
  });

  it('contains search, oauth and api samples', () => {
    const ids = URL_SAMPLES.map((s) => s.id);
    expect(ids).toContain('search');
    expect(ids).toContain('oauth');
    expect(ids).toContain('api');
  });
});
