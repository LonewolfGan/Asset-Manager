import { BLOG_POSTS, type BlogPost, type ContentBlock } from "../config/blog-data";
import { SEO_TOOLS, type Locale } from "../config/tools-seo-data";
import { sharedCss, buildNav, buildFooter, escHtml, safeJsonLd, BASE_URL } from "./seo-ssr";

function renderContentBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "p":
          return `<p>${escHtml(block.text)}</p>`;
        case "h2":
          return `<h2>${escHtml(block.text)}</h2>`;
        case "h3":
          return `<h3>${escHtml(block.text)}</h3>`;
        case "callout":
          return `<div class="geo-snippet"><p>${escHtml(block.text)}</p></div>`;
        case "ul":
          return `<ul>${block.items.map((i) => `<li>${escHtml(i)}</li>`).join("")}</ul>`;
        case "ol":
          return `<ol>${block.items.map((i) => `<li>${escHtml(i)}</li>`).join("")}</ol>`;
        default:
          return "";
      }
    })
    .join("\n");
}

export function generateBlogPostHtml(slug: string, locale: Locale): string | null {
  const post = BLOG_POSTS.find((p) => p.slug[locale] === slug || p.slug.en === slug || p.slug.fr === slug);
  if (!post) return null;

  const currentSlug = post.slug[locale];
  const canonical = `${BASE_URL}/${locale}/blog/${currentSlug}`;
  const enUrl = `${BASE_URL}/en/blog/${post.slug.en}`;
  const frUrl = `${BASE_URL}/fr/blog/${post.slug.fr}`;
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";

  const title = post.title[locale];
  const description = post.description[locale];
  const readLabel = locale === "fr" ? "min de lecture" : "min read";
  const homeLabel = locale === "fr" ? "Accueil" : "Home";
  const blogLabel = "Blog";
  const toolCta = post.relatedToolLabel[locale];

  // Tool cross-link target
  const mainTool = SEO_TOOLS.find((t) => t.internalSlug === post.relatedToolSlug);
  const toolHref = mainTool ? `/${mainTool.slugs[locale]}` : `/${post.relatedToolSlug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: canonical,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "EverydayTools Hub", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "EverydayTools Hub",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    keywords: post.keywords[locale].join(", "),
  };

  const contentHtml = renderContentBlocks(post.content[locale]);

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)} | EverydayTools Hub</title>
  <meta name="description" content="${escHtml(description)}" />
  <link rel="canonical" href="${escHtml(canonical)}" />
  <link rel="alternate" hreflang="en" href="${escHtml(enUrl)}" />
  <link rel="alternate" hreflang="fr" href="${escHtml(frUrl)}" />
  <link rel="alternate" hreflang="x-default" href="${escHtml(enUrl)}" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:url" content="${escHtml(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="EverydayTools Hub" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:image" content="${BASE_URL}/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="article:published_time" content="${post.publishedAt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image" content="${BASE_URL}/opengraph.jpg" />
  <meta name="robots" content="index, follow" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>${sharedCss()}
  .blog-meta{font-size:12px;color:var(--muted);font-family:monospace;margin-bottom:12px}
  .blog-header{margin-bottom:32px;max-width:800px}
  .blog-header h1{font-size:clamp(28px,5vw,44px);line-height:1.2;margin-bottom:16px}
  .blog-lead{font-size:17px;color:var(--muted);line-height:1.6}
  .blog-layout{display:grid;grid-template-columns:1fr;gap:40px;max-width:800px}
  .tool-banner{padding:20px;background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:8px;margin:32px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .tool-banner-title{font-size:15px;font-weight:600;color:var(--text);margin:0}
  .tool-banner-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--accent);color:#FFFFFF;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none}
  .tool-banner-btn:hover{text-decoration:none;opacity:0.95}
  .blog-article h2{font-size:22px;margin:32px 0 16px}
  .blog-article h3{font-size:17px;margin:24px 0 12px}
  .blog-article ul,.blog-article ol{padding-left:24px;margin-bottom:20px;color:var(--muted);line-height:1.7}
  .blog-article li{margin-bottom:8px}
  </style>
  <script type="application/ld+json">${safeJsonLd(articleSchema)}</script>
</head>
<body>
  ${buildNav(locale)}
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/${locale}">${escHtml(homeLabel)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">›</span>
      <a href="/${locale}/blog">${escHtml(blogLabel)}</a>
      <span class="breadcrumb-sep" aria-hidden="true">›</span>
      <span>${escHtml(title)}</span>
    </nav>

    <header class="blog-header">
      <div class="blog-meta">
        <time dateTime="${post.publishedAt}">${post.publishedAt}</time>
        <span> · </span>
        <span>${post.readingMinutes} ${escHtml(readLabel)}</span>
      </div>
      <h1>${escHtml(title)}</h1>
      <p class="blog-lead">${escHtml(description)}</p>
    </header>

    <div class="tool-banner">
      <p class="tool-banner-title">${escHtml(toolCta)}</p>
      <a href="${escHtml(toolHref)}" class="tool-banner-btn">${locale === "fr" ? "Lancer l'outil" : "Open Tool"} →</a>
    </div>

    <main class="blog-article">
      ${contentHtml}
    </main>

    <div class="tool-banner" style="margin-top: 48px;">
      <div>
        <p class="tool-banner-title">${escHtml(toolCta)}</p>
        <p style="font-size:12px;color:var(--muted);margin:4px 0 0;">${locale === "fr" ? "100% gratuit · Sans compte · Traitement sécurisé" : "100% Free · No Account · Secure Processing"}</p>
      </div>
      <a href="${escHtml(toolHref)}" class="tool-banner-btn">${locale === "fr" ? "Accéder à l'outil" : "Launch Tool"} →</a>
    </div>
  </div>
  ${buildFooter(locale)}
</body>
</html>`;
}
