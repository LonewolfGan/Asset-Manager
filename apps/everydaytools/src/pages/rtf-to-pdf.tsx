import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye, Sparkles } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';
import { useRtfToPdfWorkflow } from '@/hooks/use-rtf-to-pdf-workflow';
import { useLocale } from '@/hooks/use-locale';

export default function RtfToPdf() {
  const { isFr } = useLocale();
  const {
    t,
    tc,
    sourceFormat,
    targetFormat,
    file,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
    handleOpenPreview,
    handleOpenNextAction,
  } = useRtfToPdfWorkflow();

  const pageTitle = t.tools['rtf-to-pdf']?.title ?? 'RTF to PDF';
  const pageDesc =
    t.tools['rtf-to-pdf']?.description ??
    'Convert Rich Text Format (RTF) documents to PDF with maximum formatting fidelity.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="rtf-to-pdf"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="rtf-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                key="dropzone"
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document RTF' : 'Drag & drop your RTF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF haute fidélité (.pdf).'
                    : 'or click to browse your files and convert to high-fidelity PDF (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier RTF' : 'Select an RTF file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                key="staging"
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PDF' : 'Convert to PDF')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                key="conduit"
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Conversion du document RTF en PDF haute fidélité...'
                    : 'Converting RTF document to high-fidelity PDF...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                key="result"
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  tc.downloadPdf ?? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre document RTF' : 'Convert another RTF document')
                }
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? "Ouvrir l'aperçu PDF" : 'Open PDF preview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenNextAction}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm"
                    >
                      <Sparkles size={16} strokeWidth={2.2} className="text-amber-500" />
                      <span>{isFr ? 'Actions suivantes' : 'Next actions'}</span>
                    </button>
                  </div>
                }
              />
            )}
          </AnimatePresence>

          {/* Next Action Workflow Chaining Modal */}
          {result && (
            <NextActionModal
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              toolId="rtf-to-pdf"
              resultBlob={result.blob}
              resultFilename={result.filename}
            />
          )}
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
