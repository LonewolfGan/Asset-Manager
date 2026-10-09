import { tools } from "@/config/tools.config";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FileType2,
  Table2,
  MonitorPlay,
  ImageIcon,
  Code2,
  ShieldCheck,
  Calculator,
} from "lucide-react";
import { HUMAN_DESC } from "./home-human-desc";

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EverydayTools Hub",
  url: "https://everydaytools.qzz.io",
  description:
    "Free browser-based tools — convert PDF, images, documents. Generate passwords, calculate units and currencies. No signup. Files stay in your browser.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://everydaytools.qzz.io/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EverydayTools Hub",
  url: "https://everydaytools.qzz.io",
  logo: "https://everydaytools.qzz.io/favicon.svg",
  sameAs: [],
};

export const ITEM_LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Tools",
  description: "A collection of free browser-based utility tools for documents, images, and everyday tasks.",
  url: "https://everydaytools.qzz.io",
  numberOfItems: 34,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "PDF to Word Converter", url: "https://everydaytools.qzz.io/en/convert-pdf-to-word" },
    { "@type": "ListItem", position: 2, name: "Image Converter", url: "https://everydaytools.qzz.io/en/convert-images" },
    { "@type": "ListItem", position: 3, name: "AI Background Remover", url: "https://everydaytools.qzz.io/en/remove-background" },
    { "@type": "ListItem", position: 4, name: "Password Generator", url: "https://everydaytools.qzz.io/en/generate-password" },
    { "@type": "ListItem", position: 5, name: "Currency Converter", url: "https://everydaytools.qzz.io/en/currency-converter" },
  ],
};

export interface CategoryDef {
  key: string;
  label: string;
  labelFr: string;
  FilterIcon: LucideIcon;
}

export const ACCENT_BG = "var(--accent-subtle)";
export const ACCENT_BORDER = "var(--accent)";

export const CATEGORIES: CategoryDef[] = [
  { key: "pdf", label: "PDF Tools", labelFr: "Outils PDF", FilterIcon: FileText },
  { key: "word", label: "Documents", labelFr: "Documents", FilterIcon: FileType2 },
  { key: "excel", label: "Spreadsheets", labelFr: "Tableurs", FilterIcon: Table2 },
  { key: "pptx", label: "Presentations", labelFr: "Présentations", FilterIcon: MonitorPlay },
  { key: "image", label: "Images", labelFr: "Images", FilterIcon: ImageIcon },
  { key: "textCode", label: "Text & Code", labelFr: "Texte & Code", FilterIcon: Code2 },
  { key: "privacy", label: "Privacy", labelFr: "Confidentialité", FilterIcon: ShieldCheck },
  { key: "calculators", label: "Calculators", labelFr: "Calculatrices", FilterIcon: Calculator },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

export const BADGE_SLUGS = new Set(["background-remover", "ai-text-scrubber"]);

export interface DashTool {
  slug: string;
  name: string;
  description: string;
  categoryKey: string;
  Icon: LucideIcon;
  badge?: string;
  route: string;
  formats: string[];
}

export const DASH_TOOLS: DashTool[] = tools.map((t) => ({
  slug: t.slug,
  name: t.title,
  description: HUMAN_DESC[t.slug] ?? t.description,
  categoryKey: t.category,
  Icon: t.icon as LucideIcon,
  badge: BADGE_SLUGS.has(t.slug) ? "AI" : undefined,
  route: `/${t.slug}`,
  formats: (t.formats ?? []) as string[],
}));

export function filterDashTools(
  query: string,
  toolList: DashTool[],
  t?: { tools?: Record<string, { title?: string; description?: string }> }
): DashTool[] {
  if (!query.trim()) return toolList;
  const q = query.toLowerCase();
  return toolList.filter((tool) => {
    const loc = t?.tools?.[tool.slug];
    const locTitle = loc?.title?.toLowerCase() ?? "";
    const locDesc = loc?.description?.toLowerCase() ?? "";
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.slug.toLowerCase().includes(q) ||
      locTitle.includes(q) ||
      locDesc.includes(q)
    );
  });
}

export function groupToolsByCategory(
  toolList: DashTool[]
): { cat: CategoryDef; tools: DashTool[] }[] {
  const map = new Map<string, DashTool[]>();
  for (const tool of toolList) {
    if (!map.has(tool.categoryKey)) map.set(tool.categoryKey, []);
    map.get(tool.categoryKey)!.push(tool);
  }
  return CATEGORIES.map((cat) => ({
    cat,
    tools: map.get(cat.key) ?? [],
  })).filter((g) => g.tools.length > 0);
}
