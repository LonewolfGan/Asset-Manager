import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Table } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
} from '@/components/conversion';
import { ExcelSheetSelector } from '@/components/excel-to-csv';
import { DelimiterRadioGroup, DataPreviewTableLite } from '@workspace/ui/controls';
import { useExcelToCsvWorkflow } from '@/hooks/use-excel-to-csv-workflow';

export default function ExcelToCsv() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    sheets,
    selectedSheet,
    setSelectedSheet,
    delimiter,
    setDelimiter,
    previewData,
    result,
    isProcessing,
    isDragging,
    isPreviewOpen,
    setIsPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = useExcelToCsvWorkflow();

  const pageTitle = t.tools['excel-to-csv']?.title ?? (isFr ? 'Excel en CSV' : 'Excel to CSV');
  const pageDesc =
    t.tools['excel-to-csv']?.description ??
    (isFr
      ? 'Convertissez les feuilles Excel au format CSV directement dans votre navigateur.'
      : 'Convert Excel sheets to CSV format in your browser.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.excelSpreadsheets,
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="excel-to-csv"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre classeur Excel' : 'Drag & drop your Excel workbook here'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en données délimitées (.csv).'
                    : 'or click to browse your files and convert to delimited data (.csv).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en CSV' : 'Convert to CSV')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de classeur' : 'Change workbook')}
                onConvert={handleConvert}
                onReset={handleReset}
                optionsSlot={
                  <div className="space-y-6">
                    <ExcelSheetSelector
                      sheets={sheets}
                      selectedSheet={selectedSheet}
                      onSelectSheet={setSelectedSheet}
                      label={tc.sheetLabel ?? (isFr ? 'Feuille à exporter' : 'Sheet to export')}
                    />

                    <DelimiterRadioGroup
                      value={delimiter}
                      onChange={setDelimiter}
                      label={isFr ? 'Séparateur CSV de sortie' : 'Output CSV delimiter'}
                      isFr={isFr}
                      allowCustom
                    />

                    {previewData && previewData.headers.length > 0 && (
                      <DataPreviewTableLite
                        headers={previewData.headers}
                        rows={previewData.rows}
                        label={isFr ? 'Aperçu de la feuille' : 'Sheet preview'}
                        isFr={isFr}
                      />
                    )}
                  </div>
                }
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Extraction des données tabulaires en cours...'
                    : 'Extracting tabular data...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT WITH COPY & PREVIEW ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadCsv ?? (isFr ? 'Télécharger le fichier .csv' : 'Download .csv file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre classeur' : 'Convert another workbook')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={result.textOutput}
                      label={isFr ? 'Copier le CSV' : 'Copy CSV'}
                      copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Table size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu des données' : 'Preview data'}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Shadcn CSV Data Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename}
              text={result.textOutput}
              formatTag="CSV · UTF-8"
              onDownload={handleDownload}
              copyLabel={isFr ? 'Copier le CSV' : 'Copy CSV'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              downloadLabel={tc.downloadCsv ?? (isFr ? 'Télécharger le fichier .csv' : 'Download .csv file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="excel-to-csv"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="csv"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
