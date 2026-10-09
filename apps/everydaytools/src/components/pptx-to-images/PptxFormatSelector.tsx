import React from 'react';
import type { ImageTargetFormat } from '@/lib/pptx-conversion-logic';

interface PptxFormatSelectorProps {
  selectedFormat: ImageTargetFormat;
  onChange: (format: ImageTargetFormat) => void;
  isFr: boolean;
}

export function PptxFormatSelector({
  selectedFormat,
  onChange,
  isFr,
}: PptxFormatSelectorProps) {
  const formats: ImageTargetFormat[] = ['png', 'jpg', 'webp'];

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {isFr ? "Format d'export des diapositives" : 'Slide export format'}
      </label>
      <div className="p-1 rounded-2xl bg-neutral-200/50 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center gap-1.5 shadow-sm">
        {formats.map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => onChange(fmt)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all active:scale-[0.98] cursor-pointer ${
              selectedFormat === fmt
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
