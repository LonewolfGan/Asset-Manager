import type { BlogPost, BlogCategory } from "./blog-types";

export function filterBlogPosts(
  posts: BlogPost[],
  category: BlogCategory | "all",
  query: string,
  lang: "en" | "fr"
): BlogPost[] {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  const trimmedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    if (category !== "all" && post.category !== category) {
      return false;
    }

    if (!trimmedQuery) {
      return true;
    }

    const title = post.title?.[lang]?.toLowerCase() || "";
    const desc = post.description?.[lang]?.toLowerCase() || "";
    const keywords = post.keywords?.[lang] || [];

    return (
      title.includes(trimmedQuery) ||
      desc.includes(trimmedQuery) ||
      keywords.some((k) => k.toLowerCase().includes(trimmedQuery))
    );
  });
}

export function getCategoryPostCount(
  posts: BlogPost[],
  category: BlogCategory | "all"
): number {
  if (!Array.isArray(posts) || posts.length === 0) return 0;
  if (category === "all") return posts.length;
  return posts.filter((post) => post.category === category).length;
}

export function getResponsivePostsPerPage(width: number): number {
  if (width < 640) return 6;
  if (width < 1024) return 10;
  return 15;
}

export function formatBlogDate(dateStr: string, locale: "en" | "fr"): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
