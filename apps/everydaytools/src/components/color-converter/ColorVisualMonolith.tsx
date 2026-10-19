import React from 'react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { describeColor } from '@/lib/color-palette-logic';
import { parseHex } from '@/lib/color-converter-logic';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

interface ColorVisualMonolithProps {
  workflow: ColorConverterWorkflow;
  isFr: boolean;
}

export function ColorVisualMonolith({
  workflow,
  isFr,
}: ColorVisualMonolithProps) {
  const {
    hex,
    rgb,
    luminance,
    contrastTextColor,
    contrastWithWhite,
    contrastWithBlack,
    spectrumStrip,
    updateRgb,
  } = workflow;

  const getWcagBadge = (ratio: number) => {
    if (ratio >= 7) return { text: 'AAA', class: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' };
    if (ratio >= 4.5) return { text: 'AA', class: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' };
    if (ratio >= 3) return { text: 'AA Large', class: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' };
    return { text: 'Fail', class: 'bg-red-500/15 text-red-600 dark:text-red-400' };
  };

  const whiteWcag = getWcagBadge(contrastWithWhite);
  const blackWcag = getWcagBadge(contrastWithBlack);

  return (
    <div className="w-full space-y-4">
      {/* Grand Monolithe Visuel */}
      <div
        style={{ backgroundColor: hex }}
        className="h-56 sm:h-64 w-full rounded-2xl p-6 flex flex-col justify-between border border-black/10 dark:border-white/10 shadow-xs relative overflow-hidden select-none transition-colors duration-150"
      >
        <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider">
          <span
            style={{ color: contrastTextColor }}
            className="px-2 py-0.5 rounded bg-black/15 dark:bg-white/15 backdrop-blur-xs"
          >
            {describeColor(hex, isFr)}
          </span>
          <span style={{ color: contrastTextColor }} className="opacity-80">
            LUM {(luminance * 100).toFixed(1)}%
          </span>
        </div>

        <div>
          <span
            style={{ color: contrastTextColor }}
            className="text-4xl sm:text-5xl font-black font-mono tracking-tighter block leading-none"
          >
            {hex}
          </span>
          <span
            style={{ color: contrastTextColor, opacity: 0.8 }}
            className="font-mono text-xs uppercase tracking-wider mt-2 block"
          >
            R {rgb.r} · G {rgb.g} · B {rgb.b}
          </span>
        </div>
      </div>

      {/* Badges Accessibilité & Contraste WCAG */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs font-mono">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Contraste WCAG :' : 'WCAG Contrast:'}
        </span>
        <div className="flex items-center gap-2">
          {/* Vs Blanc */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-300" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{(contrastWithWhite ?? 1).toFixed(1)}:1</span>
            <span className={`px-1 rounded text-[10px] font-bold ${whiteWcag.class}`}>{whiteWcag.text}</span>
          </div>
          {/* Vs Noir */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-700" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{(contrastWithBlack ?? 21).toFixed(1)}:1</span>
            <span className={`px-1 rounded text-[10px] font-bold ${blackWcag.class}`}>{blackWcag.text}</span>
          </div>
        </div>
      </div>

      {/* Ruban spectral continu Tints & Shades */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-zinc-400">
          <span>{isFr ? 'TINTS (VERS BLANC)' : 'TINTS (TO WHITE)'}</span>
          <span>{isFr ? 'SPECTRE' : 'SPECTRUM'}</span>
          <span>{isFr ? 'SHADES (VERS NOIR)' : 'SHADES (TO BLACK)'}</span>
        </div>

        <div className="h-7 w-full rounded-xl overflow-hidden flex shadow-2xs border border-black/10 dark:border-white/10">
          {spectrumStrip.map((sHex, idx) => (
            <ActionTooltip key={`spec-${idx}`} label={sHex} side="top">
              <button
                type="button"
                onClick={() => {
                  const parsed = parseHex(sHex);
                  if (parsed) updateRgb(parsed, true, true);
                }}
                style={{ backgroundColor: sHex }}
                className="h-full flex-1 transition-transform duration-150 hover:scale-110 active:scale-95 cursor-pointer relative group"
              />
            </ActionTooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
