import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Undo2, Download } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { PdfReorderWorkflow } from '@/hooks/use-pdf-reorder-workflow';
import { ReorderPdfContactSheet } from './ReorderPdfContactSheet';

interface ReorderPdfWorkbenchProps {
  isFr: boolean;
  sourceFormatIcon: string;
  workflow: PdfReorderWorkflow;
  labels: {
    reverseOrder: string;
    resetOrder: string;
    saving: string;
    savePdf: string;
    loadingThumbs: string;
  };
}

export const ReorderPdfWorkbench: React.FC<ReorderPdfWorkbenchProps> = ({
  isFr,
  sourceFormatIcon,
  workflow,
  labels,
}) => {
  const {
    file,
    pages,
    originalPages,
    isLoadingThumbs,
    loadingProgress,
    isSaving,
    isOrderModified,
    dragIdx,
    dropIdx,
    setDragIdx,
    setDropIdx,
    handleReset,
    reversePages,
    resetOrder,
    handleSave,
    handlePageDrop,
    removePage,
    movePage,
  } = workflow;

  if (!file) return null;

  return (
    <motion.div
      key="staging-reorder-workbench"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, sourceFormatIcon),
          pageCount: pages.length,
        }}
        onReset={handleReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        isModified={isOrderModified}
        onResetChanges={resetOrder}
        centerControls={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={reversePages}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{labels.reverseOrder || (isFr ? "Inverser l'ordre" : 'Reverse order')}</span>
            </button>
            {isOrderModified && (
              <button
                type="button"
                onClick={resetOrder}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>{labels.resetOrder || (isFr ? 'Ordre initial' : 'Original order')}</span>
              </button>
            )}
          </div>
        }
        primaryAction={{
          label: labels.savePdf || (isFr ? 'Enregistrer le PDF' : 'Save PDF'),
          loadingLabel: labels.saving,
          onClick: handleSave,
          isDisabled: isSaving || pages.length === 0,
          isLoading: isSaving,
          icon: Download,
        }}
      />

      <ReorderPdfContactSheet
        isFr={isFr}
        pages={pages}
        isLoadingThumbs={isLoadingThumbs}
        loadingProgress={loadingProgress}
        loadingThumbsLabel={labels.loadingThumbs}
        isSaving={isSaving}
        dragIdx={dragIdx}
        dropIdx={dropIdx}
        setDragIdx={setDragIdx}
        setDropIdx={setDropIdx}
        onPageDrop={handlePageDrop}
        onRemovePage={removePage}
        onMovePage={movePage}
      />
    </motion.div>
  );
};
