import React, { useEffect, useState } from "react";
import type { ContentBlock } from "@/config/blog-data";

export interface BlogTocProps {
  blocks?: ContentBlock[];
  activeId?: string;
  lang?: "en" | "fr";
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer ponctuation et espaces par tiret
    .replace(/^-+|-+$/g, ""); // Nettoyer les tirets de début et fin
}

export function extractTocItems(blocks?: ContentBlock[]): TocItem[] {
  if (!blocks || !Array.isArray(blocks)) return [];

  const items: TocItem[] = [];
  const seenIds = new Set<string>();

  for (const block of blocks) {
    if (block.type === "h2" || block.type === "h3") {
      let id = slugifyHeading(block.text);
      if (!id) id = `section-${items.length + 1}`;

      // Gérer d'éventuels doublons
      let finalId = id;
      let counter = 1;
      while (seenIds.has(finalId)) {
        finalId = `${id}-${counter}`;
        counter++;
      }
      seenIds.add(finalId);

      items.push({
        id: finalId,
        text: block.text,
        level: block.type === "h2" ? 2 : 3,
      });
    }
  }

  return items;
}

export function BlogToc({ blocks, activeId: propActiveId, lang = "en" }: BlogTocProps): React.JSX.Element | null {
  const items = extractTocItems(blocks);
  const [internalActiveId, setInternalActiveId] = useState<string>("");

  const activeId = propActiveId !== undefined ? propActiveId : internalActiveId;

  useEffect(() => {
    if (propActiveId !== undefined || items.length === 0) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setInternalActiveId(entry.target.id);
              break;
            }
          }
        },
        { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
      );

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      }
    } catch {
      // Graceful fallback if IntersectionObserver is not constructible in test environment
    }

    return () => {
      try {
        observer?.disconnect();
      } catch {
        // ignore
      }
    };
  }, [items, propActiveId]);

  if (items.length === 0) {
    return null;
  }

  const title = lang === "fr" ? "SOMMAIRE" : "TABLE OF CONTENTS";

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label={lang === "fr" ? "Table des matières" : "Table of contents"}
      data-testid="blog-toc"
      className="space-y-3"
    >
      <div
        data-testid="blog-toc-title"
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]"
      >
        {title}
      </div>

      <ul className="space-y-1 text-sm border-l border-zinc-200 dark:border-white/10">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} data-level={item.level}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                data-active={isActive ? "true" : "false"}
                data-level={item.level}
                className={`group flex items-center py-1 transition-colors duration-150 relative -ml-px border-l-2 ${
                  item.level === 3 ? "pl-5 text-xs" : "pl-3 text-[13px]"
                } ${
                  isActive
                    ? "border-[var(--accent)] text-[var(--text-primary)] font-medium"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <span className="truncate">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
