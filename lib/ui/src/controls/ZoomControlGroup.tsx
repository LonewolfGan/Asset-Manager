import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import type { ZoomControlGroupProps } from './types';

export const ZoomControlGroup: React.FC<ZoomControlGroupProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitScreen,
  minScale = 0.25,
  maxScale = 5.0,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  const percentage = Math.round(scale * 100);
  const isMin = scale <= minScale;
  const isMax = scale >= maxScale;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-white/10 p-1 bg-white dark:bg-zinc-900 shadow-2xs ${className}`}
    >
      {/* Zoom Arrière (-) */}
      <button
        type="button"
        data-testid="zoom-out-btn"
        disabled={disabled || isMin}
        onClick={onZoomOut}
        title={isFr ? 'Zoom arrière' : 'Zoom out'}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ZoomOut size={14} />
      </button>

      {/* Pourcentage de Zoom */}
      <div className="px-2 min-w-[50px] text-center font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
        {percentage}%
      </div>

      {/* Zoom Avant (+) */}
      <button
        type="button"
        data-testid="zoom-in-btn"
        disabled={disabled || isMax}
        onClick={onZoomIn}
        title={isFr ? 'Zoom avant' : 'Zoom in'}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ZoomIn size={14} />
      </button>

      {/* Réinitialiser (100%) */}
      {onResetZoom && (
        <button
          type="button"
          data-testid="zoom-reset-btn"
          disabled={disabled}
          onClick={onResetZoom}
          title={isFr ? 'Réinitialiser le zoom (100%)' : 'Reset zoom (100%)'}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ml-0.5"
        >
          <RotateCcw size={12} />
        </button>
      )}

      {/* Ajuster à l'écran */}
      {onFitScreen && (
        <button
          type="button"
          data-testid="zoom-fit-btn"
          disabled={disabled}
          onClick={onFitScreen}
          title={isFr ? 'Ajuster à l’écran' : 'Fit to screen'}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Maximize2 size={12} />
        </button>
      )}
    </div>
  );
};
