import React from 'react';
import type { HarmonyMode } from '@/lib/color-palette-logic';
import type { HarmonyOption } from '@/hooks/use-color-palette-workflow';

interface ColorPaletteFooterProps {
  count: number;
  mode: HarmonyMode;
  harmonyModes: HarmonyOption[];
  lockedCount: number;
  isFr: boolean;
}

export function ColorPaletteFooter({
  count,
  mode,
  harmonyModes,
  lockedCount,
  isFr,
}: ColorPaletteFooterProps) {
  const modeLabel = harmonyModes.find((m) => m.id === mode)?.label;

  return (
    <div className="px-6 py-3 border-t border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? `Palette de ${count} teintes` : `${count}-color palette`}
        </span>
        <span>·</span>
        <span>{isFr ? `Harmonie ${modeLabel}` : `${modeLabel} harmony`}</span>
        {lockedCount > 0 && (
          <>
            <span>·</span>
            <span className="text-[#FF6B35] font-semibold">
              {lockedCount}{' '}
              {isFr
                ? lockedCount > 1
                  ? 'couleurs verrouillées'
                  : 'couleur verrouillée'
                : lockedCount > 1
                ? 'colors locked'
                : 'color locked'}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <span className="hidden sm:inline">{isFr ? 'Appuyez sur la touche' : 'Press'}</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold">
          {isFr ? 'Espace' : 'Space'}
        </kbd>
        <span>{isFr ? 'pour générer une nouvelle palette' : 'to generate a new palette'}</span>
      </div>
    </div>
  );
}
