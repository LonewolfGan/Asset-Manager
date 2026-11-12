export type BlogCategory = "pdf" | "image" | "documents" | "security";

export interface BlogCategoryInfo {
  id: BlogCategory | "all";
  label: { en: string; fr: string };
}

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export interface BlogPost {
  slug: { en: string; fr: string };
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  keywords: { en: string[]; fr: string[] };
  publishedAt: string;
  readingMinutes: number;
  category: BlogCategory;
  relatedToolSlug: string;
  relatedToolLabel: { en: string; fr: string };
  content: { en: ContentBlock[]; fr: ContentBlock[] };
}
