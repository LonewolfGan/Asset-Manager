import React from 'react';
import { Barcode } from 'lucide-react';
import type { BarcodeValidationResult } from '@/lib/barcode-logic';
import type { BarcodeBackgroundMode } from '@/hooks/use-barcode-workflow';

interface BarcodeCanvasViewportProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  validation: BarcodeValidationResult;
  backgroundMode: BarcodeBackgroundMode;
  svgRef: React.RefObject<SVGSVGElement | null>;
  isFr: boolean;
}

export function BarcodeCanvasViewport({
  zoomLevel,
  onZoomChange,
  validation,
  backgroundMode,
  svgRef,
  isFr,
}: BarcodeCanvasViewportProps) {
  return (
    <div className="relative flex-1 min-h-[440px] sm:min-h-[500px] p-6 sm:p-12 flex flex-col items-center justify-center bg-zinc-100/40 dark:bg-zinc-900/40 overflow-auto">
      {/* Contrôles de Zoom (Flottant discret en haut à droite) */}
      <div className="absolute top-4 right-4 flex items-center gap-0.5 p-0.5 rounded-md border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 shadow-2xs z-10">
        {[100, 150, 200].map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => onZoomChange(z)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              zoomLevel === z
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-bold'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {z}%
          </button>
        ))}
      </div>

      {!validation.isValid ? (
        <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 max-w-sm">
          <Barcode className="w-12 h-12 stroke-[1.2] mb-3 opacity-25" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            {isFr ? "En attente d'un code valide" : 'Waiting for valid barcode data'}
          </p>
          <p className="text-xs text-zinc-500">{validation.message}</p>
        </div>
      ) : (
        /* La Carte Spécimen Physique avec Repères de Calage d'Imprimerie (+) */
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
          className={`relative p-8 sm:p-10 transition-transform duration-200 select-none ${
            backgroundMode === 'transparent'
              ? 'border border-dashed border-zinc-300 dark:border-zinc-700'
              : 'bg-white rounded-xl shadow-xs border border-zinc-200/80'
          }`}
        >
          {/* Repères d'angles suisses (+) */}
          <span className="absolute top-1.5 left-1.5 text-zinc-300 dark:text-zinc-600 font-mono text-[10px] leading-none pointer-events-none">
            +
          </span>
          <span className="absolute top-1.5 right-1.5 text-zinc-300 dark:text-zinc-600 font-mono text-[10px] leading-none pointer-events-none">
            +
          </span>
          <span className="absolute bottom-1.5 left-1.5 text-zinc-300 dark:text-zinc-600 font-mono text-[10px] leading-none pointer-events-none">
            +
          </span>
          <span className="absolute bottom-1.5 right-1.5 text-zinc-300 dark:text-zinc-600 font-mono text-[10px] leading-none pointer-events-none">
            +
          </span>

          {/* SVG du Code-barres */}
          <svg ref={svgRef} className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
}
