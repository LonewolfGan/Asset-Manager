import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { SOURCE_FORMAT, TARGET_FORMAT } from '@/lib/pdf-protect-logic';
import { usePdfProtectOptions } from '@/hooks/use-pdf-protect-options';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfProtectEngine } from '@/engine/engines/pdf-protect-engine';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfProtectWorkbench } from '@/components/pdf-protect';

export default function PdfProtect() {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const opts = usePdfProtectOptions({
    isFr,
    strengthLabels: {
      weak: tc.strengthWeak ?? 'Faible',
      medium: tc.strengthMedium ?? 'Bon',
      strong: tc.strengthStrong ?? 'Très fort',
    },
  });

  const engine = useMemo(
    () =>
      createPdfProtectEngine({
        userPassword: opts.userPassword,
        ownerPassword: opts.ownerPassword,
        allowPrinting: opts.allowPrinting,
        allowCopying: opts.allowCopying,
        allowModifying: opts.allowModifying,
        isFr,
      }),
    [opts.userPassword, opts.ownerPassword, opts.allowPrinting, opts.allowCopying, opts.allowModifying, isFr]
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
    toolSlug: 'pdf-protect',
    category: 'pdf',
    autoConsumeHandoff: true,
  });

  const protectResult = useMemo(() => {
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

  const handleConvert = useCallback(() => {
    if (!opts.userPassword.trim() && !opts.ownerPassword.trim()) {
      opts.setPasswordError(
        tc.errorNoPassword ?? (isFr ? "Veuillez définir un mot de passe d'ouverture." : 'Please enter a password.')
      );
      passwordInputRef.current?.focus();
      return;
    }
    handleExecute();
  }, [opts, tc, isFr, handleExecute]);

  const handleDownload = useCallback(() => {
    if (!protectResult) return;
    downloadBlob(protectResult.blob, protectResult.filename);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [protectResult]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  }, [handleFileSelect]);

  const title = t.tools['pdf-protect']?.title ?? (isFr ? 'Protéger le PDF' : 'Protect PDF');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={
        t.tools['pdf-protect']?.description ??
        (isFr
          ? 'Chiffrez votre document en AES-256 et restreignez l’impression, la copie ou les modifications.'
          : 'Encrypt your document with AES-256 and restrict printing, copying, or modifications.')
      }
      seoSlug="pdf-protect"
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
            {!inputFile && !protectResult && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={SOURCE_FORMAT}
                  title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                  description={
                    tc.permissionsDesc ??
                    (isFr
                      ? 'ou cliquez pour parcourir vos fichiers et appliquer un chiffrement AES-256 avec restrictions.'
                      : 'or click to browse your files and apply AES-256 encryption with restrictions.')
                  }
                  buttonLabel={isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'}
                  isDragging={isDragging}
                  onFileSelected={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {inputFile && !protectResult && !isProcessing && (
              <PdfProtectWorkbench
                file={inputFile}
                isProcessing={isProcessing}
                isFr={isFr}
                userPassword={opts.userPassword}
                ownerPassword={opts.ownerPassword}
                showUserPassword={opts.showUserPassword}
                showOwnerPassword={opts.showOwnerPassword}
                showAdvanced={opts.showAdvanced}
                allowPrinting={opts.allowPrinting}
                allowCopying={opts.allowCopying}
                allowModifying={opts.allowModifying}
                passwordError={opts.passwordError}
                strength={opts.strength}
                passwordInputRef={passwordInputRef}
                onReset={handleReset}
                onConvert={handleConvert}
                onUserPasswordChange={opts.setUserPassword}
                onOwnerPasswordChange={opts.setOwnerPassword}
                onToggleShowUserPassword={opts.toggleShowUserPassword}
                onToggleShowOwnerPassword={opts.toggleShowOwnerPassword}
                onToggleShowAdvanced={opts.toggleShowAdvanced}
                onToggleAllowPrinting={opts.toggleAllowPrinting}
                onToggleAllowCopying={opts.toggleAllowCopying}
                onToggleAllowModifying={opts.toggleAllowModifying}
                onGeneratePassword={opts.handleGeneratePassword}
              />
            )}

            {isProcessing && (
              <ProcessingAperture
                formatIcon={SOURCE_FORMAT.icon}
                formatAlt="PDF"
                stageLabel={isFr ? 'Chiffrement AES-256 en cours' : 'AES-256 Encryption in progress'}
                title={formatBytes(inputFile?.size ?? 0)}
                detail={inputFile?.name}
              />
            )}

            {protectResult && !isProcessing && (
              <ConversionResult
                targetFormat={TARGET_FORMAT}
                resultFileName={protectResult.filename}
                resultFileSize={protectResult.sizeAfter}
                downloadBtnLabel={tc.downloadPdf ?? (isFr ? 'Télécharger le PDF protégé' : 'Download protected PDF')}
                resetBtnLabel={tc.protectAnother ?? (isFr ? 'Protéger un autre PDF' : 'Protect another PDF')}
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
        toolId="pdf-protect"
        resultBlob={protectResult?.blob}
        resultFilename={protectResult?.filename}
      />
    </ToolPageLayout>
  );
}
