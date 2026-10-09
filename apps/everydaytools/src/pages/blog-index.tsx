import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { BLOG_POSTS } from "@/config/blog-data";
import { useLocale } from "@/hooks/use-locale";
import { PageTitle, PageSubtitle } from "@/components/Typography";

const BASE_URL = "https://everydaytools.qzz.io";

function formatDate(dateStr: string, locale: "en" | "fr"): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const { locale } = useLocale();
  const lang: "en" | "fr" = locale?.toLowerCase().startsWith("fr") ? "fr" : "en";

  const title = lang === "fr"
    ? "Blog — Guides pratiques | EverydayTools Hub"
    : "Blog — How-to Guides | EverydayTools Hub";
  const description = lang === "fr"
    ? "Guides pratiques pour convertir des fichiers, traiter des images, et améliorer votre sécurité en ligne. Gratuit, sans inscription."
    : "Practical how-to guides for converting files, processing images, and improving your online security. Free, no account required.";
  const canonical = `${BASE_URL}/${lang}/blog`;
  const altLang = lang === "fr" ? "en" : "fr";
  const altCanonical = `${BASE_URL}/${altLang}/blog`;

  const readLabel = lang === "fr" ? "min de lecture" : "min read";
  const blogLabel = lang === "fr" ? "Blog" : "Blog";
  const heroTitle = lang === "fr" ? "Guides pratiques" : "How-to Guides";
  const heroSubtitle = lang === "fr"
    ? "Conseils simples pour les tâches numériques de tous les jours."
    : "Simple tips for everyday digital tasks.";
  const readMoreLabel = lang === "fr" ? "Lire le guide" : "Read guide";

  const BLOG_LIST_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: lang === "fr" ? "Blog EverydayTools Hub" : "EverydayTools Hub Blog",
    description,
    url: canonical,
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title[lang],
      url: `${BASE_URL}/${lang}/blog/${post.slug[lang]}`,
      datePublished: post.publishedAt,
      description: post.description[lang],
    })),
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang={lang} href={canonical} />
        <link rel="alternate" hrefLang={altLang} href={altCanonical} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en/blog`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://everydaytools.qzz.io/opengraph.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://everydaytools.qzz.io/opengraph.jpg" />
        <script type="application/ld+json">{JSON.stringify(BLOG_LIST_SCHEMA)}</script>
      </Helmet>

      <div className="container-wide" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, fontSize: 13, color: "var(--text-tertiary)" }}>
          <Link href="/" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <span>›</span>
          <span style={{ color: "var(--text-primary)" }}>{blogLabel}</span>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <PageTitle style={{ marginBottom: 16 }}>{heroTitle}</PageTitle>
          <PageSubtitle>{heroSubtitle}</PageSubtitle>
        </div>

        {/* Post grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug.en}
              href={`/${lang}/blog/${post.slug[lang]}`}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
            >
              <article
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg, 12px)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  height: "100%",
                  boxSizing: "border-box",
                  transition: "border-color 140ms ease, box-shadow 140ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
                  <span>·</span>
                  <span>{post.readingMinutes} {readLabel}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--card-title-size)", fontWeight: "var(--card-title-weight)" as React.CSSProperties["fontWeight"], color: "var(--text-primary)", lineHeight: 1.3, letterSpacing: "-0.01em", margin: 0 }}>
                  {post.title[lang]}
                </h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {post.description[lang]}
                </p>
                <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  {readMoreLabel} →
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
