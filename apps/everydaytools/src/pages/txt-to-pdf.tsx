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
  TxtToPdfModeSelector,
  TxtToPdfPastePane,
} from '@/components/txt-to-pdf';
import { useTxtToPdfWorkflow } from '@/hooks/use-txt-to-pdf-workflow';

export default function TxtToPdf() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    mode,
    setMode,
    file,
    textInput,
    setTextInput,
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
  } = useTxtToPdfWorkflow();

  const pageTitle = t.tools['txt-to-pdf']?.title ?? 'Text to PDF';
  const pageDesc =
    t.tools['txt-to-pdf']?.description ??
    'Convert plain text into a cleanly formatted, paginated PDF document.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="txt-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Mode Switcher Pills */}
          {!isStaged && !result && !isProcessing && (
            <TxtToPdfModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={tc.tabUpload ?? (isFr ? 'Importer un fichier .txt' : 'Upload .txt file')}
              pasteLabel={tc.tabPaste ?? (isFr ? 'Saisir ou coller du texte' : 'Type or paste text')}
            />
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1A : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {mode === 'upload' && !file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre fichier texte' : 'Drag & drop your text file'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF mis en page (.pdf).'
                    : 'or click to browse your files and convert to paginated PDF (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier texte' : 'Select a text file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 1B : CODEWORKSPACE FOR PASTE MODE ─── */}
            {mode === 'paste' && !isStaged && !result && !isProcessing && (
              <TxtToPdfPastePane
                textInput={textInput}
                onTextInputChange={setTextInput}
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
                fileName={mode === 'upload' ? file?.name : (isFr ? 'texte-saisi.txt' : 'pasted-text.txt')}
                statusLabel={tc.converting ?? (isFr ? 'Génération du document PDF paginé en cours...' : 'Generating paginated PDF...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadPdf ?? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre texte' : 'Convert another text')}
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
            toolId="txt-to-pdf"
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
