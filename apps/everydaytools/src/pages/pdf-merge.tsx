import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import { usePdfMergeWorkflow } from '@/hooks/use-pdf-merge-workflow';
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

  const workflow = usePdfMergeWorkflow(
    isFr,
    t.pdfMerge?.errorMin2 ??
      (isFr
        ? 'Veuillez ajouter au moins 2 fichiers PDF pour lancer la fusion.'
        : 'Please select at least 2 PDF files to merge.')
  );

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFilesSelected: workflow.handleFilesAdded,
    accept: '.pdf,application/pdf',
  });

  // Auto-consume handoff file if transferred from another tool
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      workflow.handleFilesAdded([staged]);
    }
  }, [workflow.handleFilesAdded]);

  // Keyboard shortcut Esc to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && workflow.files.length > 0 && !workflow.isProcessing && !workflow.result) {
        workflow.resetWorkflow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workflow.files.length, workflow.isProcessing, workflow.result, workflow.resetWorkflow]);

  const handleResetAll = useCallback(() => {
    workflow.resetWorkflow();
    setIsNextActionOpen(false);
  }, [workflow]);

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
          {/* Error Banner */}
          <AnimatePresence>
            {workflow.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{workflow.error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => workflow.setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden input for adding more files */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                workflow.handleFilesAdded(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />

          <AnimatePresence mode="wait">
            {/* Scène 1 : Dépôt initial */}
            {workflow.files.length === 0 && !workflow.result && !workflow.isProcessing && (
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
                  onFilesSelected={workflow.handleFilesAdded}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* Scène 2 : L'atelier d'assemblage */}
            {workflow.files.length > 0 && !workflow.result && !workflow.isProcessing && (
              <PdfMergeWorkbench
                key="workbench"
                files={workflow.files}
                format={PDF_FORMAT}
                totalSize={workflow.totalSize}
                outputFilename={workflow.outputFilename}
                viewMode={workflow.viewMode}
                draggedIndex={workflow.draggedIndex}
                dragOverIndex={workflow.dragOverIndex}
                isProcessing={workflow.isProcessing}
                isFr={isFr}
                t={t}
                fileInputRef={fileInputRef}
                onReset={handleResetAll}
                onMerge={workflow.handleMerge}
                onViewModeChange={workflow.setViewMode}
                onOutputFilenameChange={workflow.setOutputFilename}
                onMoveItem={workflow.moveItem}
                onRemoveFile={workflow.removeFile}
                onSortAZ={workflow.sortAZ}
                onReverseOrder={workflow.reverseOrder}
                onItemDragStart={workflow.handleItemDragStart}
                onItemDragOver={workflow.handleItemDragOver}
                onItemDragEnd={workflow.handleItemDragEnd}
                onItemDrop={workflow.handleItemDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* Scène 3 : Fusion cinétique (Aperture centralisée) */}
            {workflow.isProcessing && (
              <div key="processing" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={PDF_FORMAT.icon}
                  formatAlt="PDF"
                  stageLabel={isFr ? 'Reliure en cours' : 'Merging in progress'}
                  title={
                    isFr
                      ? `Assemblage de ${workflow.files.length} documents`
                      : `Merging ${workflow.files.length} documents`
                  }
                  detail={
                    isFr
                      ? `Poids total : ${formatBytes(workflow.totalSize)}`
                      : `Total size: ${formatBytes(workflow.totalSize)}`
                  }
                />
              </div>
            )}

            {/* Scène 4 : Résultat monumental */}
            {workflow.result && !workflow.isProcessing && (
              <PdfMergeResultView
                key="result"
                result={workflow.result}
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
        resultBlob={workflow.result?.blob}
        resultFilename={workflow.result?.filename}
      />
    </ToolPageLayout>
  );
}
