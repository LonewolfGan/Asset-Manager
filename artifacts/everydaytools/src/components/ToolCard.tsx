import { Link } from "wouter";
import { LucideIcon } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

interface ToolCardProps {
  tool: {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    category: string;
    formats?: string[];
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { t } = useLocale();
  const translated = t.tools[tool.slug];
  const title = translated?.title ?? tool.title;
  const description = translated?.description ?? tool.description;
  const categoryTag = (t.home.toolCategory as Record<string, string>)?.[tool.category] ?? tool.category;

  return (
    <Link
      href={`/${tool.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        textDecoration: "none",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "20px 24px",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-hover)";
        el.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-surface)";
        el.style.borderColor = "var(--border)";
      }}
    >
      <span style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
      }}>
        {categoryTag}
      </span>

      <h2 style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-lg)",
        fontWeight: 500,
        color: "var(--text-primary)",
        margin: 0,
        lineHeight: 1.3,
      }}>
        {title}
      </h2>

      <p style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        margin: 0,
        lineHeight: 1.5,
      }}>
        {description}
      </p>

      {tool.formats && tool.formats.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
          {tool.formats.map((fmt) => (
            <span key={fmt} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
              background: "var(--bg-elevated)",
              borderRadius: 3,
              padding: "2px 6px",
            }}>
              {fmt}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
