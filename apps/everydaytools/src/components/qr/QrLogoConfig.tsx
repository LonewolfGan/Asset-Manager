import React from 'react';
import { LayoutGrid, X, Upload, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ActionTooltip } from '@/components/ui/tooltip';
import { ICON_LIBRARY, QUICK_FAVORITE_ICONS } from '@/lib/qr-icons';
import { EyeStyle } from '@/lib/qr-code-logic';
import { IconSwatch } from '@/lib/qr-code-swatches';

export interface QrLogoConfigProps {
  isFr: boolean;
  eyeStyle: EyeStyle;
  logoUrl: string | null;
  clearLogo: () => void;
  logoScale: number;
  setLogoScale: (v: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsIconModalOpen: (v: boolean) => void;
  activePresetId: string | null;
  selectPresetIcon: (id: string) => void;
  iconColor: string;
  handleIconColorChange: (c: string) => void;
  availableIconSwatches: IconSwatch[];
}

export function QrLogoConfig({
  isFr,
  eyeStyle,
  logoUrl,
  clearLogo,
  logoScale,
  setLogoScale,
  fileInputRef,
  setIsIconModalOpen,
  activePresetId,
  selectPresetIcon,
  iconColor,
  handleIconColorChange,
  availableIconSwatches,
}: QrLogoConfigProps) {
  const renderQuickFavorites = (btnClass: string, iconClass: string) =>
    QUICK_FAVORITE_ICONS.map((iconId) => {
      const iconData = ICON_LIBRARY.find((i) => i.id === iconId);
      if (!iconData) return null;
      const isCurrent = activePresetId === iconId;
      return (
        <ActionTooltip key={iconId} label={iconData.label} side="top">
          <button
            type="button"
            onClick={() => selectPresetIcon(iconId)}
            className={`${btnClass} ${
              isCurrent
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={iconClass}
              dangerouslySetInnerHTML={{ __html: iconData.path }}
            />
            <span>{iconData.label}</span>
          </button>
        </ActionTooltip>
      );
    });

  return (
    <div className="flex flex-col gap-3.5 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {isFr ? 'Logo central' : 'Center Logo'}
          </span>
        </div>
        {logoUrl && (
          <button
            type="button"
            onClick={clearLogo}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-red-500 hover:text-red-600 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>{isFr ? 'Supprimer' : 'Remove'}</span>
          </button>
        )}
      </div>

      {logoUrl ? (
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 ${
                eyeStyle === 'circle' ? 'rounded-full' : eyeStyle === 'square' ? 'rounded-none' : 'rounded-xl'
              } bg-zinc-100 dark:bg-zinc-800 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs transition-all duration-200`}
            >
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{isFr ? 'Taille du logo' : 'Logo Scale'}</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{logoScale}%</span>
              </div>
              <Slider
                min={16}
                max={26}
                step={1}
                value={[logoScale]}
                onValueChange={(vals) => setLogoScale(vals[0])}
                className="w-full py-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-2.5 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer border border-zinc-200/60 dark:border-white/10"
            >
              <Upload className="w-3 h-3" />
              <span>{isFr ? 'Remplacer' : 'Replace'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsIconModalOpen(true)}
              className="h-8 px-2.5 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer border border-zinc-200/60 dark:border-white/10 font-medium"
            >
              <LayoutGrid className="w-3 h-3 text-[#FF6B35]" />
              <span>{isFr ? "Bibliothèque d'icônes" : 'Icon Library'}</span>
            </button>

            {renderQuickFavorites('h-8 px-2.5 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-mono transition-all cursor-pointer', 'w-3 h-3 shrink-0')}
          </div>

          {activePresetId && (
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {isFr ? "Couleur de l'icône" : 'Icon Color'}
              </span>
              <ColorPicker
                value={iconColor}
                onChange={handleIconColorChange}
                align="end"
              />
            </div>
          )}

        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsIconModalOpen(true)}
            className="h-9 px-3.5 rounded-lg inline-flex items-center gap-2 text-xs font-mono bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium transition-all cursor-pointer shadow-2xs"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isFr ? "Bibliothèque d'icônes" : 'Icon Library'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-3 rounded-lg inline-flex items-center gap-1.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer border border-zinc-200/60 dark:border-white/10"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isFr ? 'Importer logo' : 'Upload logo'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-1">
            {renderQuickFavorites('h-9 px-2.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer', 'w-3.5 h-3.5 shrink-0')}
          </div>
        </div>
      )}
    </div>
  );
}
