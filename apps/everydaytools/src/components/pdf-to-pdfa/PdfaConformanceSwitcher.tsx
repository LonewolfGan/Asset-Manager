import React from 'react';
import { type PdfaConformance, getConformanceOptions } from '@/lib/pdf-to-pdfa-logic';

interface PdfaConformanceSwitcherProps {
  conformance: PdfaConformance;
  onConformanceChange: (conf: PdfaConformance) => void;
  isFr: boolean;
}

export function PdfaConformanceSwitcher({
  conformance,
  onConformanceChange,
  isFr,
}: PdfaConformanceSwitcherProps) {
  const options = getConformanceOptions(isFr);

  return (
    <div
      role="radiogroup"
      aria-label={isFr ? "Profil de conformité PDF/A" : "PDF/A Conformance Profile"}
      className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] ring-1 ring-black/[0.08] dark:ring-white/10"
    >
      {options.map((opt) => {
        const isSelected = conformance === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onConformanceChange(opt.id)}
            className={`h-9 px-4 rounded-lg text-xs font-semibold tracking-wider active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] cursor-pointer flex items-center gap-1.5 ${
              isSelected
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                isSelected
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-950'
                  : 'bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {opt.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
