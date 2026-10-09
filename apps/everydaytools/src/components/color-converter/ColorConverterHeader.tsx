import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { describeColor } from '@/lib/color-palette-logic';
import { parseHex } from '@/lib/color-converter-logic';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

interface ColorConverterHeaderProps {
  workflow: ColorConverterWorkflow;
  isFr: boolean;
}

export function ColorConverterHeader({
  workflow,
  isFr,
}: ColorConverterHeaderProps) {
  const {
    hex,
    colorInput,
    handleColorInputChange,
    handleInputBlurOrEnter,
    recentColors,
    updateRgb,
    handleRandomColor,
  } = workflow;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-white/10">
      {/* Gauche : Titre technique */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-950 dark:text-zinc-50">
          COLOR CONVERTER
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold truncate">
          {describeColor(hex, isFr)}
        </span>
      </div>

      {/* Centre : Input avec label clair et explicite */}
      <div className="flex items-center gap-2.5 w-full max-w-xs sm:max-w-sm">
        <label
          htmlFor="color-input-field"
          className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0"
        >
          {isFr ? 'Couleur :' : 'Color:'}
        </label>
        <Input
          id="color-input-field"
          type="text"
          value={colorInput}
          onChange={(e) => handleColorInputChange(e.target.value)}
          onBlur={handleInputBlurOrEnter}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleInputBlurOrEnter();
          }}
          placeholder={
            isFr ? 'Coller HEX, RGB, HSL, CMYK...' : 'Paste HEX, RGB, HSL, CMYK...'
          }
          className="h-9 flex-1 font-mono text-xs font-semibold tracking-wide text-zinc-950 dark:text-zinc-50 bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/10"
        />
      </div>

      {/* Droite : Historique récent & Bouton Aléatoire */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Historique récent minimaliste */}
        <div className="hidden sm:flex items-center gap-1.5 mr-1">
          {recentColors.map((rc, idx) => (
            <ActionTooltip key={`${rc}-${idx}`} label={rc} side="top">
              <button
                type="button"
                onClick={() => {
                  const parsed = parseHex(rc);
                  if (parsed) updateRgb(parsed, true, false);
                }}
                style={{ backgroundColor: rc }}
                className="w-5 h-5 rounded-sm border border-black/10 dark:border-white/20 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              />
            </ActionTooltip>
          ))}
        </div>

        {/* Aléatoire */}
        <ActionTooltip
          label={isFr ? 'Générer une couleur aléatoire' : 'Generate random color'}
          side="top"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRandomColor}
            className="gap-1.5 font-mono text-xs cursor-pointer h-9 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isFr ? 'Aléatoire' : 'Random'}</span>
          </Button>
        </ActionTooltip>
      </div>
    </div>
  );
}
