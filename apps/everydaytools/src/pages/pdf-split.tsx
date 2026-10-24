import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import { usePdfThumbnails } from '@/hooks/use-pdf-thumbnails';
import { usePdfSplitOptions } from '@/hooks/use-pdf-split-options';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfSplitEngine } from '@/engine/engines/pdf-split-engine';
import { formatPagesToRangeString } from '@/lib/pdf-split-logic';
import { ConversionDropzone, NextActionModal, type ConversionFormat } from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfSplitWorkbench } from '@/components/pdf-split/PdfSplitWorkbench';
import { PdfSplitResultView, type SplitResultData } from '@/components/pdf-split/PdfSplitResultView';

const PDF_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document Adobe Acrobat',
};

export default function PdfSplit() {
  const { t, isFr } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const { pages, isLoadingThumbs, loadPdfThumbnails, resetThumbnails } = usePdfThumbnails();
  const options = usePdfSplitOptions(pages.length);
  const contactSheetRef = useRef<HTMLDivElement>(null);
  const lastClickedPageRef = useRef<number | null>(null);

  const engine = useMemo(() => createPdfSplitEngine({
    mode: options.activeMode,
    selectedPages: options.activeMode === 'extract' ? options.selectedPages : undefined,
    extractAsSinglePdf: options.activeMode === 'extract' ? options.extractAsSinglePdf : undefined,
    tranches: options.activeMode === 'split' ? options.tranches : undefined,
  }), [options.activeMode, options.selectedPages, options.extractAsSinglePdf, options.tranches]);

  const { isProcessing, result: rawResult, error, handleExecute, handleReset: resetWorkflow, setError } =
    useToolWorkflow<File, Blob>({
      engine,
      toolSlug: 'pdf-split',
      category: 'pdf',
      autoConsumeHandoff: false,
    });

  const handleFilesAdded = useCallback(async (incoming: File[]) => {
    const validPdf = incoming.find((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (!validPdf) {
      setError(isFr ? 'Veuillez sélectionner un fichier PDF valide.' : 'Please select a valid PDF file.');
      return;
    }
    resetWorkflow();
    options.resetOptions();
    setFile(validPdf);
    const count = await loadPdfThumbnails(validPdf);
    options.setExtractRangeFrom(1);
    options.setExtractRangeTo(Math.min(count, 1));
  }, [isFr, loadPdfThumbnails, options, resetWorkflow, setError]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFilesSelected: handleFilesAdded,
    accept: '.pdf,application/pdf',
  });

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) handleFilesAdded([staged]);
  }, [handleFilesAdded]);

  const handleReset = useCallback(() => {
    setFile(null);
    resetThumbnails();
    options.resetOptions();
    resetWorkflow();
    setIsNextActionOpen(false);
    lastClickedPageRef.current = null;
  }, [options, resetThumbnails, resetWorkflow]);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (options.activeMode === 'extract' && options.selectedPages.length === 0) {
      setError(isFr ? 'Veuillez sélectionner au moins une page à extraire.' : 'Please select at least one page to extract.');
      return;
    }
    if (options.activeMode === 'split' && options.tranches.length === 0) {
      setError(isFr ? 'Veuillez définir au moins une tranche de découpe.' : 'Please define at least one split range.');
      return;
    }
    await handleExecute(file);
  }, [file, handleExecute, isFr, options.activeMode, options.selectedPages.length, options.tranches.length, setError]);

  const handlePageCardClick = useCallback((pageNum: number, e: React.MouseEvent) => {
    if (options.activeMode !== 'extract') return;
    if (e.shiftKey && lastClickedPageRef.current !== null) {
      const start = Math.min(lastClickedPageRef.current, pageNum);
      const end = Math.max(lastClickedPageRef.current, pageNum);
      const suite: number[] = [];
      for (let p = start; p <= end; p++) suite.push(p);
      options.setSelectedPages((prev) => Array.from(new Set([...prev, ...suite])).sort((a, b) => a - b));
    } else {
      options.setSelectedPages((prev) =>
        prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
      );
    }
    lastClickedPageRef.current = pageNum;
  }, [options]);

  const getPageTrancheIndices = useCallback((pageNum: number): number[] => {
    const matches: number[] = [];
    options.tranches.forEach((tranche, idx) => {
      if (pageNum >= tranche.from && pageNum <= tranche.to) matches.push(idx + 1);
    });
    return matches;
  }, [options.tranches]);

  const result: SplitResultData | null = useMemo(() => {
    if (!rawResult || !file) return null;
    const isZip = Boolean((rawResult.metadata as any)?.isZip);
    const details = options.activeMode === 'extract'
      ? options.extractAsSinglePdf
        ? `${options.selectedPages.length} pages (${formatPagesToRangeString(options.selectedPages)})`
        : `${options.selectedPages.length} PDF (${formatPagesToRangeString(options.selectedPages)})`
      : `${options.tranches.length} PDF générés`;

    return {
      blob: rawResult.data,
      filename: rawResult.filename,
      isZip,
      sizeAfter: rawResult.resultSize ?? rawResult.data.size,
      sizeBefore: file.size,
      title: isZip ? (isFr ? 'Archive ZIP' : 'ZIP Archive') : (isFr ? 'Document extrait' : 'Extracted PDF'),
      details,
    };
  }, [file, isFr, options.activeMode, options.extractAsSinglePdf, options.selectedPages, options.tranches.length, rawResult]);

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Split PDF']}
      title={t.tools?.['pdf-split']?.title ?? (isFr ? 'Découper un PDF' : 'Split PDF')}
      description={t.tools?.['pdf-split']?.description ?? (isFr ? 'Séparez une page ou tout un intervalle pour créer facilement de nouveaux fichiers PDF.' : 'Split a page or entire range into separate PDF files.')}
      seoSlug="pdf-split"
    >
      <ToolWorkspace noGrid>
        <div className="w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!file ? (
              <div key="dropzone" className="w-full max-w-5xl mx-auto py-8">
                <ConversionDropzone
                  sourceFormat={PDF_FORMAT}
                  title={isFr ? 'Découper un document PDF' : 'Split PDF document'}
                  description={isFr ? 'Extraction de pages ciblées ou découpe en plusieurs documents' : 'Extract specific pages or split into multiple PDF documents'}
                  isDragging={isDragging}
                  onFilesSelected={handleFilesAdded}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            ) : isProcessing ? (
              <div key="processing" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={PDF_FORMAT.icon}
                  formatAlt="PDF"
                  stageLabel={isFr ? 'Découpe du document' : 'Splitting document'}
                  title={isFr ? 'Extraction des pages en cours...' : 'Extracting pages...'}
                  detail={options.activeMode === 'extract'
                    ? (isFr ? `${options.selectedPages.length} pages sélectionnées` : `${options.selectedPages.length} selected pages`)
                    : (isFr ? `${options.tranches.length} tranches définies` : `${options.tranches.length} ranges defined`)}
                />
              </div>
            ) : result ? (
              <PdfSplitResultView
                key="result"
                result={result}
                formatIcon={PDF_FORMAT.icon}
                isFr={isFr}
                t={t}
                onReset={handleReset}
                onOpenNextAction={() => setIsNextActionOpen(true)}
              />
            ) : (
              <PdfSplitWorkbench
                key="workbench"
                file={file}
                format={PDF_FORMAT}
                pages={pages}
                isLoadingThumbs={isLoadingThumbs}
                activeMode={options.activeMode}
                selectedPages={options.selectedPages}
                extractRangeFrom={options.extractRangeFrom}
                extractRangeTo={options.extractRangeTo}
                isEditingCustomSyntax={options.isEditingCustomSyntax}
                rawSyntaxText={options.rawSyntaxText}
                extractAsSinglePdf={options.extractAsSinglePdf}
                tranches={options.tranches}
                batchChunkSize={options.batchChunkSize}
                splitViewMode={options.splitViewMode}
                overlappingTranchesInfo={options.overlappingTranchesInfo}
                error={error}
                isProcessing={isProcessing}
                canConvert={options.canConvert}
                isFr={isFr}
                t={t}
                contactSheetRef={contactSheetRef}
                onReset={handleReset}
                onModeChange={options.setActiveMode}
                onConvert={handleConvert}
                onRangeFromChange={options.setExtractRangeFrom}
                onRangeToChange={options.setExtractRangeTo}
                onAddRange={options.handleAddRange}
                setSelectedPages={options.setSelectedPages}
                setIsEditingCustomSyntax={options.setIsEditingCustomSyntax}
                setRawSyntaxText={options.setRawSyntaxText}
                setExtractAsSinglePdf={options.setExtractAsSinglePdf}
                setSplitViewMode={options.setSplitViewMode}
                setBatchChunkSize={options.setBatchChunkSize}
                setTranches={options.setTranches}
                getPageTrancheIndices={getPageTrancheIndices}
                onPageCardClick={handlePageCardClick}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-split"
        resultBlob={result && !result.isZip ? result.blob : null}
        resultFilename={result && !result.isZip ? result.filename : undefined}
      />
    </ToolPageLayout>
  );
}
