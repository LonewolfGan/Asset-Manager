import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import type { ConversionFormat } from '@/components/conversion';
import type { StagedFile } from '@/lib/pdf-merge-logic';
import {
  PdfMergeToolbar,
  PdfMergeGridView,
  PdfMergeListView,
} from '@/components/pdf-merge';

export interface PdfMergeWorkbenchProps {
  files: StagedFile[];
  format: ConversionFormat;
  totalSize: number;
  outputFilename: string;
  viewMode: 'grid' | 'list';
  draggedIndex: number | null;
  dragOverIndex: number | null;
  isProcessing: boolean;
  isFr: boolean;
  t: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onReset: () => void;
  onMerge: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onOutputFilenameChange: (name: string) => void;
  onMoveItem: (index: number, direction: 'prev' | 'next') => void;
  onRemoveFile: (id: string) => void;
  onSortAZ: () => void;
  onReverseOrder: () => void;
  onItemDragStart: (e: React.DragEvent, index: number) => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onItemDragEnd: () => void;
  onItemDrop: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e?: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const PdfMergeWorkbench: React.FC<PdfMergeWorkbenchProps> = ({
  files,
  format,
  totalSize,
  outputFilename,
  viewMode,
  draggedIndex,
  dragOverIndex,
  isProcessing,
  isFr,
  t,
  fileInputRef,
  onReset,
  onMerge,
  onViewModeChange,
  onOutputFilenameChange,
  onMoveItem,
  onRemoveFile,
  onSortAZ,
  onReverseOrder,
  onItemDragStart,
  onItemDragOver,
  onItemDragEnd,
  onItemDrop,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const filesCount = files.length;
  const canMerge = filesCount >= 2 && !isProcessing;

  const mergeActionLabel = filesCount < 2
    ? (isFr ? 'Fusionner (min. 2 docs)' : 'Merge (min. 2 docs)')
    : (t.pdfMerge?.mergeBtn?.(filesCount) ?? (isFr ? `Fusionner (${filesCount} documents)` : `Merge (${filesCount} files)`));

  const mergingLabel = t.pdfMerge?.mergingLabel ?? (isFr ? 'Fusion en cours...' : 'Merging...');

  return (
    <motion.div
      key="staging-workbench"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <StudioCommandBar
        meta={{
          name: isFr
            ? `${filesCount} document${filesCount > 1 ? 's' : ''}`
            : `${filesCount} document${filesCount > 1 ? 's' : ''}`,
          size: totalSize,
          icon: format.icon,
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Recommencer' : 'Reset'}
        primaryAction={{
          label: mergeActionLabel,
          loadingLabel: mergingLabel,
          onClick: onMerge,
          isDisabled: !canMerge,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <PdfMergeToolbar
        filesCount={filesCount}
        outputFilename={outputFilename}
        viewMode={viewMode}
        isFr={isFr}
        t={t}
        onViewModeChange={onViewModeChange}
        onOutputFilenameChange={onOutputFilenameChange}
        onAddMore={() => fileInputRef.current?.click()}
        onSortAZ={onSortAZ}
        onReverseOrder={onReverseOrder}
        onReset={onReset}
      />

      <div className="py-6">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5 px-1">
          <span>
            {isFr
              ? `Séquence de reliure (${files.length} document${files.length > 1 ? 's' : ''})`
              : `Merge sequence (${files.length} document${files.length > 1 ? 's' : ''})`}
          </span>
          <span className="text-[11px] normal-case font-normal text-zinc-400 dark:text-zinc-500">
            {t.pdfMerge?.dragTip ?? (isFr ? 'Glissez les éléments pour réordonner' : 'Drag items to reorder')}
          </span>
        </div>

        {viewMode === 'grid' ? (
          <PdfMergeGridView
            files={files}
            formatIcon={format.icon}
            totalSize={totalSize}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            isFr={isFr}
            t={t}
            onItemDragStart={onItemDragStart}
            onItemDragOver={onItemDragOver}
            onItemDragEnd={onItemDragEnd}
            onItemDrop={onItemDrop}
            onMoveItem={onMoveItem}
            onRemoveFile={onRemoveFile}
            onAddMore={() => fileInputRef.current?.click()}
          />
        ) : (
          <PdfMergeListView
            files={files}
            formatIcon={format.icon}
            totalSize={totalSize}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            isFr={isFr}
            onItemDragStart={onItemDragStart}
            onItemDragOver={onItemDragOver}
            onItemDragEnd={onItemDragEnd}
            onItemDrop={onItemDrop}
            onMoveItem={onMoveItem}
            onRemoveFile={onRemoveFile}
            onAddMore={() => fileInputRef.current?.click()}
          />
        )}
      </div>
    </motion.div>
  );
};
