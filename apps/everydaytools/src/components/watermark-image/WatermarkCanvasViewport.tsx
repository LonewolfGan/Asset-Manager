import React from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatermarkCanvasViewportProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  viewportContainerRef: React.RefObject<HTMLDivElement | null>;
  isHoldingOriginal: boolean;
  setIsHoldingOriginal: (holding: boolean) => void;
  error: string | null;
  isFr: boolean;
}

export function WatermarkCanvasViewport({
  canvasRef,
  viewportContainerRef,
  isHoldingOriginal,
  setIsHoldingOriginal,
  error,
  isFr,
}: WatermarkCanvasViewportProps) {
  return (
    <div className="lg:col-span-8 flex flex-col space-y-2">
      <div
        ref={viewportContainerRef}
        className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-2xl overflow-hidden bg-[#09090b] border border-zinc-200/80 dark:border-white/10 flex items-center justify-center p-4 select-none"
      >
        {/* Interactive Canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
        />

        {/* Pill Tactile Maintenir pour Comparer */}
        <div className="absolute top-3 right-3 z-20 pointer-events-auto">
          <button
            type="button"
            onMouseDown={() => setIsHoldingOriginal(true)}
            onMouseUp={() => setIsHoldingOriginal(false)}
            onTouchStart={() => setIsHoldingOriginal(true)}
            onTouchEnd={() => setIsHoldingOriginal(false)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all cursor-pointer select-none',
              isHoldingOriginal
                ? 'bg-[#FF6B35] text-white border-transparent shadow-md scale-[1.02]'
                : 'bg-black/70 text-white/90 border-white/20 hover:bg-black/85 active:scale-[0.98]'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {isHoldingOriginal
                ? isFr
                  ? 'Affichage sans filigrane'
                  : 'Viewing without watermark'
                : isFr
                  ? 'Maintenir pour masquer (Espace)'
                  : 'Hold to hide (Space)'}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full text-xs text-red-500 py-1 font-medium">{error}</div>
      )}
    </div>
  );
}
