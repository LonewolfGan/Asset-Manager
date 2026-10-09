import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  isWatermarkVisibleOnPage,
  calcWatermarkFontSize,
  type WatermarkPattern,
  type WatermarkPagesScope,
  type WatermarkAngle,
} from '@/lib/pdf-watermark-logic';

export interface PdfWatermarkLivePreviewProps {
  pagePreviewUrl: string | null;
  previewPage: number;
  totalPages: number | null;
  isLoadingPreview: boolean;
  text: string;
  fontSize: number;
  opacity: number;
  colorHex: string;
  angle: WatermarkAngle;
  pattern: WatermarkPattern;
  pagesScope: WatermarkPagesScope;
  isFr: boolean;
  tc: Record<string, any>;
  onPageChange: (newPage: number) => void;
}

export const PdfWatermarkLivePreview: React.FC<PdfWatermarkLivePreviewProps> = ({
  pagePreviewUrl,
  previewPage,
  totalPages,
  isLoadingPreview,
  text,
  fontSize,
  opacity,
  colorHex,
  angle,
  pattern,
  pagesScope,
  isFr,
  tc,
  onPageChange,
}) => {
  const isVisible = isWatermarkVisibleOnPage(pagesScope, previewPage);
  const displayText = text.trim() || (isFr ? 'FILIGRANE' : 'WATERMARK');
  const previewFontSize = calcWatermarkFontSize(fontSize, pattern);

  return (
    <div className="w-full max-w-[340px] flex flex-col items-center space-y-3">
      {/* En-tête de l'aperçu avec pagination du PDF */}
      <div className="flex items-center justify-between w-full text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {tc.livePreview ?? (isFr ? 'Aperçu réel' : 'Live preview')}
          </span>
          {totalPages && (
            <span className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[10px]">
              Page {previewPage} / {totalPages}
            </span>
          )}
        </div>

        {totalPages && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(previewPage - 1)}
              disabled={previewPage <= 1 || isLoadingPreview}
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label={isFr ? 'Page précédente' : 'Previous page'}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[11px] font-medium px-1">{previewPage}</span>
            <button
              type="button"
              onClick={() => onPageChange(previewPage + 1)}
              disabled={previewPage >= totalPages || isLoadingPreview}
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label={isFr ? 'Page suivante' : 'Next page'}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Conteneur de la feuille réelle */}
      <div className="w-full rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-black/[0.08] dark:ring-white/10 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] select-none">
        {/* Overlay de chargement */}
        {isLoadingPreview && (
          <div className="absolute inset-0 z-20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin text-[#FF6B35]" />
            <span className="text-[11px] font-mono text-zinc-500">
              {isFr ? 'Rendu de la page...' : 'Rendering page...'}
            </span>
          </div>
        )}

        {pagePreviewUrl ? (
          <div className="relative w-full">
            <img
              src={pagePreviewUrl}
              alt={`Page ${previewPage}`}
              className="w-full h-auto block object-contain"
            />

            {/* Filigrane interactif en temps réel */}
            {isVisible ? (
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {pattern === 'repeat' ? (
                  /* Motif répété sur toute la page (Grille continue) */
                  <div className="absolute -inset-8 flex flex-col justify-around pointer-events-none">
                    {[0, 1, 2, 3, 4].map((rowIdx) => (
                      <div
                        key={rowIdx}
                        className="flex justify-around items-center"
                        style={{
                          transform: `translateX(${rowIdx % 2 === 0 ? '-24px' : '24px'})`,
                        }}
                      >
                        {[0, 1, 2].map((colIdx) => (
                          <span
                            key={colIdx}
                            className="font-bold tracking-widest uppercase whitespace-nowrap"
                            style={{
                              transform: `rotate(${-angle}deg)`,
                              fontSize: `${previewFontSize}px`,
                              color: colorHex,
                              opacity,
                            }}
                          >
                            {displayText}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Filigrane central unique */
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <span
                      className="font-bold tracking-widest text-center whitespace-nowrap uppercase transition-all duration-150"
                      style={{
                        transform: `rotate(${-angle}deg)`,
                        fontSize: `${previewFontSize}px`,
                        color: colorHex,
                        opacity,
                      }}
                    >
                      {displayText}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Mention si filigrane non actif sur cette page */
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <div className="text-center px-3 py-2 rounded-lg bg-zinc-950/85 text-white backdrop-blur-sm shadow-lg pointer-events-auto">
                  <p className="text-[11px] font-mono font-semibold">Page {previewPage}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isFr ? 'Filigrane restreint à la première page' : 'Watermark restricted to first page'}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPageChange(1)}
                    className="mt-1.5 text-[10px] font-mono text-[#FF6B35] font-semibold hover:underline cursor-pointer block mx-auto"
                  >
                    {isFr ? 'Voir la page 1 →' : 'View page 1 →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Fallback wireframe */
          <div className="w-full aspect-[1/1.414] p-4 relative flex flex-col justify-between">
            <div className="space-y-2 opacity-25 px-2 my-auto">
              <div className="h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full w-2/5 mb-3" />
              <div className="h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full w-full" />
              <div className="h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full w-4/5" />
              <div className="h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Mention d'état portée */}
      {pagesScope === 'first' && (
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
          {previewPage === 1
            ? isFr
              ? 'Page 1 ciblée · Filigrane actif'
              : 'Page 1 targeted · Active watermark'
            : isFr
            ? `Page ${previewPage} protégée sans filigrane`
            : `Page ${previewPage} without watermark`}
        </p>
      )}
    </div>
  );
};
