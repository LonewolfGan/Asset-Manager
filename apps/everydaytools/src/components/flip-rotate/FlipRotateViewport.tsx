import React from 'react';
import { RotateCw } from 'lucide-react';
import { StudioViewport } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { getTransformCss } from '@/lib/flip-rotate-logic';

interface FlipRotateViewportProps {
  previewUrl: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  isDraggingRotation: boolean;
  currentDims: { w: number; h: number; isSwapped: boolean } | null;
  isFr: boolean;
  onRotatePointerDown: (e: React.PointerEvent) => void;
  onRotatePointerMove: (e: React.PointerEvent) => void;
  onRotatePointerUp: (e: React.PointerEvent) => void;
}

export const FlipRotateViewport: React.FC<FlipRotateViewportProps> = ({
  previewUrl,
  imgRef,
  rotation,
  flipH,
  flipV,
  isDraggingRotation,
  currentDims,
  isFr,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
}) => {
  return (
    <StudioViewport
      minHeight="min-h-[560px] sm:min-h-[640px] lg:min-h-[720px]"
      className="p-8 sm:p-14"
    >
      {/* Conteneur avec transformation géométrique GPU fluide et poignée manuelle */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          style={{
            transform: getTransformCss(rotation, flipH, flipV),
            transition: isDraggingRotation
              ? 'none'
              : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
          className="relative inline-flex items-center justify-center select-none will-change-transform"
        >
          {/* Image affichée */}
          <img
            ref={imgRef}
            src={previewUrl}
            alt={isFr ? 'Prévisualisation' : 'Preview'}
            draggable={false}
            className={`${
              currentDims?.isSwapped
                ? 'max-w-[460px] sm:max-w-[540px] max-h-[620px] sm:max-h-[700px]'
                : 'max-w-full max-h-[500px] sm:max-h-[600px]'
            } object-contain rounded-lg shadow-md select-none pointer-events-none`}
          />

          {/* Poignée de rotation manuelle directe */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 group">
            <ActionTooltip
              label={
                isFr
                  ? 'Glisser pour faire pivoter manuellement (Maintenir Shift pour pas de 15°)'
                  : 'Drag to rotate manually (Hold Shift for 15° steps)'
              }
            >
              <div
                role="slider"
                aria-label={isFr ? 'Faire pivoter manuellement' : 'Rotate manually'}
                onPointerDown={onRotatePointerDown}
                onPointerMove={onRotatePointerMove}
                onPointerUp={onRotatePointerUp}
                onPointerCancel={onRotatePointerUp}
                className={`w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform touch-none select-none ${
                  isDraggingRotation
                    ? 'cursor-grabbing scale-110 ring-4 ring-zinc-900/15 dark:ring-zinc-100/20'
                    : ''
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 pointer-events-none" />
              </div>
            </ActionTooltip>
            <div className="w-0.5 h-5 bg-zinc-900/35 dark:bg-zinc-100/35" />
          </div>

          {/* Indicateur flottant d'angle lors du glisser-déposer */}
          {isDraggingRotation && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-xs font-semibold shadow-lg pointer-events-none z-40 whitespace-nowrap">
              {rotation > 0 ? `+${rotation}°` : `${rotation}°`}
            </div>
          )}
        </div>
      </div>
    </StudioViewport>
  );
};
