import React from 'react';
import { ZoomIn, Loader2 } from 'lucide-react';
import type { LoupePosition } from '@/hooks/use-image-upscale-loupe';
import type { UpscaleDimensions } from '@/lib/image-upscale-logic';

export interface ImageUpscaleStageProps {
  previewUrl: string | null;
  stageImageRef: React.RefObject<HTMLImageElement | null>;
  isLoupeActive: boolean;
  loupePos: LoupePosition | null;
  onToggleLoupe: () => void;
  sharpen: boolean;
  onSharpenChange: (checked: boolean) => void;
  isProcessing: boolean;
  scale: 2 | 4;
  targetDims: UpscaleDimensions;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  isFr: boolean;
}

export function ImageUpscaleStage({
  previewUrl,
  stageImageRef,
  isLoupeActive,
  loupePos,
  onToggleLoupe,
  sharpen,
  onSharpenChange,
  isProcessing,
  scale,
  targetDims,
  onPointerMove,
  onPointerLeave,
  isFr,
}: ImageUpscaleStageProps) {
  return (
    <div
      className="relative w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-[#f8f9fa] dark:bg-[#101012] overflow-hidden flex flex-col items-center justify-center min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] select-none p-6 sm:p-10"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Barre d'outils supérieure de l'atelier visuel */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Commande de Loupe */}
        <button
          type="button"
          onClick={onToggleLoupe}
          className={`pointer-events-auto h-9 px-3.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
            isLoupeActive
              ? 'bg-[#FF6B35] text-white'
              : 'bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800'
          }`}
        >
          <ZoomIn size={15} />
          <span>
            {isLoupeActive
              ? isFr
                ? 'Désactiver la loupe'
                : 'Disable magnifier'
              : isFr
                ? 'Loupe de détail'
                : 'Detail magnifier'}
          </span>
        </button>

        {/* Option Améliorer les contours */}
        <label className="pointer-events-auto h-9 px-3.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 flex items-center gap-2.5 cursor-pointer select-none transition-all shadow-xs text-sm font-medium">
          <input
            type="checkbox"
            checked={sharpen}
            onChange={(e) => onSharpenChange(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-0 w-4 h-4 cursor-pointer accent-[#FF6B35]"
          />
          <span>{isFr ? 'Améliorer les contours' : 'Enhance edges'}</span>
        </label>
      </div>

      {/* Image Source dans son espace de travail plein format */}
      <div className="relative my-auto flex items-center justify-center">
        {previewUrl && (
          <img
            ref={stageImageRef}
            src={previewUrl}
            alt="Aperçu Source"
            className="max-h-[560px] sm:max-h-[640px] w-auto max-w-full object-contain rounded-lg drop-shadow-sm select-none"
          />
        )}

        {/* Loupe optique de grossissement */}
        {isLoupeActive && loupePos && previewUrl && (
          <div
            className="fixed pointer-events-none z-50 w-40 h-40 rounded-full border-2 border-white dark:border-zinc-200 shadow-2xl overflow-hidden bg-black"
            style={{
              left: loupePos.x - 80,
              top: loupePos.y - 80,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${previewUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${stageImageRef.current ? stageImageRef.current.clientWidth * 2.5 : 400}px ${
                  stageImageRef.current ? stageImageRef.current.clientHeight * 2.5 : 400
                }px`,
                backgroundPosition: `${-(loupePos.relX * (stageImageRef.current ? stageImageRef.current.clientWidth * 2.5 : 400) - 80)}px ${-(
                  loupePos.relY * (stageImageRef.current ? stageImageRef.current.clientHeight * 2.5 : 400) -
                  80
                )}px`,
                imageRendering: 'pixelated',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-3 h-px bg-white" />
              <div className="h-3 w-px bg-white absolute" />
            </div>
          </div>
        )}

        {/* Overlay de traitement */}
        {isProcessing && (
          <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-white gap-3 z-30 p-6">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-zinc-100">
                {isFr
                  ? `Agrandissement en ${scale}x en cours...`
                  : `Upscaling to ${scale}x in progress...`}
              </p>
              <p className="text-sm text-zinc-400">
                {isFr
                  ? `Génération en ${targetDims.targetW} × ${targetDims.targetH} px`
                  : `Generating at ${targetDims.targetW} × ${targetDims.targetH} px`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
