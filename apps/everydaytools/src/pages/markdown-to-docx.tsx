import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Sparkles } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';
import {
  MarkdownToDocxModeSelector,
  MarkdownToDocxPastePane,
} from '@/components/markdown-to-docx';
import { useMarkdownToDocxWorkflow } from '@/hooks/use-markdown-to-docx-workflow';

export default function MarkdownToDocx() {
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
  } = useMarkdownToDocxWorkflow();

  const pageTitle =
    t.tools?.['markdown-to-docx']?.title ??
    (isFr ? 'Markdown en Word' : 'Markdown to Word');
  const pageDesc =
    t.tools?.['markdown-to-docx']?.description ??
    (isFr
      ? 'Convertissez du Markdown en un vrai document Word.'
      : 'Convert Markdown files to Microsoft Word (.docx) format.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="markdown-to-docx"
          isFr={isFr}
          getCurrentFile={() => file}
          getCurrentText={() => markdownInput}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="markdown-to-docx"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <MarkdownToDocxModeSelector
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
                key="dropzone"
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre fichier Markdown' : 'Drag and drop your Markdown file'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document Microsoft Word (.docx).'
                    : 'or click to browse your folders and convert to Microsoft Word (.docx).'
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
              <MarkdownToDocxPastePane
                key="paste"
                markdownInput={markdownInput}
                onMarkdownInputChange={setMarkdownInput}
                onSubmit={() => setIsPastedStaged(true)}
                isFr={isFr}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {isStaged && stagedFile && !result && !isProcessing && (
              <ConversionStaging
                key="staging"
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={stagedFile}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Word' : 'Convert to Word')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de texte / fichier' : 'Change text / file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                key="conduit"
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={mode === 'upload' ? file?.name : 'saisie-markdown.md'}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Génération du document Word DOCX en cours...'
                    : 'Generating Word DOCX document...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                key="result"
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadDocx ?? (isFr ? 'Télécharger le document Word' : 'Download Word document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre fichier' : 'Convert another file')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={() => setIsNextActionOpen(true)}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[transform,background-color,border-color] duration-150 flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <Sparkles size={16} strokeWidth={2.2} className="text-amber-500" />
                    <span>{isFr ? 'Actions suivantes' : 'Next actions'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          {/* Post-Conversion Document Continuum Modal */}
          <DocumentNextActionModal
            toolId="markdown-to-docx"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="docx"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
