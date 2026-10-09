import React from 'react';
import { Sliders, Type, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { BarcodeSymbology } from '@/lib/barcode-logic';
import type { BarcodeBackgroundMode, BarcodeTextPosition } from '@/hooks/use-barcode-workflow';

interface BarcodeInspectorProps {
  activeSymbology: BarcodeSymbology;
  barWidth: number;
  onBarWidthChange: (w: number) => void;
  barHeight: number;
  onBarHeightChange: (h: number) => void;
  quietZone: number;
  onQuietZoneChange: (z: number) => void;
  displayValue: boolean;
  onDisplayValueChange: (show: boolean) => void;
  fontSize: number;
  onFontSizeChange: (s: number) => void;
  textPosition: BarcodeTextPosition;
  onTextPositionChange: (pos: BarcodeTextPosition) => void;
  inkColor: string;
  onInkColorChange: (c: string) => void;
  backgroundMode: BarcodeBackgroundMode;
  onBackgroundModeChange: (m: BarcodeBackgroundMode) => void;
  isFr: boolean;
}

export function BarcodeInspector({
  activeSymbology,
  barWidth,
  onBarWidthChange,
  barHeight,
  onBarHeightChange,
  quietZone,
  onQuietZoneChange,
  displayValue,
  onDisplayValueChange,
  fontSize,
  onFontSizeChange,
  textPosition,
  onTextPositionChange,
  inkColor,
  onInkColorChange,
  backgroundMode,
  onBackgroundModeChange,
  isFr,
}: BarcodeInspectorProps) {
  return (
    <div className="lg:col-span-4 flex flex-col divide-y divide-zinc-200 dark:divide-white/10 bg-white dark:bg-zinc-950">
      {/* En-tête de l'Inspecteur */}
      <div className="h-12 px-5 flex items-center justify-between shrink-0 bg-zinc-50/30 dark:bg-zinc-900/20">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {isFr ? 'Configuration de Gravure' : 'Barcode Configuration'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">{activeSymbology.standard}</span>
      </div>

      {/* Section 1 : Géométrie des barres */}
      <div className="p-5 space-y-4">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block text-[11px]">
          {isFr ? 'Proportions & Échelle' : 'Dimensions & Scale'}
        </span>

        {/* Largeur de module */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">{isFr ? 'Largeur de module :' : 'Module width:'}</span>
            <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">{barWidth} px</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onBarWidthChange(w)}
                className={`py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                  barWidth === w
                    ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-bold'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        {/* Hauteur des barres */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">{isFr ? 'Hauteur des barres :' : 'Bar height:'}</span>
            <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">{barHeight} px</span>
          </div>
          <Slider
            value={[barHeight]}
            min={40}
            max={140}
            step={5}
            onValueChange={([val]) => onBarHeightChange(val)}
            className="w-full"
          />
        </div>

        {/* Marge de sécurité (Quiet Zone) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">{isFr ? 'Marge latérale :' : 'Quiet zone / Margin:'}</span>
            <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">{quietZone} px</span>
          </div>
          <Slider
            value={[quietZone]}
            min={0}
            max={28}
            step={2}
            onValueChange={([val]) => onQuietZoneChange(val)}
            className="w-full"
          />
        </div>
      </div>

      {/* Section 2 : Typographie */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-zinc-400" />
            {isFr ? 'Chiffres en clair' : 'Human-readable text'}
          </span>
          <button
            type="button"
            onClick={() => onDisplayValueChange(!displayValue)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              displayValue ? 'bg-[#FF6B35]' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                displayValue ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {displayValue && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{isFr ? 'Taille de police :' : 'Font size:'}</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">{fontSize} px</span>
              </div>
              <Slider
                value={[fontSize]}
                min={11}
                max={20}
                step={1}
                onValueChange={([val]) => onFontSizeChange(val)}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-500 block">{isFr ? 'Position :' : 'Position:'}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onTextPositionChange('bottom')}
                  className={`flex-1 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    textPosition === 'bottom'
                      ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                      : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isFr ? 'Dessous' : 'Bottom'}
                </button>
                <button
                  type="button"
                  onClick={() => onTextPositionChange('top')}
                  className={`flex-1 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    textPosition === 'top'
                      ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                      : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {isFr ? 'Dessus' : 'Top'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3 : Couleurs & Support */}
      <div className="p-5 space-y-4">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-zinc-400" />
          {isFr ? "Couleurs d'Impression" : 'Print Colors'}
        </span>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-mono">{isFr ? 'Encre :' : 'Ink:'}</span>
          <ColorPicker value={inkColor} onChange={onInkColorChange} isFr={isFr} />
        </div>


        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">{isFr ? 'Support :' : 'Background:'}</span>
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/60 dark:bg-zinc-800/40">
            <button
              type="button"
              onClick={() => onBackgroundModeChange('paper')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                backgroundMode === 'paper'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isFr ? 'Papier' : 'Paper'}
            </button>
            <button
              type="button"
              onClick={() => onBackgroundModeChange('transparent')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                backgroundMode === 'transparent'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isFr ? 'Transparent' : 'Transparent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
