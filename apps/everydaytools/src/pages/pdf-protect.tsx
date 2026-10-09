import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { SOURCE_FORMAT, TARGET_FORMAT } from '@/lib/pdf-protect-logic';
import { usePdfProtectWorkflow } from '@/hooks/use-pdf-protect-workflow';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { PdfProtectWorkbench } from '@/components/pdf-protect';

export default function PdfProtect() {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  const {
    file,
    result,
    error,
    passwordError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    userPassword,
    ownerPassword,
    showUserPassword,
    showOwnerPassword,
    showAdvanced,
    allowPrinting,
    allowCopying,
    allowModifying,
    strength,
    passwordInputRef,
    setUserPassword,
    setOwnerPassword,
    setShowUserPassword,
    setShowOwnerPassword,
    setShowAdvanced,
    setAllowPrinting,
    setAllowCopying,
    setAllowModifying,
    setError,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleGeneratePassword,
    handleConvert,
    handleDownload,
  } = usePdfProtectWorkflow();

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.pdf,
        t.tools['pdf-protect']?.title ?? (isFr ? 'Protéger le PDF' : 'Protect PDF'),
      ]}
      title={t.tools['pdf-protect']?.title ?? (isFr ? 'Protéger le PDF' : 'Protect PDF')}
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
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-3xl mx-auto shadow-sm"
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

          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (max-w-5xl mx-auto) ─── */}
            {!file && !result && !isProcessing && (
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
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE CHIFFREMENT (ZERO CARD, ZERO BOX SLOP) ─── */}
            {file && !result && (
              <PdfProtectWorkbench
                file={file}
                isProcessing={isProcessing}
                userPassword={userPassword}
                ownerPassword={ownerPassword}
                showUserPassword={showUserPassword}
                showOwnerPassword={showOwnerPassword}
                showAdvanced={showAdvanced}
                allowPrinting={allowPrinting}
                allowCopying={allowCopying}
                allowModifying={allowModifying}
                passwordError={passwordError}
                strength={strength}
                passwordInputRef={passwordInputRef}
                onReset={handleReset}
                onConvert={handleConvert}
                onUserPasswordChange={setUserPassword}
                onOwnerPasswordChange={setOwnerPassword}
                onToggleShowUserPassword={() => setShowUserPassword(!showUserPassword)}
                onToggleShowOwnerPassword={() => setShowOwnerPassword(!showOwnerPassword)}
                onToggleShowAdvanced={() => setShowAdvanced(!showAdvanced)}
                onToggleAllowPrinting={() => setAllowPrinting(!allowPrinting)}
                onToggleAllowCopying={() => setAllowCopying(!allowCopying)}
                onToggleAllowModifying={() => setAllowModifying(!allowModifying)}
                onGeneratePassword={handleGeneratePassword}
              />
            )}

            {/* ─── SCÈNE 3 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT ─── */}
            {result && (
              <ConversionResult
                targetFormat={TARGET_FORMAT}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  tc.downloadPdf ??
                  (isFr ? 'Télécharger le PDF protégé' : 'Download protected PDF')
                }
                resetBtnLabel={
                  tc.protectAnother ??
                  (isFr ? 'Protéger un autre PDF' : 'Protect another PDF')
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
        toolId="pdf-protect"
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
