import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import { usePdfThumbnails } from '@/hooks/use-pdf-thumbnails';
import { usePdfSplitWorkflow } from '@/hooks/use-pdf-split-workflow';
import {
  ConversionDropzone,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { PdfSplitWorkbench } from '@/components/pdf-split/PdfSplitWorkbench';
import { PdfSplitResultView } from '@/components/pdf-split/PdfSplitResultView';

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

  // Modular hooks for thumbnails and workflow
  const { pages, isLoadingThumbs, loadPdfThumbnails, resetThumbnails } = usePdfThumbnails();
  const workflow = usePdfSplitWorkflow(file ?? undefined, pages.length, isFr);

  // References for shift-click selection on page thumbnails
  const contactSheetRef = useRef<HTMLDivElement>(null);
  const lastClickedPageRef = useRef<number | null>(null);

  const handleFilesAdded = useCallback(
    async (incoming: File[]) => {
      const validPdf = incoming.find(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );

      if (!validPdf) {
        workflow.setError(
          isFr ? 'Veuillez sélectionner un fichier PDF valide.' : 'Please select a valid PDF file.'
        );
        return;
      }

      workflow.resetWorkflow();
      setFile(validPdf);
      const count = await loadPdfThumbnails(validPdf);
      workflow.setExtractRangeFrom(1);
      workflow.setExtractRangeTo(Math.min(count, 1));
    },
    [isFr, loadPdfThumbnails, workflow]
  );

  // Drag and drop handler
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFilesSelected: handleFilesAdded,
    accept: '.pdf,application/pdf',
  });

  // Handoff support across tools
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFilesAdded([staged]);
    }
  }, [handleFilesAdded]);

  const handleReset = useCallback(() => {
    setFile(null);
    resetThumbnails();
    workflow.resetWorkflow();
    setIsNextActionOpen(false);
    lastClickedPageRef.current = null;
  }, [resetThumbnails, workflow]);

  // Click on a page card in contact sheet
  const handlePageCardClick = useCallback(
    (pageNum: number, e: React.MouseEvent) => {
      if (workflow.activeMode === 'extract') {
        if (e.shiftKey && lastClickedPageRef.current !== null) {
          const start = Math.min(lastClickedPageRef.current, pageNum);
          const end = Math.max(lastClickedPageRef.current, pageNum);
          const suite: number[] = [];
          for (let p = start; p <= end; p++) suite.push(p);
          workflow.setSelectedPages((prev) =>
            Array.from(new Set([...prev, ...suite])).sort((a, b) => a - b)
          );
        } else {
          workflow.setSelectedPages((prev) =>
            prev.includes(pageNum)
              ? prev.filter((p) => p !== pageNum)
              : [...prev, pageNum].sort((a, b) => a - b)
          );
        }
        lastClickedPageRef.current = pageNum;
      }
    },
    [workflow]
  );

  // Calculate tranche indices for badges
  const getPageTrancheIndices = useCallback(
    (pageNum: number): number[] => {
      const matches: number[] = [];
      workflow.tranches.forEach((tranche, idx) => {
        if (pageNum >= tranche.from && pageNum <= tranche.to) {
          matches.push(idx + 1);
        }
      });
      return matches;
    },
    [workflow.tranches]
  );

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Split PDF']}
      title={t.tools?.['pdf-split']?.title ?? (isFr ? 'Découper un PDF' : 'Split PDF')}
      description={
        t.tools?.['pdf-split']?.description ??
        (isFr
          ? 'Séparez une page ou tout un intervalle pour créer facilement de nouveaux fichiers PDF.'
          : 'Split a page or entire range into separate PDF files.')
      }
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
                  description={
                    isFr
                      ? 'Extraction de pages ciblées ou découpe en plusieurs documents'
                      : 'Extract specific pages or split into multiple PDF documents'
                  }
                  isDragging={isDragging}
                  onFilesSelected={handleFilesAdded}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            ) : workflow.isProcessing ? (
              <div key="processing" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={PDF_FORMAT.icon}
                  formatAlt="PDF"
                  stageLabel={isFr ? 'Découpe du document' : 'Splitting document'}
                  title={isFr ? 'Extraction des pages en cours...' : 'Extracting pages...'}
                  detail={
                    workflow.activeMode === 'extract'
                      ? isFr
                        ? `${workflow.selectedPages.length} pages sélectionnées`
                        : `${workflow.selectedPages.length} selected pages`
                      : isFr
                      ? `${workflow.tranches.length} tranches définies`
                      : `${workflow.tranches.length} ranges defined`
                  }
                />
              </div>
            ) : workflow.result ? (
              <PdfSplitResultView
                key="result"
                result={workflow.result}
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
                activeMode={workflow.activeMode}
                selectedPages={workflow.selectedPages}
                extractRangeFrom={workflow.extractRangeFrom}
                extractRangeTo={workflow.extractRangeTo}
                isEditingCustomSyntax={workflow.isEditingCustomSyntax}
                rawSyntaxText={workflow.rawSyntaxText}
                extractAsSinglePdf={workflow.extractAsSinglePdf}
                tranches={workflow.tranches}
                batchChunkSize={workflow.batchChunkSize}
                splitViewMode={workflow.splitViewMode}
                overlappingTranchesInfo={workflow.overlappingTranchesInfo}
                error={workflow.error}
                isProcessing={workflow.isProcessing}
                canConvert={workflow.canConvert}
                isFr={isFr}
                t={t}
                contactSheetRef={contactSheetRef}
                onReset={handleReset}
                onModeChange={workflow.setActiveMode}
                onConvert={workflow.handleConvert}
                onRangeFromChange={workflow.setExtractRangeFrom}
                onRangeToChange={workflow.setExtractRangeTo}
                onAddRange={workflow.handleAddRange}
                setSelectedPages={workflow.setSelectedPages}
                setIsEditingCustomSyntax={workflow.setIsEditingCustomSyntax}
                setRawSyntaxText={workflow.setRawSyntaxText}
                setExtractAsSinglePdf={workflow.setExtractAsSinglePdf}
                setSplitViewMode={workflow.setSplitViewMode}
                setBatchChunkSize={workflow.setBatchChunkSize}
                setTranches={workflow.setTranches}
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
        resultBlob={workflow.result && !workflow.result.isZip ? workflow.result.blob : null}
        resultFilename={workflow.result && !workflow.result.isZip ? workflow.result.filename : undefined}
      />
    </ToolPageLayout>
  );
}
