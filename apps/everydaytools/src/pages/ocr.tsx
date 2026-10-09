import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { formatBytes } from '@/lib/utils';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
} from '@/components/conversion';
import { OcrLanguageSelector, OcrErrorBanner } from '@/components/ocr';
import { useOcrWorkflow } from '@/hooks/use-ocr-workflow';

export default function Ocr() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    supportedLanguages,
    file,
    lang,
    setLang,
    isProcessing,
    progress,
    error,
    setError,
    isDragging,
    result,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleExtract,
    handleReset,
    handleDownload,
  } = useOcrWorkflow();

  const title = t.tools['ocr']?.title ?? 'OCR — Image to Text';
  const desc =
    t.tools['ocr']?.description ??
    'Extraire le texte de vos images et scans haute fidélité avec reconnaissance optique OCR.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.tools, title]}
      title={title}
      description={desc}
      seoSlug="ocr"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Error Banner */}
          <OcrErrorBanner
            error={error}
            onClear={() => setError(null)}
            closeLabel={isFr ? 'Fermer' : 'Close'}
          />

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!file && !result && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  accept="image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif,.gif"
                  title={
                    isFr
                      ? 'Glissez-déposez votre image ou document scanné'
                      : 'Drag and drop your image or scanned document'
                  }
                  description={
                    isFr
                      ? "ou cliquez pour parcourir vos fichiers (JPG, PNG, WEBP, TIFF, BMP, GIF) et extraire l'intégralité du texte en haute précision."
                      : 'or click to browse your files (JPG, PNG, WEBP, TIFF, BMP, GIF) and extract full text with high accuracy.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une image' : 'Select an image'}
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : ATELIER STAGING NOBLE (ConversionStaging) ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                targetFileName={file.name.replace(/\.[^/.]+$/, '') + (isFr ? '_texte.txt' : '_text.txt')}
                targetSubLabel={targetFormat.subLabel}
                optionsSlot={
                  <OcrLanguageSelector
                    lang={lang}
                    onLangChange={setLang}
                    disabled={isProcessing}
                    supportedLanguages={supportedLanguages}
                    ariaLabel={tc.languageLabel ?? (isFr ? 'Langue du document' : 'Document language')}
                  />
                }
                convertBtnLabel={tc.extractBtn ?? (isFr ? 'Extraire le texte (OCR)' : 'Extract Text (OCR)')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? "Changer d'image" : 'Change image')}
                onConvert={handleExtract}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  progress > 0
                    ? isFr
                      ? `Reconnaissance optique du texte... ${progress}%`
                      : `Optical text recognition... ${progress}%`
                    : tc.extracting ??
                      (isFr
                        ? "Extraction du texte de l'image par OCR..."
                        : 'Extracting text from image via OCR...')
                }
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET INSPECTION DU TEXTE (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={`${result.wordCount} ${isFr ? 'mots' : 'words'} · ${result.charCount} ${isFr ? 'caractères' : 'characters'} · ${formatBytes(result.sizeAfter)}`}
                downloadBtnLabel={tc.downloadTxt ?? (isFr ? 'Télécharger le fichier .txt' : 'Download .txt file')}
                downloadBtnColor="#18181b"
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Scanner une autre image' : 'Scan another image')}
                onDownload={handleDownload}
                onReset={handleReset}
              >
                <div className="w-full max-w-4xl mx-auto mt-6 text-left">
                  <CodeWorkspace
                    value={result.text}
                    mode="preview"
                    format="txt"
                    formatLabel={isFr ? 'Texte extrait · OCR' : 'Extracted text · OCR'}
                    downloadFilename={result.filename}
                    onDownload={handleDownload}
                    minHeight="280px"
                    maxHeight="460px"
                  />
                </div>
              </ConversionResult>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
