import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
} from '@/components/conversion';
import {
  TxtToDocxModeSelector,
  TxtToDocxPastePane,
} from '@/components/txt-to-docx';
import { useTxtToDocxWorkflow } from '@/hooks/use-txt-to-docx-workflow';

export default function TxtToDocx() {
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
  } = useTxtToDocxWorkflow();

  const pageTitle = t.tools['txt-to-docx']?.title ?? 'Text to Word';
  const pageDesc =
    t.tools['txt-to-docx']?.description ??
    'Convert plain text into an editable Microsoft Word document.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="txt-to-docx"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <TxtToDocxModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={tc.tabUpload ?? (isFr ? 'Importer un fichier (.txt)' : 'Upload file (.txt)')}
              pasteLabel={tc.tabPaste ?? (isFr ? 'Coller du texte' : 'Paste text')}
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document Microsoft Word (.docx).'
                    : 'or click to browse your files and convert to Microsoft Word (.docx).'
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
            {mode === 'paste' && !isPastedStaged && !result && !isProcessing && (
              <TxtToDocxPastePane
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Word' : 'Convert to Word')}
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
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Génération du document Microsoft Word (.docx)...'
                    : 'Generating Microsoft Word document (.docx)...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadDocx ?? (isFr ? 'Télécharger le document Word' : 'Download Word document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>

        <DocumentNextActionModal
          toolId="txt-to-docx"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={result?.blob}
          resultFilename={result?.filename}
          formatType="docx"
        />
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
