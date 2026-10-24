import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfMergeEngine, type PdfMergeMetadata } from '@/engine/engines/pdf-merge-engine';
import { usePdfMergeFiles } from '@/hooks/use-pdf-merge-reorder';
import type { MergeResultData } from '@/lib/pdf-merge-logic';
import {
  ConversionDropzone,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfMergeWorkbench, PdfMergeResultView } from '@/components/pdf-merge';
import { formatBytes } from '@/lib/utils';

const PDF_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document Adobe Acrobat',
};

export default function PdfMerge() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [outputFilename, setOutputFilename] = useState<string>(
    isFr ? 'document_fusionne.pdf' : 'merged_document.pdf'
  );

  const engine = useMemo(() => {
    return {
      ...pdfMergeEngine,
      execute: (inputFiles: File[], options?: any) =>
        pdfMergeEngine.execute(inputFiles, { filename: outputFilename, ...options }),
    };
  }, [outputFilename]);

  const {
    isProcessing,
    result: rawResult,
    error,
    handleExecute,
    handleReset,
    setError,
  } = useToolWorkflow<File[], Blob>({
    engine,
    toolSlug: 'pdf-merge',
    category: 'pdf',
    autoConsumeHandoff: false,
  });

  const filesState = usePdfMergeFiles({ isFr, setError });
  const { files, totalSize, handleFilesAdded } = filesState;

  const result: MergeResultData | null = useMemo(() => {
    if (!rawResult?.data) return null;
    const meta = rawResult.metadata as (PdfMergeMetadata | undefined);
    return {
      blob: rawResult.data,
      filename: rawResult.filename,
      sizeAfter: rawResult.data.size,
      sizeBefore: meta?.totalSize ?? totalSize,
      count: meta?.mergedCount ?? files.length,
    };
  }, [rawResult, totalSize, files.length]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFilesSelected: handleFilesAdded,
    accept: '.pdf,application/pdf',
  });

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFilesAdded([staged]);
    }
  }, [handleFilesAdded]);

  const handleResetAll = useCallback(() => {
    handleReset();
    filesState.resetFiles();
    setOutputFilename(isFr ? 'document_fusionne.pdf' : 'merged_document.pdf');
    setIsNextActionOpen(false);
  }, [handleReset, filesState, isFr]);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      setError(
        t.pdfMerge?.errorMin2 ??
          (isFr
            ? 'Veuillez ajouter au moins 2 fichiers PDF pour lancer la fusion.'
            : 'Please select at least 2 PDF files to merge.')
      );
      return false;
    }
    setError(null);
    const res = await handleExecute(files.map((item) => item.file));
    return Boolean(res);
  }, [files, handleExecute, isFr, setError, t.pdfMerge?.errorMin2]);

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Merge PDFs']}
      title={t.tools?.['pdf-merge']?.title ?? (isFr ? 'Fusionner des PDF' : 'Merge PDFs')}
      description={
        t.tools?.['pdf-merge']?.description ??
        (isFr
          ? 'Combinez plusieurs fichiers PDF en un seul document ordonné et optimisé.'
          : 'Combine multiple PDF files into one ordered, optimized document.')
      }
      seoSlug="pdf-merge"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesAdded(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />

          <AnimatePresence mode="wait">
            {files.length === 0 && !result && !isProcessing && (
              <div key="dropzone" className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={PDF_FORMAT}
                  title={t.tools?.['pdf-merge']?.title ?? (isFr ? 'Fusionner des documents PDF' : 'Merge PDF documents')}
                  description={
                    t.tools?.['pdf-merge']?.description ??
                    (isFr
                      ? 'Glissez-déposez plusieurs fichiers ici ou cliquez pour parcourir votre appareil.'
                      : 'Drag and drop multiple files here or click to browse.')
                  }
                  buttonLabel={isFr ? 'Sélectionner des fichiers PDF' : 'Select PDF files'}
                  multiple={true}
                  isDragging={isDragging}
                  onFilesSelected={handleFilesAdded}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {files.length > 0 && !result && !isProcessing && (
              <PdfMergeWorkbench
                key="workbench"
                files={files}
                format={PDF_FORMAT}
                totalSize={totalSize}
                outputFilename={outputFilename}
                viewMode={viewMode}
                draggedIndex={filesState.draggedIndex}
                dragOverIndex={filesState.dragOverIndex}
                isProcessing={isProcessing}
                isFr={isFr}
                t={t}
                fileInputRef={fileInputRef}
                onReset={handleResetAll}
                onMerge={handleMerge}
                onViewModeChange={setViewMode}
                onOutputFilenameChange={setOutputFilename}
                onMoveItem={filesState.moveItem}
                onRemoveFile={filesState.removeFile}
                onSortAZ={filesState.sortAZ}
                onReverseOrder={filesState.reverseOrder}
                onItemDragStart={filesState.handleItemDragStart}
                onItemDragOver={filesState.handleItemDragOver}
                onItemDragEnd={filesState.handleItemDragEnd}
                onItemDrop={filesState.handleItemDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {isProcessing && (
              <div key="processing" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={PDF_FORMAT.icon}
                  formatAlt="PDF"
                  stageLabel={isFr ? 'Reliure en cours' : 'Merging in progress'}
                  title={
                    isFr
                      ? `Assemblage de ${files.length} documents`
                      : `Merging ${files.length} documents`
                  }
                  detail={
                    isFr
                      ? `Poids total : ${formatBytes(totalSize)}`
                      : `Total size: ${formatBytes(totalSize)}`
                  }
                />
              </div>
            )}

            {result && !isProcessing && (
              <PdfMergeResultView
                key="result"
                result={result}
                formatIcon={PDF_FORMAT.icon}
                isFr={isFr}
                t={t}
                onReset={handleResetAll}
                onOpenNextAction={() => setIsNextActionOpen(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-merge"
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
