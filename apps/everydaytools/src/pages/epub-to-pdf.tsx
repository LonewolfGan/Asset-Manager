import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ReciprocalTitle,
  NextActionModal,
} from '@/components/conversion';
import { useEpubToPdfWorkflow } from '@/hooks/use-epub-to-pdf-workflow';

export default function EpubToPdf() {
  const {
    t,
    tc,
    isFr,
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
  } = useEpubToPdfWorkflow();

  const pageTitle = t.tools['epub-to-pdf']?.title ?? (isFr ? 'EPUB en PDF' : 'EPUB to PDF');
  const pageDesc =
    t.tools['epub-to-pdf']?.description ??
    (isFr
      ? 'Convertissez vos livres électroniques EPUB en documents PDF prêts à imprimer et faciles à partager.'
      : 'Convert EPUB e-books into print-ready, easily shareable PDF documents.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="epub-to-pdf"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="epub-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre livre EPUB' : 'Drag & drop your EPUB e-book'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF haute définition (.pdf).'
                    : 'or click to browse your folders and convert to high-definition PDF (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier EPUB' : 'Select an EPUB file'}
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
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting ??
                  (isFr ? 'Conversion du livre en document PDF en cours...' : 'Converting e-book to PDF...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  tc.downloadPdf ?? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre fichier' : 'Convert another file')
                }
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={() => setIsNextActionOpen(true)}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <span>{isFr ? 'Actions suivantes' : 'Next actions'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          {result && (
            <NextActionModal
              toolId="epub-to-pdf"
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              resultBlob={result.blob}
              resultFilename={result.filename}
            />
          )}
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
