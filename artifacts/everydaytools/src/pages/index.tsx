import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { tools } from "@/config/tools.config";
import { useLocale } from "@/hooks/use-locale";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

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

const CATEGORY_COLORS: Record<DashCategory, { icon: string; bg: string; accent: string; badgeBg: string }> = {
  Documents:   { icon: "#D97706", bg: "rgba(217,119,6,0.10)",   accent: "#D97706", badgeBg: "rgba(217,119,6,0.10)" },
  Images:      { icon: "#0D9488", bg: "rgba(13,148,136,0.10)",  accent: "#0D9488", badgeBg: "rgba(13,148,136,0.10)" },
  Privacy:     { icon: "#7C3AED", bg: "rgba(124,58,237,0.10)",  accent: "#7C3AED", badgeBg: "rgba(124,58,237,0.10)" },
  Calculators: { icon: "#1A6BFF", bg: "rgba(26,107,255,0.10)",  accent: "#1A6BFF", badgeBg: "rgba(26,107,255,0.10)" },
};

const CATEGORY_ORDER: DashCategory[] = ["Documents", "Images", "Privacy", "Calculators"];

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
        style={{
          padding: "20px 20px 18px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = colors.accent + "55";
          el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px ${colors.accent}22`;
          el.style.transform = "translateY(-2px)";
          const arrow = el.querySelector<HTMLElement>(".card-arrow");
          if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateX(0)"; }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
          el.style.transform = "translateY(0)";
          const arrow = el.querySelector<HTMLElement>(".card-arrow");
          if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateX(-4px)"; }
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2,
          background: colors.accent,
          opacity: 0.35,
          borderRadius: "var(--radius-card) var(--radius-card) 0 0",
        }} />

        {/* Header row: icon + arrow */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colors.bg,
            color: colors.icon,
            flexShrink: 0,
          }}>
            <Icon size={19} strokeWidth={1.7} />
          </div>
          <div className="card-arrow" style={{
            color: colors.icon,
            opacity: 0,
            transform: "translateX(-4px)",
            transition: "opacity 160ms ease, transform 160ms ease",
            paddingTop: 2,
          }}>
            <ArrowRight size={15} strokeWidth={2} />
          </div>
        </div>

        {/* Name + AI badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            lineHeight: 1.25,
          }}>
            {name}
          </span>
          {tool.badge && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 6px",
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
          fontSize: 12.5,
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
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
            {formatPairs.map((pair, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
                color: colors.icon,
                background: colors.bg,
                padding: "2px 7px",
                borderRadius: 4,
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

/* ── Category Section ────────────────────────────────────────────────────── */
function CategorySection({ category, tools: catTools }: { category: DashCategory; tools: DashTool[] }) {
  const { t } = useLocale();
  const colors = CATEGORY_COLORS[category];
  const label = t.home.sectionLabels[category] ?? category;
  const desc = t.home.sectionDescriptions[category] ?? "";

  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
        <h2 style={{
          fontSize: 13,
          fontWeight: 700,
          margin: 0,
          fontFamily: "var(--font-ui)",
          color: colors.icon,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}>
          {label}
        </h2>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>
          {t.home.toolCount(catTools.length)} — {desc}
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 14,
      }}>
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const { t } = useLocale();
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
    return DASH_TOOLS.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [query]);

  const groupedByCategory = useMemo(() => {
    const map = new Map<DashCategory, DashTool[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const tool of filteredTools) {
      map.get(tool.category)!.push(tool);
    }
    return map;
  }, [filteredTools]);

  const isSearching = query.trim().length > 0;

  return (
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
              fontSize: 15,
              color: "var(--text-secondary)",
              margin: "0 0 28px",
              fontFamily: "var(--font-ui)",
            }}>
              {t.home.allToolsSubtitle(DASH_TOOLS.length)}
            </p>

            {/* Category anchor pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {CATEGORY_ORDER.map((cat) => {
                const colors = CATEGORY_COLORS[cat];
                const count = DASH_TOOLS.filter((tool) => tool.category === cat).length;
                const label = t.home.sectionLabels[cat] ?? cat;
                return (
                  <a
                    key={cat}
                    href={`#section-${cat.toLowerCase()}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `1px solid ${colors.accent}33`,
                      background: colors.bg,
                      color: colors.icon,
                      fontSize: 12.5,
                      fontWeight: 600,
                      fontFamily: "var(--font-ui)",
                      textDecoration: "none",
                      transition: "opacity 120ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {label}
                    <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>{count}</span>
                  </a>
                );
              })}
            </div>
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

        {/* Search results: flat grid */}
        {isSearching && filteredTools.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}

        {/* Normal: grouped by category */}
        {!isSearching && filteredTools.length > 0 && (
          <>
            {CATEGORY_ORDER.map((cat) => {
              const catTools = groupedByCategory.get(cat) ?? [];
              if (catTools.length === 0) return null;
              return (
                <div key={cat} id={`section-${cat.toLowerCase()}`}>
                  <CategorySection category={cat} tools={catTools} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
