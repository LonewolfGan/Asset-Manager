import { AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { CopyButton } from '@/components/ui/copy-button';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
} from '@/components/conversion';
import { useHtmlToMarkdownWorkflow } from '@/hooks/use-html-to-markdown-workflow';
import {
  HtmlToMarkdownModeSelector,
  HtmlToMarkdownPastePane,
} from '@/components/html-to-markdown';

export default function HtmlToMarkdown() {
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
    previewOpen,
    setPreviewOpen,
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
  } = useHtmlToMarkdownWorkflow();

  const pageTitle = t.tools['html-to-markdown']?.title ?? 'HTML to Markdown';
  const pageDesc =
    t.tools['html-to-markdown']?.description ??
    'Convert HTML content to clean, readable Markdown format in your browser.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="html-to-markdown"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <HtmlToMarkdownModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={tc.tabUpload ?? (isFr ? 'Importer un fichier (.html)' : 'Upload file (.html)')}
              pasteLabel={tc.tabPaste ?? (isFr ? 'Coller du code HTML' : 'Paste HTML code')}
            />
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1A : UPLOAD DROPZONE ─── */}
            {mode === 'upload' && !file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document HTML' : 'Drag & drop your HTML document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en syntaxe Markdown épurée (.md).'
                    : 'or click to browse your files and convert to clean Markdown syntax (.md).'
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
              <HtmlToMarkdownPastePane
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Markdown' : 'Convert to Markdown')}
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
                    ? 'Conversion du code HTML en Markdown épuré...'
                    : 'Converting HTML code to clean Markdown...')
                }
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
                      label={isFr ? 'Copier le Markdown' : 'Copy Markdown'}
                      size="md"
                      className="h-12 px-6 rounded-full text-base font-medium shadow-sm"
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
              copyLabel={isFr ? 'Copier le Markdown' : 'Copy Markdown'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              formatTag="Markdown · UTF-8"
            />
          )}

          <DocumentNextActionModal
            toolId="html-to-markdown"
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
