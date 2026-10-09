import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import { usePdfThumbnails } from '@/hooks/use-pdf-thumbnails';
import { usePdfRotateWorkflow } from '@/hooks/use-pdf-rotate-workflow';
import {
  ConversionDropzone,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfRotateWorkbench, PdfRotateResultView } from '@/components/pdf-rotate';

const PDF_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document Adobe Acrobat',
};

export default function PdfRotate() {
  const { t, isFr } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const { pages, isLoadingThumbs, loadPdfThumbnails, resetThumbnails } = usePdfThumbnails();
  const workflow = usePdfRotateWorkflow(
    file ?? undefined,
    pages,
    t.pdfRotate?.error ?? (isFr ? 'Échec de la rotation du document.' : 'Failed to rotate document.')
  );

  const validateAndSetFile = useCallback(
    async (selectedFile: File) => {
      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        workflow.setError(
          isFr ? 'Veuillez sélectionner un fichier PDF valide.' : 'Please select a valid PDF file.'
        );
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        workflow.setError(
          isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'File exceeds maximum allowed size of 50 MB.'
        );
        return;
      }

      workflow.resetWorkflow();
      resetThumbnails();
      setFile(selectedFile);
      await loadPdfThumbnails(selectedFile);
    },
    [isFr, loadPdfThumbnails, resetThumbnails, workflow]
  );

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFileSelected: validateAndSetFile,
    accept: '.pdf,application/pdf',
  });

  // Auto-consume handoff file if transferred from another tool
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged && (staged.type === 'application/pdf' || staged.name.toLowerCase().endsWith('.pdf'))) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleResetAll = useCallback(() => {
    setFile(null);
    resetThumbnails();
    workflow.resetWorkflow();
    setIsNextActionOpen(false);
  }, [resetThumbnails, workflow]);

  // Keyboard shortcut Esc to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && file && !workflow.isProcessing && !workflow.result) {
        handleResetAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, workflow.isProcessing, workflow.result, handleResetAll]);

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Rotate PDF']}
      title={t.tools?.['pdf-rotate']?.title ?? (isFr ? 'Faire pivoter un PDF' : 'Rotate PDF')}
      description={
        t.tools?.['pdf-rotate']?.description ??
        (isFr
          ? 'Pivotez des pages spécifiques ou l’intégralité de votre document PDF avec prévisualisation en temps réel.'
          : 'Rotate specific pages or your entire PDF document with real-time preview.')
      }
      seoSlug="pdf-rotate"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Bannière d'erreur */}
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

          <AnimatePresence mode="wait">
            {/* Scène 1 : Dépôt initial cadré */}
            {!file && !workflow.result && !workflow.isProcessing && (
              <div key="dropzone" className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={PDF_FORMAT}
                  title={
                    t.tools?.['pdf-rotate']?.title ??
                    (isFr ? 'Faire pivoter un document PDF' : 'Rotate PDF document')
                  }
                  description={
                    t.tools?.['pdf-rotate']?.description ??
                    (isFr
                      ? 'Glissez-déposez votre document PDF ici ou cliquez pour parcourir votre appareil.'
                      : 'Drag and drop your PDF document here or click to browse.')
                  }
                  buttonLabel={isFr ? 'Sélectionner un fichier PDF' : 'Select PDF file'}
                  multiple={false}
                  isDragging={isDragging}
                  onFilesSelected={(files) => files[0] && validateAndSetFile(files[0])}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* Scène 2 : L'atelier de rotation */}
            {file && !workflow.result && !workflow.isProcessing && (
              <PdfRotateWorkbench
                key="workbench"
                file={file}
                format={PDF_FORMAT}
                pages={pages}
                isLoadingThumbs={isLoadingThumbs}
                pageRotations={workflow.pageRotations}
                selectedPages={workflow.selectedPages}
                modifiedPagesCount={workflow.modifiedPagesCount}
                isProcessing={workflow.isProcessing}
                isFr={isFr}
                t={t}
                onReset={handleResetAll}
                onApplyRotation={workflow.handleApplyRotation}
                onRotateSelectedPages={workflow.rotateSelectedPages}
                onResetAllRotations={workflow.resetAllRotations}
                onSelectAllPages={workflow.selectAllPages}
                onClearSelection={workflow.clearSelection}
                onSelectOddPages={workflow.selectOddPages}
                onSelectEvenPages={workflow.selectEvenPages}
                onToggleSelectPage={workflow.toggleSelectPage}
                onRotateSinglePage={workflow.rotateSinglePage}
              />
            )}

            {/* Scène 3 : Aperture optique cinétique centralisée */}
            {workflow.isProcessing && (
              <div key="processing" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={PDF_FORMAT.icon}
                  formatAlt="PDF"
                  stageLabel={isFr ? 'Rotation en cours' : 'Rotating in progress'}
                  title={
                    workflow.modifiedPagesCount > 0
                      ? isFr
                        ? `Application de la rotation sur ${workflow.modifiedPagesCount} page${workflow.modifiedPagesCount > 1 ? 's' : ''}`
                        : `Applying rotation to ${workflow.modifiedPagesCount} page${workflow.modifiedPagesCount > 1 ? 's' : ''}`
                      : isFr
                      ? 'Rotation de toutes les pages (+90°)'
                      : 'Rotating all pages (+90°)'
                  }
                />
              </div>
            )}

            {/* Scène 4 : Résultat monumental */}
            {workflow.result && !workflow.isProcessing && (
              <PdfRotateResultView
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
        toolId="pdf-rotate"
        resultBlob={workflow.result?.blob}
        resultFilename={workflow.result?.filename}
      />
    </ToolPageLayout>
  );
}
