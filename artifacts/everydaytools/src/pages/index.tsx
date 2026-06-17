import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { tools } from "@/config/tools.config";
import { useLocale } from "@/hooks/use-locale";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";
import { Bookmark, BookmarkCheck } from "lucide-react";

const WEBSITE_SCHEMA = {
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

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EverydayTools Hub",
  url: "https://everydaytools.qzz.io",
  logo: "https://everydaytools.qzz.io/favicon.svg",
  sameAs: [],
};

const ITEM_LIST_SCHEMA = {
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

/* ── Category config ─────────────────────────────────────────────────────── */
interface CategoryDef {
  key: string;
  label: string;
  labelFr: string;
  color: string;       // icon color
  bg: string;          // icon background
  border: string;      // accent border on hover
}

const CATEGORIES: CategoryDef[] = [
  { key: "pdf",         label: "PDF Tools",        labelFr: "Outils PDF",         color: "#DC2626", bg: "rgba(220,38,38,0.09)",   border: "rgba(220,38,38,0.35)" },
  { key: "word",        label: "Documents",         labelFr: "Documents",          color: "#1A6BFF", bg: "rgba(26,107,255,0.09)",  border: "rgba(26,107,255,0.35)" },
  { key: "excel",       label: "Spreadsheets",      labelFr: "Tableurs",           color: "#16A34A", bg: "rgba(22,163,74,0.09)",   border: "rgba(22,163,74,0.35)" },
  { key: "pptx",        label: "Presentations",     labelFr: "Présentations",      color: "#EA580C", bg: "rgba(234,88,12,0.09)",   border: "rgba(234,88,12,0.35)" },
  { key: "image",       label: "Images",            labelFr: "Images",             color: "#0D9488", bg: "rgba(13,148,136,0.09)",  border: "rgba(13,148,136,0.35)" },
  { key: "textCode",    label: "Text & Code",       labelFr: "Texte & Code",       color: "#7C3AED", bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.35)" },
  { key: "privacy",     label: "Privacy",           labelFr: "Confidentialité",    color: "#0E7490", bg: "rgba(14,116,144,0.09)",  border: "rgba(14,116,144,0.35)" },
  { key: "calculators", label: "Calculators",       labelFr: "Calculatrices",      color: "#9333EA", bg: "rgba(147,51,234,0.09)",  border: "rgba(147,51,234,0.35)" },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

const BADGE_SLUGS = new Set(["background-remover", "ai-text-scrubber"]);

interface DashTool {
  slug: string;
  name: string;
  description: string;
  categoryKey: string;
  Icon: LucideIcon;
  badge?: string;
  route: string;
}

const DASH_TOOLS: DashTool[] = tools.map((t) => ({
  slug: t.slug,
  name: t.title,
  description: t.description,
  categoryKey: t.category,
  Icon: t.icon as LucideIcon,
  badge: BADGE_SLUGS.has(t.slug) ? "AI" : undefined,
  route: `/${t.slug}`,
}));

/* ── ToolCard ────────────────────────────────────────────────────────────── */
function ToolCard({
  tool,
  cat,
  isPinned,
  onTogglePin,
}: {
  tool: DashTool;
  cat: CategoryDef;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) {
  const { t } = useLocale();
  const { Icon } = tool;
  const tl = t.tools[tool.slug];
  const name = tl?.title ?? tool.name;
  const description = tl?.description ?? tool.description;

  return (
    <Link href={tool.route} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        data-testid="tool-card"
        style={{
          position: "relative",
          padding: "18px 18px 16px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          transition: "border-color 150ms ease, box-shadow 150ms ease, background 150ms ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = cat.border;
          el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.07)`;
          el.style.background = "var(--bg-elevated)";
          const pin = el.querySelector<HTMLElement>(".card-pin");
          if (pin && !isPinned) pin.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
          el.style.background = "var(--bg-surface)";
          const pin = el.querySelector<HTMLElement>(".card-pin");
          if (pin && !isPinned) pin.style.opacity = "0";
        }}
      >
        {/* Icon row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: cat.bg,
            color: cat.color,
            flexShrink: 0,
          }}>
            <Icon size={20} strokeWidth={1.6} />
          </div>

          {onTogglePin !== undefined && (
            <button
              className="card-pin"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
              aria-label={isPinned ? "Unpin tool" : "Pin tool"}
              style={{
                background: "none",
                border: "none",
                padding: "3px 2px",
                cursor: "pointer",
                color: isPinned ? cat.color : "var(--text-tertiary)",
                opacity: isPinned ? 1 : 0,
                transition: "opacity 150ms ease, color 150ms ease",
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
                lineHeight: 0,
                flexShrink: 0,
              }}
            >
              {isPinned
                ? <BookmarkCheck size={15} strokeWidth={2} />
                : <Bookmark size={15} strokeWidth={1.8} />}
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{
              fontSize: "13.5px",
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              lineHeight: 1.3,
            }}>
              {name}
            </span>
            {tool.badge && (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                background: cat.bg,
                color: cat.color,
                lineHeight: 1.4,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {tool.badge}
              </span>
            )}
          </div>
          <p style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "var(--font-ui)",
          }}>
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}

/* ── Category Section ─────────────────────────────────────────────────────── */
function CategorySection({
  cat,
  tools,
  isMobile,
  pinnedSlugs,
  onTogglePin,
}: {
  cat: CategoryDef;
  tools: DashTool[];
  isMobile: boolean;
  pinnedSlugs: string[];
  onTogglePin: (slug: string) => void;
}) {
  const { locale } = useLocale();
  const label = locale.toLowerCase().startsWith("fr") ? cat.labelFr : cat.label;

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}>
        <div style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: cat.color,
          flexShrink: 0,
        }} />
        <h2 style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          margin: 0,
          fontFamily: "var(--font-ui)",
        }}>
          {label}
        </h2>
        <span style={{
          fontSize: "11px",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)",
        }}>
          {tools.length}
        </span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "repeat(2, 1fr)"
          : "repeat(auto-fill, minmax(190px, 1fr))",
        gap: 10,
      }}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            cat={cat}
            isPinned={pinnedSlugs.includes(tool.slug)}
            onTogglePin={() => onTogglePin(tool.slug)}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const { t, locale } = useLocale();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
    };
    window.addEventListener("et:search", handler);
    return () => window.removeEventListener("et:search", handler);
  }, []);

  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('et:pinned') ?? '[]'); } catch { return []; }
  });
  useEffect(() => {
    const onPinned = () => {
      try { setPinnedSlugs(JSON.parse(localStorage.getItem('et:pinned') ?? '[]')); } catch { setPinnedSlugs([]); }
    };
    window.addEventListener('et:pinned', onPinned);
    return () => window.removeEventListener('et:pinned', onPinned);
  }, []);

  const pinnedTools = useMemo(
    () => pinnedSlugs.map(s => DASH_TOOLS.find(t => t.slug === s)).filter((t): t is DashTool => t !== undefined),
    [pinnedSlugs]
  );

  const togglePin = useCallback((slug: string) => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem('et:pinned') ?? '[]');
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [slug, ...prev];
      localStorage.setItem('et:pinned', JSON.stringify(next));
      window.dispatchEvent(new Event('et:pinned'));
    } catch {}
  }, []);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return DASH_TOOLS;
    const q = query.toLowerCase();
    return DASH_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
    );
  }, [query]);

  const isSearching = query.trim().length > 0;

  // Group tools by category, preserving CATEGORIES order
  const groupedTools = useMemo(() => {
    const map = new Map<string, DashTool[]>();
    for (const tool of filteredTools) {
      if (!map.has(tool.categoryKey)) map.set(tool.categoryKey, []);
      map.get(tool.categoryKey)!.push(tool);
    }
    return CATEGORIES
      .map(cat => ({ cat, tools: map.get(cat.key) ?? [] }))
      .filter(g => g.tools.length > 0);
  }, [filteredTools]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://everydaytools.qzz.io/${locale.toLowerCase()}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/en" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/en" />
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ITEM_LIST_SCHEMA)}</script>
      </Helmet>

      <div style={{ flex: 1, background: "var(--bg-base)" }}>
        <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* Page header */}
          {!isSearching && (
            <div style={{ marginBottom: 48 }}>
              <h1 style={{
                fontSize: "2rem",
                fontWeight: 700,
                margin: "0 0 8px",
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}>
                {t.home.allTools}
              </h1>
              <p style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                margin: 0,
                fontFamily: "var(--font-ui)",
              }}>
                {t.home.allToolsSubtitle(DASH_TOOLS.length)}
              </p>
            </div>
          )}

          {/* Pinned */}
          {!isSearching && pinnedTools.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: "var(--accent)", flexShrink: 0 }} />
                <p style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontFamily: "var(--font-ui)",
                }}>
                  {t.home.pinned}
                </p>
                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  {pinnedTools.length}
                </span>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : `repeat(${Math.min(pinnedTools.length, 5)}, minmax(0, 1fr))`,
                gap: 10,
              }}>
                {pinnedTools.map((tool) => {
                  const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                  return (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      cat={cat}
                      isPinned={true}
                      onTogglePin={() => togglePin(tool.slug)}
                    />
                  );
                })}
              </div>
              <div style={{ marginTop: 36, borderTop: "1px solid var(--border)" }} />
            </div>
          )}

          {/* Search results */}
          {isSearching && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-ui)" }}>
                {t.home.resultCount(filteredTools.length)} {t.home.resultsFor} &ldquo;<strong style={{ color: "var(--text-primary)" }}>{query}</strong>&rdquo;
              </p>
            </div>
          )}

          {/* No results */}
          {filteredTools.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 12px", fontFamily: "var(--font-ui)" }}>
                {t.home.noResults(query)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  window.dispatchEvent(new CustomEvent("et:search", { detail: "" }));
                }}
                style={{ fontSize: "var(--text-sm)", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", padding: 0 }}
              >
                {t.home.clearSearch}
              </button>
            </div>
          )}

          {/* Flat search grid */}
          {isSearching && filteredTools.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 10,
            }}>
              {filteredTools.map((tool) => {
                const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                return (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={cat}
                    isPinned={pinnedSlugs.includes(tool.slug)}
                    onTogglePin={() => togglePin(tool.slug)}
                  />
                );
              })}
            </div>
          )}

          {/* Grouped by category */}
          {!isSearching && groupedTools.map(({ cat, tools }) => (
            <CategorySection
              key={cat.key}
              cat={cat}
              tools={tools}
              isMobile={isMobile}
              pinnedSlugs={pinnedSlugs}
              onTogglePin={togglePin}
            />
          ))}
        </div>
      </div>
    </>
  );
}
