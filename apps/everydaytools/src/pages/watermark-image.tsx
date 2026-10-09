import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { ConversionDropzone, ImageNextActionModal, type ConversionFormat } from '@/components/conversion';
import { useLocale } from '@/hooks/use-locale';
import { useWatermarkWorkflow } from '@/hooks/use-watermark-workflow';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { ActionTooltip } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WatermarkCanvasViewport } from '@/components/watermark-image/WatermarkCanvasViewport';
import { WatermarkControlPanel } from '@/components/watermark-image/WatermarkControlPanel';

const SOURCE_IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'png',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'PNG, JPEG, WebP, AVIF, TIFF',
};

export default function WatermarkImage() {
  const { t, isFr } = useLocale();

  const {
    file,
    previewUrl,
    originalDims,
    isDragging,
    setIsDragging,
    config,
    setConfig,
    isHoldingOriginal,
    setIsHoldingOriginal,
    isExportMenuOpen,
    setIsExportMenuOpen,
    isExporting,
    error,
    exportedResult,
    isNextActionOpen,
    setIsNextActionOpen,
    canvasRef,
    viewportContainerRef,
    handleFiles,
    handleFullReset,
    handleResetConfig,
    handleTogglePosition,
    handleExportWithFormat,
    hasModifications,
    selectedFont,
    colorSwatches,
  } = useWatermarkWorkflow(isFr);

  const titleText =
    t.tools?.['watermark-image']?.title ??
    (isFr ? 'Ajouter un Filigrane à une Image' : 'Add Watermark to Image');
  const descText =
    t.tools?.['watermark-image']?.description ??
    (isFr
      ? 'Studio de protection et marquage visuel haute fidélité. Signature typographique, matrice multi-points et trame diagonale antivol.'
      : 'High-fidelity visual protection and watermarking studio. Typographic signature, multi-point matrix, and anti-theft diagonal pattern.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="watermark-image"
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
                  sourceFormat={SOURCE_IMAGE_FORMAT}
                  title={
                    isFr
                      ? 'Glissez une image pour ouvrir le studio de filigrane'
                      : 'Drop an image to open the watermark studio'
                  }
                  description={
                    isFr
                      ? 'Ajoutez une signature typographique ©, une mention légale ou une trame diagonale antivol avec rendu haute résolution.'
                      : 'Add a typographic signature ©, legal notice or anti-theft diagonal pattern in high resolution.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une image' : 'Select an image'}
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

            {/* Scène 2 : L'Atelier Studio de Marquage (Règle 35 : Pleine Largeur) */}
            {file && previewUrl && (
              <motion.div
                key="watermark-studio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full space-y-4"
              >
                {/* Barre de commande supérieure unifiée StudioCommandBar */}
                <StudioCommandBar
                  meta={{
                    name: file.name,
                    size: file.size,
                    icon: getFileFormatIcon(file, SOURCE_IMAGE_FORMAT.icon),
                    dimensions: originalDims ? { width: originalDims.w, height: originalDims.h } : undefined,
                  }}
                  onReset={handleFullReset}
                  resetLabel={isFr ? "Changer d'image" : 'Change image'}
                  isModified={hasModifications}
                  onResetChanges={handleResetConfig}
                  centerControls={
                    <ActionTooltip
                      label={
                        isFr
                          ? 'Maintenir enfoncé pour voir sans filigrane (Touche Espace)'
                          : 'Hold to view without watermark (Space key)'
                      }
                    >
                      <button
                        type="button"
                        onMouseDown={() => setIsHoldingOriginal(true)}
                        onMouseUp={() => setIsHoldingOriginal(false)}
                        onTouchStart={() => setIsHoldingOriginal(true)}
                        onTouchEnd={() => setIsHoldingOriginal(false)}
                        className="hidden md:flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer select-none"
                      >
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[11px] transition-colors',
                            isHoldingOriginal
                              ? 'bg-[#FF6B35] text-white border-transparent'
                              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300'
                          )}
                        >
                          {isFr ? 'Espace' : 'Space'}
                        </span>
                        <span>
                          {isHoldingOriginal
                            ? isFr
                              ? 'Original affiché'
                              : 'Original shown'
                            : isFr
                              ? 'Maintenir pour voir sans filigrane'
                              : 'Hold to view without watermark'}
                        </span>
                      </button>
                    </ActionTooltip>
                  }
                  actionSlot={
                    <Popover open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={isExporting}
                          className="flex items-center gap-2 h-9 px-4 rounded-xl font-semibold text-xs text-white bg-[#FF6B35] hover:bg-[#ff5a1f] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExporting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isFr ? 'Exportation...' : 'Exporting...'}</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>{isFr ? 'Exporter' : 'Export'}</span>
                              <ChevronDown
                                className={cn(
                                  'w-3 h-3 transition-transform duration-200',
                                  isExportMenuOpen && 'rotate-180'
                                )}
                              />
                            </>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-64 p-1">
                        <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 border-b border-black/[0.05] dark:border-white/5">
                          {isFr ? "Choisir le format d'image" : 'Choose image format'}
                        </div>
                        {[
                          {
                            value: 'png' as const,
                            label: 'PNG',
                            ext: 'png',
                            description: isFr ? 'Sans perte avec transparence' : 'Lossless with transparency',
                          },
                          {
                            value: 'jpeg' as const,
                            label: 'JPEG',
                            ext: 'jpg',
                            description: isFr ? 'Compression photo universelle' : 'Universal photo compression',
                          },
                          {
                            value: 'webp' as const,
                            label: 'WebP',
                            ext: 'webp',
                            description: isFr ? 'Format moderne ultra-léger' : 'Modern lightweight format',
                          },
                        ].map((fmt) => (
                          <button
                            key={fmt.value}
                            type="button"
                            onClick={() => handleExportWithFormat(fmt.value)}
                            className="w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer group"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="text-xs font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-100">
                                Image {fmt.label}{' '}
                                <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                                  (.{fmt.ext})
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                {fmt.description}
                              </div>
                            </div>
                            <Download className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF6B35] transition-colors shrink-0" />
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  }
                />

                {/* Split Workbench : Viewport interactif & Contrôles */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <WatermarkCanvasViewport
                    canvasRef={canvasRef}
                    viewportContainerRef={viewportContainerRef}
                    isHoldingOriginal={isHoldingOriginal}
                    setIsHoldingOriginal={setIsHoldingOriginal}
                    error={error}
                    isFr={isFr}
                  />

                  <WatermarkControlPanel
                    config={config}
                    setConfig={setConfig}
                    onTogglePosition={handleTogglePosition}
                    selectedFont={selectedFont}
                    colorSwatches={colorSwatches}
                    isFr={isFr}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        toolId="watermark-image"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={exportedResult?.blob}
        resultFilename={exportedResult?.filename}
      />
    </ToolPageLayout>
  );
}
