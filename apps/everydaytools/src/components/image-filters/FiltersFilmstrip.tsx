import React from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AESTHETIC_PRESETS,
  DEFAULT_FILTER_SETTINGS,
  type AestheticPreset,
  buildCssFilterString,
} from '@/lib/image-filters-logic';

interface FiltersFilmstripProps {
  previewUrl: string;
  activePresetId: string;
  presetIntensity: number;
  onSelectPreset: (preset: AestheticPreset) => void;
  onIntensityChange: (intensity: number) => void;
  filmstripRef: (node: HTMLDivElement | null) => void;
  scrollState: { canLeft: boolean; canRight: boolean };
  onScrollFilmstrip: (direction: 'left' | 'right') => void;
  onUpdateScrollState: () => void;
  isFr: boolean;
}

export function FiltersFilmstrip({
  previewUrl,
  activePresetId,
  presetIntensity,
  onSelectPreset,
  onIntensityChange,
  filmstripRef,
  scrollState,
  onScrollFilmstrip,
  onUpdateScrollState,
  isFr,
}: FiltersFilmstripProps) {
  return (
    <div className="w-full space-y-3">
      {/* Contrôle tactile d'intensité pour le preset actif */}
      {activePresetId !== 'original' && activePresetId !== 'custom' && (
        <div className="flex items-center justify-end gap-2 pb-1">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {isFr ? 'Intensité :' : 'Intensity:'}
          </span>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200/70 dark:border-white/10">
            {[25, 50, 75, 100].map((stepPct) => (
              <button
                key={stepPct}
                type="button"
                onClick={() => onIntensityChange(stepPct)}
                className={cn(
                  'h-6 px-2 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer',
                  presetIntensity === stepPct
                    ? 'bg-[#FF6B35] text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                )}
              >
                {stepPct}%
              </button>
            ))}
          </div>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/70 dark:border-white/10 h-7 px-1 gap-1">
            <button
              type="button"
              onClick={() => onIntensityChange(Math.max(0, presetIntensity - 5))}
              disabled={presetIntensity <= 0}
              className="w-5 h-5 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 w-9 text-center">
              {presetIntensity}%
            </span>
            <button
              type="button"
              onClick={() => onIntensityChange(Math.min(100, presetIntensity + 5))}
              disabled={presetIntensity >= 100}
              className="w-5 h-5 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Ruban horizontal avec flèches latérales */}
      <div className="w-full flex items-center gap-2">
        <button
          type="button"
          onClick={() => onScrollFilmstrip('left')}
          disabled={!scrollState.canLeft}
          aria-label={isFr ? 'Faire défiler vers la gauche' : 'Scroll left'}
          className={cn(
            'w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100',
            'border border-zinc-700/40 dark:border-white/15 shadow-md',
            'flex items-center justify-center hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] hover:text-white',
            'active:scale-95 transition-all duration-150 shrink-0',
            '-translate-y-3.5 sm:-translate-y-[18px]',
            scrollState.canLeft
              ? 'opacity-100 pointer-events-auto cursor-pointer visible'
              : 'opacity-0 pointer-events-none select-none invisible'
          )}
        >
          <ChevronLeft className="w-4 h-4 -translate-x-0.5" />
        </button>

        <div
          ref={filmstripRef}
          onScroll={onUpdateScrollState}
          className="flex-1 min-w-0 flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scroll-smooth px-1"
        >
          {AESTHETIC_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            const presetFilter = buildCssFilterString({
              ...DEFAULT_FILTER_SETTINGS,
              ...preset.settings,
            });

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={cn(
                  'flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer group/card',
                  isSelected ? 'scale-[1.03]' : 'hover:scale-[1.02]'
                )}
              >
                <div
                  className={cn(
                    'w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-900 relative transition-all',
                    isSelected
                      ? 'ring-2 ring-zinc-950 dark:ring-zinc-100 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 shadow-md'
                      : 'border border-zinc-200 dark:border-white/10 group-hover/card:border-zinc-400 dark:group-hover/card:border-white/30'
                  )}
                >
                  <img
                    src={previewUrl}
                    alt={preset.name}
                    draggable={false}
                    style={{ filter: presetFilter }}
                    className="w-full h-full object-cover select-none"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  )}
                </div>

                <div className="text-center w-20 sm:w-24">
                  <div
                    className={cn(
                      'text-xs font-medium tracking-tight truncate',
                      isSelected
                        ? 'text-[#FF6B35] font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 group-hover/card:text-zinc-950 dark:group-hover/card:text-zinc-100'
                    )}
                  >
                    {preset.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onScrollFilmstrip('right')}
          disabled={!scrollState.canRight}
          aria-label={isFr ? 'Faire défiler vers la droite' : 'Scroll right'}
          className={cn(
            'w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100',
            'border border-zinc-700/40 dark:border-white/15 shadow-md',
            'flex items-center justify-center hover:bg-[#FF6B35] dark:hover:bg-[#FF6B35] hover:text-white',
            'active:scale-95 transition-all duration-150 shrink-0',
            '-translate-y-3.5 sm:-translate-y-[18px]',
            scrollState.canRight
              ? 'opacity-100 pointer-events-auto cursor-pointer visible'
              : 'opacity-0 pointer-events-none select-none invisible'
          )}
        >
          <ChevronRight className="w-4 h-4 translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
