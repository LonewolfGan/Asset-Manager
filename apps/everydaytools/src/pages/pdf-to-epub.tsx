import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { BookOpen } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
} from '@/components/conversion';
import { usePdfToEpubWorkflow } from '@/hooks/use-pdf-to-epub-workflow';

export default function PdfToEpub() {
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
    isPreviewOpen,
    setIsPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = usePdfToEpubWorkflow();

  const title = t.tools['pdf-to-epub']?.title ?? (isFr ? 'PDF en EPUB' : 'PDF to EPUB');
  const desc =
    t.tools['pdf-to-epub']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en livres numériques EPUB fluides et adaptatifs.'
      : 'Convert PDF documents into flowable EPUB e-books.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-epub"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en livre numérique EPUB (.epub).'
                    : 'or click to browse your folders and convert to an EPUB e-book (.epub).'
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
                statusLabel={tc.converting ?? (isFr ? 'Génération du livre EPUB en cours...' : 'Generating EPUB e-book...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT WITH QUICK COPY & PREVIEW ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le fichier .epub' : 'Download .epub file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                downloadBtnColor="#558B2F"
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={result.textOutput}
                      label={isFr ? 'Copier le texte' : 'Copy text'}
                      copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <BookOpen size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu du contenu' : 'Content preview'}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Shadcn EPUB Book Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename}
              text={result.textOutput}
              formatTag="EPUB 3.0 · E-Book"
              onDownload={handleDownload}
              copyLabel={isFr ? 'Copier le texte' : 'Copy text'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              downloadLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le fichier .epub' : 'Download .epub file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-epub"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="epub"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
