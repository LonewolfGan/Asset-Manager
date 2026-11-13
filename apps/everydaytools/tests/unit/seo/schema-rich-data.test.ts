import { describe, it, expect } from 'vitest';
import { generateToolPageHtml, generateHomepageHtml } from '@/lib/seo-ssr';

describe('Enriched Schema.org JSON-LD & Princeton GEO Blocks (TDD)', () => {
  it('generates rich SoftwareApplication schema with AggregateRating and featureList', () => {
    const html = generateToolPageHtml('convert-pdf-to-word', 'en');
    expect(html).not.toBeNull();

    const scriptMatches = html!.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    const jsonObjects = scriptMatches.map((s) =>
      JSON.parse(s.replace('<script type="application/ld+json">', '').replace('</script>', ''))
    );

    const softwareApp = jsonObjects.find((o) => o['@type'] === 'SoftwareApplication');
    expect(softwareApp, 'SoftwareApplication schema must exist').toBeDefined();
    expect(softwareApp.name).toBe('PDF to Word Converter');
    expect(softwareApp.applicationCategory).toBe('UtilitiesApplication');
    expect(softwareApp.offers?.price).toBe('0');
    expect(softwareApp.aggregateRating).toBeDefined();
    expect(softwareApp.aggregateRating['@type']).toBe('AggregateRating');
    expect(softwareApp.aggregateRating.ratingValue).toBe('4.9');
    expect(softwareApp.featureList).toContain('Client-side');
  });

  it('generates HowTo, FAQPage, and BreadcrumbList schemas on tool pages', () => {
    const html = generateToolPageHtml('convert-pdf-to-word', 'en');
    expect(html).not.toBeNull();

    const scriptMatches = html!.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    const types = scriptMatches.map((s) => {
      const parsed = JSON.parse(s.replace('<script type="application/ld+json">', '').replace('</script>', ''));
      return parsed['@type'];
    });

    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('FAQPage');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('HowTo');
  });

  it('generates WebSite and Organization schema on homepage', () => {
    const homeHtml = generateHomepageHtml('en');
    expect(homeHtml).toContain('WebSite');
    expect(homeHtml).toContain('SearchAction');
  });

  it('embeds a Princeton GEO direct-answer snippet (40-60 words) and comparative superiority section', () => {
    const html = generateToolPageHtml('convert-pdf-to-word', 'en');
    expect(html).not.toBeNull();

    expect(html).toContain('geo-answer-block');
    expect(html).toContain('geo-comparison-table');
    expect(html).toContain('EverydayTools (Client-Side)');
    expect(html).toContain('Traditional Cloud Converters');
  });
});
