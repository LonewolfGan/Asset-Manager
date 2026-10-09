import React from 'react';
import { Check, RotateCcw, RotateCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface PdfPageCardProps {
  pageNumber: number;
  dataUrl?: string;
  isSelected?: boolean;
  isOverlapping?: boolean;
  isRotated?: boolean;
  rotationDeg?: number;
  trancheBadge?: string;
  onCardClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // Contrôles de rotation optionnels (utilisés notamment pour pdf-rotate)
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  // Contrôles de réorganisation optionnels (utilisés pour reorder-pdf)
  orderIndex?: number;
  onRemove?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  showCheckbox?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
}

export const PdfPageCard: React.FC<PdfPageCardProps> = ({
  pageNumber,
  dataUrl,
  isSelected = false,
  isOverlapping = false,
  isRotated = false,
  rotationDeg = 0,
  trancheBadge,
  onCardClick,
  onRotateLeft,
  onRotateRight,
  orderIndex,
  onRemove,
  onMoveLeft,
  onMoveRight,
  canMoveLeft = false,
  canMoveRight = false,
  showCheckbox = true,
  isDragging = false,
  isDropTarget = false,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  // Styles de bordure unifiés selon le protocole visuel
  let cardBorderClass =
    'bg-black/[0.01] dark:bg-white/[0.01] border-black/[0.08] dark:border-white/10 opacity-75 hover:opacity-100 hover:border-black/[0.18] dark:hover:border-white/25';

  if (isDropTarget) {
    cardBorderClass =
      'bg-white dark:bg-zinc-900 border-zinc-950 dark:border-white ring-2 ring-zinc-950/20 dark:ring-white/20 shadow-md scale-[1.02] opacity-100';
  } else if (isDragging) {
    cardBorderClass =
      'bg-black/[0.02] dark:bg-white/[0.02] border-dashed border-zinc-400 dark:border-zinc-600 ring-1 ring-zinc-400/20 opacity-30 scale-95';
  } else if (isOverlapping) {
    cardBorderClass =
      'bg-white dark:bg-zinc-900 border-blue-500 ring-2 ring-blue-500/25 dark:border-blue-400 dark:ring-blue-400/25 shadow-xs opacity-100';
  } else if (isSelected) {
    cardBorderClass =
      'bg-white dark:bg-zinc-900 border-zinc-950 dark:border-white ring-2 ring-zinc-950/10 dark:ring-white/20 shadow-xs opacity-100';
  } else if (isRotated) {
    cardBorderClass =
      'bg-white dark:bg-zinc-900 border-black/[0.18] dark:border-white/25 shadow-2xs opacity-100';
  }

  const hasRotationControls = Boolean(onRotateLeft || onRotateRight);
  const hasMovementControls = Boolean(onMoveLeft || onMoveRight);

  return (
    <button
      type="button"
      data-page-card={pageNumber}
      onClick={onCardClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative rounded-xl border transition-all duration-150 p-3 flex flex-col justify-between cursor-pointer select-none text-left w-full ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${cardBorderClass}`}
    >
      {/* En-tête de vignette : Page N + Badges & Contrôles */}
      <div className="flex items-center justify-between mb-2.5 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`text-xs font-mono font-bold truncate ${
              isDropTarget || isSelected
                ? 'text-[#FF6B35]'
                : isOverlapping
                ? 'text-blue-600 dark:text-blue-400'
                : isRotated
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Page {orderIndex !== undefined ? orderIndex : pageNumber}
          </span>
          {orderIndex !== undefined && orderIndex !== pageNumber && (
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
              (p.{pageNumber})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Badge de rotation si pivoté */}
          {isRotated && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] font-semibold border border-[#FF6B35]/20">
              +{rotationDeg}°
            </span>
          )}

          {/* Badge de tranche si spécifié (ex: Fichier 1, Fichiers 1 & 2) */}
          {trancheBadge && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-white font-semibold ${
                isOverlapping ? 'bg-blue-600' : 'bg-[#FF6B35]'
              }`}
            >
              {trancheBadge}
            </span>
          )}

          {/* Bouton de suppression directe si onRemove spécifié */}
          {onRemove && (
            <ActionTooltip label="Exclure cette page" side="top">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </span>
            </ActionTooltip>
          )}

          {/* Case à cocher carrée standardisée */}
          {showCheckbox && !onRemove && (
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                isSelected
                  ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
              }`}
            >
              {isSelected && <Check size={12} strokeWidth={3} />}
            </div>
          )}
        </div>
      </div>

      {/* Miniature réelle de proportion A4 ratio 1/1.414 */}
      <div className="w-full aspect-[1/1.414] bg-white dark:bg-zinc-800 rounded-lg border border-black/[0.05] dark:border-white/10 overflow-hidden flex items-center justify-center relative shadow-2xs p-1">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center"
          style={{
            transform: rotationDeg !== 0 ? `rotate(${rotationDeg}deg)` : undefined,
          }}
        >
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`Page ${pageNumber}`}
              className="w-full h-full object-contain pointer-events-none"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                P. {pageNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Commandes directes de rotation (si activées) */}
      {hasRotationControls && (
        <div
          className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionTooltip label="Pivoter 90° à gauche" side="top">
            <button
              type="button"
              onClick={onRotateLeft}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-90 transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
            </button>
          </ActionTooltip>

          <span className="text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
            {rotationDeg}°
          </span>

          <ActionTooltip label="Pivoter 90° à droite" side="top">
            <button
              type="button"
              onClick={onRotateRight}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-90 transition-all cursor-pointer"
            >
              <RotateCw size={13} />
            </button>
          </ActionTooltip>
        </div>
      )}

      {/* Commandes directes de réorganisation gauche/droite (si activées) */}
      {hasMovementControls && (
        <div
          className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionTooltip label="Déplacer vers la gauche" side="top">
            <button
              type="button"
              disabled={!canMoveLeft}
              onClick={onMoveLeft}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-90 transition-all cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
          </ActionTooltip>

          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            orig. p.{pageNumber}
          </span>

          <ActionTooltip label="Déplacer vers la droite" side="top">
            <button
              type="button"
              disabled={!canMoveRight}
              onClick={onMoveRight}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] active:scale-90 transition-all cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};
