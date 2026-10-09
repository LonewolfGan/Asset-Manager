import React from 'react';
import { Lock, Unlock, ArrowLeftRight } from 'lucide-react';
import type { DimensionLockGroupProps } from './types';

export const DimensionLockGroup: React.FC<DimensionLockGroupProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  isLocked = true,
  onToggleLock,
  unit = 'px',
  onUnitChange,
  onSwap,
  disabled = false,
  isFr = false,
  minWidth = 1,
  maxWidth = 10000,
  minHeight = 1,
  maxHeight = 10000,
  className = '',
}) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onWidthChange(Math.max(minWidth, Math.min(maxWidth, val)));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onHeightChange(Math.max(minHeight, Math.min(maxHeight, val)));
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Barre d'options : Ratio & Unités */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {isFr ? 'Dimensions' : 'Dimensions'}
        </span>
        {onUnitChange && (
          <div className="flex items-center gap-1 rounded-md p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 font-mono text-[11px]">
            <button
              type="button"
              data-testid="dimension-unit-px"
              disabled={disabled}
              onClick={() => onUnitChange('px')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                unit === 'px'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              px
            </button>
            <button
              type="button"
              data-testid="dimension-unit-percent"
              disabled={disabled}
              onClick={() => onUnitChange('%')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                unit === '%'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              %
            </button>
          </div>
        )}
      </div>

      {/* Rangée de saisie W x H avec Cadenas et Inversion */}
      <div className="flex items-center gap-2">
        {/* Champ Largeur */}
        <div className="flex-1 relative flex items-center">
          <input
            type="number"
            data-testid="dimension-width-input"
            value={width}
            onChange={handleWidthChange}
            disabled={disabled}
            min={minWidth}
            max={maxWidth}
            className="w-full h-9 pl-3 pr-8 text-xs font-mono font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] disabled:opacity-50"
            placeholder="W"
          />
          <span className="absolute right-2.5 text-[11px] font-mono text-zinc-400 select-none">
            {unit === '%' ? '%' : 'W'}
          </span>
        </div>

        {/* Cadenas de verrouillage du ratio */}
        {onToggleLock && (
          <button
            type="button"
            data-testid="dimension-lock-btn"
            disabled={disabled}
            onClick={onToggleLock}
            title={
              isLocked
                ? isFr
                  ? 'Conserver les proportions (actif)'
                  : 'Lock aspect ratio (active)'
                : isFr
                ? 'Proportions libres'
                : 'Free aspect ratio'
            }
            className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${
              isLocked
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-white/20 text-[#FF6B35]'
                : 'border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        )}

        {/* Champ Hauteur */}
        <div className="flex-1 relative flex items-center">
          <input
            type="number"
            data-testid="dimension-height-input"
            value={height}
            onChange={handleHeightChange}
            disabled={disabled}
            min={minHeight}
            max={maxHeight}
            className="w-full h-9 pl-3 pr-8 text-xs font-mono font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] disabled:opacity-50"
            placeholder="H"
          />
          <span className="absolute right-2.5 text-[11px] font-mono text-zinc-400 select-none">
            {unit === '%' ? '%' : 'H'}
          </span>
        </div>

        {/* Bouton d'inversion W/H */}
        {onSwap && (
          <button
            type="button"
            data-testid="dimension-swap-btn"
            disabled={disabled}
            onClick={onSwap}
            title={isFr ? 'Intervertir largeur et hauteur' : 'Swap width and height'}
            className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowLeftRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
