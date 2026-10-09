import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { usePdfUnlockWorkflow } from '@/hooks/use-pdf-unlock-workflow';
import { PdfUnlockWorkbench } from '@/components/pdf-unlock';

export default function PdfUnlock() {
  const { t, isFr } = useLocale();
  const tc = t.pdfUnlock;

  const workflow = usePdfUnlockWorkflow(isFr, tc.error);
  const {
    file,
    sourceFormat,
    targetFormat,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleDownload,
  } = workflow;

  const pageTitle =
    t.tools['pdf-unlock']?.title ?? (isFr ? 'Déverrouiller le PDF' : 'Unlock PDF');
  const pageDesc =
    t.tools['pdf-unlock']?.description ??
    (isFr
      ? 'Supprimez les restrictions d’impression, de copie et d’édition, ou déchiffrez un document PDF protégé.'
      : 'Remove printing, copying, and editing restrictions, or decrypt a password-protected PDF document.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="pdf-unlock"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 max-w-2xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
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

          {/* Unified 3-Scene Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ ─── */}
            {!file && !result && !isProcessing && (
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
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE DÉVERROUILLAGE ─── */}
            {file && !result && (
              <PdfUnlockWorkbench
                workflow={workflow}
                isFr={isFr}
                unlockBtnLabel={tc.unlockBtn}
                passwordLabel={tc.passwordLabel}
                passwordPlaceholder={tc.passwordPlaceholder}
                passwordHelp={tc.passwordHelp}
                unlockingLabel={tc.unlocking}
              />
            )}

            {/* ─── SCÈNE 3 : TÉLÉCHARGEMENT DIRECT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={{
                  ...targetFormat,
                  subLabel:
                    tc.readyBadge ??
                    (isFr ? 'Document déverrouillé' : 'Unlocked document'),
                }}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
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
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
