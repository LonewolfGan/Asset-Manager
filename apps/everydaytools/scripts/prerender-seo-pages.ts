import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SEO_TOOLS, type Locale } from '../src/config/tools-seo-data';
import { BLOG_POSTS } from '../src/config/blog-data';
import { generateToolPageHtml, generateHomepageHtml } from '../src/lib/seo-ssr';
import { generateBlogPostHtml } from '../src/lib/seo-blog-ssr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Prerenders static HTML files for all homepages and tools to maximize
 * crawlability, bot discovery, and sub-50ms TTFB.
 */
export function prerenderSeoPages(targetDir: string): number {
  let count = 0;
  const locales: Locale[] = ['en', 'fr'];

  for (const locale of locales) {
    // 1. Prerender localized homepages
    const homeHtml = generateHomepageHtml(locale);
    const homeDir = resolve(targetDir, locale);
    mkdirSync(homeDir, { recursive: true });
    writeFileSync(resolve(homeDir, 'index.html'), homeHtml, 'utf-8');
    count++;

    // 2. Prerender each localized tool page
    for (const tool of SEO_TOOLS) {
      const slug = tool.slugs[locale];
      const toolHtml = generateToolPageHtml(slug, locale);
      if (toolHtml) {
        const toolDir = resolve(homeDir, slug);
        mkdirSync(toolDir, { recursive: true });
        writeFileSync(resolve(toolDir, 'index.html'), toolHtml, 'utf-8');
        count++;
      }
    }

    // 3. Prerender each localized blog post with rich article schema & tool cross-link
    for (const post of BLOG_POSTS) {
      const slug = post.slug[locale];
      const postHtml = generateBlogPostHtml(slug, locale);
      if (postHtml) {
        const postDir = resolve(homeDir, 'blog', slug);
        mkdirSync(postDir, { recursive: true });
        writeFileSync(resolve(postDir, 'index.html'), postHtml, 'utf-8');
        count++;
      }
    }
  }

  return count;
}

// Auto-run if executed directly via CLI (e.g. tsx scripts/prerender-seo-pages.ts)
const isDirectCli = process.argv[1] && resolve(process.argv[1]) === resolve(__filename);
if (isDirectCli) {
  const defaultOutDir = resolve(__dirname, '../dist/public');
  console.log(`Starting SSG prerendering to: ${defaultOutDir} ...`);
  const total = prerenderSeoPages(defaultOutDir);
  console.log(`✓ SSG Prerendering complete: ${total} physical HTML pages generated.`);
}
