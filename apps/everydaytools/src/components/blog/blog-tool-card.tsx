import React from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

export interface BlogToolCardProps {
  toolSlug: string;
  label?: string;
  actionLabel?: string;
  title?: string;
  description?: string;
  lang?: "en" | "fr";
  variant?: "sidebar" | "banner";
}

export function BlogToolCard({
  toolSlug,
  label,
  actionLabel,
  title,
  description,
  lang,
  variant = "sidebar",
}: BlogToolCardProps): React.JSX.Element {
  const ctaText = actionLabel || label || (lang === "fr" ? "Ouvrir l'outil" : "Open tool");
  const href = lang ? `/${lang}/${toolSlug}` : `/${toolSlug}`;

  const isBanner = variant === "banner";

  return (
    <div
      data-testid="blog-tool-card"
      data-variant={variant}
      className={`rounded-2xl p-1.5 border border-zinc-200/80 dark:border-white/8 bg-zinc-100 dark:bg-zinc-900 shadow-xs transition-colors duration-200 ${
        isBanner ? "w-full" : "w-full flex-col"
      }`}
    >
      <div
        data-slot="core"
        className={`rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-white/5 p-4 sm:p-5 ${
          isBanner
            ? "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
            : "flex flex-col gap-3.5"
        }`}
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          {title && (
            <h3 className="font-sans text-sm font-semibold text-[var(--text-primary)] tracking-tight">
              {title}
            </h3>
          )}
          {description && isBanner && (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        <Link
          href={href}
          className="group inline-flex items-center justify-between sm:justify-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.98] transition-all duration-150 shrink-0"
        >
          <span className="truncate">{ctaText}</span>
          <span
            data-slot="cta-icon"
            className="w-6 h-6 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
          >
            <ArrowUpRight
              aria-hidden="true"
              className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}
