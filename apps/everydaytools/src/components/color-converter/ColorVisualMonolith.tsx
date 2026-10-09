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
    spectrumStrip,
    updateRgb,
  } = workflow;

  return (
    <div className="w-full space-y-5">
      {/* Grand Monolithe Visuel */}
      <div
        style={{ backgroundColor: hex }}
        className="h-56 sm:h-64 w-full rounded-2xl p-6 flex flex-col justify-between border border-black/10 dark:border-white/10 shadow-sm relative overflow-hidden select-none transition-colors duration-150"
      >
        <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider">
          <span
            style={{ color: contrastTextColor }}
            className="px-2 py-0.5 rounded bg-black/15 dark:bg-white/15 backdrop-blur-xs"
          >
            {describeColor(hex)}
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
            className="font-mono text-xs uppercase tracking-wider mt-1.5 block"
          >
            R {rgb.r} · G {rgb.g} · B {rgb.b}
          </span>
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
                className="h-full flex-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group"
              />
            </ActionTooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
