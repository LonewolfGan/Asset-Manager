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
import { useWordToTextWorkflow } from '@/hooks/use-word-to-text-workflow';

export default function WordToText() {
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
  } = useWordToTextWorkflow();

  const pageTitle = t.tools['word-to-text']?.title ?? 'Word to Text';
  const pageDesc =
    t.tools['word-to-text']?.description ??
    'Extract plain text from Microsoft Word (.docx) documents securely.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="word-to-text"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document Word' : 'Drag & drop your Word document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et extraire le texte brut épuré (.txt).'
                    : 'or click to browse your files and extract clean plain text (.txt).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier Word' : 'Select Word file'}
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Extraire le texte' : 'Extract text')}
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
                  (isFr ? 'Extraction du texte brut en cours...' : 'Extracting plain text...')
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
                  tc.downloadTxt ?? (isFr ? 'Télécharger le fichier texte' : 'Download text file')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre document' : 'Convert another document')
                }
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu du texte' : 'Preview text'}</span>
                    </button>

                    <CopyButton
                      text={result.textOutput}
                      label={tc.copyText ?? (isFr ? 'Copier le texte' : 'Copy text')}
                      copiedLabel={tc.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
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
              downloadLabel={tc.downloadTxt ?? (isFr ? 'Télécharger le fichier TXT' : 'Download TXT file')}
              copyLabel={tc.copyText ?? (isFr ? 'Copier le texte' : 'Copy text')}
              copiedLabel={tc.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
              formatTag="TXT · UTF-8"
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="word-to-text"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="txt"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
