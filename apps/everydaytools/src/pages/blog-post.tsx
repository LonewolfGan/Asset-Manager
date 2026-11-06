import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { getBlogPostByEitherSlug } from "@/config/blog-data";
import { useLocale } from "@/hooks/use-locale";
import NotFound from "@/pages/not-found";
import { BlogProgressBar } from "@/components/blog/blog-progress-bar";
import { BlogToc } from "@/components/blog/blog-toc";
import { BlogToolCard } from "@/components/blog/blog-tool-card";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts";

const BASE_URL = "https://everydaytools.qzz.io";

interface BlogPostPageProps {
  params: { slug: string };
}

function formatDate(dateStr: string, locale: "en" | "fr"): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPost({ params }: BlogPostPageProps) {
  const slug = params?.slug ?? "";
  const post = getBlogPostByEitherSlug(slug);

  if (!post) return <NotFound />;

  const { locale } = useLocale();
  const lang: "en" | "fr" =
    post.slug.fr === slug
      ? "fr"
      : post.slug.en === slug
      ? "en"
      : locale?.toLowerCase().startsWith("fr")
      ? "fr"
      : "en";

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
    publisher: {
      "@type": "Organization",
      name: "EverydayTools Hub",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    keywords: post.keywords[lang].join(", "),
  };

  const readLabel = lang === "fr" ? "min de lecture" : "min read";
  const homeLabel = lang === "fr" ? "Accueil" : "Home";
  const blogLabel = "Blog";
  const ctaLabel = post.relatedToolLabel[lang];

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

      {/* Reading Progress Indicator */}
      <BlogProgressBar />

      <div className="container-wide py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-8 text-xs text-[var(--text-tertiary)] flex-wrap"
        >
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            {homeLabel}
          </Link>
          <span aria-hidden="true" className="opacity-50">›</span>
          <Link href={`/${lang}/blog`} className="hover:text-[var(--text-primary)] transition-colors">
            {blogLabel}
          </Link>
          <span aria-hidden="true" className="opacity-50">›</span>
          <span className="text-[var(--text-primary)] font-medium truncate max-w-[260px] sm:max-w-md">
            {post.title[lang]}
          </span>
        </nav>

        {/* Editorial Header */}
        <header className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] mb-4">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
            <span>·</span>
            <span>
              {post.readingMinutes} {readLabel}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.18] mb-4">
            {post.title[lang]}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {post.description[lang]}
          </p>
        </header>

        {/* Asymmetrical Studio Layout */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] gap-12 items-start">
          {/* Main Reading Column */}
          <main className="min-w-0 max-w-2xl">
            <BlogContentRenderer blocks={post.content[lang]} />

            {/* Bottom Conversion Banner Card */}
            <div className="mt-12">
              <BlogToolCard
                toolSlug={post.relatedToolSlug}
                label={ctaLabel}
                lang={lang}
                variant="banner"
                title={post.title[lang]}
                description={post.description[lang]}
              />
            </div>

            {/* Recommended Articles Grid */}
            <BlogRelatedPosts currentSlug={slug} lang={lang} />
          </main>

          {/* Sticky Desktop Sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start space-y-8">
            <BlogToc blocks={post.content[lang]} lang={lang} />
            <BlogToolCard
              toolSlug={post.relatedToolSlug}
              label={ctaLabel}
              lang={lang}
              variant="sidebar"
              title={ctaLabel}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
