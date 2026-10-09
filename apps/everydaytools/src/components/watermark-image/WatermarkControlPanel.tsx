import React from 'react';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  WatermarkConfig,
  NinePointPosition,
  FontOption,
} from '@/lib/watermark-logic';
import { WatermarkPlacementSection } from './WatermarkPlacementSection';
import { WatermarkAppearanceSection } from './WatermarkAppearanceSection';

interface WatermarkControlPanelProps {
  config: WatermarkConfig;
  setConfig: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  onTogglePosition: (posId: NinePointPosition) => void;
  selectedFont: FontOption;
  colorSwatches: Array<{ hex: string; label: string }>;
  isFr: boolean;
}

export function WatermarkControlPanel({
  config,
  setConfig,
  onTogglePosition,
  selectedFont,
  colorSwatches,
  isFr,
}: WatermarkControlPanelProps) {
  const textPresets = isFr
    ? [
        '© EverydayTools',
        '© Copyright',
        'CONFIDENTIEL',
        'ÉCHANTILLON',
        'BROUILLON',
        'NE PAS DIFFUSER',
        'SOUS EMBARGO',
      ]
    : [
        '© EverydayTools',
        '© Copyright',
        'CONFIDENTIAL',
        'SAMPLE',
        'DRAFT',
        'DO NOT DISTRIBUTE',
        'UNDER EMBARGO',
      ];

  return (
    <div className="lg:col-span-4 space-y-5 pt-1">
      {/* SECTION A : TEXTE & MENTIONS EXPRESS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{isFr ? 'Contenu du filigrane' : 'Watermark content'}</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {config.text.length}/100
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={config.text}
            maxLength={100}
            placeholder={isFr ? 'Saisir votre texte...' : 'Enter your text...'}
            onChange={(e) => setConfig((prev) => ({ ...prev, text: e.target.value }))}
            className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/90 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
          />
        </div>

        {/* Puces de mentions rapides légales */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {textPresets.map((preset) => {
            const isCurrent = config.text === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, text: preset }))}
                className={cn(
                  'h-6 px-2 rounded-md text-[11px] font-medium transition-all cursor-pointer',
                  isCurrent
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                )}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION B & C : POSITIONNEMENT & INCLINAISON */}
      <WatermarkPlacementSection
        config={config}
        setConfig={setConfig}
        onTogglePosition={onTogglePosition}
        isFr={isFr}
      />

      {/* SECTION D & E : TYPOGRAPHIE & APPARENCE */}
      <WatermarkAppearanceSection
        config={config}
        setConfig={setConfig}
        selectedFont={selectedFont}
        colorSwatches={colorSwatches}
        isFr={isFr}
      />
    </div>
  );
}
