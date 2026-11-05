import React from "react";
import type { ContentBlock } from "@/config/blog-data";
import { slugifyHeading } from "@/components/blog/blog-toc";

export interface BlogContentRendererProps {
  blocks?: ContentBlock[];
  className?: string;
}

export function BlogContentRenderer({
  blocks,
  className = "",
}: BlogContentRendererProps): React.JSX.Element {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return <article className={className} />;
  }

  const seenIds = new Set<string>();
  const idCounts = new Map<string, number>();

  const getHeadingId = (text: string, fallbackIdx: number): string => {
    let baseId = slugifyHeading(text) || `section-${fallbackIdx}`;
    if (seenIds.has(baseId)) {
      const count = idCounts.get(baseId) || 1;
      idCounts.set(baseId, count + 1);
      return `${baseId}-${count}`;
    }
    seenIds.add(baseId);
    idCounts.set(baseId, 1);
    return baseId;
  };

  return (
    <article className={`prose-container ${className}`.trim()}>
      {blocks.map((block, idx) => {
        if (!block || typeof block !== "object" || !block.type) {
          return null;
        }

        switch (block.type) {
          case "h2": {
            const id = getHeadingId(block.text, idx);
            return (
              <h2
                key={idx}
                id={id}
                className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-12 mb-4 scroll-mt-24 group flex items-center"
              >
                <span>{block.text}</span>
              </h2>
            );
          }

          case "h3": {
            const id = getHeadingId(block.text, idx);
            return (
              <h3
                key={idx}
                id={id}
                className="font-sans text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-3 scroll-mt-24"
              >
                {block.text}
              </h3>
            );
          }

          case "p":
            return (
              <p
                key={idx}
                className="text-[15px] sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-5 font-normal"
              >
                {block.text}
              </p>
            );

          case "ul": {
            const items = Array.isArray(block.items) ? block.items : [];
            if (items.length === 0) return null;
            return (
              <ul
                key={idx}
                className="list-disc pl-5 space-y-2 mb-6 text-[15px] sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
              >
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          }

          case "ol": {
            const items = Array.isArray(block.items) ? block.items : [];
            if (items.length === 0) return null;
            return (
              <ol
                key={idx}
                className="list-decimal pl-5 space-y-2.5 mb-6 text-[15px] sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
              >
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ol>
            );
          }

          case "callout":
            return (
              <div
                key={idx}
                data-slot="callout"
                data-testid="blog-callout"
                className="rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 sm:p-5 my-6 text-[14px] sm:text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 border-l-2 border-l-[var(--accent)]"
              >
                <p className="m-0 leading-relaxed text-[14px] sm:text-[15px]">
                  {block.text}
                </p>
              </div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}
