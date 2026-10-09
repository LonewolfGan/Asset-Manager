import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { AlertCircle } from 'lucide-react';
import { usePdfReorderWorkflow } from '@/hooks/use-pdf-reorder-workflow';
import { ReorderPdfWorkbench } from '@/components/reorder-pdf';
import { getSourceFormat, getTargetFormat } from '@/lib/pdf-reorder-logic';

export default function ReorderPdf() {
  const { t, isFr } = useLocale();
  const tc = t.reorderPdf;
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const workflow = usePdfReorderWorkflow(isFr, {
    loadFailed: tc.loadFailed,
    saveFailed: tc.saveFailed,
    loadingThumbs: tc.loadingThumbs,
  });

  const {
    file,
    result,
    error,
    setError,
    isDraggingFile,
    isNextActionOpen,
    setIsNextActionOpen,
    handleSingleFileSelected,
    handleDragOver,
    handleDragLeave,
    handleFileDrop,
    handleReset,
    handleDownload,
  } = workflow;

  const title =
    t.tools['reorder-pdf']?.title ??
    (isFr ? 'Réorganiser les pages PDF' : 'Reorder PDF Pages');
  const description =
    t.tools['reorder-pdf']?.description ??
    (isFr
      ? 'Réorganisez, triez ou supprimez des pages de votre document PDF.'
      : 'Rearrange, sort or remove pages from your PDF.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={description}
      seoSlug="reorder-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm w-full shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-mono font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL HAUTE-FIDÉLITÉ ─── */}
            {!file && !result && (
              <div className="w-full max-w-5xl mx-auto" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  title={
                    isFr
                      ? 'Glissez-déposez votre document PDF'
                      : 'Drag & drop your PDF document'
                  }
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers et réorganiser, trier ou supprimer vos pages.'
                      : 'or click to browse your files and reorder, sort, or remove pages.'
                  }
                  buttonLabel={
                    isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'
                  }
                  isDragging={isDraggingFile}
                  onFileSelected={handleSingleFileSelected}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleFileDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE RÉORGANISATION ─── */}
            {file && !result && (
              <ReorderPdfWorkbench
                isFr={isFr}
                sourceFormatIcon={sourceFormat.icon}
                workflow={workflow}
                labels={{
                  reverseOrder: tc.reverseOrder ?? '',
                  resetOrder: tc.resetOrder ?? '',
                  saving: tc.saving ?? '',
                  savePdf: tc.savePdf ?? '',
                  loadingThumbs: tc.loadingThumbs ?? '',
                }}
              />
            )}

            {/* ─── SCÈNE 3 : TÉLÉCHARGEMENT DIRECT ET RÉSULTAT ─── */}
            {result && (
              <motion.div
                key="result-scene"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-4xl mx-auto"
              >
                <ConversionResult
                  targetFormat={targetFormat}
                  resultFileName={result.filename}
                  resultFileSize={result.sizeAfter}
                  downloadBtnLabel={
                    tc.saveReorderedPdf ??
                    (isFr
                      ? 'Télécharger le PDF réorganisé'
                      : 'Download reordered PDF')
                  }
                  resetBtnLabel={
                    tc.loadDifferent ??
                    (isFr
                      ? 'Réorganiser un autre document'
                      : 'Reorder another document')
                  }
                  onDownload={handleDownload}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        toolId="reorder-pdf"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
