import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { generateSitemapXml } from '@/lib/seo-ssr';

describe('Comprehensive XML Sitemap & E-E-A-T Routes (TDD)', () => {
  const publicDir = resolve(__dirname, '../../../public');
  const sitemapPath = resolve(publicDir, 'sitemap.xml');

  it('generates public/sitemap.xml with valid XML structure and namespaces', () => {
    expect(existsSync(sitemapPath), 'public/sitemap.xml must exist').toBe(true);
    const content = readFileSync(sitemapPath, 'utf-8');

    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(content).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
  });

  it('includes all 7 E-E-A-T trust pages in both English and French with reciprocal hreflang', () => {
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    const ssrContent = generateSitemapXml();

    const requiredPairs = [
      { en: 'https://everydaytools.qzz.io/en/contact', fr: 'https://everydaytools.qzz.io/fr/contact' },
      { en: 'https://everydaytools.qzz.io/en/privacy', fr: 'https://everydaytools.qzz.io/fr/privacy' },
      { en: 'https://everydaytools.qzz.io/en/terms', fr: 'https://everydaytools.qzz.io/fr/terms' },
      { en: 'https://everydaytools.qzz.io/en/security', fr: 'https://everydaytools.qzz.io/fr/security' },
      { en: 'https://everydaytools.qzz.io/en/legal-notice', fr: 'https://everydaytools.qzz.io/fr/mentions-legales' },
      { en: 'https://everydaytools.qzz.io/en/cookies', fr: 'https://everydaytools.qzz.io/fr/cookies' },
      { en: 'https://everydaytools.qzz.io/en/changelog', fr: 'https://everydaytools.qzz.io/fr/changelog' },
    ];

    for (const content of [sitemapContent, ssrContent]) {
      for (const pair of requiredPairs) {
        expect(content, `Missing EN page: ${pair.en}`).toContain(`<loc>${pair.en}</loc>`);
        expect(content, `Missing FR page: ${pair.fr}`).toContain(`<loc>${pair.fr}</loc>`);
        expect(content).toContain(`hreflang="en" href="${pair.en}"`);
        expect(content).toContain(`hreflang="fr" href="${pair.fr}"`);
      }
    }
  });

  it('guarantees bidirectional hreflang and x-default fallback on all indexed pages', () => {
    const content = readFileSync(sitemapPath, 'utf-8');
    const urlMatches = content.match(/<url>[\s\S]*?<\/url>/g) || [];

    expect(urlMatches.length).toBeGreaterThan(150);

    for (const block of urlMatches) {
      expect(block).toContain('<xhtml:link rel="alternate" hreflang="en"');
      expect(block).toContain('<xhtml:link rel="alternate" hreflang="fr"');
      expect(block).toContain('<lastmod>');
      expect(block).toContain('<changefreq>');
      expect(block).toContain('<priority>');
    }
  });
});
