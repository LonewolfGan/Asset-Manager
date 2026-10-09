import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ImageNextActionModal,
} from '@/components/conversion';
import {
  PdfToImageFormatSwitcher,
  PdfToImageErrorBanner,
} from '@/components/pdf-to-image';
import { usePdfToImageWorkflow } from '@/hooks/use-pdf-to-image-workflow';

export default function PdfToImage() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    formatConfigs,
    targetFormat,
    file,
    format,
    setFormat,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConvert,
    handleReset,
    handleDownload,
  } = usePdfToImageWorkflow();

  const title = t.tools['pdf-to-image']?.title ?? (isFr ? 'PDF en Images' : 'PDF to Image');
  const desc =
    t.tools['pdf-to-image']?.description ??
    (isFr
      ? 'Convertissez vos pages PDF en images haute définition (PNG, JPG, WEBP, AVIF, TIFF, GIF).'
      : 'Convert PDF pages into crisp images in PNG, JPG, WEBP, AVIF, TIFF or GIF.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-image"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
          <PdfToImageErrorBanner
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
                  title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers et convertir vos pages en images haute définition (PNG, JPG, WEBP, AVIF, TIFF, GIF).'
                      : 'or click to browse your files and convert your pages into high-definition images (PNG, JPG, WEBP, AVIF, TIFF, GIF).'
                  }
                  buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
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
                targetFileName={
                  file.name.replace(/\.[^/.]+$/, '') +
                  `_images.${targetFormat.extension}`
                }
                targetSubLabel={targetFormat.subLabel}
                optionsSlot={
                  <PdfToImageFormatSwitcher
                    format={format}
                    onFormatChange={setFormat}
                    formatConfigs={formatConfigs}
                  />
                }
                convertBtnLabel={tc.convertBtn ?? (isFr ? `Convertir en ${targetFormat.name}` : `Convert to ${targetFormat.name}`)}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={tc.converting ?? (isFr ? 'Extraction des images en cours...' : 'Extracting images...')}
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  result.isZip
                    ? (isFr ? 'Télécharger le pack ZIP des images' : 'Download images ZIP archive')
                    : (isFr ? `Télécharger l'image ${targetFormat.name}` : `Download ${targetFormat.name} image`)
                }
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-to-image"
        file={result && !result.isZip ? new File([result.blob], result.filename, { type: 'image/' + (format === 'jpeg' ? 'jpeg' : format) }) : null}
      />
    </ToolPageLayout>
  );
}
