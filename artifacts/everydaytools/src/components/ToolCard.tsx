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
  const Icon = tool.icon;
  return (
    <Link href={`/${tool.slug}`} className="block group">
      <div className="bg-white rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5 h-full border border-[var(--border)] border-l-4 border-l-transparent group-hover:border-l-[var(--accent)] transition-all">
        <Icon className="w-8 h-8 text-[var(--accent)] mb-4" />
        <h3 className="font-medium text-[var(--text)] text-lg mb-2">{tool.title}</h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{tool.description}</p>
      </div>
    </Link>
  );
}
