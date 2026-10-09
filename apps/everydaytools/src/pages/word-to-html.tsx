import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
} from '@/components/conversion';
import { useWordToHtmlWorkflow } from '@/hooks/use-word-to-html-workflow';

export default function WordToHtml() {
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
  } = useWordToHtmlWorkflow();

  const pageTitle = t.tools['word-to-html']?.title ?? (isFr ? 'Word en HTML' : 'Word to HTML');
  const pageDesc =
    t.tools['word-to-html']?.description ??
    (isFr
      ? 'Convertissez vos documents Word en code HTML5 propre et prêt pour le web.'
      : 'Convert DOCX documents to clean, web-ready HTML code.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="word-to-html"
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en balisage HTML5 sémantique (.html).'
                    : 'or click to browse your folders and convert to semantic HTML5 markup (.html).'
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en HTML' : 'Convert to HTML')}
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
                statusLabel={tc.converting ?? (isFr ? 'Génération du code HTML sémantique en cours...' : 'Generating semantic HTML code...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadHtml ?? (isFr ? 'Télécharger le code HTML' : 'Download HTML code')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu du code HTML' : 'Preview HTML code'}</span>
                    </button>

                    <CopyButton
                      text={result.textOutput}
                      label={tc.copyHtml ?? (isFr ? 'Copier le code' : 'Copy code')}
                      copiedLabel={tc.copiedHtml ?? (isFr ? 'Copié !' : 'Copied!')}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />
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
              downloadLabel={tc.downloadHtml ?? (isFr ? 'Télécharger le fichier HTML' : 'Download HTML file')}
              copyLabel={tc.copyHtml ?? (isFr ? 'Copier le code' : 'Copy code')}
              copiedLabel={tc.copiedHtml ?? (isFr ? 'Copié !' : 'Copied!')}
              formatTag="HTML5 · UTF-8"
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="word-to-html"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="html"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
