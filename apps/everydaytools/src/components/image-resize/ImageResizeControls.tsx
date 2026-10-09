import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ActionTooltip } from '@/components/ui/tooltip';
import { DimensionLockGroup } from '@workspace/ui';
import { type Mode, type StandardPreset } from '@/lib/image-resize-logic';

interface ImageResizeControlsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  lockRatio: boolean;
  onToggleLockRatio: () => void;
  percentage: number;
  onPercentageChange: (pct: number) => void;
  selectedPresetId: string | null;
  standardPresets: StandardPreset[];
  onPresetSelect: (preset: StandardPreset) => void;
  onResetDimensions: () => void;
  targetW: number;
  targetH: number;
  targetRatioLabel: string;
  isProcessing: boolean;
  isFr: boolean;
}

export function ImageResizeControls({
  mode,
  onModeChange,
  width,
  height,
  onWidthChange,
  onHeightChange,
  lockRatio,
  onToggleLockRatio,
  percentage,
  onPercentageChange,
  selectedPresetId,
  standardPresets,
  onPresetSelect,
  onResetDimensions,
  targetW,
  targetH,
  targetRatioLabel,
  isProcessing,
  isFr,
}: ImageResizeControlsProps) {
  return (
    <div className="lg:col-span-5 xl:col-span-4 lg:border-l lg:border-black/[0.08] dark:lg:border-white/10 lg:pl-8 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* En-tête de section droite */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            {isFr ? 'Paramètres' : 'Settings'}
          </span>

          <ActionTooltip label={isFr ? 'Rétablir les dimensions initiales' : 'Restore initial dimensions'}>
            <button
              type="button"
              onClick={onResetDimensions}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              {isFr ? 'Rétablir' : 'Restore'}
            </button>
          </ActionTooltip>
        </div>

        {/* Tabs Principaux */}
        <Tabs
          value={mode}
          onValueChange={(val) => onModeChange(val as Mode)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full h-9">
            <TabsTrigger value="pixels" className="text-xs">
              {isFr ? 'Dimensions' : 'Dimensions'}
            </TabsTrigger>
            <TabsTrigger value="percentage" className="text-xs">
              {isFr ? 'Échelle %' : 'Scale %'}
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">
              {isFr ? 'Formats' : 'Presets'}
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1 : DIMENSIONLOCKGROUP (@workspace/ui) ── */}
          <TabsContent value="pixels" className="mt-4">
            <DimensionLockGroup
              width={width}
              height={height}
              onWidthChange={onWidthChange}
              onHeightChange={onHeightChange}
              isLocked={lockRatio}
              onToggleLock={onToggleLockRatio}
              unit="px"
              disabled={isProcessing}
              isFr={isFr}
            />
          </TabsContent>

          {/* ── TAB 2 : ÉCHELLE % ── */}
          <TabsContent value="percentage" className="mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {isFr ? 'Échelle' : 'Scale'}
              </span>
              <span className="text-xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
                {percentage}%
              </span>
            </div>

            <Slider
              value={[percentage]}
              min={10}
              max={200}
              step={1}
              onValueChange={(val) => onPercentageChange(val[0])}
              className="py-2"
            />

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[25, 50, 75, 125, 150].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onPercentageChange(pct)}
                  className={`py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                    percentage === pct
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold border-zinc-900 dark:border-zinc-100'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-white/5 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </TabsContent>

          {/* ── TAB 3 : FORMATS STANDARDS ── */}
          <TabsContent value="presets" className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-1.5">
              {standardPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onPresetSelect(preset)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-xs'
                        : 'bg-transparent border-zinc-200/60 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{preset.name}</div>
                      <div
                        className={`text-[10px] font-mono mt-0.5 ${
                          isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {preset.w} × {preset.h} px · {preset.ratio}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Télémétrie Cible Directe */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>{isFr ? 'Dimensions cibles :' : 'Target dimensions:'}</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold tabular-nums">
              {targetW} × {targetH} px
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>{isFr ? 'Ratio cible :' : 'Target ratio:'}</span>
            <span className="text-zinc-900 dark:text-zinc-100 tabular-nums font-semibold">
              {targetRatioLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
