import type { CategoryDef, DashTool } from "@/lib/home-tools-data";
import { ToolCard } from "./ToolCard";

interface CategorySectionProps {
  cat: CategoryDef;
  tools: DashTool[];
  isMobile?: boolean;
}

export function CategorySection({ cat, tools }: CategorySectionProps) {
  return (
    <section id={`cat-${cat.key}`} style={{ marginBottom: 40 }}>
      <div className="tool-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} cat={cat} />
        ))}
      </div>
    </section>
  );
}
