import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { ConversionDropzone, type ConversionFormat } from '@/components/conversion';
import { useFaviconWorkflow } from '@/hooks/use-favicon-workflow';
import { FaviconTopBar } from '@/components/favicon-generator/FaviconTopBar';
import { FaviconControlBar } from '@/components/favicon-generator/FaviconControlBar';
import { FaviconAlerts } from '@/components/favicon-generator/FaviconAlerts';
import { FaviconBrowserPreview } from '@/components/favicon-generator/FaviconBrowserPreview';
import { FaviconMobilePreview } from '@/components/favicon-generator/FaviconMobilePreview';
import { FaviconSearchPreview } from '@/components/favicon-generator/FaviconSearchPreview';
import { FaviconSizesGrid } from '@/components/favicon-generator/FaviconSizesGrid';
import { FaviconCodePanel } from '@/components/favicon-generator/FaviconCodePanel';

const SOURCE_IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'png',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'PNG, SVG, JPG, WebP, AVIF',
};

export default function FaviconGenerator() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const {
    file,
    sourceUrl,
    dimensions,
    isDragging,
    setIsDragging,
    handleFiles,
    padding,
    setPadding,
    bgColor,
    setBgColor,
    previewShape,
    setPreviewShape,
    stageView,
    setStageView,
    browserTheme,
    setBrowserTheme,
    compositedUrl,
    isProcessing,
    error,
    result,
    activeCodeTab,
    setActiveCodeTab,
    isModified,
    handleResetAdjustments,
    handleFullReset,
    handleGenerateZip,
    handleDownloadSingle,
    handleDownloadCachedZip,
    activeCodeSnippet,
    handleDownloadManifestFile,
  } = useFaviconWorkflow(isFr);

  const pageTitle = t.tools?.['favicon-generator']?.title ?? (isFr ? 'Générateur de Favicon' : 'Favicon Generator');
  const pageDesc =
    t.tools?.['favicon-generator']?.description ??
    (isFr
      ? "Atelier de conception et calibration d'icônes web. Générez vos packs de favicons multi-résolutions (.ico, PNG Retina, Apple Touch et manifestes PWA)."
      : 'Web icon studio. Generate complete multi-resolution favicon packs (.ico, Retina PNG, Apple Touch, and PWA manifests).');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.image, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="favicon-generator"
    >
      <ToolWorkspace noGrid={true}>
        <div className="w-full">
          <AnimatePresence mode="wait">
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
                  sourceFormat={SOURCE_IMAGE_FORMAT}
                  title={isFr ? "Glissez votre logo ou icône pour générer tous vos favicons" : "Drag and drop your logo or icon to generate all favicons"}
                  description={isFr ? "Résolution recommandée de 512×512 px minimum au format PNG, SVG, JPG, WebP ou AVIF." : "Recommended resolution 512×512 px minimum in PNG, SVG, JPG, WebP or AVIF."}
                  buttonLabel={isFr ? "Sélectionner une image" : "Select an image"}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
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

            {file && sourceUrl && (
              <motion.div
                key="favicon-studio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full space-y-6"
              >
                <FaviconTopBar
                  file={file}
                  dimensions={dimensions}
                  stageView={stageView}
                  onStageViewChange={setStageView}
                  isModified={isModified}
                  isProcessing={isProcessing}
                  onFullReset={handleFullReset}
                  onResetAdjustments={handleResetAdjustments}
                  onGenerateZip={handleGenerateZip}
                  isFr={isFr}
                  sourceFormatIcon={SOURCE_IMAGE_FORMAT.icon}
                />

                <FaviconAlerts
                  error={error}
                  result={result}
                  onRetry={handleGenerateZip}
                  onDownloadCachedZip={handleDownloadCachedZip}
                  isFr={isFr}
                />

                <div className="w-full space-y-4">
                  <FaviconControlBar
                    previewShape={previewShape}
                    onShapeChange={setPreviewShape}
                    padding={padding}
                    onPaddingChange={setPadding}
                    bgColor={bgColor}
                    onBgColorChange={setBgColor}
                    stageView={stageView}
                    browserTheme={browserTheme}
                    onBrowserThemeChange={setBrowserTheme}
                    isFr={isFr}
                  />

                  <div className="w-full min-h-[440px] rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 p-6 sm:p-10 flex flex-col justify-center items-center shadow-xs">
                    {stageView === 'browser' && (
                      <FaviconBrowserPreview compositedUrl={compositedUrl} browserTheme={browserTheme} isFr={isFr} />
                    )}
                    {stageView === 'mobile' && (
                      <FaviconMobilePreview compositedUrl={compositedUrl} isFr={isFr} />
                    )}
                    {stageView === 'search' && (
                      <FaviconSearchPreview compositedUrl={compositedUrl} isFr={isFr} />
                    )}
                    {stageView === 'manifest' && (
                      <FaviconSizesGrid compositedUrl={compositedUrl} onDownloadSingle={handleDownloadSingle} isFr={isFr} />
                    )}
                    {stageView === 'code' && (
                      <FaviconCodePanel
                        activeCodeTab={activeCodeTab}
                        onTabChange={setActiveCodeTab}
                        activeCodeSnippet={activeCodeSnippet}
                        onDownloadManifestFile={handleDownloadManifestFile}
                        isFr={isFr}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
