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
import { usePdfToHtmlWorkflow } from '@/hooks/use-pdf-to-html-workflow';

export default function PdfToHtml() {
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
  } = usePdfToHtmlWorkflow();

  const title = t.tools['pdf-to-html']?.title ?? (isFr ? 'PDF en HTML' : 'PDF to HTML');
  const desc =
    t.tools['pdf-to-html']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en pages web HTML5 propres et réactives.'
      : 'Convert PDF documents into clean, responsive HTML web pages.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-html"
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en page HTML5 responsive (.html).'
                    : 'or click to browse your folders and convert to a responsive HTML5 page (.html).'
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
                statusLabel={tc.converting ?? (isFr ? 'Génération de la page HTML5 en cours...' : 'Generating HTML5 page...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT WITH QUICK COPY & PREVIEW ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadHtml ?? (isFr ? 'Télécharger le fichier .html' : 'Download .html file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    {/* Quick 1-Click Copy HTML Code Button */}
                    <CopyButton
                      text={result.htmlOutput}
                      label={isFr ? 'Copier le code HTML' : 'Copy HTML code'}
                      copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    {/* Shadcn Dialog Trigger: Voir l'aperçu du code */}
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Voir le code source' : 'View source code'}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Shadcn HTML Source Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename}
              text={result.htmlOutput}
              formatTag="HTML5 · UTF-8"
              onDownload={handleDownload}
              copyLabel={isFr ? 'Copier le code HTML' : 'Copy HTML code'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              downloadLabel={tc.downloadHtml ?? (isFr ? 'Télécharger le fichier .html' : 'Download .html file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-html"
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
