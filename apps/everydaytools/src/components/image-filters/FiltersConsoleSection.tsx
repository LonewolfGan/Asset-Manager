import React from 'react';
import { Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AESTHETIC_PRESETS, type AestheticPreset, type FilterSettings } from '@/lib/image-filters-logic';
import { FiltersFilmstrip } from './FiltersFilmstrip';
import { FiltersAdjustConsole } from './FiltersAdjustConsole';

interface FiltersConsoleSectionProps {
  consoleTab: 'presets' | 'adjust';
  setConsoleTab: (tab: 'presets' | 'adjust') => void;
  previewUrl: string;
  activePresetId: string;
  presetIntensity: number;
  onSelectPreset: (preset: AestheticPreset) => void;
  onIntensityChange: (intensity: number) => void;
  filmstripRef: (node: HTMLDivElement | null) => void;
  scrollState: { canLeft: boolean; canRight: boolean };
  onScrollFilmstrip: (direction: 'left' | 'right') => void;
  onUpdateScrollState: () => void;
  settings: FilterSettings;
  onAdjustChannel: <K extends keyof FilterSettings>(channel: K, value: FilterSettings[K]) => void;
  onResetChannel: (channel: keyof FilterSettings) => void;
  isFr: boolean;
}

export function FiltersConsoleSection({
  consoleTab,
  setConsoleTab,
  previewUrl,
  activePresetId,
  presetIntensity,
  onSelectPreset,
  onIntensityChange,
  filmstripRef,
  scrollState,
  onScrollFilmstrip,
  onUpdateScrollState,
  settings,
  onAdjustChannel,
  onResetChannel,
  isFr,
}: FiltersConsoleSectionProps) {
  return (
    <div className="w-full pt-2 space-y-4">
      {/* En-tête des onglets de console */}
      <div className="w-full flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-black/[0.06] dark:border-white/10">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setConsoleTab('presets')}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5',
              consoleTab === 'presets'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            )}
          >
            <span>{isFr ? 'Presets Visuels' : 'Visual Presets'}</span>
            <span className="text-[10px] opacity-70 font-mono">
              ({AESTHETIC_PRESETS.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setConsoleTab('adjust')}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5',
              consoleTab === 'adjust'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isFr ? 'Ajustements Précis' : 'Fine Adjustments'}</span>
          </button>
        </div>
      </div>

      {/* Vue Presets ou Ajustements Précis */}
      {consoleTab === 'presets' ? (
        <FiltersFilmstrip
          previewUrl={previewUrl}
          activePresetId={activePresetId}
          presetIntensity={presetIntensity}
          onSelectPreset={onSelectPreset}
          onIntensityChange={onIntensityChange}
          filmstripRef={filmstripRef}
          scrollState={scrollState}
          onScrollFilmstrip={onScrollFilmstrip}
          onUpdateScrollState={onUpdateScrollState}
          isFr={isFr}
        />
      ) : (
        <FiltersAdjustConsole
          settings={settings}
          onAdjustChannel={onAdjustChannel}
          onResetChannel={onResetChannel}
          isFr={isFr}
        />
      )}
    </div>
  );
}
