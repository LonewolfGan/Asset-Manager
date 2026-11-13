import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { prerenderSeoPages } from '../../../scripts/prerender-seo-pages';

describe('SSG Pre-renderer for High-Speed Bot Crawlability (TDD)', () => {
  const tmpOutDir = resolve(__dirname, '../../../dist/tmp-prerender-test');

  it('prerenders physical HTML files for homepages and tools with canonicals and schemas', () => {
    if (existsSync(tmpOutDir)) {
      rmSync(tmpOutDir, { recursive: true, force: true });
    }
    mkdirSync(tmpOutDir, { recursive: true });

    const count = prerenderSeoPages(tmpOutDir);
    expect(count).toBeGreaterThan(400);

    // Verify EN homepage
    const enHomePath = resolve(tmpOutDir, 'en/index.html');
    expect(existsSync(enHomePath), 'en/index.html must exist').toBe(true);
    const enHomeHtml = readFileSync(enHomePath, 'utf-8');
    expect(enHomeHtml).toContain('<!DOCTYPE html>');
    expect(enHomeHtml).toContain('<html lang="en">');
    expect(enHomeHtml).toContain('https://everydaytools.qzz.io/en');

    // Verify FR homepage
    const frHomePath = resolve(tmpOutDir, 'fr/index.html');
    expect(existsSync(frHomePath), 'fr/index.html must exist').toBe(true);
    const frHomeHtml = readFileSync(frHomePath, 'utf-8');
    expect(frHomeHtml).toContain('<html lang="fr">');
    expect(frHomeHtml).toContain('https://everydaytools.qzz.io/fr');

    // Verify Tool Page: convert-pdf-to-word (EN)
    const enToolPath = resolve(tmpOutDir, 'en/convert-pdf-to-word/index.html');
    expect(existsSync(enToolPath), 'en/convert-pdf-to-word/index.html must exist').toBe(true);
    const enToolHtml = readFileSync(enToolPath, 'utf-8');
    expect(enToolHtml).toContain('PDF to Word Converter');
    expect(enToolHtml).toContain('<link rel="canonical" href="https://everydaytools.qzz.io/en/convert-pdf-to-word"');
    expect(enToolHtml).toContain('<link rel="alternate" hreflang="fr" href="https://everydaytools.qzz.io/fr/convertir-pdf-en-word"');
    expect(enToolHtml).toContain('<script type="application/ld+json">');

    // Verify Tool Page: convertir-pdf-en-word (FR)
    const frToolPath = resolve(tmpOutDir, 'fr/convertir-pdf-en-word/index.html');
    expect(existsSync(frToolPath), 'fr/convertir-pdf-en-word/index.html must exist').toBe(true);
    const frToolHtml = readFileSync(frToolPath, 'utf-8');
    expect(frToolHtml).toContain('Convertir PDF en Word');
    expect(frToolHtml).toContain('<link rel="canonical" href="https://everydaytools.qzz.io/fr/convertir-pdf-en-word"');

    // Verify Blog Post: how-to-convert-pdf-to-word (EN)
    const enBlogPath = resolve(tmpOutDir, 'en/blog/how-to-convert-pdf-to-word/index.html');
    expect(existsSync(enBlogPath), 'en/blog/how-to-convert-pdf-to-word/index.html must exist').toBe(true);
    const enBlogHtml = readFileSync(enBlogPath, 'utf-8');
    expect(enBlogHtml).toContain('How to Convert a PDF to Word');
    expect(enBlogHtml).toContain('@type":"Article"');
    expect(enBlogHtml).toContain('href="/convert-pdf-to-word"');

    // Clean up temporary test files
    rmSync(tmpOutDir, { recursive: true, force: true });
  });
});
