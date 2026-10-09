import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { PdfNumberPosition } from '@/lib/pdf-page-numbers-logic';

export interface PdfPageNumbersLivePreviewProps {
  pagePreviewUrl: string | null;
  previewPage: number;
  totalPages: number | null;
  isLoadingPreview: boolean;
  position: PdfNumberPosition;
  fontSize: number;
  skipFirst: boolean;
  isFr: boolean;
  onPageChange: (newPage: number) => void;
  stampLabel: string | null;
}

export const PdfPageNumbersLivePreview: React.FC<PdfPageNumbersLivePreviewProps> = ({
  pagePreviewUrl,
  previewPage,
  totalPages,
  isLoadingPreview,
  position,
  fontSize,
  skipFirst,
  isFr,
  onPageChange,
  stampLabel,
}) => {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center space-y-3">
      {/* En-tête de l'aperçu avec pagination du PDF */}
      <div className="flex items-center justify-between w-full text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? 'Aperçu réel' : 'Live preview'}
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

            {/* Tampon de pagination interactif en temps réel */}
            <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between">
              {/* Rangée supérieure */}
              <div className="flex justify-between items-center min-h-[22px]">
                <div className="w-1/3 flex justify-start">
                  {position === 'top-left' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
                <div className="w-1/3 flex justify-center">
                  {position === 'top-center' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
                <div className="w-1/3 flex justify-end">
                  {position === 'top-right' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Message si page 1 exclue */}
              {skipFirst && previewPage === 1 && (
                <div className="my-auto mx-auto max-w-[200px] text-center px-3 py-2 rounded-lg bg-zinc-950/85 text-white backdrop-blur-sm pointer-events-auto shadow-lg">
                  <p className="text-[11px] font-mono font-semibold">
                    {isFr ? 'Couverture exclue' : 'Cover excluded'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isFr ? 'Aucun numéro apposé' : 'No number stamped'}
                  </p>
                  {totalPages && totalPages > 1 && (
                    <button
                      type="button"
                      onClick={() => onPageChange(2)}
                      className="mt-1.5 text-[10px] font-mono text-[#FF6B35] font-semibold hover:underline cursor-pointer block mx-auto"
                    >
                      {isFr ? 'Voir la page 2 →' : 'View page 2 →'}
                    </button>
                  )}
                </div>
              )}

              {/* Rangée inférieure */}
              <div className="flex justify-between items-center min-h-[22px]">
                <div className="w-1/3 flex justify-start">
                  {position === 'bottom-left' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
                <div className="w-1/3 flex justify-center">
                  {position === 'bottom-center' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
                <div className="w-1/3 flex justify-end">
                  {position === 'bottom-right' && stampLabel && (
                    <span
                      style={{ fontSize: `${Math.max(9, Math.min(16, fontSize))}px` }}
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-semibold text-zinc-950 dark:text-zinc-50 bg-white/95 dark:bg-zinc-900/95 ring-1.5 ring-zinc-950 dark:ring-white shadow-md backdrop-blur-sm transition-all"
                    >
                      {stampLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Fallback géométrique si en cours de chargement initial */
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

      {/* Mention d'état couverture */}
      {skipFirst && previewPage !== 1 && (
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
          {isFr
            ? `Page 1 exclue · Aperçu de la page ${previewPage}`
            : `Page 1 excluded · Preview of page ${previewPage}`}
        </p>
      )}
    </div>
  );
};
