import { pdfPosts } from "./blog-registries/pdf-posts";
import { docPosts } from "./blog-registries/doc-posts";
import { imagePosts } from "./blog-registries/image-posts";
import { securityPosts } from "./blog-registries/security-posts";

import type { BlogPost, BlogCategoryInfo } from "./blog-types";
export type { ContentBlock, BlogPost, BlogCategory, BlogCategoryInfo } from "./blog-types";
export { filterBlogPosts, getCategoryPostCount } from "./blog-helpers";

export const BLOG_POSTS: BlogPost[] = [
  ...pdfPosts,
  ...docPosts,
  ...imagePosts,
  ...securityPosts,
];

export const BLOG_CATEGORIES: BlogCategoryInfo[] = [
  { id: "all", label: { en: "All Guides", fr: "Tous les guides" } },
  { id: "pdf", label: { en: "PDF Tools", fr: "Outils PDF" } },
  { id: "image", label: { en: "Image Tools", fr: "Outils Image" } },
  { id: "documents", label: { en: "Documents & Office", fr: "Documents & Office" } },
  { id: "security", label: { en: "Security & Privacy", fr: "Sécurité & Confidentialité" } },
];

export function getBlogPostBySlug(slug: string, locale: "en" | "fr"): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug[locale] === slug);
}

export function getBlogPostByEitherSlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug.en === slug || p.slug.fr === slug);
}
