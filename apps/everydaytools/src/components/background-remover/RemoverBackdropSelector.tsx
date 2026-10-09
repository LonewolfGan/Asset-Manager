import React, { RefObject } from 'react';
import { Check, Grid, ImagePlus } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { ColorPicker } from '@/components/ui/color-picker';
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
}: RemoverBackdropSelectorProps) {
  return (
    <div className="w-full flex items-center justify-end gap-2 flex-wrap">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1 hidden sm:inline">
        {isFr ? 'Fond :' : 'Background:'}
      </span>

      {/* Option Transparent */}
      <ActionTooltip label={isFr ? 'Transparent (PNG 32-bit sans arrière-plan)' : 'Transparent (32-bit PNG without background)'}>
        <button
          type="button"
          onClick={() => onBackdropTypeChange('transparent')}
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            backdropType === 'transparent'
              ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-2 dark:ring-offset-zinc-950 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
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

      {/* Blanc E-commerce */}
      <ActionTooltip label={isFr ? 'Blanc pur (E-commerce / Fiche produit)' : 'Pure white (E-commerce / Product listing)'}>
        <button
          type="button"
          onClick={() => onBackdropTypeChange('white')}
          className={`w-8 h-8 rounded-lg bg-white border transition-all cursor-pointer ${
            backdropType === 'white'
              ? 'border-2 border-zinc-900 dark:border-zinc-100 scale-105 shadow-xs'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400'
          }`}
        >
          {backdropType === 'white' && (
            <Check className="w-3.5 h-3.5 text-zinc-900 mx-auto" />
          )}
        </button>
      </ActionTooltip>

      {/* Noir Studio */}
      <ActionTooltip label={isFr ? 'Noir studio profond' : 'Deep studio black'}>
        <button
          type="button"
          onClick={() => onBackdropTypeChange('dark')}
          className={`w-8 h-8 rounded-lg bg-zinc-900 border transition-all cursor-pointer ${
            backdropType === 'dark'
              ? 'border-2 border-zinc-100 scale-105 shadow-xs'
              : 'border-zinc-700 hover:border-zinc-600'
          }`}
        >
          {backdropType === 'dark' && (
            <Check className="w-3.5 h-3.5 text-white mx-auto" />
          )}
        </button>
      </ActionTooltip>

      {/* Gris Neutre */}
      <ActionTooltip label={isFr ? 'Gris clair catalogue' : 'Light catalog gray'}>
        <button
          type="button"
          onClick={() => onBackdropTypeChange('neutral')}
          className={`w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border transition-all cursor-pointer ${
            backdropType === 'neutral'
              ? 'border-2 border-zinc-900 dark:border-zinc-100 scale-105 shadow-xs'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400'
          }`}
        >
          {backdropType === 'neutral' && (
            <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 mx-auto" />
          )}
        </button>
      </ActionTooltip>

      {/* Couleur personnalisée avec Popover shadcn */}
      <ColorPicker
        value={customColor}
        onChange={(hex) => {
          onCustomColorChange(hex);
          onBackdropTypeChange('custom');
        }}
        ariaLabel={isFr ? "Choisir une couleur d'arrière-plan personnalisée" : 'Choose custom background color'}
      >
        <ActionTooltip label={isFr ? 'Couleur personnalisée' : 'Custom color'}>
          <button
            type="button"
            onClick={() => onBackdropTypeChange('custom')}
            style={{ backgroundColor: backdropType === 'custom' ? customColor : undefined }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              backdropType === 'custom'
                ? 'border-2 border-zinc-900 dark:border-zinc-100 scale-105 shadow-xs'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </ActionTooltip>
      </ColorPicker>


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
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all cursor-pointer"
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
              className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                backdropType === 'image'
                  ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-2 dark:ring-offset-zinc-950 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
              }`}
            >
              <img
                src={customBgUrl}
                alt={isFr ? 'Aperçu fond' : 'Background preview'}
                className="w-3.5 h-3.5 rounded-xs object-cover border border-black/15 shrink-0"
              />
              <span>{isFr ? 'Image' : 'Image'}</span>
            </button>
          </ActionTooltip>
          <ActionTooltip label={isFr ? "Remplacer l'image de fond" : 'Replace background image'}>
            <button
              type="button"
              onClick={() => customBgInputRef.current?.click()}
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
