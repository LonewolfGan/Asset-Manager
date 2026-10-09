import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
  ImageNextActionModal,
} from '@/components/conversion';
import { useMetadataCleanerWorkflow } from '@/hooks/use-metadata-cleaner-workflow';
import { MetadataCleanerWorkbench } from '@/components/metadata-cleaner';
import {
  getSourceDropzoneFormat,
  buildResultMetadataText,
} from '@/lib/metadata-cleaner-logic';

export default function MetadataCleaner() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const {
    file,
    isDragging,
    isInspecting,
    inspection,
    activeFilter,
    previewUrl,
    isPreviewLoading,
    isProcessing,
    error,
    result,
    isNextActionOpen,
    targetFormat,
    telemetryDetails,
    visibleTags,
    setFiles,
    setActiveFilter,
    setIsNextActionOpen,
    handleReset,
    handleClean,
    handleDownload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useMetadataCleanerWorkflow(isFr);

  const title =
    t.tools['metadata-cleaner']?.title ??
    (isFr ? 'Nettoyeur de métadonnées' : 'Metadata Cleaner');
  const desc =
    t.tools['metadata-cleaner']?.description ??
    (isFr
      ? 'Supprimez les données cachées EXIF, GPS et métadonnées de vos documents et photos.'
      : 'Purge hidden EXIF, GPS, and metadata from your documents and photos.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.privacy, title]}
      title={title}
      description={desc}
      seoSlug="metadata-cleaner"
    >
      <ToolWorkspace noGrid={true}>
        <AnimatePresence mode="wait">
          {/* SCÈNE 1 : DROPZONE CANONIQUE (max-w-5xl mx-auto) */}
          {!file && !result && (
            <div key="scene-dropzone" className="w-full max-w-5xl mx-auto">
              <ConversionDropzone
                sourceFormat={getSourceDropzoneFormat(isFr)}
                title={
                  isFr
                    ? 'Déposez une image ou un PDF à nettoyer'
                    : 'Drop an image or PDF to clean'
                }
                description={
                  isFr
                    ? "Supprimez les coordonnées GPS, l'appareil photo, les dates et les identifiants d'auteur."
                    : 'Purge GPS coordinates, camera model, timestamps, and author tags.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select file'}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff,.tif,application/pdf,image/*"
                multiple={false}
                isDragging={isDragging}
                onFileSelected={(f) => setFiles([f])}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            </div>
          )}

          {/* SCÈNE 2 : ATELIER SOBRE */}
          {file && !result && (
            <MetadataCleanerWorkbench
              file={file}
              telemetryDetails={telemetryDetails}
              isProcessing={isProcessing}
              error={error}
              previewUrl={previewUrl}
              isPreviewLoading={isPreviewLoading}
              targetFormat={targetFormat}
              inspection={inspection}
              visibleTags={visibleTags}
              activeFilter={activeFilter}
              isInspecting={isInspecting}
              isFr={isFr}
              onReset={handleReset}
              onClean={handleClean}
              onFilterChange={setActiveFilter}
            />
          )}

          {/* SCÈNE 3 : TÉLÉCHARGEMENT DIRECT ET SOBRE */}
          {result && (
            <div key="scene-result" className="w-full">
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={buildResultMetadataText(
                  result.sizeBefore,
                  result.sizeAfter,
                  isFr
                )}
                downloadBtnLabel={isFr ? 'Télécharger le fichier' : 'Download file'}
                resetBtnLabel={isFr ? 'Nettoyer un autre fichier' : 'Clean another file'}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadBtnColor={targetFormat.color}
              />
            </div>
          )}
        </AnimatePresence>
      </ToolWorkspace>

      {targetFormat.extension === 'pdf' ? (
        <NextActionModal
          toolId="metadata-cleaner"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={result?.blob}
          resultFilename={result?.filename}
        />
      ) : (
        <ImageNextActionModal
          toolId="metadata-cleaner"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={result?.blob}
          resultFilename={result?.filename}
        />
      )}
    </ToolPageLayout>
  );
}
