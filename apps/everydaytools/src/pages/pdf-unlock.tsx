import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfUnlockWorkbench, type PdfUnlockWorkflow } from '@/components/pdf-unlock';
import { usePdfUnlockOptions } from '@/hooks/use-pdf-unlock-options';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfUnlockEngine } from '@/engine/engines/pdf-unlock-engine';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';
import {
  getPdfUnlockSourceFormat,
  getPdfUnlockTargetFormat,
} from '@/lib/pdf-unlock-logic';

export default function PdfUnlock() {
  const { t, isFr } = useLocale();
  const tc = t.pdfUnlock;

  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const sourceFormat = useMemo(() => getPdfUnlockSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getPdfUnlockTargetFormat(isFr), [isFr]);

  const opts = usePdfUnlockOptions({ isFr });

  const engine = useMemo(
    () =>
      createPdfUnlockEngine({
        password: opts.password,
        isFr,
      }),
    [opts.password, isFr]
  );

  const {
    inputFile,
    result,
    isProcessing,
    error,
    handleFileSelect,
    handleExecute,
    handleReset: handleWorkflowReset,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-unlock',
    category: 'pdf',
    autoConsumeHandoff: true,
  });

  const unlockResult = useMemo(() => {
    if (!result?.data || !inputFile) return null;
    return {
      blob: result.data,
      filename: result.filename,
      sizeAfter: result.resultSize ?? result.data.size,
      sizeBefore: result.originalSize ?? inputFile.size,
    };
  }, [result, inputFile]);

  const handleReset = useCallback(() => {
    handleWorkflowReset();
    opts.resetOptions();
    setIsNextActionOpen(false);
  }, [handleWorkflowReset, opts]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inputFile && !isProcessing) handleReset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputFile, isProcessing, handleReset]);

  const handleDownload = useCallback(() => {
    if (!unlockResult) return;
    downloadBlob(unlockResult.blob, unlockResult.filename);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [unlockResult]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const workbenchWorkflow = useMemo<PdfUnlockWorkflow>(
    () => ({
      file: inputFile,
      password: opts.password,
      showPassword: opts.showPassword,
      isProcessing,
      isSuccess: Boolean(unlockResult),
      unlockedBlob: unlockResult?.blob ?? null,
      error: opts.error ?? error,
      setPassword: opts.setPassword,
      setShowPassword: opts.setShowPassword,
      handleReset,
      handleConvert: handleExecute,
      handleDownload,
      setError,
    }),
    [
      inputFile,
      opts.password,
      opts.showPassword,
      isProcessing,
      unlockResult,
      opts.error,
      error,
      opts.setPassword,
      opts.setShowPassword,
      handleReset,
      handleExecute,
      handleDownload,
      setError,
    ]
  );

  const title =
    t.tools['pdf-unlock']?.title ?? (isFr ? 'Déverrouiller le PDF' : 'Unlock PDF');
  const description =
    t.tools['pdf-unlock']?.description ??
    (isFr
      ? 'Supprimez les restrictions d’impression, de copie et d’édition, ou déchiffrez un document PDF protégé.'
      : 'Remove printing, copying, and editing restrictions, or decrypt a password-protected PDF document.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={description}
      seoSlug="pdf-unlock"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!inputFile && !unlockResult && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  title={
                    isFr
                      ? 'Glissez-déposez votre document PDF'
                      : 'Drag and drop your PDF document'
                  }
                  description={
                    tc.note ??
                    (isFr
                      ? 'ou cliquez pour parcourir vos dossiers et supprimer les restrictions de droits ou le mot de passe.'
                      : 'or click to browse your folders and remove permission restrictions or password.')
                  }
                  buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                  isDragging={isDragging}
                  onFileSelected={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {inputFile && !unlockResult && !isProcessing && (
              <PdfUnlockWorkbench
                workflow={workbenchWorkflow}
                isFr={isFr}
                unlockBtnLabel={tc.unlockBtn}
                passwordLabel={tc.passwordLabel}
                passwordPlaceholder={tc.passwordPlaceholder}
                passwordHelp={tc.passwordHelp}
                unlockingLabel={tc.unlocking}
              />
            )}

            {isProcessing && (
              <ProcessingAperture
                formatIcon={sourceFormat.icon}
                formatAlt="PDF"
                stageLabel={
                  isFr
                    ? 'Déverrouillage du document en cours'
                    : 'Decrypting PDF document'
                }
                title={formatBytes(inputFile?.size ?? 0)}
                detail={inputFile?.name}
              />
            )}

            {unlockResult && !isProcessing && (
              <ConversionResult
                targetFormat={{
                  ...targetFormat,
                  subLabel:
                    tc.readyBadge ??
                    (isFr ? 'Document déverrouillé' : 'Unlocked document'),
                }}
                resultFileName={unlockResult.filename}
                resultFileSize={unlockResult.sizeAfter}
                downloadBtnLabel={
                  tc.downloadPdf ??
                  (isFr
                    ? 'Télécharger le PDF déverrouillé'
                    : 'Download unlocked PDF')
                }
                resetBtnLabel={
                  tc.unlockAnother ??
                  (isFr ? 'Déverrouiller un autre PDF' : 'Unlock another PDF')
                }
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-unlock"
        resultBlob={unlockResult?.blob}
        resultFilename={unlockResult?.filename}
      />
    </ToolPageLayout>
  );
}
