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

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="11" fill="#1A1916"/>
      <rect x="14" y="15" width="36" height="7" rx="2" fill="#1A6BFF"/>
      <rect x="14" y="28" width="28" height="7" rx="2" fill="#F7F6F3"/>
      <rect x="14" y="41" width="36" height="7" rx="2" fill="#F7F6F3"/>
    </svg>
  );
}

function ToolCard({ tool, isActive, onSelect }: { tool: DashTool; isActive: boolean; onSelect: () => void }) {
  const { Icon } = tool;
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        borderRadius: 12,
        border: isActive ? "1px solid rgba(26,107,255,0.4)" : "1px solid #E8E6E1",
        background: isActive ? "rgba(26,107,255,0.06)" : "#FFFFFF",
        boxShadow: isActive ? "0 1px 4px rgba(26,107,255,0.08)" : "none",
        cursor: "pointer",
        transition: "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "#C8C6C1";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "#E8E6E1";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
          (e.currentTarget as HTMLElement).style.transform = "none";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          marginTop: 2,
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isActive ? "rgba(26,107,255,0.10)" : "#F2F0EB",
          color: isActive ? "#1A6BFF" : "#6B6963",
          transition: "background 120ms ease, color 120ms ease",
        }}>
          <Icon size={17} strokeWidth={1.75} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? "#1A6BFF" : "#1A1916",
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
                background: "rgba(26,107,255,0.10)",
                color: "#1A6BFF",
                lineHeight: 1,
              }}>
                {tool.badge}
              </span>
            )}
          </div>
          <p style={{
            marginTop: 4,
            fontSize: 12,
            color: "#8A8880",
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

function ToolsGrid({ tools: list, selectedSlug, onSelect }: { tools: DashTool[]; selectedSlug: string | null; onSelect: (slug: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
      {list.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} isActive={selectedSlug === tool.slug} onSelect={() => onSelect(tool.slug)} />
      ))}
    </div>
  );
}

function ToolDetail({ tool }: { tool: DashTool }) {
  const { Icon } = tool;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #EEECE8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(26,107,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A6BFF", flexShrink: 0 }}>
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1916" }}>{tool.name}</span>
          {tool.badge && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 5px", borderRadius: 4, background: "rgba(26,107,255,0.10)", color: "#1A6BFF", lineHeight: 1 }}>
              {tool.badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#8A8880", lineHeight: 1.6, marginLeft: 42 }}>{tool.description}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href={tool.route}>
          <button
            type="button"
            style={{ width: "100%", padding: "10px 16px", borderRadius: 10, background: "#1A1916", color: "#FFFFFF", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "background 120ms ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2A2924"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1916"; }}
          >
            Open {tool.name}
          </button>
        </Link>
        <p style={{ textAlign: "center", fontSize: 11, color: "#BBBBBB" }}>
          {tool.category} &middot; {tool.route}
        </p>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, padding: "0 24px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F2F0EB", border: "1px solid #E8E6E1", display: "flex", alignItems: "center", justifyContent: "center", color: "#C0BEB8" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#6B6963" }}>Select a tool</p>
        <p style={{ fontSize: 12, color: "#AAAAAA", marginTop: 4 }}>Pick any tool from the grid to see details and open it.</p>
      </div>
    </div>
  );
}

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F7F6F3", color: "#1A1916", fontFamily: "var(--font-ui, system-ui, sans-serif)" }}>

      {/* Header */}
      <header style={{ height: 56, borderBottom: "1px solid #E8E6E1", background: "#FFFFFF", display: "flex", alignItems: "center", padding: "0 20px", gap: 20, position: "sticky", top: 0, zIndex: 20, boxShadow: "0 1px 0 0 #E8E6E1", flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <LogoMark />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "#1A1916" }}>EverydayTools</span>
        </div>

        {/* Category nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflowX: "auto" }}>
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); setSelectedSlug(null); }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: activeCategory === cat ? "#F2F0EB" : "transparent",
                color: activeCategory === cat ? "#1A1916" : "#6B6963",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 120ms ease, color 120ms ease",
                fontFamily: "var(--font-ui, system-ui, sans-serif)",
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Search */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, background: "#F7F6F3", border: "1px solid #E8E6E1", borderRadius: 8, padding: "6px 10px", width: 176, flexShrink: 0, cursor: "text" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9890" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedSlug(null); }}
            aria-label="Search tools"
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#1A1916", width: "100%", fontFamily: "var(--font-ui, system-ui, sans-serif)" }}
          />
        </label>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Tools grid */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#9A9890" }}>
              {activeCategory === "All" ? "All tools" : activeCategory}
            </span>
            <span style={{ fontSize: 12, color: "#C0BEB8" }}>{filteredTools.length}</span>
          </div>

          {filteredTools.length > 0 ? (
            <ToolsGrid tools={filteredTools} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center", gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#6B6963" }}>No tools match &ldquo;{query}&rdquo;</p>
              <button type="button" onClick={() => setQuery("")} style={{ fontSize: 12, color: "#1A6BFF", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Clear search</button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "#E8E6E1", flexShrink: 0 }} />

        {/* Detail panel */}
        <div style={{ width: 320, flexShrink: 0, background: "#FFFFFF", overflowY: "auto", padding: 20 }}>
          {selectedTool ? <ToolDetail tool={selectedTool} /> : <EmptyDetail />}
        </div>
      </div>
    </div>
  );
}
