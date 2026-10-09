import React from 'react';
import { Scissors, Layers, Download } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { cn } from '@/lib/utils';
import type { ConversionFormat } from '@/components/conversion';
import type { PageThumb } from '@/hooks/use-pdf-thumbnails';
import {
  selectOddPages,
  selectEvenPages,
  generateBatchSlices,
  parseRangeStringToPages,
} from '@/lib/pdf-split-logic';
import {
  PdfSplitExtractControls,
  PdfSplitTrancheControls,
  PdfSplitPageGrid,
} from '@/components/pdf-split';

export interface PdfSplitWorkbenchProps {
  file: File;
  format: ConversionFormat;
  pages: PageThumb[];
  isLoadingThumbs: boolean;
  activeMode: 'extract' | 'split';
  selectedPages: number[];
  extractRangeFrom: number;
  extractRangeTo: number;
  isEditingCustomSyntax: boolean;
  rawSyntaxText: string;
  extractAsSinglePdf: boolean;
  tranches: any[];
  batchChunkSize: number;
  splitViewMode: 'list' | 'pages';
  overlappingTranchesInfo: any;
  error: string | null;
  isProcessing: boolean;
  canConvert: boolean;
  isFr: boolean;
  t: any;
  contactSheetRef: React.RefObject<HTMLDivElement | null>;
  onReset: () => void;
  onModeChange: (mode: 'extract' | 'split') => void;
  onConvert: () => void;
  onRangeFromChange: (val: number | ((prev: number) => number)) => void;
  onRangeToChange: (val: number | ((prev: number) => number)) => void;
  onAddRange: () => void;
  setSelectedPages: React.Dispatch<React.SetStateAction<number[]>>;
  setIsEditingCustomSyntax: (val: boolean) => void;
  setRawSyntaxText: (val: string) => void;
  setExtractAsSinglePdf: (val: boolean) => void;
  setSplitViewMode: (mode: 'list' | 'pages') => void;
  setBatchChunkSize: React.Dispatch<React.SetStateAction<number>>;
  setTranches: React.Dispatch<React.SetStateAction<any[]>>;
  getPageTrancheIndices: (pageNum: number) => number[];
  onPageCardClick: (pageNum: number, e: React.MouseEvent) => void;
}

