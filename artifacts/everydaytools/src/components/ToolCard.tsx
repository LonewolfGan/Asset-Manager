import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/${tool.slug}`}
      style={{ display: "block", textDecoration: "none", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div style={{ padding: "20px 24px", transition: "background 120ms ease" }}>
        <h3 style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: 0 }}>
          {tool.title}
        </h3>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
