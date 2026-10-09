import React from 'react';
import { DocumentPageGrid } from '@workspace/ui';
import { PdfPageCard } from '@/components/conversion/PdfPageCard';
import type { PageThumb } from '@/hooks/use-pdf-thumbnails';

export interface PdfRotatePageGridProps {
  pages: PageThumb[];
  pageRotations: Record<number, number>;
  selectedPages: number[];
  isLoadingThumbs: boolean;
  isFr: boolean;
  t: any;
  onToggleSelectPage: (pageNum: number) => void;
  onRotateSinglePage: (pageNum: number, delta: number) => void;
  onSelectAllPages: () => void;
  onClearSelection: () => void;
  onSelectOddPages: () => void;
  onSelectEvenPages: () => void;
}

export const PdfRotatePageGrid: React.FC<PdfRotatePageGridProps> = ({
  pages,
  pageRotations,
  selectedPages,
  isLoadingThumbs,
  isFr,
  t,
  onToggleSelectPage,
  onRotateSinglePage,
  onSelectAllPages,
  onClearSelection,
  onSelectOddPages,
  onSelectEvenPages,
}) => {
  const tc = t?.pdfRotate ?? {};

  const documentPages = pages.map((p, idx) => {
    const pageNum = (p as any).pageNumber ?? (p as any).pageNum ?? idx + 1;
    return {
      id: pageNum,
      pageNumber: pageNum,
      dataUrl: p.dataUrl,
      isSelected: selectedPages.includes(pageNum),
    };
  });

  return (
    <DocumentPageGrid
      pages={documentPages}
      selectedCount={selectedPages.length}
      isLoading={isLoadingThumbs}
      loadingMessage={
        tc.renderingPages ??
        (isFr
          ? 'Génération des planches du document...'
          : 'Rendering page thumbnails...')
      }
      isFr={isFr}
      onClearSelection={onClearSelection}
      onSelectAll={onSelectAllPages}
      onSelectOdd={onSelectOddPages}
      onSelectEven={onSelectEvenPages}
      renderPageCard={(p) => {
        const pageNum = p.pageNumber;
        const idx = pageNum - 1;
        const rotationDeg = pageRotations[idx] ?? 0;
        const isRotated = rotationDeg % 360 !== 0;
        const isSelected = selectedPages.includes(pageNum);

        return (
          <PdfPageCard
            key={`page-card-${pageNum}`}
            pageNumber={pageNum}
            dataUrl={p.dataUrl}
            isSelected={isSelected}
            isRotated={isRotated}
            rotationDeg={rotationDeg}
            onCardClick={() => onToggleSelectPage(pageNum)}
            onRotateLeft={() => onRotateSinglePage(pageNum, -90)}
            onRotateRight={() => onRotateSinglePage(pageNum, 90)}
          />
        );
      }}
    />
  );
};
