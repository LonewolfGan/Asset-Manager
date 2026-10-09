import React from 'react';
import {
  type ImageFormat,
  IMAGE_FORMATS,
  type getFormatConfigs,
} from '@/lib/pdf-to-image-logic';

interface PdfToImageFormatSwitcherProps {
  format: ImageFormat;
  onFormatChange: (fmt: ImageFormat) => void;
  formatConfigs: ReturnType<typeof getFormatConfigs>;
}

export function PdfToImageFormatSwitcher({
  format,
  onFormatChange,
  formatConfigs,
}: PdfToImageFormatSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] ring-1 ring-black/[0.08] dark:ring-white/10">
      {IMAGE_FORMATS.map((fmt) => {
        const isSelected = format === fmt;
        const cfg = formatConfigs[fmt];
        return (
          <button
            key={fmt}
            type="button"
            onClick={() => onFormatChange(fmt)}
            className={`h-9 px-4 rounded-lg text-xs font-semibold tracking-wider active:scale-[0.98] transition-all cursor-pointer ${
              isSelected
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {cfg.name}
          </button>
        );
      })}
    </div>
  );
}
