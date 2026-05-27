import { Link } from "wouter";
import { useState } from "react";
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
  const [hovered, setHovered] = useState(false);
  const translated = t.tools[tool.slug];
  const title = translated?.title ?? tool.title;
  const description = translated?.description ?? tool.description;
  const categoryTag = (t.home.toolCategory as Record<string, string>)?.[tool.category] ?? tool.category;

  return (
    <Link
      href={`/${tool.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        textDecoration: "none",
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10,
        padding: "20px 22px",
        boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.06)",
        transition: "background 200ms ease",
      }}
    >
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)",
        transition: "transform 200ms ease",
        display: "block",
        transform: hovered ? "translateX(2px)" : "translateX(0)",
      }}>
        {categoryTag}
      </span>

      <h2 style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-base)",
        fontWeight: 600,
        color: "var(--text-primary)",
        margin: 0,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
        transition: "transform 200ms ease",
        transform: hovered ? "translateX(2px)" : "translateX(0)",
      }}>
        {title}
      </h2>

      <p style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        color: "var(--text-tertiary)",
        margin: 0,
        lineHeight: 1.55,
        letterSpacing: "-0.01em",
      }}>
        {description}
      </p>

      {tool.formats && tool.formats.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
          {tool.formats.map((fmt) => (
            <span key={fmt} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.67rem",
              color: "var(--accent)",
              background: "var(--accent-subtle)",
              borderRadius: 4,
              padding: "2px 6px",
              letterSpacing: "0.04em",
            }}>
              {fmt}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
