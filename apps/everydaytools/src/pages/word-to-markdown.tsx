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
import { useWordToMarkdownWorkflow } from '@/hooks/use-word-to-markdown-workflow';

export default function WordToMarkdown() {
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
  } = useWordToMarkdownWorkflow();

  const pageTitle = t.tools['word-to-markdown']?.title ?? (isFr ? 'Word en Markdown' : 'Word to Markdown');
  const pageDesc =
    t.tools['word-to-markdown']?.description ??
    (isFr
      ? 'Convertissez vos fichiers DOCX en syntaxe Markdown propre et lisible.'
      : 'Convert DOCX files to clean Markdown.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="word-to-markdown"
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en syntaxe Markdown épurée (.md).'
                    : 'or click to browse your folders and convert to clean Markdown syntax (.md).'
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Markdown' : 'Convert to Markdown')}
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
                statusLabel={tc.converting ?? (isFr ? 'Conversion du document en Markdown en cours...' : 'Converting document to Markdown...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadMd ?? (isFr ? 'Télécharger le fichier Markdown' : 'Download Markdown file')}
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
                      <span>{isFr ? 'Aperçu Markdown' : 'Markdown preview'}</span>
                    </button>

                    <CopyButton
                      text={result.textOutput}
                      label={tc.copyMd ?? (isFr ? 'Copier le Markdown' : 'Copy Markdown')}
                      copiedLabel={tc.copiedMd ?? (isFr ? 'Copié !' : 'Copied!')}
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
              downloadLabel={tc.downloadMd ?? (isFr ? 'Télécharger le fichier Markdown' : 'Download Markdown file')}
              copyLabel={tc.copyMd ?? (isFr ? 'Copier le Markdown' : 'Copy Markdown')}
              copiedLabel={tc.copiedMd ?? (isFr ? 'Copié !' : 'Copied!')}
              formatTag="Markdown · UTF-8"
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="word-to-markdown"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="md"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
