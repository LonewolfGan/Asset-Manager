import {
  SEO_TOOLS,
  getToolSeoByLocaleSlug,
  HREFLANG_MANIFEST,
  type Locale,
  type ToolSeoEntry,
} from "@/config/tools-seo-data";

const BASE_URL = "https://everydaytools.qzz.io";

const CONVERTER_INTERNAL_SLUGS = new Set([
  "pdf-to-word","pdf-to-text","pdf-to-html","pdf-to-epub","pdf-compress",
  "pdf-merge","pdf-split","pdf-rotate","pdf-unlock","pdf-protect",
  "pdf-page-numbers","pdf-watermark","word-to-text","word-to-html",
  "word-to-epub","markdown-to-pdf","markdown-to-docx","html-to-pdf",
  "txt-to-pdf","txt-to-docx","image-converter","heic-to-jpg",
  "image-compress","image-resize","image-crop","image-to-pdf","pdf-to-image",
  "background-remover",
]);

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escJson(s: string): string {
  return JSON.stringify(s);
}

function generateSchemas(tool: ToolSeoEntry, locale: Locale): string {
  const canonical = `${BASE_URL}/${locale}/${tool.slugs[locale]}`;
  const toolName = tool.h1[locale];
  const desc = tool.description[locale];
  const faqs = tool.faqs[locale];

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: desc,
    url: canonical,
    inLanguage: [locale === "fr" ? "fr-FR" : "en-US"],
    browserRequirements: "Requires JavaScript. Works offline after first load.",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "fr" ? "Accueil" : "Home", item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: toolName, item: canonical },
    ],
  };

  const schemas: object[] = [softwareApp, faqPage, breadcrumb];

  if (CONVERTER_INTERNAL_SLUGS.has(tool.internalSlug)) {
    const steps = tool.howItWorks[locale];
    const howTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: locale === "fr" ? `Comment utiliser ${toolName}` : `How to use ${toolName}`,
      description: desc,
      totalTime: "PT10S",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    };
    schemas.push(howTo);
  }

  return schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s, null, 0)}</script>`)
    .join("\n  ");
}

function sharedCss(): string {
  return `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#F7F6F3;--surface:#FFFFFF;--elevated:#EFEDE6;--border:#E2DFD5;
      --text:#1A1916;--muted:#6B6860;--accent:#1A6BFF;--accent-text:#FFFFFF;
      --font-display:'DM Serif Display',Georgia,serif;
      --font-ui:'IBM Plex Sans',system-ui,-apple-system,sans-serif;
    }
    html{font-size:16px;-webkit-text-size-adjust:100%}
    body{background:var(--bg);color:var(--text);font-family:var(--font-ui);line-height:1.625;-webkit-font-smoothing:antialiased;min-height:100vh}
    h1,h2,h3{font-family:var(--font-display);font-weight:400;letter-spacing:-0.02em;color:var(--text)}
    a{color:var(--accent);text-decoration:none}
    a:hover{text-decoration:underline}
    p{color:var(--muted);line-height:1.7;margin-bottom:1rem}
    /* Nav */
    .site-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--surface);z-index:100}
    .site-nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
    .site-nav-logo{width:28px;height:28px;background:var(--accent);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;color:var(--accent-text);font-weight:400;flex-shrink:0}
    .site-nav-name{font-family:var(--font-ui);font-size:15px;font-weight:500;color:var(--text)}
    .site-nav-links{display:flex;align-items:center;gap:24px}
    .site-nav-links a{font-size:14px;color:var(--muted);text-decoration:none}
    .site-nav-links a:hover{color:var(--text)}
    /* Container */
    .container{max-width:1200px;margin:0 auto;padding:48px 24px 80px}
    /* Breadcrumb */
    .breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:24px;font-size:12px;color:var(--muted)}
    .breadcrumb a{color:var(--muted);text-decoration:none}
    .breadcrumb a:hover{color:var(--text)}
    .breadcrumb-sep{color:var(--muted)}
    /* Hero */
    .tool-h1{font-size:clamp(28px,5vw,42px);margin-bottom:12px;line-height:1.2}
    .tool-description{font-size:16px;color:var(--muted);margin-bottom:32px;max-width:600px;line-height:1.6}
    /* CTA */
    .cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:var(--accent-text);padding:14px 28px;border-radius:6px;font-family:var(--font-ui);font-size:15px;font-weight:500;text-decoration:none;margin-bottom:48px;transition:opacity 120ms}
    .cta-btn:hover{opacity:0.85;text-decoration:none}
    .cta-arrow{font-size:18px}
    /* Sections */
    .section{margin-bottom:48px}
    .section-label{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--border)}
    .section h2{font-size:20px;margin-bottom:20px}
    /* How it works */
    .hiw-list{list-style:none;counter-reset:hiw}
    .hiw-item{counter-increment:hiw;display:flex;gap:16px;margin-bottom:12px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:6px}
    .hiw-num{width:28px;height:28px;background:var(--elevated);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);flex-shrink:0;margin-top:2px}
    .hiw-body strong{display:block;color:var(--text);font-size:14px;font-weight:500;margin-bottom:4px;font-family:var(--font-ui)}
    .hiw-body p{font-size:13px;color:var(--muted);margin:0}
    /* About */
    .about-text{font-size:15px;color:var(--muted);line-height:1.75}
    .about-text p{margin-bottom:16px}
    .freshness{font-size:12px;color:var(--muted);margin-top:16px}
    /* FAQ */
    .faq-list{display:flex;flex-direction:column;gap:8px}
    .faq-item{border:1px solid var(--border);border-radius:6px;overflow:hidden}
    .faq-q{padding:14px 16px;font-size:14px;font-weight:500;color:var(--text);background:var(--surface);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center}
    .faq-q::after{content:'+';color:var(--muted);font-size:18px;font-weight:300;flex-shrink:0;margin-left:12px}
    details[open] .faq-q::after{content:'-'}
    .faq-a{padding:14px 16px;font-size:13px;color:var(--muted);line-height:1.7;background:var(--bg);border-top:1px solid var(--border)}
    /* Ad slot */
    .ad-slot{width:100%;min-height:90px;background:var(--surface);border:1px dashed var(--border);border-radius:6px;margin:24px 0;display:flex;align-items:center;justify-content:center}
    .ad-slot-label{font-size:11px;color:var(--muted);font-family:monospace}
    /* Related */
    .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:16px}
    .related-card{padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:6px;text-decoration:none;display:block;transition:border-color 120ms}
    .related-card:hover{border-color:var(--accent);text-decoration:none}
    .related-card-name{font-size:13px;color:var(--text);font-weight:500;display:block;margin-bottom:4px;font-family:var(--font-ui)}
    .related-card-desc{font-size:12px;color:var(--muted)}
    /* Footer */
    .site-footer{border-top:1px solid var(--border);padding:32px 24px;text-align:center;font-size:12px;color:var(--muted)}
    @media(max-width:600px){
      .site-nav-links{display:none}
      .container{padding:32px 16px 60px}
    }
  `;
}

function buildNav(locale: Locale): string {
  const home = locale === "fr" ? "Accueil" : "Home";
  const pdfLabel = locale === "fr" ? "PDF" : "PDF Tools";
  const imgLabel = locale === "fr" ? "Images" : "Images";
  const toolsLabel = locale === "fr" ? "Outils" : "Tools";
  return `
