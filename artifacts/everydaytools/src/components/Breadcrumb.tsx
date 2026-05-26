import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6 overflow-x-auto whitespace-nowrap pb-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {i === 0 ? (
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              {item}
            </Link>
          ) : i === items.length - 1 ? (
            <span className="text-[var(--text)] font-medium">{item}</span>
          ) : (
            <span>{item}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
    </div>
  );
}
