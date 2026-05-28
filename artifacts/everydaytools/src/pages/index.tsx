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

/* ── ToolCard ────────────────────────────────────────────────────────────── */
function ToolCard({ tool, isActive, onSelect }: { tool: DashTool; isActive: boolean; onSelect: () => void }) {
  const { Icon } = tool;
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 14,
        borderRadius: 8,
        border: isActive
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        background: isActive ? "var(--accent-subtle)" : "var(--bg-surface)",
        cursor: "pointer",
        transition: "border-color 120ms ease, background 120ms ease, box-shadow 120ms ease, transform 120ms ease",
        outline: "none",
        fontFamily: "var(--font-ui)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
          (e.currentTarget as HTMLElement).style.transform = "none";
        }
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
          background: isActive ? "rgba(26,107,255,0.18)" : "var(--bg-elevated)",
          color: isActive ? "var(--accent)" : "var(--text-tertiary)",
          transition: "background 120ms ease, color 120ms ease",
        }}>
          <Icon size={16} strokeWidth={1.75} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? "var(--accent)" : "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {tool.name}
            </span>
            {tool.badge && (
              <span style={{
                flexShrink: 0,
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 5px",
                borderRadius: 4,
                background: "var(--accent-subtle)",
                color: "var(--accent)",
                lineHeight: 1,
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
    </button>
  );
}

/* ── ToolsGrid ───────────────────────────────────────────────────────────── */
function ToolsGrid({ tools: list, selectedSlug, onSelect }: { tools: DashTool[]; selectedSlug: string | null; onSelect: (slug: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
      {list.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} isActive={selectedSlug === tool.slug} onSelect={() => onSelect(tool.slug)} />
      ))}
    </div>
  );
}

/* ── ToolDetail ──────────────────────────────────────────────────────────── */
function ToolDetail({ tool }: { tool: DashTool }) {
  const { Icon } = tool;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: "var(--accent-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent)", flexShrink: 0,
          }}>
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{tool.name}</span>
          {tool.badge && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 5px", borderRadius: 4, background: "var(--accent-subtle)", color: "var(--accent)", lineHeight: 1, flexShrink: 0 }}>
              {tool.badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{tool.description}</p>
      </div>

      <Link href={tool.route}>
        <button
          type="button"
          style={{
            width: "100%", padding: "10px 16px", borderRadius: 6,
            background: "var(--accent)", color: "#fff",
            fontSize: 13, fontWeight: 500, border: "none",
            cursor: "pointer", transition: "opacity 120ms ease",
            fontFamily: "var(--font-ui)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          Open {tool.name}
        </button>
      </Link>

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)", marginTop: 10 }}>
        {tool.category} &middot; {tool.route}
      </p>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14, padding: "40px 24px", color: "var(--text-tertiary)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Select a tool</p>
        <p style={{ fontSize: 12, marginTop: 4 }}>Pick any card to see details and open it.</p>
      </div>
    </div>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const [selectedSlug, setSelectedSlug]     = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DashCategory | "All">("All");
  const [query, setQuery]                   = useState("");

  const filteredTools = useMemo(() => {
    let list = activeCategory === "All" ? DASH_TOOLS : DASH_TOOLS.filter((t) => t.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, query]);

  const selectedTool = DASH_TOOLS.find((t) => t.slug === selectedSlug) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--bg-base)", overflow: "hidden", height: "calc(100vh - 52px)" }}>

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
      }}>
        {/* Category pills */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflow: "auto" }}>
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); setSelectedSlug(null); }}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                background: activeCategory === cat ? "var(--bg-elevated)" : "transparent",
                color: activeCategory === cat ? "var(--text-primary)" : "var(--text-tertiary)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 120ms ease, color 120ms ease",
                fontFamily: "var(--font-ui)",
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Tool count */}
        <span style={{ fontSize: 12, color: "var(--text-tertiary)", flexShrink: 0 }}>
          {filteredTools.length} tools
        </span>

        {/* Search */}
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
            onChange={(e) => { setQuery(e.target.value); setSelectedSlug(null); }}
            aria-label="Search tools"
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 12, color: "var(--text-primary)", width: "100%",
              fontFamily: "var(--font-ui)",
            }}
          />
        </label>
      </div>

      {/* ── Body: grid + detail ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Tools grid */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: 20 }}>
          {filteredTools.length > 0 ? (
            <ToolsGrid tools={filteredTools} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center", gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>No tools match &ldquo;{query}&rdquo;</p>
              <button type="button" onClick={() => setQuery("")} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-ui)" }}>
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />

        {/* Detail panel */}
        <div style={{ width: 300, flexShrink: 0, background: "var(--bg-surface)", overflowY: "auto", padding: 20 }}>
          {selectedTool ? <ToolDetail tool={selectedTool} /> : <EmptyDetail />}
        </div>
      </div>
    </div>
  );
}
