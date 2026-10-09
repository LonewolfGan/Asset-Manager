import React from 'react';
import { Sliders, SunMedium, Minus, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ColorPickerField } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  type WatermarkConfig,
  FONT_OPTIONS,
  type FontOption,
} from '@/lib/watermark-logic';

interface WatermarkAppearanceSectionProps {
  config: WatermarkConfig;
  setConfig: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  selectedFont: FontOption;
  colorSwatches: Array<{ hex: string; label: string }>;
  isFr: boolean;
}

export function WatermarkAppearanceSection({
  config,
  setConfig,
  selectedFont,
  colorSwatches,
  isFr,
}: WatermarkAppearanceSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-black/[0.06] dark:border-white/10">
      {/* TYPOGRAPHIE & MENU DE POLICES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{isFr ? 'Typographie & Police' : 'Typography & Font'}</span>
          </span>
        </div>

        {/* Menu Déroulant des Polices */}
        <Select
          value={config.fontId}
          onValueChange={(val) => setConfig((prev) => ({ ...prev, fontId: val }))}
        >
          <SelectTrigger className="w-full h-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
            <div className="flex items-center justify-between w-full pr-2">
              <span style={{ fontFamily: selectedFont.fontFamily }} className="text-[13px]">
                {selectedFont.name}
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                {selectedFont.category}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-72 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
            {(
              ['Sans-Serif', 'Serif', 'Monospace', 'Display', 'Signature'] as const
            ).map((category) => {
              const categoryFonts = FONT_OPTIONS.filter((f) => f.category === category);
              return (
                <SelectGroup key={category}>
                  <SelectLabel className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 px-2 py-1">
                    {category}
                  </SelectLabel>
                  {categoryFonts.map((font) => (
                    <SelectItem
                      key={font.id}
                      value={font.id}
                      className="text-xs cursor-pointer py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span
                          style={{ fontFamily: font.fontFamily }}
                          className="text-[13px] font-medium"
                        >
                          {font.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            })}
          </SelectContent>
        </Select>

        {/* Stepper Taille de Police */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {isFr ? 'Taille de police :' : 'Font size:'}
          </span>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/80 dark:border-white/10 h-7 px-1 gap-1">
            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  fontSize: Math.max(12, prev.fontSize - 4),
                }))
              }
              disabled={config.fontSize <= 12}
              className="w-5 h-5 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 w-12 text-center">
              {config.fontSize} px
            </span>

            <button
              type="button"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  fontSize: Math.min(220, prev.fontSize + 4),
                }))
              }
              disabled={config.fontSize >= 220}
              className="w-5 h-5 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* COULEUR, OPACITÉ & OMBRE */}
      <div className="space-y-2.5 pt-2 border-t border-black/[0.06] dark:border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{isFr ? 'Apparence & Opacité' : 'Appearance & Opacity'}</span>
          </span>
        </div>

        {/* Opacité Tactile Slider */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {isFr ? 'Opacité :' : 'Opacity:'}
          </span>
          <div className="flex items-center gap-2.5">
            <Slider
              value={[config.opacity]}
              min={5}
              max={100}
              step={5}
              onValueChange={([val]) => setConfig((prev) => ({ ...prev, opacity: val }))}
              className="w-36 sm:w-44"
            />
            <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 w-9 text-right tabular-nums">
              {config.opacity}%
            </span>
          </div>
        </div>

        {/* Nuancier Palette & ColorPickerField (@workspace/ui) */}
        <div className="pt-1">
          <ColorPickerField
            value={config.color}
            onChange={(val) => setConfig((prev) => ({ ...prev, color: val }))}
            label={isFr ? 'Couleur :' : 'Color:'}
            isFr={isFr}
          />
        </div>

        {/* Ombre de contraste */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {isFr ? 'Ombre de lisibilité :' : 'Legibility shadow:'}
          </span>
          <button
            type="button"
            onClick={() => setConfig((prev) => ({ ...prev, hasShadow: !prev.hasShadow }))}
            className={cn(
              'h-6 px-2.5 rounded-md text-[11px] font-medium transition-all cursor-pointer',
              config.hasShadow
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500'
            )}
          >
            {config.hasShadow
              ? isFr
                ? 'Activée'
                : 'Enabled'
              : isFr
                ? 'Désactivée'
                : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
