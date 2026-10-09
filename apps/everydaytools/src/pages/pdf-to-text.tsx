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
import { usePdfToTextWorkflow } from '@/hooks/use-pdf-to-text-workflow';
import { PdfToTextErrorBanner } from '@/components/pdf-to-text';

export default function PdfToText() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    error,
    clearError,
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
  } = usePdfToTextWorkflow();

  const title = t.tools['pdf-to-text']?.title ?? (isFr ? 'PDF en Texte' : 'PDF to Text');
  const desc =
    t.tools['pdf-to-text']?.description ??
    (isFr
      ? 'Extrayez le texte brut de vos documents PDF de manière propre et rapide.'
      : 'Extract clean, editable plain text from PDF documents.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-text"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          <PdfToTextErrorBanner
            error={error}
            onClear={clearError}
            closeLabel={isFr ? 'Fermer' : 'Close'}
          />

          <AnimatePresence mode="wait">
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et extraire le texte brut en fichier TXT UTF-8.'
                    : 'or click to browse your folders and extract plain text into a UTF-8 TXT file.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Extraire le texte brut' : 'Extract plain text')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={tc.converting ?? (isFr ? 'Extraction du contenu texte...' : 'Extracting text content...')}
              />
            )}

            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadTxt ?? (isFr ? 'Télécharger le fichier TXT' : 'Download TXT file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={result.textOutput}
                      label={tc.copyText ?? (isFr ? 'Copier le texte' : 'Copy text')}
                      copiedLabel={tc.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{tc.previewText ?? (isFr ? "Voir l'aperçu" : 'Preview text')}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename}
              text={result.textOutput}
              onDownload={handleDownload}
              copyLabel={tc.copyText ?? (isFr ? 'Copier tout le texte' : 'Copy all text')}
              copiedLabel={tc.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
              downloadLabel={tc.downloadTxt ?? (isFr ? 'Télécharger le fichier TXT' : 'Download TXT file')}
            />
          )}

          <DocumentNextActionModal
            toolId="pdf-to-text"
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
