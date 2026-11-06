import React from "react";
import { Link } from "wouter";
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

  if (!Array.isArray(allPosts) || allPosts.length === 0) {
    return null;
  }

  const normalizedCurrent = (currentSlug || "").trim().toLowerCase();

  const filtered = allPosts.filter((post) => {
    if (!post || !post.slug) return false;
    const enSlug = (post.slug.en || "").toLowerCase();
    const frSlug = (post.slug.fr || "").toLowerCase();
    return enSlug !== normalizedCurrent && frSlug !== normalizedCurrent;
  });

  const selectedPosts = filtered.slice(0, maxPosts);

  if (selectedPosts.length === 0) {
    return null;
  }

  const sectionTitle = lang === "fr" ? "À lire également" : "Related guides";
  const readingLabel = lang === "fr" ? "min de lecture" : "min read";

  return (
    <section
      aria-label={sectionTitle}
      data-testid="blog-related-posts"
      className="mt-16 pt-10 border-t border-zinc-200/80 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {sectionTitle}
        </h2>
        <Link
          href={`/${lang}/blog`}
          className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {lang === "fr" ? "Tous les guides →" : "All guides →"}
        </Link>
      </div>

      <div
        data-testid="blog-related-posts-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {selectedPosts.map((post) => {
          const title = post.title[lang] || post.title.en;
          const slug = post.slug[lang] || post.slug.en;
          const href = `/${lang}/blog/${slug}`;

          return (
            <Link key={slug} href={href} className="group block focus:outline-none">
              <article
                data-testid="blog-related-post-card"
                className="h-full rounded-xl p-5 border border-zinc-200/80 dark:border-white/10 bg-zinc-50/60 dark:bg-zinc-900/40 hover:border-[var(--accent)] hover:shadow-xs transition-all duration-150 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-tertiary)]">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, lang)}</time>
                    <span>·</span>
                    <span>{post.readingMinutes} {readingLabel}</span>
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {title}
                  </h3>
                </div>

                <div className="text-[12px] font-medium text-[var(--accent)] inline-flex items-center gap-1">
                  <span>{lang === "fr" ? "Lire" : "Read"}</span>
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
