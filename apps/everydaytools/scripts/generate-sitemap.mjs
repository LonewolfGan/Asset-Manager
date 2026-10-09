#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from:
 *   - src/config/tools-seo-data.ts  (tool slugs EN/FR)
 *   - src/config/blog-data.ts        (blog slugs EN/FR + publishedAt)
 *
 * Run: pnpm --filter @workspace/everydaytools run sitemap
 *
 * To add a new tool:   add it to SEO_TOOLS in tools-seo-data.ts, then re-run.
 * To add a new article: add it to BLOG_POSTS in blog-data.ts, then re-run.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = "https://everydaytools.qzz.io";
const today = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// 1. Parse tool slugs from tools-seo-data.ts
//    Matches:  slugs: { en: "slug-en", fr: "slug-fr" }
// ---------------------------------------------------------------------------
const toolsSrc = readFileSync(
  resolve(ROOT, "src/config/tools-seo-data.ts"),
  "utf8"
);
const toolSlugRe = /slugs:\s*\{\s*en:\s*"([^"]+)"\s*,\s*fr:\s*"([^"]+)"\s*\}/g;
const toolSlugs = [];
let m;
while ((m = toolSlugRe.exec(toolsSrc)) !== null) {
  toolSlugs.push({ en: m[1], fr: m[2] });
}

// ---------------------------------------------------------------------------
// 2. Parse blog slugs + publishedAt from blog-data.ts
//    Matches:  slug: { en: "slug-en", fr: "slug-fr" }
//    Pairs each with the nearest publishedAt: "YYYY-MM-DD" that follows it.
// ---------------------------------------------------------------------------
const blogSrc = readFileSync(
  resolve(ROOT, "src/config/blog-data.ts"),
  "utf8"
);
const blogSlugRe = /slug:\s*\{\s*en:\s*"([^"]+)"\s*,\s*fr:\s*"([^"]+)"\s*\}/g;
const blogDateRe = /publishedAt:\s*"([^"]+)"/g;

const rawSlugs = [];
while ((m = blogSlugRe.exec(blogSrc)) !== null) {
  rawSlugs.push({ en: m[1], fr: m[2], index: m.index });
}

const rawDates = [];
while ((m = blogDateRe.exec(blogSrc)) !== null) {
  rawDates.push({ date: m[1], index: m.index });
}

const blogPosts = rawSlugs.map((slug, i) => {
  const nextSlugIndex = rawSlugs[i + 1]?.index ?? Infinity;
  const found = rawDates.find(
    (d) => d.index > slug.index && d.index < nextSlugIndex
  );
  return { en: slug.en, fr: slug.fr, date: found?.date ?? today };
});

// ---------------------------------------------------------------------------
// 3. Build XML helpers
// ---------------------------------------------------------------------------
function urlBlock({ loc, lastmod, changefreq, priority, altEn, altFr }) {
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${altEn}"/>`,
    `    <xhtml:link rel="alternate" hreflang="fr" href="${altFr}"/>`,
    `  </url>`,
  ].join("\n");
}

const urls = [];

// Homepages
urls.push(urlBlock({
  loc: `${BASE_URL}/en`, lastmod: today, changefreq: "weekly", priority: "1.0",
  altEn: `${BASE_URL}/en`, altFr: `${BASE_URL}/fr`,
}));
urls.push(urlBlock({
  loc: `${BASE_URL}/fr`, lastmod: today, changefreq: "weekly", priority: "1.0",
  altEn: `${BASE_URL}/en`, altFr: `${BASE_URL}/fr`,
}));

// Tool pages
for (const slug of toolSlugs) {
  const enUrl = `${BASE_URL}/en/${slug.en}`;
  const frUrl = `${BASE_URL}/fr/${slug.fr}`;
  urls.push(urlBlock({ loc: enUrl, lastmod: today, changefreq: "monthly", priority: "0.8", altEn: enUrl, altFr: frUrl }));
  urls.push(urlBlock({ loc: frUrl, lastmod: today, changefreq: "monthly", priority: "0.8", altEn: enUrl, altFr: frUrl }));
}

// Blog index pages
urls.push(urlBlock({
  loc: `${BASE_URL}/en/blog`, lastmod: today, changefreq: "weekly", priority: "0.9",
  altEn: `${BASE_URL}/en/blog`, altFr: `${BASE_URL}/fr/blog`,
}));
urls.push(urlBlock({
  loc: `${BASE_URL}/fr/blog`, lastmod: today, changefreq: "weekly", priority: "0.9",
  altEn: `${BASE_URL}/en/blog`, altFr: `${BASE_URL}/fr/blog`,
}));

// Blog posts
for (const post of blogPosts) {
  const enUrl = `${BASE_URL}/en/blog/${post.en}`;
  const frUrl = `${BASE_URL}/fr/blog/${post.fr}`;
  urls.push(urlBlock({ loc: enUrl, lastmod: post.date, changefreq: "monthly", priority: "0.7", altEn: enUrl, altFr: frUrl }));
  urls.push(urlBlock({ loc: frUrl, lastmod: post.date, changefreq: "monthly", priority: "0.7", altEn: enUrl, altFr: frUrl }));
}

// ---------------------------------------------------------------------------
// 4. Write output
// ---------------------------------------------------------------------------
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...urls,
  `</urlset>`,
].join("\n");

const outPath = resolve(ROOT, "public/sitemap.xml");
writeFileSync(outPath, xml, "utf8");

const locCount = (xml.match(/<loc>/g) ?? []).length;
console.log(`sitemap.xml generated — ${locCount} URLs`);
console.log(`  Tools:      ${toolSlugs.length} × 2 locales = ${toolSlugs.length * 2} URLs`);
console.log(`  Blog posts: ${blogPosts.length} × 2 locales = ${blogPosts.length * 2} URLs`);
console.log(`  Homepages + blog indexes: ${locCount - toolSlugs.length * 2 - blogPosts.length * 2} URLs`);
console.log(`  Written to: ${outPath}`);
