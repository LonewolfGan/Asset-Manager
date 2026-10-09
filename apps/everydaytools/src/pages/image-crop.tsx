import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { IMAGE_FORMAT } from '../lib/image-crop-logic';
import { ConversionDropzone } from '../components/conversion/ConversionDropzone';
import { ImageNextActionModal } from '../components/conversion/ImageNextActionModal';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useImageCropWorkflow } from '../hooks/use-image-crop-workflow';
import { ImageCropWorkbench } from '../components/image-crop/ImageCropWorkbench';
import { ImageCropResultShowcase } from '../components/image-crop/ImageCropResultShowcase';

export default function ImageCrop() {
  const { t, isFr } = useLocale();

  const {
    file,
    crop,
    setCrop,
    origW,
    origH,
    aspectRatio,
    imgObj,
    resultPreviewUrl,
    result,
    isDragging,
    isProcessing,
    error,
    setError,
    isModified,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSelectAspectPreset,
    handleSwapOrientation,
    handleCenterCrop,
    handleMaximizeCrop,
    handleResetCrop,
    handleProcessCrop,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
    originalRatioLabel,
    croppedRatioLabel,
    surfaceRetainedPct,
  } = useImageCropWorkflow();

  const titleText = t.tools?.['image-crop']?.title ?? (isFr ? 'Recadrer une image' : 'Crop Image');
  const descText =
    t.tools?.['image-crop']?.description ??
    (isFr
      ? 'Atelier photographique de recadrage précis avec ratios prédéfinis et vue studio cinématique.'
      : 'Precise photo cropping studio with aspect ratios and cinematic workbench.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="image-crop"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Alerte Erreur */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DROPZONE CANONIQUE (max-w-5xl mx-auto) ─── */}
            {!file && (
              <motion.div
                key="dropzone-scene"
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
                      ? 'Glissez-déposez votre image ici (JPEG, PNG, WebP, AVIF) ou cliquez pour parcourir votre appareil.'
                      : 'Drag and drop your image here (JPEG, PNG, WebP, AVIF) or click to browse your device.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une image' : 'Select an image'}
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </motion.div>
            )}

            {/* ─── SCÈNE 2 : L'ATELIER STUDIO PRO ─── */}
            {file && !result && (
              <motion.div
                key="studio-scene"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full space-y-6"
              >
                <ImageCropWorkbench
                  file={file}
                  origW={origW}
                  origH={origH}
                  isModified={isModified}
                  isProcessing={isProcessing}
                  onFullReset={handleFullReset}
                  onResetCrop={handleResetCrop}
                  onProcessCrop={handleProcessCrop}
                  imgObj={imgObj}
                  crop={crop}
                  setCrop={setCrop}
                  aspectRatio={aspectRatio}
                  onCenterCrop={handleCenterCrop}
                  onMaximizeCrop={handleMaximizeCrop}
                  onSelectAspectPreset={handleSelectAspectPreset}
                  onSwapOrientation={handleSwapOrientation}
                  croppedRatioLabel={croppedRatioLabel}
                  surfaceRetainedPct={surfaceRetainedPct}
                />
              </motion.div>
            )}

            {/* ─── SCÈNE 3 : SCÈNE DE RÉSULTAT COMPACTE & DIRECTE ─── */}
            {file && result && !isProcessing && (
              <motion.div
                key="result-scene"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full"
              >
                <ImageCropResultShowcase
                  result={result}
                  resultPreviewUrl={resultPreviewUrl}
                  origW={origW}
                  origH={origH}
                  originalRatioLabel={originalRatioLabel}
                  onDownload={handleDownload}
                  onBackToEditor={handleBackToEditor}
                  onFullReset={handleFullReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        toolId="image-crop"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
