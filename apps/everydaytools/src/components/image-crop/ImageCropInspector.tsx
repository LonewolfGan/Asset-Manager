import React, { useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CropRatioSelector } from '@workspace/ui';
import { useLocale } from '@/hooks/use-locale';
import type { CropRect } from '../../lib/image-crop-logic';
import { getAspectPresets } from '../../lib/image-crop-logic';

interface ImageCropInspectorProps {
  aspectRatio: number | null;
  onSelectAspectPreset: (ratio: number | null) => void;
  onSwapOrientation: () => void;
  crop: CropRect;
  croppedRatioLabel: string;
  surfaceRetainedPct: number;
}

export function ImageCropInspector({
  aspectRatio,
  onSelectAspectPreset,
  onSwapOrientation,
  crop,
  croppedRatioLabel,
  surfaceRetainedPct,
}: ImageCropInspectorProps) {
  const { isFr } = useLocale();
  const aspectPresets = useMemo(() => getAspectPresets(isFr), [isFr]);

  const cropRatios = useMemo(() => {
    return aspectPresets.map((p) => ({
      id: p.name,
      name: p.sub ? `${p.name} (${p.sub})` : p.name,
      nameEn: p.sub ? `${p.name} (${p.sub})` : p.name,
      ratio: p.ratio,
    }));
  }, [aspectPresets]);

  const selectedRatioId = useMemo(() => {
    const found = aspectPresets.find((p) => p.ratio === aspectRatio);
    return found ? found.name : '';
  }, [aspectPresets, aspectRatio]);

  return (
    <div className="lg:col-span-4 xl:col-span-3 lg:border-l lg:border-black/[0.08] dark:lg:border-white/10 lg:pl-6 space-y-6">
      {/* Section 1 : Proportions & Ratios */}
      <div className="space-y-3">
        <CropRatioSelector
          selectedRatio={selectedRatioId}
          onSelectRatio={(item) => onSelectAspectPreset(item.ratio)}
          ratios={cropRatios}
          isFr={isFr}
        />

        {/* Bouton Inversion Portrait / Paysage */}
        <button
          type="button"
          onClick={onSwapOrientation}
          className="w-full h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <ArrowLeftRight size={13} />
          <span>
            {isFr
              ? 'Inverser orientation (Portrait / Paysage)'
              : 'Swap orientation (Portrait / Landscape)'}
          </span>
        </button>
      </div>

      {/* Section 2 : Télémétrie Fine du Cadrage */}
      <div className="space-y-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono block">
          {isFr ? 'Télémétrie Cible' : 'Target Telemetry'}
        </span>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>{isFr ? 'Dimensions :' : 'Dimensions:'}</span>
            <span className="text-zinc-950 dark:text-zinc-50 font-bold tabular-nums">
              {crop.w} × {crop.h} px
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>{isFr ? "Ratio d'aspect :" : 'Aspect ratio:'}</span>
            <span className="text-zinc-950 dark:text-zinc-50 font-bold">
              {croppedRatioLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>{isFr ? 'Surface conservée :' : 'Surface kept:'}</span>
            <span className="text-zinc-950 dark:text-zinc-50 font-bold tabular-nums">
              {surfaceRetainedPct}%
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span>{isFr ? 'Position (X, Y) :' : 'Position (X, Y):'}</span>
            <span className="text-zinc-500 font-mono tabular-nums">
              {crop.x}, {crop.y} px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
