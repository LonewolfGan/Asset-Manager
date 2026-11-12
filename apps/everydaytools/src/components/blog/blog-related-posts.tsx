import React, { useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/config/blog-data";

export interface BlogRelatedPostsProps {
  currentSlug: string;
  posts?: BlogPost[];
  lang?: "en" | "fr";
  maxPosts?: number;
}

function formatDate(dateStr: string, locale: "en" | "fr"): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogRelatedPosts({
  currentSlug,
  posts,
  lang = "en",
  maxPosts = 3,
}: BlogRelatedPostsProps): React.JSX.Element | null {
  const allPosts = posts !== undefined ? posts : BLOG_POSTS;

  const normalizedCurrent = (currentSlug || "").trim().toLowerCase();

  const selectedPosts = useMemo(() => {
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      return [];
    }

    const filtered = allPosts.filter((post) => {
      if (!post || !post.slug) return false;
      const enSlug = (post.slug.en || "").toLowerCase();
      const frSlug = (post.slug.fr || "").toLowerCase();
      return enSlug !== normalizedCurrent && frSlug !== normalizedCurrent;
    });

    return filtered.slice(0, maxPosts);
  }, [allPosts, normalizedCurrent, maxPosts]);

  if (selectedPosts.length === 0) {
    return null;
  }

  const sectionTitle = lang === "fr" ? "À lire également" : "Related guides";
  const readingLabel = lang === "fr" ? "min de lecture" : "min read";
  const readMoreLabel = lang === "fr" ? "Lire le guide" : "Read guide";
  const allGuidesLabel = lang === "fr" ? "Tous les guides" : "All guides";

  return (
    <section
      aria-label={sectionTitle}
      data-testid="blog-related-posts"
      className="mt-24"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {sectionTitle}
        </h2>
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <span>{allGuidesLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div
        data-testid="blog-related-posts-grid"
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {selectedPosts.map((post) => {
          const title = post.title[lang] || post.title.en;
          const description = post.description[lang] || post.description.en;
          const slug = post.slug[lang] || post.slug.en;
          const href = `/${lang}/blog/${slug}`;

          return (
            <Link
              key={slug}
              href={href}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
            >
              <div
                data-testid="blog-related-post-card"
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
                  <span>·</span>
                  <span>
                    {post.readingMinutes} {readingLabel}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--card-title-size)",
                    fontWeight: "var(--card-title-weight)" as React.CSSProperties["fontWeight"],
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {description}
                </p>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--accent)",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {readMoreLabel} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
