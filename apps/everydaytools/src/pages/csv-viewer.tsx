import React, { useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  DocumentNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { useCsvViewerData } from '@/hooks/use-csv-viewer-data';
import { useCsvViewerExport } from '@/hooks/use-csv-viewer-export';
import { useCsvViewerWorkflow } from '@/hooks/use-csv-viewer-workflow';
import {
  CsvViewerDropzoneScene,
  CsvViewerWorkbench,
} from '@/components/csv-viewer';

const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Tableur CSV' : 'CSV Spreadsheet',
  extension: 'csv, xlsx, tsv',
  icon: '/icons/csv.svg',
  color: '#10B981',
  subLabel: isFr ? 'Fichiers CSV, Excel (.xlsx, .xls) ou TSV' : 'CSV, Excel (.xlsx, .xls) or TSV files',
});

export default function CsvViewer() {
  const { t, isFr } = useLocale();
  const title = t.tools['csv-viewer']?.title ?? (isFr ? 'Visualiseur CSV & Tableur' : 'CSV & Spreadsheet Viewer');
  const desc =
    t.tools['csv-viewer']?.description ??
    (isFr
      ? 'Affichez, explorez, triez et filtrez instantanément vos fichiers CSV ou tableurs sans aucun transfert vers un serveur.'
      : 'Instantly view, explore, sort and filter your CSV or spreadsheet files directly in your browser.');

  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);

  const workflow = useCsvViewerWorkflow({
    isFr,
    onResetView: () => data.resetViewParams(),
  });

  const data = useCsvViewerData(workflow.rows);

  const {
    showExportMenu,
    setShowExportMenu,
    isNextActionOpen,
    setIsNextActionOpen,
    exportedFormat,
    exportedBlob,
    exportedFilename,
    handleDownloadCsv,
    handleDownloadExcel,
  } = useCsvViewerExport({
    headers: workflow.headers,
    rows: workflow.rows,
    documentName: workflow.documentName,
    isFr,
  });

  // Global Escape key listener: closes menu, clears search, or resets view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === 'Escape') {
        if (showExportMenu) {
          setShowExportMenu(false);
          return;
        }
        if (data.searchQuery) {
          data.setSearchQuery('');
          return;
        }
        if (!isInput && workflow.isReady) {
          workflow.handleReset();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, showExportMenu, setShowExportMenu, workflow]);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.excelSpreadsheets, title]}
      title={title}
      description={desc}
      seoSlug="csv-viewer"
    >
      <ToolWorkspace noGrid>
        <div className="w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!workflow.isReady ? (
              <CsvViewerDropzoneScene
                inputMode={workflow.inputMode}
                setInputMode={workflow.setInputMode}
                isFr={isFr}
                error={workflow.error}
                sourceFormat={sourceFormat}
                isDragging={workflow.isDragging}
                onFileSelected={workflow.processUploadedFile}
                onDragOver={workflow.handleDragOver}
                onDragLeave={workflow.handleDragLeave}
                onDrop={workflow.handleDrop}
                onLoadSample={workflow.handleLoadSample}
                rawText={workflow.rawText}
                setRawText={workflow.setRawText}
                onPasteSubmit={workflow.handlePasteSubmit}
              />
            ) : (
              <CsvViewerWorkbench
                isFr={isFr}
                documentName={workflow.documentName}
                fileSize={workflow.fileSize}
                rows={workflow.rows}
                headers={workflow.headers}
                searchQuery={data.searchQuery}
                onSearchChange={data.setSearchQuery}
                onClearSearch={() => data.setSearchQuery('')}
                onReset={workflow.handleReset}
                showExportMenu={showExportMenu}
                setShowExportMenu={setShowExportMenu}
                onDownloadCsv={handleDownloadCsv}
                onDownloadExcel={handleDownloadExcel}
                paginatedRows={data.paginatedRows}
                filteredAndSortedCount={data.filteredAndSortedRows.length}
                sortCol={data.sortCol}
                sortDir={data.sortDir}
                onSort={data.handleSort}
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                pageSize={data.pageSize}
                onPageSizeChange={data.setPageSize}
                onPageChange={data.setCurrentPage}
              />
            )}
          </AnimatePresence>
        </div>

        <DocumentNextActionModal
          toolId="csv-viewer"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={exportedBlob}
          resultFilename={exportedFilename}
          formatType={exportedFormat}
        />
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
