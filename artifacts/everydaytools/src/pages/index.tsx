import { useState, useMemo } from "react";
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

const CATEGORIES: DashCategory[] = ["Documents", "Images", "Privacy", "Calculators"];

const CATEGORY_COLORS: Record<DashCategory, { icon: string; bg: string; badge: string; badgeBg: string }> = {
  Documents:   { icon: "#D97706", bg: "rgba(217,119,6,0.12)",   badge: "#D97706", badgeBg: "rgba(217,119,6,0.12)" },
  Images:      { icon: "#0D9488", bg: "rgba(13,148,136,0.12)",  badge: "#0D9488", badgeBg: "rgba(13,148,136,0.12)" },
  Privacy:     { icon: "#7C3AED", bg: "rgba(124,58,237,0.13)",  badge: "#7C3AED", badgeBg: "rgba(124,58,237,0.13)" },
  Calculators: { icon: "#EA580C", bg: "rgba(234,88,12,0.12)",   badge: "#EA580C", badgeBg: "rgba(234,88,12,0.12)" },
};

/* ── ToolCard ────────────────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: DashTool }) {
  const { Icon } = tool;
  const colors = CATEGORY_COLORS[tool.category];

  return (
    <Link href={tool.route} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 'var(--radius-card)',
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
          boxShadow: "var(--shadow-card)",
          fontFamily: "var(--font-ui)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = colors.icon + "88";
          el.style.boxShadow = `0 4px 14px rgba(0,0,0,0.25)`;
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "none";
          el.style.transform = "none";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{
            marginTop: 1,
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colors.bg,
            color: colors.icon,
          }}>
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {tool.name}
              </span>
              {tool.badge && (
                <span style={{
                  flexShrink: 0,
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "2px 5px",
                  borderRadius: 4,
                  background: colors.badgeBg,
                  color: colors.badge,
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}>
                  {tool.badge}
                </span>
              )}
            </div>
            <p style={{
              marginTop: 3,
              fontSize: 12,
              color: "var(--text-tertiary)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {tool.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const [activeCategory, setActiveCategory] = useState<DashCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    let list = activeCategory === "All" ? DASH_TOOLS : DASH_TOOLS.filter((t) => t.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, query]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--bg-base)" }}>

      {/* ── Filter bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 20px",
        height: 44,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
        flexShrink: 0,
        position: "sticky",
        top: 52,
        zIndex: 10,
      }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflow: "auto" }}>
          {(["All", ...CATEGORIES] as const).map((cat) => {
            const isActive = activeCategory === cat;
            const catColors = cat !== "All" ? CATEGORY_COLORS[cat as DashCategory] : null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: isActive
                    ? (catColors ? catColors.bg : "var(--bg-elevated)")
                    : "transparent",
                  color: isActive
                    ? (catColors ? catColors.icon : "var(--text-primary)")
                    : "var(--text-tertiary)",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 120ms ease, color 120ms ease",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        <span style={{ fontSize: 12, color: "var(--text-tertiary)", flexShrink: 0 }}>
          {filteredTools.length} tools
        </span>

        <label style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 6, padding: "5px 10px", width: 160, flexShrink: 0, cursor: "text",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tools"
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 12, color: "var(--text-primary)", width: "100%",
              fontFamily: "var(--font-ui)",
            }}
          />
        </label>
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: 20 }}>
        {filteredTools.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center", gap: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
              No tools match &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-ui)" }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
