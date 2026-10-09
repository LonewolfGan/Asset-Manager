import React from 'react';
import type { PlacementPosition, PositionPlacementGridProps } from './types';

const POSITIONS: Array<{ id: PlacementPosition; labelFr: string; labelEn: string }> = [
  { id: 'top-left', labelFr: 'Haut gauche', labelEn: 'Top Left' },
  { id: 'top-center', labelFr: 'Haut centre', labelEn: 'Top Center' },
  { id: 'top-right', labelFr: 'Haut droite', labelEn: 'Top Right' },
  { id: 'center-left', labelFr: 'Milieu gauche', labelEn: 'Middle Left' },
  { id: 'center', labelFr: 'Centre', labelEn: 'Center' },
  { id: 'center-right', labelFr: 'Milieu droite', labelEn: 'Middle Right' },
  { id: 'bottom-left', labelFr: 'Bas gauche', labelEn: 'Bottom Left' },
  { id: 'bottom-center', labelFr: 'Bas centre', labelEn: 'Bottom Center' },
  { id: 'bottom-right', labelFr: 'Bas droite', labelEn: 'Bottom Right' },
];

export const PositionPlacementGrid: React.FC<PositionPlacementGridProps> = ({
  position,
  onSelectPosition,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  const currentPos = POSITIONS.find((p) => p.id === position);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          <span className="text-[11px] font-mono text-zinc-400">
            {currentPos ? (isFr ? currentPos.labelFr : currentPos.labelEn) : position}
          </span>
        </div>
      )}

      <div
        className="grid grid-cols-3 gap-1.5 p-1.5 w-fit rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40"
        role="group"
        aria-label={label || (isFr ? 'Positionnement' : 'Placement')}
      >
        {POSITIONS.map((pos) => {
          const isActive = position === pos.id;
          const posName = isFr ? pos.labelFr : pos.labelEn;

          return (
            <button
              key={pos.id}
              type="button"
              disabled={disabled}
              data-placement={pos.id}
              onClick={() => onSelectPosition(pos.id)}
              aria-label={posName}
              title={posName}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 border border-zinc-200/80 dark:border-zinc-700/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-transform ${
                  isActive ? 'bg-white scale-125' : 'bg-zinc-400 dark:bg-zinc-500'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
