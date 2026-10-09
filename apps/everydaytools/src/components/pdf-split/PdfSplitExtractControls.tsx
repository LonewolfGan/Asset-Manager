import React from 'react';
import { FileText, Archive } from 'lucide-react';
import { PageRangeSelector } from '@workspace/ui/controls';
import { formatPagesToRangeString, parseRangeStringToPages } from '@/lib/pdf-split-logic';

export interface PdfSplitExtractControlsProps {
  totalPages: number;
  selectedPages: number[];
  extractRangeFrom: number;
  extractRangeTo: number;
  isEditingCustomSyntax: boolean;
  rawSyntaxText: string;
  extractAsSinglePdf: boolean;
  isFr: boolean;
  t: any;
  onRangeFromChange: (val: number | ((prev: number) => number)) => void;
  onRangeToChange: (val: number | ((prev: number) => number)) => void;
  onAddRange: () => void;
  onToggleSelectAll: () => void;
  onSelectOdd: () => void;
  onSelectEven: () => void;
  onClearSelection: () => void;
  onStartEditingSyntax: () => void;
  onStopEditingSyntax: () => void;
  onRawSyntaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExtractAsSinglePdfChange: (val: boolean) => void;
  onSelectedPagesChange?: (pages: number[]) => void;
}

export const PdfSplitExtractControls: React.FC<PdfSplitExtractControlsProps> = ({
  totalPages,
  selectedPages,
  extractAsSinglePdf,
  isFr,
  t,
  onRawSyntaxChange,
  onExtractAsSinglePdfChange,
  onSelectedPagesChange,
}) => {
  const currentRangeStr = formatPagesToRangeString(selectedPages);

  const handleRangeChange = (newVal: string) => {
    const pages = parseRangeStringToPages(newVal, totalPages);
    if (onSelectedPagesChange) {
      onSelectedPagesChange(pages);
    } else {
      onRawSyntaxChange({ target: { value: newVal } } as any);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/10 p-6 sm:p-8 flex flex-col gap-5">
      {/* LINE 1 : PageRangeSelector */}
      <PageRangeSelector
        value={currentRangeStr}
        onChange={handleRangeChange}
        totalPages={totalPages}
        label={isFr ? 'Sélectionner des pages à extraire' : 'Select pages to extract'}
        isFr={isFr}
      />

      {/* LINE 2 : Selected Pages Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[11px] font-medium">
            {isFr ? 'Pages retenues :' : 'Selected pages:'}
          </span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {selectedPages.length > 0
              ? `${formatPagesToRangeString(selectedPages)} (${selectedPages.length} page${selectedPages.length > 1 ? 's' : ''})`
              : isFr ? 'Aucune page sélectionnée' : 'No pages selected'}
          </span>
        </div>

        <span className="text-zinc-400 text-[11px]">
          {isFr ? 'Cliquez sur une page, ou glissez (lasso) pour encadrer' : 'Click a page, or drag (lasso) to select'}
        </span>
      </div>

      {/* LINE 3 : Output Format */}
      <div className="pt-3 border-t border-black/[0.06] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? 'Format du document de sortie :' : 'Output format:'}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {extractAsSinglePdf
              ? isFr
                ? 'Toutes les pages sélectionnées sont assemblées dans un seul document PDF final.'
                : 'All selected pages are merged into a single final PDF document.'
              : isFr
              ? 'Chaque page sélectionnée génère son propre fichier PDF dans une archive ZIP.'
              : 'Each selected page generates its own PDF file inside a ZIP archive.'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onExtractAsSinglePdfChange(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              extractAsSinglePdf
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText size={13} />
            <span>{isFr ? '1 PDF Unique' : '1 Single PDF'}</span>
          </button>
          <button
            type="button"
            onClick={() => onExtractAsSinglePdfChange(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              !extractAsSinglePdf
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Archive size={13} />
            <span>{isFr ? 'Pages Séparées (ZIP)' : 'Separate Pages (ZIP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
