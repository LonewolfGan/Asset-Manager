import React from 'react';
import { DocumentPageGrid } from '@workspace/ui';
import { PdfPageCard } from '@/components/conversion';
import { PageThumb, getOriginalPageNumber } from '@/lib/pdf-reorder-logic';

interface ReorderPdfContactSheetProps {
  isFr: boolean;
  pages: PageThumb[];
  isLoadingThumbs: boolean;
  loadingProgress: { current: number; total: number };
  loadingThumbsLabel: string;
  isSaving: boolean;
  dragIdx: number | null;
  dropIdx: number | null;
  setDragIdx: (idx: number | null) => void;
  setDropIdx: (idx: number | null) => void;
  onPageDrop: (targetIdx: number) => void;
  onRemovePage: (idx: number) => void;
  onMovePage: (fromIdx: number, toIdx: number) => void;
}

export const ReorderPdfContactSheet: React.FC<ReorderPdfContactSheetProps> = ({
  isFr,
  pages,
  isLoadingThumbs,
  loadingProgress,
  loadingThumbsLabel,
  isSaving,
  dragIdx,
  dropIdx,
  setDragIdx,
  setDropIdx,
  onPageDrop,
  onRemovePage,
  onMovePage,
}) => {
  const documentPages = pages.map((p, idx) => ({
    id: `reorder-${getOriginalPageNumber(p, idx)}-${idx}`,
    pageNumber: getOriginalPageNumber(p, idx),
    dataUrl: p.dataUrl,
    orderIndex: idx + 1,
  }));

  return (
    <DocumentPageGrid
      pages={documentPages}
      isLoading={isLoadingThumbs}
      loadingProgress={loadingProgress}
      loadingMessage={loadingThumbsLabel}
      isFr={isFr}
      className={isSaving ? 'opacity-40 pointer-events-none' : ''}
      headerSlot={
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold font-mono text-xs">
          {pages.length}{' '}
          {pages.length > 1
            ? isFr
              ? 'pages actives'
              : 'active pages'
            : isFr
            ? 'page active'
            : 'active page'}
        </span>
      }
      renderPageCard={(p, idx) => {
        const origPageNum = p.pageNumber;
        const isCurrentDrag = dragIdx === idx;
        const isCurrentDrop = dropIdx === idx;

        return (
          <PdfPageCard
            key={`reorder-page-${origPageNum}-${idx}`}
            pageNumber={origPageNum}
            orderIndex={idx + 1}
            dataUrl={p.dataUrl}
            draggable
            isDragging={isCurrentDrag}
            isDropTarget={isCurrentDrop}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => {
              e.preventDefault();
              setDropIdx(idx);
            }}
            onDrop={() => onPageDrop(idx)}
            onDragEnd={() => {
              setDragIdx(null);
              setDropIdx(null);
            }}
            onRemove={() => onRemovePage(idx)}
            onMoveLeft={() => onMovePage(idx, idx - 1)}
            onMoveRight={() => onMovePage(idx, idx + 1)}
            canMoveLeft={idx > 0}
            canMoveRight={idx < pages.length - 1}
            showCheckbox={false}
          />
        );
      }}
    />
  );
};
