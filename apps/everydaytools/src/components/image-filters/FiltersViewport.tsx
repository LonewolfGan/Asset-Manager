import React from 'react';
import { Eye } from 'lucide-react';
import { CompareReveal } from '@/components/ui/compare-reveal';
import { cn } from '@/lib/utils';

interface FiltersViewportProps {
  previewUrl: string;
  cssFilterString: string;
  viewMode: 'split' | 'direct';
  isHoldingOriginal: boolean;
  setIsHoldingOriginal: (holding: boolean) => void;
  error: string | null;
  isFr: boolean;
}

export function FiltersViewport({
  previewUrl,
  cssFilterString,
  viewMode,
  isHoldingOriginal,
  setIsHoldingOriginal,
  error,
  isFr,
}: FiltersViewportProps) {
  return (
    <div className="w-full space-y-2">
      <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] rounded-2xl overflow-hidden bg-[#09090b] border border-zinc-200/80 dark:border-white/10 flex items-center justify-center select-none">
        {viewMode === 'split' ? (
          <CompareReveal
            before={
              <img
                src={previewUrl}
                alt="Original"
                draggable={false}
                className="w-full h-full object-contain"
              />
            }
            after={
              <img
                src={previewUrl}
                alt="Filtré"
                draggable={false}
                style={{ filter: cssFilterString }}
                className="w-full h-full object-contain"
              />
            }
            labels={[isFr ? 'Original' : 'Original', isFr ? 'Étalonné' : 'Graded']}
            className="!aspect-auto h-full w-full border-none rounded-none bg-transparent"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={previewUrl}
              alt="Photo étalonnée"
              draggable={false}
              style={{
                filter: isHoldingOriginal ? 'none' : cssFilterString,
                transition: 'filter 120ms ease-out',
              }}
              className="max-h-full max-w-full object-contain select-none"
            />

            {/* Tactile Hold-to-Compare Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
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
                    : 'bg-black/60 text-white/90 border-white/20 hover:bg-black/80 active:scale-[0.98]'
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {isHoldingOriginal
                    ? isFr
                      ? "Affichage de l'original"
                      : 'Showing original'
                    : isFr
                      ? 'Maintenir pour comparer (Espace)'
                      : 'Hold to compare (Space)'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full text-xs text-red-500 py-1 font-medium">{error}</div>
      )}
    </div>
  );
}
