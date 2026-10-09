import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { formatBytes } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { usePdfRepairWorkflow } from '@/hooks/use-pdf-repair-workflow';
import { PdfRepairWorkbench } from '@/components/pdf-repair';

export default function PdfRepair() {
  const { t, isFr } = useLocale();
  const tc = t.pdfRepair;

  const workflow = usePdfRepairWorkflow(isFr, tc.error);
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

  const title = t.tools['pdf-repair']?.title ?? (isFr ? 'Réparer un PDF' : 'Repair PDF');
  const desc =
    t.tools['pdf-repair']?.description ??
    (isFr
      ? 'Analyser et restaurer les documents PDF endommagés, corrompus ou illisibles.'
      : 'Analyze and restore damaged, corrupt, or unreadable PDF files.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-repair"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Error Notification Banner */}
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

          {/* Unified Architectural Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT DU DOCUMENT ─── */}
            {!file && !result && (
              <div className="w-full max-w-5xl mx-auto" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  accept=".pdf,application/pdf"
                  title={
                    isFr
                      ? 'Glissez-déposez votre document PDF endommagé'
                      : 'Drag & drop your damaged PDF document'
                  }
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers. Analyse et reconstruction intégrale de la table xref, linéarisation et récupération des flux corrompus.'
                      : 'or click to browse your files. Complete analysis and reconstruction of xref table, linearization, and corrupted stream recovery.'
                  }
                  buttonLabel={
                    isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'
                  }
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : ATELIER DE RÉPARATION ─── */}
            {file && !result && (
              <PdfRepairWorkbench
                workflow={workflow}
                isFr={isFr}
                repairBtnLabel={tc.repairBtn}
                repairingLabel={tc.repairing}
              />
            )}

            {/* ─── SCÈNE 3 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={
                  isFr
                    ? `${formatBytes(result.sizeAfter)} · Structure restaurée`
                    : `${formatBytes(result.sizeAfter)} · Restored structure`
                }
                downloadBtnLabel={
                  tc.downloadRepaired ??
                  (isFr ? 'Télécharger le PDF réparé' : 'Download repaired PDF')
                }
                downloadBtnColor="#FF6B35"
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Réparer un autre document' : 'Repair another PDF')
                }
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        toolId="pdf-repair"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
