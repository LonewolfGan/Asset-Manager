import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  ReciprocalTitle,
  DocumentNextActionModal,
} from '@/components/conversion';
import { useWordToEpubWorkflow } from '@/hooks/use-word-to-epub-workflow';
import { useLocale } from '@/hooks/use-locale';

export default function WordToEpub() {
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
    previewOpen,
    setPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = useWordToEpubWorkflow();

  const pageTitle = t.tools['word-to-epub']?.title ?? (isFr ? 'Word en EPUB' : 'Word to EPUB');
  const pageDesc =
    t.tools['word-to-epub']?.description ??
    (isFr
      ? 'Transformez vos manuscrits Word en livres numériques EPUB pour liseuses et smartphones.'
      : 'Turn your Word manuscripts into EPUB e-books for any device.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="word-to-epub"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="word-to-epub"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document Word' : 'Drag and drop your Word document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et compiler un livre électronique EPUB (.epub).'
                    : 'or click to browse your folders and compile an EPUB e-book (.epub).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en EPUB' : 'Convert to EPUB')}
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
                statusLabel={tc.converting ?? (isFr ? 'Compilation du livre électronique EPUB en cours...' : 'Compiling EPUB e-book...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={`${result.textOutput ? result.textOutput.split('\n').length : 0} ${isFr ? 'lignes' : 'lines'} · ${result.textOutput.length} ${isFr ? 'caractères' : 'chars'}`}
                downloadBtnLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le livre EPUB' : 'Download EPUB e-book')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu du contenu du livre' : 'Preview book content'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsNextActionOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <span>{isFr ? 'Actions suivantes' : 'Next actions'}</span>
                    </button>
                  </div>
                }
              />
            )}
          </AnimatePresence>

          {/* Dedicated Text Preview Dialog */}
          {result && (
            <TextPreviewDialog
              open={previewOpen}
              onOpenChange={setPreviewOpen}
              filename={result.filename}
              text={result.textOutput}
              onDownload={handleDownload}
              downloadLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le livre EPUB' : 'Download EPUB e-book')}
              copyLabel={isFr ? 'Copier le texte' : 'Copy text'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              formatTag="EPUB Text · UTF-8"
            />
          )}

          {/* Continuum Modal */}
          {result && (
            <DocumentNextActionModal
              toolId="word-to-epub"
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              resultBlob={result.blob}
              resultFilename={result.filename}
              formatType="epub"
            />
          )}
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