<nav class="site-nav" aria-label="Main navigation">
  <a href="/${locale}" class="site-nav-brand">
    <span class="site-nav-logo" aria-hidden="true">E</span>
    <span class="site-nav-name">EverydayTools</span>
  </a>
  <div class="site-nav-links">
    <a href="/${locale}">${home}</a>
    <a href="/${locale}#pdf">${pdfLabel}</a>
    <a href="/${locale}#images">${imgLabel}</a>
    <a href="/${locale}#tools">${toolsLabel}</a>
  </div>
</nav>`.trim();
}

function buildFooter(locale: Locale): string {
  const copy = locale === "fr"
    ? `© ${new Date().getFullYear()} EverydayTools Hub. Tous outils gratuits, traitement dans le navigateur.`
    : `© ${new Date().getFullYear()} EverydayTools Hub. All tools free, browser-based processing.`;
  return `<footer class="site-footer">${escHtml(copy)}</footer>`;
}

function formatAboutText(text: string): string {
  const paragraphs = text.split("\n\n").filter(Boolean);
  return paragraphs.map((p) => `<p>${escHtml(p.trim())}</p>`).join("\n");
}

function buildRelatedSection(tool: ToolSeoEntry, locale: Locale): string {
  if (!tool.relatedTools.length) return "";
  const relatedHeader = locale === "fr" ? "Outils connexes" : "Related Tools";
  const cards = tool.relatedTools.map((internalSlug) => {
    const related = SEO_TOOLS.find((t) => t.internalSlug === internalSlug);
    if (!related) return "";
    const href = `/${locale}/${related.slugs[locale]}`;
    const name = related.h1[locale];
    return `<a href="${href}" class="related-card"><span class="related-card-name">${escHtml(name)}</span></a>`;
  }).filter(Boolean).join("\n");

  if (!cards) return "";
  return `
