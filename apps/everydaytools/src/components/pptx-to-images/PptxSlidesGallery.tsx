import React from 'react';
import { Download } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ImageTargetFormat } from '@/lib/pptx-conversion-logic';
import type { PptxSlide } from '@/hooks/use-pptx-to-images-workflow';

interface PptxSlidesGalleryProps {
  slides: PptxSlide[];
  format: ImageTargetFormat;
  formatColor: string;
  isFr: boolean;
  slidesCountLabel?: string;
  onDownloadSlide: (slide: PptxSlide) => void;
}

export function PptxSlidesGallery({
  slides,
  format,
  formatColor,
  isFr,
  slidesCountLabel,
  onDownloadSlide,
}: PptxSlidesGalleryProps) {
  if (slides.length === 0) return null;

  const countText =
    slidesCountLabel ??
    (isFr
      ? `${slides.length} diapositive${slides.length > 1 ? 's' : ''} extraite${
          slides.length > 1 ? 's' : ''
        }`
      : `${slides.length} slide${slides.length > 1 ? 's' : ''} extracted`);

  return (
    <div className="rounded-3xl p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {countText}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
            style={{
              backgroundColor: `${formatColor}15`,
              color: formatColor,
            }}
          >
            {format.toUpperCase()} · {isFr ? 'Haute Résolution' : 'High Resolution'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, i) => (
          <div
            key={slide.name}
            className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs group transition-transform hover:-translate-y-0.5"
          >
            <div className="aspect-video bg-neutral-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative">
              <img
                src={slide.dataUrl}
                alt={`${isFr ? 'Diapositive' : 'Slide'} ${i + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-3 bg-white dark:bg-zinc-900 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-600 dark:text-zinc-400 truncate text-[11px]">
                {slide.name}
              </span>
              <ActionTooltip
                label={isFr ? `Télécharger ${slide.name}` : `Download ${slide.name}`}
              >
                <button
                  type="button"
                  onClick={() => onDownloadSlide(slide)}
                  className="h-8 px-2.5 rounded-lg border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={12} />
                  <span>{format.toUpperCase()}</span>
                </button>
              </ActionTooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
