import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { generateRobotsTxt } from '@/lib/seo-ssr';

describe('AI-SEO Machine-Readable Files & Crawler Directives (TDD)', () => {
  const publicDir = resolve(__dirname, '../../../public');

  it('provides public/llms.txt following llmstxt.org specification', () => {
    const llmsPath = resolve(publicDir, 'llms.txt');
    expect(existsSync(llmsPath), 'public/llms.txt must exist').toBe(true);

    const content = readFileSync(llmsPath, 'utf-8');
    expect(content).toContain('# EverydayTools Hub');
    expect(content).toContain('https://everydaytools.qzz.io');
    expect(content).toContain('Client-side');
    expect(content).toContain('/pricing.md');
    expect(content).toContain('/llms-full.txt');
    expect(content).toContain('PDF Tools');
    expect(content).toContain('Image Tools');
  });

  it('provides public/llms-full.txt with exhaustive technical capabilities', () => {
    const fullPath = resolve(publicDir, 'llms-full.txt');
    expect(existsSync(fullPath), 'public/llms-full.txt must exist').toBe(true);

    const content = readFileSync(fullPath, 'utf-8');
    expect(content).toContain('# EverydayTools Hub — Full Specification');
    expect(content).toContain('WebAssembly');
    expect(content).toContain('Web Workers');
    expect(content).toContain('application/pdf');
    expect(content).toContain('zero-retention');
  });

  it('provides public/pricing.md with explicit $0 / free tier terms for AI buyer agents', () => {
    const pricingPath = resolve(publicDir, 'pricing.md');
    expect(existsSync(pricingPath), 'public/pricing.md must exist').toBe(true);

    const content = readFileSync(pricingPath, 'utf-8');
    expect(content).toContain('# Pricing — EverydayTools Hub');
    expect(content).toContain('$0');
    expect(content).toContain('Free Forever');
    expect(content).toContain('Unlimited');
    expect(content).toContain('No credit card');
    expect(content).toContain('No account required');
  });

  it('updates public/robots.txt and generateRobotsTxt() with AI search bot allowlists and discovery links', () => {
    const robotsPath = resolve(publicDir, 'robots.txt');
    expect(existsSync(robotsPath), 'public/robots.txt must exist').toBe(true);

    const fileContent = readFileSync(robotsPath, 'utf-8');
    const ssrContent = generateRobotsTxt();

    for (const content of [fileContent, ssrContent]) {
      expect(content).toContain('User-agent: OAI-SearchBot');
      expect(content).toContain('User-agent: ClaudeBot');
      expect(content).toContain('User-agent: PerplexityBot');
      expect(content).toContain('Sitemap: https://everydaytools.qzz.io/sitemap.xml');
      expect(content).toContain('https://everydaytools.qzz.io/llms.txt');
    }
  });
});
