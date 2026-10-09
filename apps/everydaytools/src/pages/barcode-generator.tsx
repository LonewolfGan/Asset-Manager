import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useBarcodeWorkflow } from '@/hooks/use-barcode-workflow';
import { BarcodeTopBar } from '@/components/barcode-generator/BarcodeTopBar';
import { BarcodeDataInput } from '@/components/barcode-generator/BarcodeDataInput';
import { BarcodeCanvasViewport } from '@/components/barcode-generator/BarcodeCanvasViewport';
import { BarcodeInspector } from '@/components/barcode-generator/BarcodeInspector';

export default function BarcodeGenerator() {
  const { t, isFr } = useLocale();
  const title = t.tools['barcode-generator']?.title ?? 'Générateur de Codes-Barres Studio';
  const desc =
    t.tools['barcode-generator']?.description ??
    'Atelier de création et d’exportation vectorielle haute définition pour codes-barres conformes aux normes GS1.';

  const {
    symbologyId,
    value,
    barWidth,
    setBarWidth,
    barHeight,
    setBarHeight,
    quietZone,
    setQuietZone,
    displayValue,
    setDisplayValue,
    fontSize,
    setFontSize,
    textPosition,
    setTextPosition,
    inkColor,
    setInkColor,
    backgroundMode,
    setBackgroundMode,
    zoomLevel,
    setZoomLevel,
    showDownloadMenu,
    setShowDownloadMenu,
    history,
    svgRef,
    symbologies,
    activeSymbology,
    validation,
    handleValueChange,
    handleUndo,
    handleSelectSymbology,
    handleApplyAutoFix,
    handleDownloadSvg,
    handleDownloadPng,
    handleCopyPng,
    handlePrint,
    getSvgString,
  } = useBarcodeWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home ?? 'Home',
        t.nav.breadcrumb.textCode ?? 'Data & Code',
        title,
      ]}
      title={title}
      description={desc}
      seoSlug="barcode-generator"
    >
      <div className="w-full space-y-4">
        {/* Barre d'actions & Exportations */}
        <BarcodeTopBar
          symbologies={symbologies}
          symbologyId={symbologyId}
          onSelectSymbology={handleSelectSymbology}
          historyLength={history.length}
          onUndo={handleUndo}
          validation={validation}
          onPrint={handlePrint}
          onCopyPng={handleCopyPng}
          getSvgString={getSvgString}
          showDownloadMenu={showDownloadMenu}
          onDownloadMenuChange={setShowDownloadMenu}
          onDownloadPng={handleDownloadPng}
          onDownloadSvg={handleDownloadSvg}
          isFr={isFr}
        />

        {/* L'Atelier Monolithique Studio */}
        <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
            {/* Zone 1 : Le Canvas Héro du Spécimen */}
            <div className="lg:col-span-8 flex flex-col">
              <BarcodeDataInput
                activeSymbology={activeSymbology}
                value={value}
                onValueChange={handleValueChange}
                validation={validation}
                onApplyAutoFix={handleApplyAutoFix}
                isFr={isFr}
              />
              <BarcodeCanvasViewport
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
                validation={validation}
                backgroundMode={backgroundMode}
                svgRef={svgRef}
                isFr={isFr}
              />
            </div>

            {/* Zone 2 : L'Inspecteur de Gravure */}
            <BarcodeInspector
              activeSymbology={activeSymbology}
              barWidth={barWidth}
              onBarWidthChange={setBarWidth}
              barHeight={barHeight}
              onBarHeightChange={setBarHeight}
              quietZone={quietZone}
              onQuietZoneChange={setQuietZone}
              displayValue={displayValue}
              onDisplayValueChange={setDisplayValue}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              textPosition={textPosition}
              onTextPositionChange={setTextPosition}
              inkColor={inkColor}
              onInkColorChange={setInkColor}
              backgroundMode={backgroundMode}
              onBackgroundModeChange={setBackgroundMode}
              isFr={isFr}
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
