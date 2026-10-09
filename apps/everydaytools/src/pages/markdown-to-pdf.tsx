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
  NextActionModal,
} from '@/components/conversion';
import {
  MarkdownToPdfModeSelector,
  MarkdownToPdfPastePane,
} from '@/components/markdown-to-pdf';
import { useMarkdownToPdfWorkflow } from '@/hooks/use-markdown-to-pdf-workflow';

export default function MarkdownToPdf() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    mode,
    setMode,
    file,
    markdownInput,
    setMarkdownInput,
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
  } = useMarkdownToPdfWorkflow();

  const pageTitle = t.tools['markdown-to-pdf']?.title ?? 'Markdown to PDF';
  const pageDesc =
    t.tools['markdown-to-pdf']?.description ??
    'Convert Markdown (.md) or text files into an elegant, formatted PDF document.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="markdown-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <MarkdownToPdfModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={isFr ? 'Importer un fichier (.md)' : 'Upload file (.md)'}
              pasteLabel={isFr ? 'Coller du Markdown' : 'Paste Markdown'}
            />
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1A : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {mode === 'upload' && !file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre fichier Markdown' : 'Drag and drop your Markdown file'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF haute fidélité (.pdf).'
                    : 'or click to browse your folders and convert to a high-fidelity PDF document (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier Markdown' : 'Select a Markdown file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 1B : CODEWORKSPACE FOR PASTE MODE ─── */}
            {mode === 'paste' && !isStaged && !result && !isProcessing && (
              <MarkdownToPdfPastePane
                markdownInput={markdownInput}
                onMarkdownInputChange={setMarkdownInput}
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
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de texte / fichier' : 'Change text / file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={mode === 'upload' ? file?.name : 'saisie-markdown.md'}
                statusLabel={tc.converting ?? (isFr ? 'Compilation du document PDF haute fidélité...' : 'Compiling high-fidelity PDF document...')}
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
            toolId="markdown-to-pdf"
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
