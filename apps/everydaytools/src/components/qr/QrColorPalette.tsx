import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ColorPickerField } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface QrColorPaletteProps {
  isFr: boolean;
  fgColor: string;
  setFgColor: (v: string) => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  invertColors: () => void;
}

export function QrColorPalette({
  isFr,
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  invertColors,
}: QrColorPaletteProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
          {isFr ? 'Palette chromatique' : 'Color Palette'}
        </span>
      </div>

      {/* Rangée unifiée des deux sélecteurs via ColorPickerField */}
      <div className="flex items-center justify-between gap-6 py-1">
        {/* Motif (Foreground) */}
        <div className="flex-1">
          <ColorPickerField
            label={isFr ? 'Motif' : 'Pattern'}
            value={fgColor}
            onChange={setFgColor}
            isFr={isFr}
          />
        </div>

        {/* Bouton Inverser */}
        <div className="pt-5">
          <ActionTooltip label={isFr ? 'Inverser les couleurs' : 'Invert colors'} side="top">
            <button
              type="button"
              data-testid="qr-invert-colors-btn"
              onClick={invertColors}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </ActionTooltip>
        </div>

        {/* Fond (Background) */}
        <div className="flex-1">
          <ColorPickerField
            label={isFr ? 'Fond' : 'Surface'}
            value={bgColor}
            onChange={setBgColor}
            isFr={isFr}
            align="end"
          />
        </div>
      </div>
    </div>
  );
}

