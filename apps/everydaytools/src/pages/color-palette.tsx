import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useColorPaletteWorkflow } from '@/hooks/use-color-palette-workflow';
import { ColorPaletteToolbar } from '@/components/color-palette/ColorPaletteToolbar';
import { ColorPaletteSwatchesGrid } from '@/components/color-palette/ColorPaletteSwatchesGrid';
import { ColorPaletteFooter } from '@/components/color-palette/ColorPaletteFooter';
import { ColorPaletteMockupModal } from '@/components/color-palette/ColorPaletteMockupModal';

export default function ColorPalette() {
  const { t, isFr } = useLocale();
  const pageTitle =
    t.tools?.['color-palette']?.title ??
    (isFr ? 'Générateur de Palettes de Couleurs' : 'Color Palette Generator');
  const pageDesc =
    t.tools?.['color-palette']?.description ??
    (isFr
      ? 'Créez des harmonies chromatiques parfaites, ajustez les nuances et exportez vos codes CSS et Tailwind.'
      : 'Create perfect chromatic harmonies, adjust tints, and export CSS and Tailwind code.');

  const {
    mode,
    count,
    format,
    setFormat,
    palette,
    harmonyModes,
    isMockupModalOpen,
    setIsMockupModalOpen,
    copiedIdx,
    isRefreshing,
    lockedCount,
    handleRegenerate,
    handleModeChange,
    handleCountChange,
    toggleLock,
    getColorValue,
    getColorDisplayValue,
    getCodeFontSize,
    handleCopyColor,
    handleCopyCode,
    handleDownload,
    handleAdjustLightness,
    handleCustomHexChange,
  } = useColorPaletteWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[
        'Home',
        t.nav.breadcrumb?.textCode ?? (isFr ? 'Données & Code' : 'Data & Code'),
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="color-palette"
    >
      <div className="w-full pb-16">
        <div className="w-full rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <ColorPaletteToolbar
            mode={mode}
            count={count}
            format={format}
            palette={palette}
            harmonyModes={harmonyModes}
            isRefreshing={isRefreshing}
            onModeChange={handleModeChange}
            onCountChange={handleCountChange}
            onFormatChange={setFormat}
            onRegenerate={handleRegenerate}
            onOpenMockupModal={() => setIsMockupModalOpen(true)}
            onCopyCode={handleCopyCode}
            onDownload={handleDownload}
            isFr={isFr}
          />

          <ColorPaletteSwatchesGrid
            palette={palette}
            format={format}
            count={count}
            copiedIdx={copiedIdx}
            onToggleLock={toggleLock}
            onCustomHexChange={handleCustomHexChange}
            onCopyColor={handleCopyColor}
            onAdjustLightness={handleAdjustLightness}
            getColorValue={getColorValue}
            getColorDisplayValue={getColorDisplayValue}
            getCodeFontSize={getCodeFontSize}
            isFr={isFr}
          />

          <ColorPaletteFooter
            count={count}
            mode={mode}
            harmonyModes={harmonyModes}
            lockedCount={lockedCount}
            isFr={isFr}
          />
        </div>
      </div>

      <ColorPaletteMockupModal
        isOpen={isMockupModalOpen}
        onOpenChange={setIsMockupModalOpen}
        palette={palette}
        isFr={isFr}
      />
    </ToolPageLayout>
  );
}