<section class="section" aria-label="${escHtml(relatedHeader)}">
  <p class="section-label">${escHtml(relatedHeader)}</p>
  <div class="related-grid">
    ${cards}
  </div>
</section>`.trim();
}

export function generateToolPageHtml(localeSlug: string, locale: Locale): string | null {
  const tool = getToolSeoByLocaleSlug(localeSlug, locale);
  if (!tool) return null;

  const canonical = `${BASE_URL}/${locale}/${tool.slugs[locale]}`;
  const enUrl = `${BASE_URL}/en/${tool.slugs.en}`;
  const frUrl = `${BASE_URL}/fr/${tool.slugs.fr}`;
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const title = tool.title[locale];
  const h1 = tool.h1[locale];
  const description = tool.description[locale];
  const schemas = generateSchemas(tool, locale);
  const steps = tool.howItWorks[locale];
  const faqs = tool.faqs[locale];
  const internalToolUrl = `/${tool.internalSlug}`;

  const howItWorksLabel = locale === "fr" ? "Comment ça marche" : "How it works";
  const aboutLabel = locale === "fr" ? "À propos de cet outil" : "About this tool";
  const faqLabel = locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";
  const ctaLabel = locale === "fr" ? `Ouvrir ${h1}` : `Open ${h1}`;
  const breadcrumbHome = locale === "fr" ? "Accueil" : "Home";
  const lastVerified = locale === "fr"
    ? `Dernière vérification : ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`
    : `Last verified: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;

  const hiwItems = steps
    .map((step, i) => `
    <li class="hiw-item">
      <span class="hiw-num" aria-hidden="true">${i + 1}</span>
      <div class="hiw-body">
        <strong>${escHtml(step.name)}</strong>
        <p>${escHtml(step.text)}</p>
      </div>
    </li>`)
    .join("");

  const faqItems = faqs
    .map((faq) => `
    <details class="faq-item">
      <summary class="faq-q">${escHtml(faq.q)}</summary>
      <div class="faq-a">${escHtml(faq.a)}</div>
    </details>`)
    .join("");

  const relatedSection = buildRelatedSection(tool, locale);

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}" />
  <link rel="canonical" href="${escHtml(canonical)}" />
  <link rel="alternate" hreflang="en" href="${escHtml(enUrl)}" />
  <link rel="alternate" hreflang="fr" href="${escHtml(frUrl)}" />
  <link rel="alternate" hreflang="x-default" href="${escHtml(enUrl)}" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:url" content="${escHtml(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="EverydayTools Hub" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  ${schemas}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" /></noscript>
  <style>${sharedCss()}</style>
</head>
<body>
  ${buildNav(locale)}
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/${locale}">${escHtml(breadcrumbHome)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">›</span>
      <span>${escHtml(h1)}</span>
    </nav>

    <h1 class="tool-h1">${escHtml(h1)}</h1>
    <p class="tool-description">${escHtml(description)}</p>

    <a href="${escHtml(internalToolUrl)}" class="cta-btn">
      ${escHtml(ctaLabel)} <span class="cta-arrow" aria-hidden="true">→</span>
    </a>

    <section class="section" aria-label="${escHtml(howItWorksLabel)}">
      <p class="section-label">${escHtml(howItWorksLabel)}</p>
      <ol class="hiw-list">
        ${hiwItems}
      </ol>
    </section>

    <div class="ad-slot" aria-hidden="true">
      <span class="ad-slot-label">ad · horizontal · 100% × 90px</span>
    </div>

    <section class="section" aria-label="${escHtml(aboutLabel)}">
      <p class="section-label">${escHtml(aboutLabel)}</p>
      <div class="about-text">
        ${formatAboutText(tool.about[locale])}
        <time class="freshness" datetime="${new Date().toISOString().split("T")[0]}">${escHtml(lastVerified)}</time>
      </div>
    </section>

    <div class="ad-slot" aria-hidden="true">
      <span class="ad-slot-label">ad · horizontal · 100% × 90px</span>
    </div>

    <section class="section" aria-label="${escHtml(faqLabel)}">
      <p class="section-label">${escHtml(faqLabel)}</p>
      <div class="faq-list">
        ${faqItems}
      </div>
    </section>

    ${relatedSection}
  </div>
  ${buildFooter(locale)}
</body>
</html>`;
}

export function generateHomepageHtml(locale: Locale): string {
  const title = locale === "fr"
    ? "EverydayTools Hub — Outils Gratuits en Ligne | Convertir PDF, Images, Calculs"
    : "EverydayTools Hub — Free Online Tools | Convert PDF, Images, Calculate";
  const description = locale === "fr"
    ? "Outils de conversion de documents et d'images entièrement dans votre navigateur. Convertir PDF, images, calculer des unités et devises — gratuit, sans envoi, sans compte."
    : "Browser-based document and image conversion tools. Convert PDF, images, calculate units and currencies — free, no upload, no account.";
  const canonical = `${BASE_URL}/${locale}`;
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const h1 = locale === "fr" ? "Outils de Conversion Gratuits en Ligne" : "Free Online Conversion Tools";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EverydayTools Hub",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/en/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const categories: { slug: string; label_en: string; label_fr: string }[] = [
    { slug: "pdf", label_en: "PDF Tools", label_fr: "Outils PDF" },
    { slug: "word", label_en: "Document Converters", label_fr: "Convertisseurs de Documents" },
    { slug: "image", label_en: "Image Tools", label_fr: "Outils Image" },
    { slug: "privacy", label_en: "Privacy Tools", label_fr: "Outils de Confidentialité" },
    { slug: "calculators", label_en: "Calculators", label_fr: "Calculateurs" },
  ];

  const toolGridHtml = categories.map(cat => {
    const catTools = SEO_TOOLS.filter(t => {
      const config = toolCategoryMap[t.internalSlug];
      return config === cat.slug;
    });
    if (!catTools.length) return "";
    const catLabel = locale === "fr" ? cat.label_fr : cat.label_en;
    const cards = catTools.map(t => {
      const href = `/${locale}/${t.slugs[locale]}`;
      return `<a href="${href}" class="related-card"><span class="related-card-name">${escHtml(t.h1[locale])}</span><span class="related-card-desc">${escHtml(t.description[locale].substring(0, 80))}…</span></a>`;
    }).join("\n");
    return `<section class="section" id="${cat.slug}">
      <p class="section-label">${escHtml(catLabel)}</p>
      <div class="related-grid">${cards}</div>
    </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}" />
  <link rel="canonical" href="${escHtml(canonical)}" />
  <link rel="alternate" hreflang="en" href="${BASE_URL}/en" />
  <link rel="alternate" hreflang="fr" href="${BASE_URL}/fr" />
  <link rel="alternate" hreflang="x-default" href="${BASE_URL}/en" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:url" content="${escHtml(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="EverydayTools Hub" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" /></noscript>
  <style>${sharedCss()}
  .hero{padding:64px 0 48px;max-width:600px}
  .hero h1{font-size:clamp(32px,6vw,52px);margin-bottom:16px;line-height:1.15}
  .hero p{font-size:16px;color:var(--muted);line-height:1.6}
  </style>
</head>
<body>
  ${buildNav(locale)}
  <div class="container">
    <div class="hero">
      <h1>${escHtml(h1)}</h1>
      <p>${escHtml(locale === "fr"
        ? "Traitement de fichiers entièrement dans votre navigateur. Aucun fichier envoyé à un serveur. Gratuit, sans compte."
        : "File processing entirely in your browser. No files sent to any server. Free, no account required.")}</p>
    </div>
    ${toolGridHtml}
  </div>
  ${buildFooter(locale)}
</body>
</html>`;
}

const toolCategoryMap: Record<string, string> = {
  "pdf-to-word": "pdf", "pdf-to-text": "pdf", "pdf-to-html": "pdf", "pdf-to-epub": "pdf",
  "pdf-compress": "pdf", "pdf-merge": "pdf", "pdf-split": "pdf", "pdf-rotate": "pdf",
  "pdf-unlock": "pdf", "pdf-protect": "pdf", "pdf-page-numbers": "pdf", "pdf-watermark": "pdf",
  "word-to-text": "word", "word-to-html": "word", "word-to-epub": "word",
  "markdown-to-pdf": "word", "markdown-to-docx": "word",
  "html-to-pdf": "word", "txt-to-pdf": "word", "txt-to-docx": "word",
  "image-converter": "image", "heic-to-jpg": "image", "image-compress": "image",
  "image-resize": "image", "image-crop": "image", "image-to-pdf": "image",
  "pdf-to-image": "image", "background-remover": "image",
  "metadata-cleaner": "privacy", "ai-text-scrubber": "privacy",
  "password-generator": "calculators", "percentage-calc": "calculators",
  "unit-converter": "calculators", "currency-converter": "calculators",
};

const BLOG_POSTS_STATIC = [
  { en: "how-to-convert-pdf-to-word", fr: "comment-convertir-pdf-en-word", date: "2025-05-15" },
  { en: "how-to-compress-pdf", fr: "comment-compresser-un-pdf", date: "2025-05-20" },
  { en: "how-to-remove-image-background", fr: "comment-supprimer-fond-image", date: "2025-05-25" },
  { en: "how-to-convert-heic-to-jpg", fr: "comment-convertir-heic-en-jpg", date: "2025-06-01" },
  { en: "how-to-generate-strong-password", fr: "comment-creer-mot-de-passe-fort", date: "2025-06-01" },
  { en: "webp-vs-jpeg-vs-png", fr: "webp-vs-jpeg-vs-png", date: "2025-06-01" },
];

export function generateSitemapXml(): string {
  const now = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  urls.push(`  <url><loc>${BASE_URL}/en</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`);
  urls.push(`  <url><loc>${BASE_URL}/fr</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`);

  for (const tool of SEO_TOOLS) {
    urls.push(`  <url><loc>${BASE_URL}/en/${tool.slugs.en}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
    urls.push(`  <url><loc>${BASE_URL}/fr/${tool.slugs.fr}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  }

  urls.push(`  <url><loc>${BASE_URL}/en/blog</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
  urls.push(`  <url><loc>${BASE_URL}/fr/blog</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);

  for (const post of BLOG_POSTS_STATIC) {
    urls.push(`  <url><loc>${BASE_URL}/en/blog/${post.en}</loc><lastmod>${post.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
    urls.push(`  <url><loc>${BASE_URL}/fr/blog/${post.fr}</loc><lastmod>${post.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /.well-known/
Crawl-delay: 2

User-agent: Googlebot
Allow: /
Disallow: /api/
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Disallow: /api/
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /

User-agent: GPTBot
Allow: /en/blog/
Allow: /fr/blog/
Allow: /en/
Allow: /fr/
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /en/blog/
Allow: /fr/blog/
Allow: /en/
Allow: /fr/
Disallow: /api/

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Disallow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

export function generateHreflangManifest(): string {
  return JSON.stringify(HREFLANG_MANIFEST, null, 2);
}
