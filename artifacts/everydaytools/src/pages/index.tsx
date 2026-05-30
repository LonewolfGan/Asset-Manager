import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { tools } from "@/config/tools.config";
import { useLocale } from "@/hooks/use-locale";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EverydayTools Hub",
  url: "https://everydaytoolshub.com",
  description:
    "Free browser-based tools — convert PDF, images, documents. Generate passwords, calculate units and currencies. No signup. Files stay in your browser.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://everydaytoolshub.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

type DashCategory = "Documents" | "Images" | "Privacy" | "Calculators";

interface DashTool {
  slug: string;
  name: string;
  description: string;
  category: DashCategory;
  Icon: LucideIcon;
  badge?: string;
  route: string;
  formats: string[];
}

const CATEGORY_MAP: Record<string, DashCategory> = {
  pdf:         "Documents",
  word:        "Documents",
  image:       "Images",
  privacy:     "Privacy",
  calculators: "Calculators",
};

const BADGE_SLUGS = new Set(["background-remover", "ai-text-scrubber"]);

const DASH_TOOLS: DashTool[] = tools.map((t) => ({
  slug:        t.slug,
  name:        t.title,
  description: t.description,
  category:    CATEGORY_MAP[t.category] ?? "Documents",
  Icon:        t.icon as LucideIcon,
  badge:       BADGE_SLUGS.has(t.slug) ? "AI" : undefined,
  route:       `/${t.slug}`,
  formats:     t.formats ?? [],
}));

const CATEGORY_COLORS: Record<DashCategory, { icon: string; bg: string; badgeBg: string }> = {
  Documents:   { icon: "#D97706", bg: "rgba(217,119,6,0.10)",   badgeBg: "rgba(217,119,6,0.10)" },
  Images:      { icon: "#0D9488", bg: "rgba(13,148,136,0.10)",  badgeBg: "rgba(13,148,136,0.10)" },
  Privacy:     { icon: "#7C3AED", bg: "rgba(124,58,237,0.10)",  badgeBg: "rgba(124,58,237,0.10)" },
  Calculators: { icon: "#1A6BFF", bg: "rgba(26,107,255,0.10)",  badgeBg: "rgba(26,107,255,0.10)" },
};

/* ── ToolCard ────────────────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: DashTool }) {
  const { t } = useLocale();
  const { Icon } = tool;
  const colors = CATEGORY_COLORS[tool.category];
  const tl = t.tools[tool.slug];
  const name = tl?.title ?? tool.name;
  const description = tl?.description ?? tool.description;
  const ref = useRef<HTMLElement>(null);

  const formatPairs = useMemo(() => {
    const f = tool.formats;
    if (f.length === 0) return [];
    if (f.length === 1) return [[f[0]]];
    const pairs: string[][] = [[f[0], f[1]]];
    for (let i = 2; i < Math.min(f.length, 4); i++) pairs.push([f[i]]);
    return pairs;
  }, [tool.formats]);

  return (
    <Link href={tool.route} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        ref={ref}
        data-testid="tool-card"
        style={{
          padding: "22px 22px 20px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = colors.icon + "55";
          el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`;
          const arrow = el.querySelector<HTMLElement>(".card-arrow");
          if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateX(0)"; }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
          const arrow = el.querySelector<HTMLElement>(".card-arrow");
          if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateX(-4px)"; }
        }}
      >
        {/* Header row: icon + arrow */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colors.bg,
            color: colors.icon,
            flexShrink: 0,
          }}>
            <Icon size={24} strokeWidth={1.6} />
          </div>
          <div className="card-arrow" style={{
            color: colors.icon,
            opacity: 0,
            transform: "translateX(-4px)",
            transition: "opacity 160ms ease, transform 160ms ease",
            paddingTop: 4,
          }}>
            <ArrowRight size={17} strokeWidth={2} />
          </div>
        </div>

        {/* Name + AI badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            lineHeight: 1.25,
          }}>
            {name}
          </span>
          {tool.badge && (
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 5,
              background: colors.badgeBg,
              color: colors.icon,
              lineHeight: 1.3,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}>
              {tool.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.55,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontFamily: "var(--font-ui)",
          flexGrow: 1,
        }}>
          {description}
        </p>

        {/* Format pills */}
        {formatPairs.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
            {formatPairs.map((pair, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                color: colors.icon,
                background: colors.bg,
                padding: "3px 9px",
                borderRadius: 5,
                letterSpacing: "0.02em",
                lineHeight: 1.5,
              }}>
                {pair.length === 2
                  ? <>{pair[0]}<span style={{ opacity: 0.5, fontWeight: 400 }}>→</span>{pair[1]}</>
                  : pair[0]
                }
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
    };
    window.addEventListener("et:search", handler);
    return () => window.removeEventListener("et:search", handler);
  }, []);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return DASH_TOOLS;
    const q = query.toLowerCase();
    return DASH_TOOLS.filter((tool) => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q));
  }, [query]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(WEBSITE_SCHEMA)}
        </script>
      </Helmet>
      <div style={{ flex: 1, background: "var(--bg-base)" }}>
      <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Page header */}
        {!isSearching && (
          <div style={{ marginBottom: 40 }}>
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
              fontSize: 15,
              color: "var(--text-secondary)",
              margin: 0,
              fontFamily: "var(--font-ui)",
            }}>
              {t.home.allToolsSubtitle(DASH_TOOLS.length)}
            </p>
          </div>
        )}

        {/* Search results header */}
        {isSearching && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-ui)" }}>
              {t.home.resultCount(filteredTools.length)} {t.home.resultsFor} &ldquo;<strong style={{ color: "var(--text-primary)" }}>{query}</strong>&rdquo;
            </p>
          </div>
        )}

        {/* No results */}
        {filteredTools.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 12px", fontFamily: "var(--font-ui)" }}>
              {t.home.noResults(query)}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                window.dispatchEvent(new CustomEvent("et:search", { detail: "" }));
              }}
              style={{ fontSize: 13, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", padding: 0 }}
            >
              {t.home.clearSearch}
            </button>
          </div>
        )}

        {/* Flat grid */}
        {filteredTools.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
