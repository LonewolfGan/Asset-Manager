#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the tools SEO data.
 * Run: node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE = "https://everydaytoolshub.com";
const TODAY = new Date().toISOString().slice(0, 10);

const HIGH_PRIORITY = new Set([
  "convert-pdf-to-word",
  "compress-pdf",
  "merge-pdf",
  "convert-image-format",
  "convert-heic-to-jpg",
  "compress-image",
  "remove-image-background",
  "password-generator",
  "currency-converter",
  "unit-converter",
  "percentage-calculator",
]);

/**
 * All tools that have proper bilingual SEO slugs.
 * Format: [enSlug, frSlug]
 */
const TOOLS = [
  ["convert-pdf-to-word", "convertir-pdf-en-word"],
  ["convert-pdf-to-text", "convertir-pdf-en-texte"],
  ["convert-pdf-to-html", "convertir-pdf-en-html"],
  ["convert-pdf-to-epub", "convertir-pdf-en-epub"],
  ["compress-pdf", "compresser-pdf"],
  ["merge-pdf", "fusionner-pdf"],
  ["split-pdf", "diviser-pdf"],
  ["rotate-pdf", "pivoter-pdf"],
  ["unlock-pdf", "deverrouiller-pdf"],
  ["protect-pdf", "proteger-pdf"],
  ["add-page-numbers-pdf", "ajouter-numeros-page-pdf"],
  ["watermark-pdf", "filigraner-pdf"],
  ["convert-word-to-text", "convertir-word-en-texte"],
  ["convert-word-to-html", "convertir-word-en-html"],
  ["convert-word-to-epub", "convertir-word-en-epub"],
  ["convert-markdown-to-pdf", "convertir-markdown-en-pdf"],
  ["convert-markdown-to-word", "convertir-markdown-en-word"],
  ["convert-html-to-pdf", "convertir-html-en-pdf"],
  ["convert-text-to-pdf", "convertir-texte-en-pdf"],
  ["convert-text-to-word", "convertir-texte-en-word"],
  ["convert-image-format", "convertir-format-image"],
  ["convert-heic-to-jpg", "convertir-heic-en-jpg"],
  ["compress-image", "compresser-image"],
  ["resize-image", "redimensionner-image"],
  ["crop-image", "recadrer-image"],
  ["convert-image-to-pdf", "convertir-image-en-pdf"],
  ["convert-pdf-to-image", "convertir-pdf-en-image"],
  ["remove-image-background", "supprimer-fond-image"],
  ["clean-file-metadata", "nettoyer-metadonnees-fichier"],
  ["remove-ai-text-watermarks", "supprimer-filigranes-texte-ia"],
  ["password-generator", "generateur-mot-de-passe"],
  ["percentage-calculator", "calculateur-pourcentage"],
  ["unit-converter", "convertisseur-unites"],
  ["currency-converter", "convertisseur-devises"],
];

function url(loc, priority, enSlug, frSlug) {
  const enHref = `${BASE}/en/${enSlug}`;
  const frHref = `${BASE}/fr/${frSlug}`;
  const altEn = `<xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`;
  const altFr = `<xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    ${altEn}
    ${altFr}
  </url>`;
}

const entries = [];

// Homepage
entries.push(`  <url>
    <loc>${BASE}/en</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/en"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE}/fr"/>
  </url>`);
entries.push(`  <url>
    <loc>${BASE}/fr</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/en"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE}/fr"/>
  </url>`);

// Tool pages
for (const [enSlug, frSlug] of TOOLS) {
  const priority = HIGH_PRIORITY.has(enSlug) ? "0.9" : "0.8";
  entries.push(url(`${BASE}/en/${enSlug}`, priority, enSlug, frSlug));
  entries.push(url(`${BASE}/fr/${frSlug}`, priority, enSlug, frSlug));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

const outPath = join(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`sitemap.xml written: ${2 + TOOLS.length * 2} URLs (${TOOLS.length} tools × 2 locales)`);
