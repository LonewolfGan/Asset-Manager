import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { getBlogPostByEitherSlug, type ContentBlock } from "@/config/blog-data";
import { useLocale } from "@/hooks/use-locale";
import NotFound from "@/pages/not-found";

const BASE_URL = "https://everydaytools.qzz.io";

interface BlogPostPageProps {
  params: { slug: string };
}

function formatDate(dateStr: string, locale: "en" | "fr"): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={idx}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 400,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            margin: "40px 0 16px",
            lineHeight: 1.25,
          }}
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={idx}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "28px 0 10px",
            lineHeight: 1.4,
          }}
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p
          key={idx}
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            margin: "0 0 16px",
          }}
        >
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul
          key={idx}
          style={{
            margin: "0 0 20px",
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {block.items.map((item, i) => (
            <li key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={idx}
          style={{
            margin: "0 0 20px",
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {block.items.map((item, i) => (
            <li key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={idx}
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            margin: "24px 0",
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPost({ params }: BlogPostPageProps) {
  const { locale } = useLocale();
  const lang: "en" | "fr" = locale?.toLowerCase().startsWith("fr") ? "fr" : "en";
  const slug = params?.slug ?? "";
  const post = getBlogPostByEitherSlug(slug);

  if (!post) return <NotFound />;

  const canonical = `${BASE_URL}/${lang}/blog/${post.slug[lang]}`;
  const altLang: "en" | "fr" = lang === "fr" ? "en" : "fr";
  const altCanonical = `${BASE_URL}/${altLang}/blog/${post.slug[altLang]}`;

  const ARTICLE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[lang],
    description: post.description[lang],
    url: canonical,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "EverydayTools Hub", url: BASE_URL },
    publisher: { "@type": "Organization", name: "EverydayTools Hub", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.svg` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    keywords: post.keywords[lang].join(", "),
  };

  const readLabel = lang === "fr" ? "min de lecture" : "min read";
  const homeLabel = lang === "fr" ? "Accueil" : "Home";
  const blogLabel = "Blog";
  const ctaLabel = post.relatedToolLabel[lang];
  const toolPath = `/${post.relatedToolSlug}`;

  return (
    <>
      <Helmet>
        <title>{post.title[lang]}</title>
        <meta name="description" content={post.description[lang]} />
        <meta name="keywords" content={post.keywords[lang].join(", ")} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang={lang} href={canonical} />
        <link rel="alternate" hrefLang={altLang} href={altCanonical} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en/blog/${post.slug.en}`} />
        <meta property="og:title" content={post.title[lang]} />
        <meta property="og:description" content={post.description[lang]} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EverydayTools Hub" />
        <meta property="og:image" content={`${BASE_URL}/opengraph.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title[lang]} />
        <meta name="twitter:description" content={post.description[lang]} />
        <meta name="twitter:image" content={`${BASE_URL}/opengraph.jpg`} />
        <script type="application/ld+json">{JSON.stringify(ARTICLE_SCHEMA)}</script>
      </Helmet>

      <div className="container-reading" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, fontSize: 13, color: "var(--text-tertiary)", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            {homeLabel}
          </Link>
          <span>›</span>
          <Link href={`/${lang}/blog`} style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            {blogLabel}
          </Link>
          <span>›</span>
          <span style={{ color: "var(--text-primary)" }}>{post.title[lang]}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", marginBottom: 16 }}>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
            <span>·</span>
            <span>{post.readingMinutes} {readLabel}</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 400,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {post.title[lang]}
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
            {post.description[lang]}
          </p>
        </header>

        {/* CTA — try the tool */}
        <Link href={toolPath} style={{ textDecoration: "none", display: "block", marginBottom: 40 }}>
          <div
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              fontWeight: 500,
              transition: "opacity 120ms ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.87"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {ctaLabel} →
          </div>
        </Link>

        {/* Article content */}
        <article>
          {post.content[lang].map((block, idx) => renderBlock(block, idx))}
        </article>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <Link href={toolPath} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "var(--radius-md)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-ui)",
                fontSize: 15,
                fontWeight: 500,
                transition: "opacity 120ms ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.87"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {ctaLabel} →
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
