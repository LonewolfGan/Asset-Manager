import type { CategoryDef } from "@/lib/home-tools-data";
import { ACCENT_BG, ACCENT_BORDER } from "@/lib/home-tools-data";
import { useLocale } from "@/hooks/use-locale";

interface CategoryFilterBarProps {
  categories: CategoryDef[];
  activeKey: string | null;
  isMobile: boolean;
  onSelect: (key: string | null) => void;
}

export function CategoryFilterBar({
  categories,
  activeKey,
  isMobile,
  onSelect,
}: CategoryFilterBarProps) {
  const { locale } = useLocale();

  const allLabel = locale.toLowerCase().startsWith("fr") ? "Tous" : "All";
  const isAllActive = activeKey === null;

  if (isMobile) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 36,
      }}
    >
      {/* All pill */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 18px",
          borderRadius: "var(--radius-pill)",
          border: `1px solid ${isAllActive ? "var(--accent)" : "var(--border)"}`,
          background: isAllActive ? "var(--accent)" : "var(--bg-surface)",
          color: isAllActive ? "var(--accent-text)" : "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-xs)",
          fontWeight: isAllActive ? 600 : 500,
          cursor: "pointer",
          transition: "all 120ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!isAllActive) {
            (e.currentTarget as HTMLElement).style.borderColor = ACCENT_BORDER;
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isAllActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        {allLabel}
      </button>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 22,
          background: "var(--border-strong)",
          flexShrink: 0,
          marginInline: 4,
          opacity: 0.7,
        }}
      />

      {categories.map((cat) => {
        const label = locale.toLowerCase().startsWith("fr") ? cat.labelFr : cat.label;
        const isActive = activeKey === cat.key;
        const { FilterIcon } = cat;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelect(cat.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              border: `1px solid ${isActive ? ACCENT_BORDER : "var(--border)"}`,
              background: isActive ? ACCENT_BG : "var(--bg-surface)",
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-xs)",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              transition: "all 120ms ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = ACCENT_BORDER;
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }
            }}
          >
            <FilterIcon size={13} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
