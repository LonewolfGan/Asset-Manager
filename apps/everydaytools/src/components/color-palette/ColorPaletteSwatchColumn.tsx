import React from 'react';
import {
  Lock,
  Unlock,
  Check,
  SunMedium,
  Moon,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { ColorPicker } from '@/components/ui/color-picker';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';
import {
  getContrastTextColor,
  getColorShades,
  getWcagContrastRatio,
  describeColor,
  type PaletteColor,
} from '@/lib/color-palette-logic';
import type { ColorFormat } from '@/hooks/use-color-palette-workflow';

interface ColorPaletteSwatchColumnProps {
  color: PaletteColor;
  idx: number;
  format: ColorFormat;
  count: number;
  copiedIdx: number | null;
  onToggleLock: (idx: number) => void;
  onCustomHexChange: (idx: number, hex: string) => void;
  onCopyColor: (color: PaletteColor, idx: number) => void;
  onAdjustLightness: (idx: number, delta: number) => void;
  getColorValue: (color: PaletteColor) => string;
  getColorDisplayValue: (color: PaletteColor, format: ColorFormat) => string;
  getCodeFontSize: (format: ColorFormat, count: number) => string;
  isFr: boolean;
}

export function ColorPaletteSwatchColumn({
  color,
  idx,
  format,
  count,
  copiedIdx,
  onToggleLock,
  onCustomHexChange,
  onCopyColor,
  onAdjustLightness,
  getColorValue,
  getColorDisplayValue,
  getCodeFontSize,
  isFr,
}: ColorPaletteSwatchColumnProps) {
  const textColor = getContrastTextColor(color.hex);
  const isDarkText = textColor === '#09090b';
  const contrastClasses = isDarkText ? 'text-zinc-950' : 'text-white';
  const buttonBg = isDarkText
    ? 'bg-black/10 hover:bg-black/20 text-zinc-950'
    : 'bg-white/15 hover:bg-white/25 text-white';
  const shades = getColorShades(color.hex);
  const wcagRatio = getWcagContrastRatio(color.hex, isDarkText ? '#09090b' : '#ffffff');

  return (
    <div
      style={{ backgroundColor: color.hex }}
      className="group relative flex-1 min-h-[140px] md:min-h-[540px] flex flex-col justify-between p-3 sm:p-5 lg:p-6 transition-colors duration-200 overflow-hidden"
    >
      {/* Sommet : Verrouillage, Nuances et Sélecteur de couleur */}
      <div className="flex items-center justify-between w-full">
        <ActionTooltip
          label={
            color.isLocked
              ? isFr
                ? 'Déverrouiller cette couleur'
                : 'Unlock this color'
              : isFr
              ? 'Verrouiller pour conserver lors de la régénération'
              : 'Lock to keep during generation'
          }
          side="top"
        >
          <button
            type="button"
            onClick={() => onToggleLock(idx)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-[0.95] ${buttonBg} ${
              color.isLocked ? 'ring-1 ring-current font-semibold' : ''
            }`}
          >
            {color.isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">{isFr ? 'Verrouillée' : 'Locked'}</span>
              </>
            ) : (
              <Unlock className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            )}
          </button>
        </ActionTooltip>

        <div className="flex items-center gap-1.5">
          {/* Popover Nuances / Tints */}
          <Popover>
            <ActionTooltip label={isFr ? 'Nuancier de teintes (shades)' : 'Color shades & tints'} side="top">
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`p-1.5 rounded-lg transition-transform cursor-pointer active:scale-[0.95] ${buttonBg} opacity-80 md:opacity-0 group-hover:opacity-100`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
            </ActionTooltip>
            <PopoverContent
              align="center"
              className="w-48 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-lg rounded-xl"
            >
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-1 pb-1">
                  {isFr ? 'Nuances' : 'Shades'} ({color.hex})
                </div>
                {shades.map((shadeHex) => (
                  <button
                    key={shadeHex}
                    type="button"
                    onClick={() => onCustomHexChange(idx, shadeHex)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-transform cursor-pointer active:scale-[0.98] border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: shadeHex }}
                  >
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: getContrastTextColor(shadeHex) }}
                    >
                      {shadeHex}
                    </span>
                    {shadeHex.toLowerCase() === color.hex.toLowerCase() && (
                      <Check className="w-3.5 h-3.5" style={{ color: getContrastTextColor(shadeHex) }} />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* ColorPicker */}
          <ColorPicker value={color.hex} onChange={(newHex) => onCustomHexChange(idx, newHex)}>
            <ActionTooltip label={isFr ? 'Ajuster précisément cette couleur' : 'Fine-tune color'} side="top">
              <button
                type="button"
                className={`p-1.5 rounded-lg opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer active:scale-[0.95] ${buttonBg}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </ActionTooltip>
          </ColorPicker>
        </div>
      </div>

      {/* Centre : Code couleur + Nom descriptif + WCAG */}
      <div className="flex flex-col items-center justify-center my-auto py-6 text-center select-none w-full max-w-full overflow-hidden">
        <ActionTooltip
          label={
            isFr
              ? `Cliquer pour copier ${getColorValue(color)}`
              : `Click to copy ${getColorValue(color)}`
          }
          side="top"
        >
          <button
            type="button"
            onClick={() => onCopyColor(color, idx)}
            className={`group/code flex items-center justify-center gap-1 font-mono font-bold w-full max-w-full overflow-hidden px-1.5 py-1 rounded-lg ${contrastClasses} ${getCodeFontSize(
              format,
              count
            )} ${format === 'hex' ? 'tracking-wider' : 'tracking-tight'} hover:scale-105 transition-transform cursor-pointer active:scale-[0.96]`}
          >
            <span className="truncate max-w-full">
              {copiedIdx === idx ? (isFr ? 'Copié !' : 'Copied!') : getColorDisplayValue(color, format)}
            </span>
          </button>
        </ActionTooltip>

        <div className="flex flex-col items-center gap-0.5 mt-2 w-full max-w-full overflow-hidden px-1 text-center">
          <span className={`text-xs sm:text-sm font-medium tracking-tight truncate max-w-full ${contrastClasses}`}>
            {describeColor(color.hex, isFr)}
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-wider opacity-60 truncate max-w-full ${contrastClasses}`}>
            WCAG {wcagRatio >= 7 ? 'AAA' : wcagRatio >= 4.5 ? 'AA' : 'A'} · {wcagRatio}:1
          </span>
        </div>
      </div>

      {/* Bas : Boutons de réglage de luminosité (+5% / -5%) et bouton Copier */}
      <div className="flex items-center justify-center gap-1.5 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionTooltip label={isFr ? 'Éclaircir la teinte (+5%)' : 'Lighten shade (+5%)'} side="top">
          <button
            type="button"
            onClick={() => onAdjustLightness(idx, 5)}
            className={`p-1.5 rounded-lg transition-transform cursor-pointer active:scale-[0.95] ${buttonBg}`}
          >
            <SunMedium className="w-3.5 h-3.5" />
          </button>
        </ActionTooltip>

        <ActionTooltip label={isFr ? 'Assombrir la teinte (-5%)' : 'Darken shade (-5%)'} side="top">
          <button
            type="button"
            onClick={() => onAdjustLightness(idx, -5)}
            className={`p-1.5 rounded-lg transition-transform cursor-pointer active:scale-[0.95] ${buttonBg}`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </ActionTooltip>

        <CopyButton
          text={() => getColorValue(color)}
          variant="custom"
          size="icon"
          className={`p-1.5 w-7 h-7 rounded-lg cursor-pointer ${buttonBg}`}
          toastMessage={
            isFr
              ? `${getColorValue(color)} copié dans le presse-papier`
              : `${getColorValue(color)} copied to clipboard`
          }
          onCopy={() => trackToolUsed('color-palette', 'copy-single')}
        />
      </div>
    </div>
  );
}
