import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ImageNextActionModal,
} from '@/components/conversion';
import { IMAGE_FORMAT } from '@/lib/background-remover-logic';
import { useBackgroundRemoverWorkflow } from '@/hooks/use-background-remover-workflow';
import { RemoverStudioScene } from '@/components/background-remover/RemoverStudioScene';
import { RemoverBatchGallery } from '@/components/background-remover/RemoverBatchGallery';

export default function BackgroundRemoverPage() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const {
    queueState,
    backdrop,
    inspectedIndex,
    setInspectedIndex,
    isDragging,
    isCompositing,
    downloadedResult,
    isNextActionOpen,
    setIsNextActionOpen,
    isSingle,
    isInspecting,
    activeStudioItem,
    doneCountTotal,
    allBatchFinished,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFullReset,
    handleDownloadItem,
    handleDownloadBatchZip,
  } = useBackgroundRemoverWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.image,
        isFr ? "Supprimer l'arrière-plan" : 'Remove Background',
      ]}
      title={isFr ? "Supprimer l'arrière-plan" : 'Remove Background'}
      description={
        isFr
          ? 'Détourage automatique haute précision du sujet avec transparence PNG.'
          : 'High-precision automatic cutout with PNG transparency.'
      }
      seoSlug="background-remover"
    >
      <ToolWorkspace noGrid>
        <div className="w-full space-y-6">
          <AnimatePresence mode="wait">
            {/* SCÈNE 1 : DROPZONE CANONIQUE */}
            {queueState.queue.length === 0 && (
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
                  title={isFr ? "Supprimer l'arrière-plan" : 'Remove Background'}
                  description={
                    isFr
                      ? 'Déposez une ou plusieurs images pour isoler le sujet en haute définition.'
                      : 'Drop one or more images to isolate the subject in high resolution.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une ou plusieurs images' : 'Select one or more images'}
                  accept="image/jpeg,image/png,image/webp"
                  multiple={true}
                  isDragging={isDragging}
                  onFileSelected={(file) => queueState.handleFiles([file])}
                  onFilesSelected={queueState.handleFiles}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </motion.div>
            )}

            {/* SCÈNE 2 : ATELIER STUDIO DE DÉTOURAGE (SINGLE / INSPECT) */}
            {(isSingle || isInspecting) && activeStudioItem && (
              <RemoverStudioScene
                key={`studio-${activeStudioItem.id}`}
                item={activeStudioItem}
                isInspecting={isInspecting}
                onBackToGallery={() => setInspectedIndex(null)}
                onFullReset={handleFullReset}
                viewMode={backdrop.viewMode}
                onViewModeChange={backdrop.setViewMode}
                backdropType={backdrop.backdropType}
                onBackdropTypeChange={backdrop.setBackdropType}
                customColor={backdrop.customColor}
                onCustomColorChange={backdrop.setCustomColor}
                customBgUrl={backdrop.customBgUrl}
                customBgInputRef={backdrop.customBgInputRef}
                onCustomBgChange={backdrop.handleCustomBgChange}
                stageBackgroundStyle={backdrop.stageBackgroundStyle}
                isCompositing={isCompositing}
                onDownload={() => handleDownloadItem(activeStudioItem)}
                onRetry={() => queueState.retryItem(inspectedIndex ?? 0)}
                isFr={isFr}
              />
            )}

            {/* SCÈNE 3 : GALERIE PAR LOT (MULTI-IMAGES) */}
            {!isSingle && !isInspecting && queueState.queue.length > 1 && (
              <RemoverBatchGallery
                key="batch-screen"
                queue={queueState.queue}
                isProcessing={queueState.isProcessing}
                doneCountTotal={doneCountTotal}
                allBatchFinished={allBatchFinished}
                onFullReset={handleFullReset}
                onCancel={queueState.handleCancel}
                onDownloadItem={handleDownloadItem}
                onDownloadBatchZip={handleDownloadBatchZip}
                onInspectItem={setInspectedIndex}
                isFr={isFr}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        toolId="background-remover"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={downloadedResult?.blob}
        resultFilename={downloadedResult?.filename}
      />
    </ToolPageLayout>
  );
}
