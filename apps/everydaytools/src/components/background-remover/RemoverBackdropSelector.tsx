import React, { RefObject } from 'react';
import { ImagePlus } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { ColorPickerField } from '@workspace/ui';
import type { BackdropType } from '@/lib/background-remover-logic';

interface RemoverBackdropSelectorProps {
  backdropType: BackdropType;
  onBackdropTypeChange: (type: BackdropType) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  customBgUrl: string | null;
  customBgInputRef: RefObject<HTMLInputElement | null>;
  onCustomBgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFr: boolean;
  className?: string;
}

export function RemoverBackdropSelector({
  backdropType,
  onBackdropTypeChange,
  customColor,
  onCustomColorChange,
  customBgUrl,
  customBgInputRef,
  onCustomBgChange,
  isFr,
  className,
}: RemoverBackdropSelectorProps) {
  return (
    <div className={className || "flex items-center gap-1.5 flex-wrap"}>
      {/* Option Transparent */}
      <ActionTooltip label={isFr ? 'Transparent (PNG 32-bit sans arrière-plan)' : 'Transparent (32-bit PNG without background)'}>
        <button
          type="button"
          onClick={() => onBackdropTypeChange('transparent')}
          aria-label={isFr ? 'Fond transparent sans arrière-plan' : 'Transparent background'}
          aria-pressed={backdropType === 'transparent'}
          className={`flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            backdropType === 'transparent'
              ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
              : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 rounded-xs overflow-hidden border border-black/15 dark:border-white/20"
          >
            <rect width="16" height="16" fill="#FFFFFF" />
            <rect x="0" y="0" width="8" height="8" fill="#CBD5E1" />
            <rect x="8" y="8" width="8" height="8" fill="#CBD5E1" />
          </svg>
          <span>{isFr ? 'Transparent' : 'Transparent'}</span>
        </button>
      </ActionTooltip>

      {/* Sélecteur de couleur studio canonique (@workspace/ui) */}
      <ColorPickerField
        value={customColor}
        onChange={(hex) => {
          onCustomColorChange(hex);
          onBackdropTypeChange('custom');
        }}
        isActive={backdropType === 'custom'}
        size="sm"
        isFr={isFr}
        showHexValue={true}
        placeholder={isFr ? 'Couleur' : 'Color'}
        side="bottom"
        align="end"
      />

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 self-center mx-0.5" />

      {/* Import d'image de fond personnalisée */}
      <input
        ref={customBgInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onCustomBgChange}
      />

      {!customBgUrl ? (
        <ActionTooltip label={isFr ? 'Importer une image de fond personnalisée' : 'Import custom background image'}>
          <button
            type="button"
            onClick={() => customBgInputRef.current?.click()}
            aria-label={isFr ? 'Importer une image de fond personnalisée' : 'Import custom background image'}
            aria-pressed={backdropType === 'image'}
            className={`flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              backdropType === 'image'
                ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            }`}
          >
            <ImagePlus className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{isFr ? 'Image de fond' : 'Background image'}</span>
          </button>
        </ActionTooltip>
      ) : (
        <div className="inline-flex items-center gap-1">
          <ActionTooltip label={isFr ? "Activer l'image de fond importée" : 'Activate imported background image'}>
            <button
              type="button"
              onClick={() => onBackdropTypeChange('image')}
              aria-label={isFr ? "Activer l'image de fond importée" : 'Activate imported background image'}
              aria-pressed={backdropType === 'image'}
              className={`flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                backdropType === 'image'
                  ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <img
                src={customBgUrl}
                alt={isFr ? 'Aperçu fond' : 'Background preview'}
                className="w-3.5 h-3.5 rounded-xs object-cover shrink-0"
              />
              <span>{isFr ? 'Image' : 'Image'}</span>
            </button>
          </ActionTooltip>
          <ActionTooltip label={isFr ? "Remplacer l'image de fond" : 'Replace background image'}>
            <button
              type="button"
              onClick={() => customBgInputRef.current?.click()}
              aria-label={isFr ? "Remplacer l'image de fond" : 'Replace background image'}
              className="h-7 w-7 rounded-lg flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
