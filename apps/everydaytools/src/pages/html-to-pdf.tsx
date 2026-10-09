import { AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { useHtmlToPdfWorkflow } from '@/hooks/use-html-to-pdf-workflow';
import {
  HtmlToPdfModeSelector,
  HtmlToPdfPastePane,
} from '@/components/html-to-pdf';

export default function HtmlToPdf() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    mode,
    setMode,
    file,
    htmlInput,
    setHtmlInput,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    isStaged,
    stagedFile,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
    handleOpenPreview,
  } = useHtmlToPdfWorkflow();

  const pageTitle = t.tools['html-to-pdf']?.title ?? 'HTML to PDF';
  const pageDesc =
    t.tools['html-to-pdf']?.description ??
    'Convert HTML snippets or files into structured, printable PDF documents.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="html-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <HtmlToPdfModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={tc.tabUpload ?? (isFr ? 'Importer un fichier (.html)' : 'Upload file (.html)')}
              pasteLabel={tc.tabPaste ?? (isFr ? 'Coller du code HTML' : 'Paste HTML code')}
            />
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1A : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {mode === 'upload' && !file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document HTML' : 'Drag & drop your HTML document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF mis en page (.pdf).'
                    : 'or click to browse your files and convert to paginated PDF (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier HTML' : 'Select an HTML file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 1B : CODEWORKSPACE FOR PASTE MODE ─── */}
            {mode === 'paste' && !isPastedStaged && !result && !isProcessing && (
              <HtmlToPdfPastePane
                htmlInput={htmlInput}
                onHtmlInputChange={setHtmlInput}
                onSubmit={() => setIsPastedStaged(true)}
                isFr={isFr}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {isStaged && stagedFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={stagedFile}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PDF' : 'Convert to PDF')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier / code' : 'Change file / code')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={mode === 'upload' ? file?.name : (isFr ? 'code-html.html' : 'html-code.html')}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Génération du document PDF haute fidélité...'
                    : 'Generating high-fidelity PDF...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadPdf ?? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={handleOpenPreview}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <Eye size={16} strokeWidth={2.2} />
                    <span>{isFr ? "Ouvrir l'aperçu PDF" : 'Open PDF preview'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          {/* Post-Download Action Continuum Modal */}
          <NextActionModal
            toolId="html-to-pdf"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
