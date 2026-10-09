import React from 'react';
import { Loader2 } from 'lucide-react';
import type { DocumentPageGridProps } from './types';

export const DocumentPageGrid: React.FC<DocumentPageGridProps> = ({
  pages,
  selectedCount = 0,
  isLoading = false,
  loadingMessage,
  loadingProgress,
  isFr = false,
  emptyMessage,
  onSelectAll,
  onClearSelection,
  onSelectOdd,
  onSelectEven,
  headerSlot,
  renderPageCard,
  className = '',
  gridRef,
  onPointerDownGrid,
}) => {
  const hasSelection = selectedCount > 0;
  const defaultLoadingMsg = isFr
    ? 'Génération des planches du document...'
    : 'Rendering page thumbnails...';
  const defaultEmptyMsg = isFr
    ? 'Aucune page disponible'
    : 'No pages available';

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/10 p-6 sm:p-8 mt-6 shadow-xs ${className}`}
    >
      {/* Barre supérieure : Compteurs, filtres de sélection et slots */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.05] dark:border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="text-zinc-500 dark:text-zinc-400">
            {hasSelection ? (
              <span className="text-[#FF6B35] font-semibold">
                {isFr
                  ? `${selectedCount} page${selectedCount > 1 ? 's' : ''} sélectionnée${selectedCount > 1 ? 's' : ''}`
                  : `${selectedCount} page${selectedCount > 1 ? 's' : ''} selected`}
              </span>
            ) : (
              <span>
                {isFr
                  ? `Toutes les pages (${pages.length})`
                  : `All pages (${pages.length})`}
              </span>
            )}
          </span>

          {hasSelection && onClearSelection && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <button
                type="button"
                data-testid="page-grid-clear-selection"
                onClick={onClearSelection}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors underline cursor-pointer"
              >
                {isFr ? 'Tout désélectionner' : 'Clear selection'}
              </button>
            </>
          )}
        </div>

        {/* Contrôles et raccourcis de sélection */}
        <div className="flex items-center gap-3">
          {(onSelectAll || onSelectOdd || onSelectEven) && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-400 dark:text-zinc-500">
                {isFr ? 'Sélection :' : 'Select:'}
              </span>
              {onSelectAll && (
                <button
                  type="button"
                  data-testid="page-grid-select-all"
                  onClick={onSelectAll}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors underline-offset-4 hover:underline cursor-pointer"
                >
                  {isFr ? 'Tout' : 'All'}
                </button>
              )}
              {onSelectOdd && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <button
                    type="button"
                    data-testid="page-grid-select-odd"
                    onClick={onSelectOdd}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors underline-offset-4 hover:underline cursor-pointer"
                  >
                    {isFr ? 'Impaires' : 'Odd'}
                  </button>
                </>
              )}
              {onSelectEven && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <button
                    type="button"
                    data-testid="page-grid-select-even"
                    onClick={onSelectEven}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors underline-offset-4 hover:underline cursor-pointer"
                  >
                    {isFr ? 'Paires' : 'Even'}
                  </button>
                </>
              )}
            </div>
          )}

          {headerSlot && (
            <div className="flex items-center gap-2 pl-2 border-l border-black/[0.05] dark:border-white/10">
              {headerSlot}
            </div>
          )}
        </div>
      </div>

      {/* Corps de la planche */}
      <div
        ref={gridRef}
        onPointerDown={onPointerDownGrid}
        data-testid="page-grid-canvas"
        className="pt-6 relative select-none"
      >
        {isLoading && pages.length === 0 ? (
          <div
            data-testid="page-grid-loading"
            className="py-20 flex flex-col items-center justify-center text-center"
          >
            <Loader2 size={24} className="animate-spin text-[#FF6B35] mb-3" />
            <span className="text-xs font-mono text-zinc-500">
              {loadingMessage || defaultLoadingMsg}
            </span>
            {loadingProgress && loadingProgress.total > 0 && (
              <span className="text-xs font-mono text-zinc-400 mt-1">
                Page {loadingProgress.current} / {loadingProgress.total}
              </span>
            )}
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-xs font-mono">
            {emptyMessage || defaultEmptyMsg}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pages.map((page, index) =>
              renderPageCard ? (
                renderPageCard(page, index)
              ) : (
                <div
                  key={page.id ?? `page-${index}`}
                  className="rounded-xl border border-zinc-200 dark:border-white/10 p-3 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center min-h-[140px]"
                >
                  <span className="text-xs font-mono text-zinc-500">
                    Page {page.pageNumber}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
