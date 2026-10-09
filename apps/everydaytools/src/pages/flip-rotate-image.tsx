import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ImageNextActionModal,
} from '@/components/conversion';
import { IMAGE_FORMAT } from '@/lib/flip-rotate-format-logic';
import { useFlipRotateWorkflow } from '@/hooks/use-flip-rotate-workflow';
import { FlipRotateWorkbench } from '@/components/flip-rotate';

export default function FlipRotateImage() {
  const { t, isFr } = useLocale();

  const {
    file,
    previewUrl,
    isDragging,
    rotation,
    flipH,
    flipV,
    outputFormat,
    imgRef,
    isDraggingRotation,
    isProcessing,
    error,
    exportedResult,
    isNextActionOpen,
    hasTransform,
    currentDims,
    setIsDragging,
    setOutputFormat,
    setIsNextActionOpen,
    handleFiles,
    handleResetTransform,
    handleFullReset,
    rotateLeft,
    rotateRight,
    rotate180,
    toggleFlipH,
    toggleFlipV,
    handleRotatePointerDown,
    handleRotatePointerMove,
    handleRotatePointerUp,
    handleDownload,
  } = useFlipRotateWorkflow(isFr);

  const titleText =
    t.tools?.['flip-rotate-image']?.title ??
    (isFr ? 'Pivoter et retourner une image' : 'Rotate & Flip Image');
  const descText =
    t.tools?.['flip-rotate-image']?.description ??
    (isFr
      ? "Ajustez l'orientation libre ou par crans et l'effet miroir avec prévisualisation en temps réel."
      : 'Adjust free or fixed orientation and mirror flip with real-time preview.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="flip-rotate-image"
    >
      <ToolWorkspace noGrid>
        <div className="w-full space-y-6">
          <AnimatePresence mode="wait">
            {/* Scène 1 : Dropzone canonique */}
            {!file && (
              <motion.div
                key="dropzone-screen"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full max-w-5xl mx-auto"
              >
                <ConversionDropzone
                  sourceFormat={IMAGE_FORMAT}
                  title={titleText}
                  description={
                    isFr
                      ? 'Déposez votre fichier pour modifier son orientation et son axe miroir.'
                      : 'Drop your file to adjust its orientation and mirror flip.'
                  }
                  buttonLabel={isFr ? 'Parcourir les fichiers' : 'Browse files'}
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff"
                  multiple={false}
                  isDragging={isDragging}
                  onFilesSelected={handleFiles}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) {
                      handleFiles(Array.from(e.dataTransfer.files));
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Scène 2 : Atelier studio pleine largeur */}
            {file && previewUrl && (
              <FlipRotateWorkbench
                file={file}
                previewUrl={previewUrl}
                imgRef={imgRef}
                currentDims={currentDims}
                rotation={rotation}
                flipH={flipH}
                flipV={flipV}
                outputFormat={outputFormat}
                hasTransform={hasTransform}
                isDraggingRotation={isDraggingRotation}
                isProcessing={isProcessing}
                error={error}
                isFr={isFr}
                onFullReset={handleFullReset}
                onRotateLeft={rotateLeft}
                onRotateRight={rotateRight}
                onRotate180={rotate180}
                onToggleFlipH={toggleFlipH}
                onToggleFlipV={toggleFlipV}
                onFormatChange={setOutputFormat}
                onResetTransform={handleResetTransform}
                onDownload={handleDownload}
                onRotatePointerDown={handleRotatePointerDown}
                onRotatePointerMove={handleRotatePointerMove}
                onRotatePointerUp={handleRotatePointerUp}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        toolId="flip-rotate-image"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={exportedResult?.blob}
        resultFilename={exportedResult?.filename}
      />
    </ToolPageLayout>
  );
}
