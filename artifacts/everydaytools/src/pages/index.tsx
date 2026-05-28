import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { tools } from "@/config/tools.config";
import type { LucideIcon } from "lucide-react";

type DashCategory = "Documents" | "Images" | "Privacy" | "Calculators";

interface DashTool {
  slug: string;
  name: string;
  description: string;
  category: DashCategory;
  Icon: LucideIcon;
  badge?: string;
  route: string;
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
}));

const CATEGORY_COLORS: Record<DashCategory, { icon: string; bg: string; badge: string; badgeBg: string }> = {
  Documents:   { icon: "#D97706", bg: "rgba(217,119,6,0.10)",   badge: "#D97706", badgeBg: "rgba(217,119,6,0.10)" },
  Images:      { icon: "#0D9488", bg: "rgba(13,148,136,0.10)",  badge: "#0D9488", badgeBg: "rgba(13,148,136,0.10)" },
  Privacy:     { icon: "#7C3AED", bg: "rgba(124,58,237,0.10)",  badge: "#7C3AED", badgeBg: "rgba(124,58,237,0.10)" },
  Calculators: { icon: "#EA580C", bg: "rgba(234,88,12,0.10)",   badge: "#EA580C", badgeBg: "rgba(234,88,12,0.10)" },
};

/* ── ToolCard ────────────────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: DashTool }) {
  const { Icon } = tool;
  const colors = CATEGORY_COLORS[tool.category];

  return (
    <Link href={tool.route} style={{ textDecoration: "none", display: "block" }}>
      <article
        style={{
          padding: "20px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = colors.icon + "66";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
          el.style.transform = "none";
        }}
      >
        {/* Icon */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          color: colors.icon,
          marginBottom: 14,
        }}>
          <Icon size={18} strokeWidth={1.75} />
        </div>

        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            lineHeight: 1.2,
          }}>
            {tool.name}
          </span>
          {tool.badge && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 6,
              background: colors.badgeBg,
              color: colors.badge,
              lineHeight: 1.2,
              letterSpacing: "0.04em",
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
          lineHeight: 1.5,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontFamily: "var(--font-ui)",
        }}>
          {tool.description}
        </p>
      </article>
    </Link>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
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

  return (
    <div style={{ flex: 1, background: "var(--bg-base)" }}>
      <div style={{ maxWidth: "var(--content-wide)", margin: "0 auto", padding: "40px 24px 64px" }}>

        {/* Page header */}
        {!query && (
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              All Tools
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-ui)" }}>
              {DASH_TOOLS.length} browser-based utilities — nothing uploaded, everything private.
            </p>
          </div>
        )}

        {query && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-ui)" }}>
              {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} for &ldquo;<strong style={{ color: "var(--text-primary)" }}>{query}</strong>&rdquo;
            </p>
          </div>
        )}

        {/* Grid */}
        {filteredTools.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 12px", fontFamily: "var(--font-ui)" }}>
              No tools match &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                window.dispatchEvent(new CustomEvent("et:search", { detail: "" }));
              }}
              style={{ fontSize: 13, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", padding: 0 }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
