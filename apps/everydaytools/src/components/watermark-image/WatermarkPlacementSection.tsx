import React from 'react';
import { Grid3X3, Compass } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { GradingDial } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  type WatermarkConfig,
  type NinePointPosition,
  NINE_POINT_GRID,
} from '@/lib/watermark-logic';

interface WatermarkPlacementSectionProps {
  config: WatermarkConfig;
  setConfig: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  onTogglePosition: (posId: NinePointPosition) => void;
  isFr: boolean;
}

export function WatermarkPlacementSection({
  config,
  setConfig,
  onTogglePosition,
  isFr,
}: WatermarkPlacementSectionProps) {
  const getPointLabel = (id: NinePointPosition) => {
    switch (id) {
      case 'top-left':
        return isFr ? 'Haut Gauche' : 'Top Left';
      case 'top-center':
        return isFr ? 'Haut Centre' : 'Top Center';
      case 'top-right':
        return isFr ? 'Haut Droite' : 'Top Right';
      case 'center-left':
        return isFr ? 'Milieu Gauche' : 'Middle Left';
      case 'center':
        return isFr ? 'Plein Centre' : 'Center';
      case 'center-right':
        return isFr ? 'Milieu Droite' : 'Middle Right';
      case 'bottom-left':
        return isFr ? 'Bas Gauche' : 'Bottom Left';
      case 'bottom-center':
        return isFr ? 'Bas Centre' : 'Bottom Center';
      case 'bottom-right':
        return isFr ? 'Bas Droite' : 'Bottom Right';
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/10">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <Grid3X3 className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>{isFr ? 'Positionnement & Trame' : 'Placement & Pattern'}</span>
        </span>
        {config.mode === 'points' && (
          <span className="text-[11px] font-medium text-[#FF6B35]">
            {isFr
              ? `${config.positions.length} point${config.positions.length > 1 ? 's' : ''} actif${config.positions.length > 1 ? 's' : ''}`
              : `${config.positions.length} active point${config.positions.length > 1 ? 's' : ''}`}
          </span>
        )}
      </div>

      {/* Commutateur Mode Unique/Multi vs Trame Diagonale */}
      <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => {
            if (config.mode !== 'points') {
              setConfig((prev) => ({
                ...prev,
                mode: 'points',
                positions: prev.positions.length > 0 ? prev.positions : ['bottom-right'],
              }));
            }
          }}
          className={cn(
            'h-7 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5',
            config.mode === 'points'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          )}
        >
          <span>{isFr ? 'Points Précis' : 'Precise Points'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setConfig((prev) => ({
              ...prev,
              mode: 'tile',
            }));
          }}
          className={cn(
            'h-7 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5',
            config.mode === 'tile'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          )}
        >
          <span>{isFr ? 'Trame Diagonale' : 'Diagonal Pattern'}</span>
        </button>
      </div>

      {/* Mode Points Précis : Matrice 9 Points Tactile avec Multi-sélection */}
      {config.mode === 'points' ? (
        <div className="w-36 h-36 mx-auto grid grid-cols-3 gap-1.5 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-white/10">
          {NINE_POINT_GRID.map((pt) => {
            const isSelected = config.positions.includes(pt.id);
            return (
              <ActionTooltip
                key={pt.id}
                label={`${getPointLabel(pt.id)} (${isSelected ? (isFr ? 'Retirer' : 'Remove') : isFr ? 'Ajouter' : 'Add'})`}
              >
                <button
                  type="button"
                  onClick={() => onTogglePosition(pt.id)}
                  className={cn(
                    'w-full h-full rounded-md transition-all cursor-pointer flex items-center justify-center relative',
                    isSelected
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-300/70 dark:hover:bg-zinc-700'
                  )}
                >
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      isSelected ? 'bg-white scale-110' : 'bg-current opacity-60'
                    )}
                  />
                </button>
              </ActionTooltip>
            );
          })}
        </div>
      ) : (
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center py-1">
          {isFr
            ? "Trame répétée sur l'ensemble de l'image avec espacement régulier."
            : 'Repeated pattern across the entire image with even spacing.'}
        </div>
      )}

      {/* Angle d'inclinaison */}
      <GradingDial
        label={isFr ? "Angle d'inclinaison" : 'Rotation angle'}
        icon={<Compass className="w-3.5 h-3.5 text-[#FF6B35]" />}
        value={config.rotation}
        min={-180}
        max={180}
        defaultValue={0}
        step={1}
        unit="°"
        isBipolar={true}
        onChange={(val) => setConfig((prev) => ({ ...prev, rotation: val }))}
        onReset={() => setConfig((prev) => ({ ...prev, rotation: 0 }))}
      />
    </div>
  );
}
