import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, RotateCw, Download } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { ConversionFormat } from '@/components/conversion';
import type { PageThumb } from '@/hooks/use-pdf-thumbnails';
import { PdfRotatePageGrid } from './PdfRotatePageGrid';

export interface PdfRotateWorkbenchProps {
  file: File;
  format: ConversionFormat;
  pages: PageThumb[];
  isLoadingThumbs: boolean;
  pageRotations: Record<number, number>;
  selectedPages: number[];
  modifiedPagesCount: number;
  isProcessing: boolean;
  isFr: boolean;
  t: any;
  onReset: () => void;
  onApplyRotation: () => void;
  onRotateSelectedPages: (delta: number) => void;
  onResetAllRotations: () => void;
  onSelectAllPages: () => void;
  onClearSelection: () => void;
  onSelectOddPages: () => void;
  onSelectEvenPages: () => void;
  onToggleSelectPage: (pageNum: number) => void;
  onRotateSinglePage: (pageNum: number, delta: number) => void;
}

export const PdfRotateWorkbench: React.FC<PdfRotateWorkbenchProps> = ({
  file,
  format,
  pages,
  isLoadingThumbs,
  pageRotations,
  selectedPages,
  modifiedPagesCount,
  isProcessing,
  isFr,
  t,
  onReset,
  onApplyRotation,
  onRotateSelectedPages,
  onResetAllRotations,
  onSelectAllPages,
  onClearSelection,
  onSelectOddPages,
  onSelectEvenPages,
  onToggleSelectPage,
  onRotateSinglePage,
}) => {
  const tc = t?.pdfRotate ?? {};
  const selectedPagesCount = selectedPages.length;

  return (
    <motion.div
      key="staging-rotate-workbench"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col space-y-6"
    >
      {/* 1. Barre de commande Studio transversale (@workspace/ui) */}
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, format.icon),
          pageCount: pages.length,
        }}
        onReset={onReset}
        resetLabel={tc.loadDifferent ?? (isFr ? 'Changer de document' : 'Change document')}
        isModified={modifiedPagesCount > 0}
        onResetChanges={onResetAllRotations}
        centerControls={
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/90 rounded-xl p-1 border border-black/[0.06] dark:border-white/10">
            <ActionTooltip
              label={
                selectedPagesCount > 0
                  ? isFr
                    ? `Pivoter les ${selectedPagesCount} pages sélectionnées de -90°`
                    : `Rotate ${selectedPagesCount} selected pages -90°`
                  : tc.rotateAllLeft ?? (isFr ? 'Pivoter toutes les pages de -90°' : 'Rotate all pages -90°')
              }
            >
              <button
                type="button"
                onClick={() => onRotateSelectedPages(-90)}
                className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>-90°</span>
              </button>
            </ActionTooltip>

            <ActionTooltip
              label={
                selectedPagesCount > 0
                  ? isFr
                    ? `Pivoter les ${selectedPagesCount} pages sélectionnées de +90°`
                    : `Rotate ${selectedPagesCount} selected pages +90°`
                  : tc.rotateAllRight ?? (isFr ? 'Pivoter toutes les pages de +90°' : 'Rotate all pages +90°')
              }
            >
              <button
                type="button"
                onClick={() => onRotateSelectedPages(90)}
                className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>+90°</span>
              </button>
            </ActionTooltip>

            <ActionTooltip
              label={
                selectedPagesCount > 0
                  ? isFr
                    ? `Pivoter les ${selectedPagesCount} pages sélectionnées de 180°`
                    : `Rotate ${selectedPagesCount} selected pages 180°`
                  : isFr
                  ? 'Pivoter toutes les pages de 180°'
                  : 'Rotate all pages 180°'
              }
            >
              <button
                type="button"
                onClick={() => onRotateSelectedPages(180)}
                className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>180°</span>
              </button>
            </ActionTooltip>
          </div>
        }
        primaryAction={{
          label:
            modifiedPagesCount > 0
              ? isFr
                ? `Enregistrer (${modifiedPagesCount} page${modifiedPagesCount > 1 ? 's' : ''})`
                : `Save (${modifiedPagesCount} page${modifiedPagesCount > 1 ? 's' : ''})`
              : isFr
              ? 'Pivoter tout (+90°)'
              : 'Rotate all (+90°)',
          loadingLabel: tc.rotating ?? (isFr ? 'Enregistrement...' : 'Saving...'),
          onClick: onApplyRotation,
          isLoading: isProcessing,
          icon: Download,
        }}
      />

      {/* 2. Grille de vignettes de pages PDF */}
      <PdfRotatePageGrid
        pages={pages}
        pageRotations={pageRotations}
        selectedPages={selectedPages}
        isLoadingThumbs={isLoadingThumbs}
        isFr={isFr}
        t={t}
        onToggleSelectPage={onToggleSelectPage}
        onRotateSinglePage={onRotateSinglePage}
        onSelectAllPages={onSelectAllPages}
        onClearSelection={onClearSelection}
        onSelectOddPages={onSelectOddPages}
        onSelectEvenPages={onSelectEvenPages}
      />
    </motion.div>
  );
};
