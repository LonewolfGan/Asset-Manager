import React from 'react';
import { DocumentPageGrid } from '@workspace/ui';
import { PdfPageCard } from '@/components/conversion/PdfPageCard';
import type { PageThumb } from '@/hooks/use-pdf-thumbnails';

export interface PdfSplitPageGridProps {
  pages: PageThumb[];
  selectedPages: number[];
  isLoadingThumbs: boolean;
  activeMode: 'extract' | 'split';
  isFr: boolean;
  getPageTrancheIndices: (pageNum: number) => number[];
  onPageCardClick: (pageNum: number, e: React.MouseEvent) => void;
  contactSheetRef: React.RefObject<HTMLDivElement | null>;
  onPointerDownCanvas: (e: React.PointerEvent) => void;
}

export const PdfSplitPageGrid: React.FC<PdfSplitPageGridProps> = ({
  pages,
  selectedPages,
  isLoadingThumbs,
  activeMode,
  isFr,
  getPageTrancheIndices,
  onPageCardClick,
  contactSheetRef,
  onPointerDownCanvas,
}) => {
  const documentPages = pages.map((p, idx) => {
    const pageNum = (p as any).pageNumber ?? (p as any).pageNum ?? idx + 1;
    return {
      id: pageNum,
      pageNumber: pageNum,
      dataUrl: p.dataUrl,
      isSelected: selectedPages.includes(pageNum),
    };
  });

  const modeHint =
    activeMode === 'extract'
      ? isFr
        ? 'Aperçu du document : Cliquez ou encadrez pour ajuster la sélection'
        : 'Document preview: Click or drag to adjust selection'
      : isFr
      ? 'Aperçu des découpes : Les badges et bordures indiquent les fichiers générés'
      : 'Split preview: Badges and borders indicate generated files';

  return (
    <DocumentPageGrid
      pages={documentPages}
      isLoading={isLoadingThumbs}
      loadingMessage={
        isFr
          ? 'Génération des planches du document...'
          : 'Rendering page thumbnails...'
      }
      isFr={isFr}
      gridRef={contactSheetRef}
      onPointerDownGrid={onPointerDownCanvas}
      headerSlot={
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-mono">
            {modeHint}
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-xs font-mono">
            {isFr
              ? `${pages.length} pages au total`
              : `${pages.length} total pages`}
          </span>
        </div>
      }
      renderPageCard={(p) => {
        const pageNum = p.pageNumber;
        const isSelected = selectedPages.includes(pageNum);
        const trancheIndices = getPageTrancheIndices(pageNum);
        const isOverlapping =
          activeMode === 'split' && trancheIndices.length > 1;

        const trancheBadge =
          activeMode === 'split' && trancheIndices.length > 0
            ? isOverlapping
              ? isFr
                ? `Fichiers ${trancheIndices.join(' & ')}`
                : `Files ${trancheIndices.join(' & ')}`
              : isFr
              ? `Fichier ${trancheIndices[0]}`
              : `File ${trancheIndices[0]}`
            : undefined;

        return (
          <PdfPageCard
            key={`page-card-${pageNum}`}
            pageNumber={pageNum}
            dataUrl={p.dataUrl}
            isSelected={
              activeMode === 'extract' ? isSelected : trancheIndices.length > 0
            }
            isOverlapping={isOverlapping}
            trancheBadge={trancheBadge}
            onCardClick={(e) => onPageCardClick(pageNum, e)}
          />
        );
      }}
    />
  );
};
