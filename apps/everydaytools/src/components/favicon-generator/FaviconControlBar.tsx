import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ActionTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  type IconShape,
  SHAPE_OPTIONS,
} from '@/lib/favicon-logic';
import { ShapeGlyph } from './ShapeGlyph';
import type { StageView } from '@/hooks/use-favicon-workflow';

interface FaviconControlBarProps {
  previewShape: IconShape;
  onShapeChange: (shape: IconShape) => void;
  padding: number;
  onPaddingChange: (padding: number) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  stageView: StageView;
  browserTheme: 'light' | 'dark';
  onBrowserThemeChange: (theme: 'light' | 'dark') => void;
  isFr: boolean;
}

export function FaviconControlBar({
  previewShape,
  onShapeChange,
  padding,
  onPaddingChange,
  bgColor,
  onBgColorChange,
  stageView,
  browserTheme,
  onBrowserThemeChange,
  isFr,
}: FaviconControlBarProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4 flex-wrap py-2.5 px-4 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10">
      {/* Contrôle 1 : Forme de découpe */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
          {isFr ? 'Découpe :' : 'Cutout:'}
        </span>
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10">
          {SHAPE_OPTIONS.map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => onShapeChange(shape.id)}
              className={cn(
                'h-7 px-2.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-[0.98]',
                previewShape === shape.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <ShapeGlyph shape={shape.id} />
              <span className="text-[11px]">{isFr ? shape.labelFr : shape.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-5 w-px bg-zinc-200 dark:bg-white/10 hidden md:block" />

      {/* Contrôle 2 : Marge interne (Safe Area) */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
          <span>{isFr ? 'Marge :' : 'Padding:'}</span>
          <span className="font-mono text-[#FF6B35] font-semibold">{padding}%</span>
        </div>
        <Slider
          value={[padding]}
          min={0}
          max={30}
          step={1}
          onValueChange={(vals) => onPaddingChange(vals[0] ?? 0)}
          className="w-24 sm:w-28 py-1"
        />
        <div className="flex items-center gap-1">
          {[
            { val: 0, label: '0%' },
            { val: 10, label: '10%' },
            { val: 18, label: '18%' },
          ].map((p) => (
            <button
              key={p.val}
              type="button"
              onClick={() => onPaddingChange(p.val)}
              className={cn(
                'px-1.5 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer active:scale-[0.98]',
                padding === p.val
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-white/10 hover:border-zinc-400'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-5 w-px bg-zinc-200 dark:bg-white/10 hidden md:block" />

      {/* Contrôle 3 : Couleur de fond */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
          {isFr ? 'Fond :' : 'Background:'}
        </span>
        <div className="flex items-center gap-1.5">
          <ActionTooltip label={isFr ? 'Fond transparent' : 'Transparent background'}>
            <button
              type="button"
              onClick={() => onBgColorChange('transparent')}
              className={cn(
                'h-7 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-[0.98]',
                bgColor === 'transparent'
                  ? 'border-zinc-900 dark:border-white font-medium bg-zinc-100 dark:bg-zinc-850 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              )}
            >
              <span className="w-3 h-3 rounded-full border border-black/10 dark:border-white/20 shrink-0 bg-[radial-gradient(#999_1px,transparent_1px)] [background-size:4px_4px]" />
              <span className="text-[11px]">{isFr ? 'Transparent' : 'Transparent'}</span>
            </button>
          </ActionTooltip>

          <ColorPicker
            value={bgColor === 'transparent' ? '#ffffff' : bgColor}
            onChange={(newHex) => onBgColorChange(newHex)}
            triggerClassName={cn(
              'h-7 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-[0.98]',
              bgColor !== 'transparent'
                ? 'border-zinc-900 dark:border-white font-medium bg-zinc-100 dark:bg-zinc-850 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                : 'bg-white dark:bg-zinc-800 border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
            )}
          >
            <span className="flex items-center gap-1.5 text-[11px]">
              <span
                className="w-3 h-3 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                style={{ backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor }}
              />
              <span className="font-mono">
                {bgColor === 'transparent'
                  ? (isFr ? 'Couleur' : 'Color')
                  : bgColor.toUpperCase()}
              </span>
            </span>
          </ColorPicker>
        </div>
      </div>

      {/* Contrôle 4 : Thème clair/sombre si onglet web */}
      {stageView === 'browser' && (
        <>
          <div className="h-5 w-px bg-zinc-200 dark:bg-white/10 hidden lg:block" />
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => onBrowserThemeChange('light')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer text-xs',
                browserTheme === 'light'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              )}
            >
              <Sun className="w-3 h-3" />
              <span className="text-[11px]">{isFr ? 'Clair' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={() => onBrowserThemeChange('dark')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer text-xs',
                browserTheme === 'dark'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              )}
            >
              <Moon className="w-3 h-3" />
              <span className="text-[11px]">{isFr ? 'Sombre' : 'Dark'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
