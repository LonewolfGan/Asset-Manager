import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ImageNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { useImageFiltersWorkflow } from '@/hooks/use-image-filters-workflow';
import { FiltersTopBar } from '@/components/image-filters/FiltersTopBar';
import { FiltersViewport } from '@/components/image-filters/FiltersViewport';
import { FiltersConsoleSection } from '@/components/image-filters/FiltersConsoleSection';

const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'png',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'PNG, JPEG, WebP, AVIF, TIFF',
};

export default function ImageFilters() {
  const { t, isFr } = useLocale();

  const {
    file,
    previewUrl,
    originalDims,
    isDragging,
    setIsDragging,
    settings,
    activePresetId,
    presetIntensity,
    consoleTab,
    setConsoleTab,
    viewMode,
    setViewMode,
    isHoldingOriginal,
    setIsHoldingOriginal,
    isExportMenuOpen,
    setIsExportMenuOpen,
    isExporting,
    error,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedFile,
    scrollState,
    setFilmstripRef,
    updateScrollState,
    scrollFilmstrip,
    cssFilterString,
    formatOptions,
    hasModifications,
    handleFiles,
    handleSelectPreset,
    handleIntensityChange,
    handleAdjustChannel,
    handleResetChannel,
    handleResetAll,
    handleFullReset,
    handleExportWithFormat,
  } = useImageFiltersWorkflow(isFr);

  const titleText =
    t.tools?.['image-filters']?.title ??
    (isFr ? 'Filtres & Effets de Couleur' : 'Filters & Color Effects');
  const descText =
    t.tools?.['image-filters']?.description ??
    (isFr
      ? "Studio de color grading photographique haute fidélité avec 27 presets esthétiques en temps réel et console d'ajustements tactiles."
      : 'High-fidelity photographic color grading studio with 27 real-time aesthetic presets and tactile adjustment console.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="image-filters"
    >
      <ToolWorkspace noGrid={true}>
        <div className="w-full">
          <AnimatePresence mode="wait">
            {/* Scène 1 : Dropzone Canonique Standardisée (Règle 23) */}
            {!file && (
              <motion.div
                key="upload-scene"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-5xl mx-auto"
              >
                <ConversionDropzone
                  sourceFormat={IMAGE_FORMAT}
                  title={isFr ? 'Glissez une photo pour ouvrir le studio de filtres' : 'Drop a photo to open the filter studio'}
                  description={isFr ? 'Explorez 27 presets argentiques, vintage, cinéma et noir & blanc avec console tactile.' : 'Explore 27 legendary film, vintage, cinema, and black & white presets with tactile console.'}
                  buttonLabel={isFr ? 'Sélectionner une photo' : 'Select a photo'}
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff"
                  multiple={false}
                  isDragging={isDragging}
                  onFilesSelected={handleFiles}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) handleFiles(Array.from(e.dataTransfer.files));
                  }}
                />
              </motion.div>
            )}

            {/* Scène 2 : Le Studio Photographique (Règle 35 : Pleine Largeur) */}
            {file && previewUrl && (
              <motion.div
                key="darkroom-studio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full space-y-4"
              >
                {/* Barre de commande supérieure */}
                <FiltersTopBar
                  file={file}
                  originalDims={originalDims}
                  imageFormat={IMAGE_FORMAT}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  hasModifications={hasModifications}
                  onResetAll={handleResetAll}
                  onFullReset={handleFullReset}
                  isExportMenuOpen={isExportMenuOpen}
                  setIsExportMenuOpen={setIsExportMenuOpen}
                  isExporting={isExporting}
                  onExportWithFormat={handleExportWithFormat}
                  formatOptions={formatOptions}
                  isFr={isFr}
                />

                {/* Viewport Darkroom (Split CompareReveal ou Direct) */}
                <FiltersViewport
                  previewUrl={previewUrl}
                  cssFilterString={cssFilterString}
                  viewMode={viewMode}
                  isHoldingOriginal={isHoldingOriginal}
                  setIsHoldingOriginal={setIsHoldingOriginal}
                  error={error}
                  isFr={isFr}
                />

                {/* Console de Color Grading */}
                <FiltersConsoleSection
                  consoleTab={consoleTab}
                  setConsoleTab={setConsoleTab}
                  previewUrl={previewUrl}
                  activePresetId={activePresetId}
                  presetIntensity={presetIntensity}
                  onSelectPreset={handleSelectPreset}
                  onIntensityChange={handleIntensityChange}
                  filmstripRef={setFilmstripRef}
                  scrollState={scrollState}
                  onScrollFilmstrip={scrollFilmstrip}
                  onUpdateScrollState={updateScrollState}
                  settings={settings}
                  onAdjustChannel={handleAdjustChannel}
                  onResetChannel={handleResetChannel}
                  isFr={isFr}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="image-filters"
        file={downloadedFile}
      />
    </ToolPageLayout>
  );
}