export const PdfSplitWorkbench: React.FC<PdfSplitWorkbenchProps> = ({
  file,
  format,
  pages,
  isLoadingThumbs,
  activeMode,
  selectedPages,
  extractRangeFrom,
  extractRangeTo,
  isEditingCustomSyntax,
  rawSyntaxText,
  extractAsSinglePdf,
  tranches,
  batchChunkSize,
  splitViewMode,
  overlappingTranchesInfo,
  error,
  isProcessing,
  canConvert,
  isFr,
  t,
  contactSheetRef,
  onReset,
  onModeChange,
  onConvert,
  onRangeFromChange,
  onRangeToChange,
  onAddRange,
  setSelectedPages,
  setIsEditingCustomSyntax,
  setRawSyntaxText,
  setExtractAsSinglePdf,
  setSplitViewMode,
  setBatchChunkSize,
  setTranches,
  getPageTrancheIndices,
  onPageCardClick,
}) => {
  const primaryActionLabel = activeMode === 'extract'
    ? (t.pdfSplit?.extractAction ?? (isFr ? 'Extraire la sélection' : 'Extract selection'))
    : (t.pdfSplit?.splitAction ?? (isFr ? 'Découper le PDF' : 'Split PDF'));

  const loadingLabel = t.pdfSplit?.splitting ?? (isFr ? 'Traitement...' : 'Processing...');

  return (
    <div key="workbench" className="w-full py-4 sm:py-8 flex flex-col">
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, format.icon),
          pageCount: pages.length,
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        centerControls={
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-200/60 dark:border-white/5">
            <button
              type="button"
              onClick={() => onModeChange('extract')}
              className={cn(
                'h-7 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]',
                activeMode === 'extract'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              )}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{t.pdfSplit?.modeExtractTitle ?? (isFr ? 'Extraire des pages' : 'Extract pages')}</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('split')}
              className={cn(
                'h-7 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]',
                activeMode === 'split'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.pdfSplit?.modeRangeTitle ?? (isFr ? 'Découper en tranches' : 'Split by ranges')}</span>
            </button>
          </div>
        }
        primaryAction={{
          label: primaryActionLabel,
          loadingLabel: loadingLabel,
          onClick: onConvert,
          isDisabled: !canConvert || isProcessing,
          isLoading: isProcessing,
          icon: Download,
        }}
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-mono">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {activeMode === 'extract' ? (
          <PdfSplitExtractControls
            totalPages={pages.length}
            selectedPages={selectedPages}
            extractRangeFrom={extractRangeFrom}
            extractRangeTo={extractRangeTo}
            isEditingCustomSyntax={isEditingCustomSyntax}
            rawSyntaxText={rawSyntaxText}
            extractAsSinglePdf={extractAsSinglePdf}
            isFr={isFr}
            t={t}
            onRangeFromChange={onRangeFromChange}
            onRangeToChange={onRangeToChange}
            onAddRange={onAddRange}
            onToggleSelectAll={() =>
              setSelectedPages(selectedPages.length === pages.length ? [] : pages.map((p) => p.pageNumber))
            }
            onSelectOdd={() => setSelectedPages(selectOddPages(pages.length))}
            onSelectEven={() => setSelectedPages(selectEvenPages(pages.length))}
            onClearSelection={() => setSelectedPages([])}
            onStartEditingSyntax={() => setIsEditingCustomSyntax(true)}
            onStopEditingSyntax={() => setIsEditingCustomSyntax(false)}
            onRawSyntaxChange={(e) => {
              setRawSyntaxText(e.target.value);
              setSelectedPages(parseRangeStringToPages(e.target.value, pages.length));
            }}
            onExtractAsSinglePdfChange={setExtractAsSinglePdf}
            onSelectedPagesChange={setSelectedPages}
          />
        ) : (
          <PdfSplitTrancheControls
            totalPages={pages.length}
            tranches={tranches}
            splitViewMode={splitViewMode}
            batchChunkSize={batchChunkSize}
            overlappingTranchesInfo={overlappingTranchesInfo}
            isFr={isFr}
            t={t}
            onSplitViewModeChange={setSplitViewMode}
            onBatchChunkSizeChange={setBatchChunkSize}
            onGenerateBatchSlices={() => setTranches(generateBatchSlices(pages.length, batchChunkSize))}
            onAddTranche={() =>
              setTranches((prev) => [
                ...prev,
                {
                  id: `tranche-${Date.now()}`,
                  from: prev.length > 0 ? Math.min(pages.length, prev[prev.length - 1].to + 1) : 1,
                  to: pages.length,
                },
              ])
            }
            onUpdateTranche={(id, field, val) =>
              setTranches((prev) =>
                prev.map((tr) => (tr.id === id ? { ...tr, [field]: Math.max(1, Math.min(pages.length, val)) } : tr))
              )
            }
            onRemoveTranche={(id) => setTranches((prev) => prev.filter((tr) => tr.id !== id))}
          />
        )}

        {(activeMode === 'extract' || (activeMode === 'split' && splitViewMode === 'pages')) && (
          <PdfSplitPageGrid
            pages={pages}
            selectedPages={selectedPages}
            isLoadingThumbs={isLoadingThumbs}
            activeMode={activeMode}
            isFr={isFr}
            getPageTrancheIndices={getPageTrancheIndices}
            onPageCardClick={onPageCardClick}
            contactSheetRef={contactSheetRef}
            onPointerDownCanvas={() => {}}
          />
        )}
      </div>
    </div>
  );
};
