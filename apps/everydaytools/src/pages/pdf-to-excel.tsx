import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfToExcelEngine } from '@/engine/engines/pdf-to-excel-engine';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ReciprocalTitle,
  type ConversionFormat,
} from '@/components/conversion';

const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'XLSX',
  extension: 'xlsx',
  icon: '/icons/excel.svg',
  color: '#107C41',
  subLabel: isFr ? 'Classeur Excel (.xlsx)' : 'Excel Workbook (.xlsx)',
});

export default function PdfToExcel() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToExcel;
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [isDragging, setIsDragging] = useState(false);

  const {
    inputFile,
    result,
    error,
    isProcessing,
    handleFileSelect,
    handleExecute,
    handleReset,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine: pdfToExcelEngine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-excel',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDownload = useCallback(() => {
    if (!result?.data || !result.filename) return;
    downloadBlob(result.data, result.filename);
  }, [result]);

  const title = t.tools['pdf-to-excel']?.title ?? (isFr ? 'PDF en Excel' : 'PDF to Excel');
  const desc =
    t.tools['pdf-to-excel']?.description ??
    (isFr
      ? 'Extrayez des tableaux et feuilles de calcul depuis votre PDF vers des classeurs Excel éditables.'
      : 'Extract tabular data and spreadsheets from your PDF into editable Excel sheets.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-excel"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-excel"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 max-w-2xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!inputFile && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et extraire vos tableaux en classeur Excel (.xlsx).'
                    : 'or click to browse your folders and extract your tables into an Excel workbook (.xlsx).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : ATELIER STAGING NOBLE (ConversionStaging) ─── */}
            {inputFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={inputFile}
                convertBtnLabel={tc?.convertBtn ?? (isFr ? 'Convertir en Excel (XLSX)' : 'Convert to Excel (XLSX)')}
                changeFileBtnLabel={tc?.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleExecute}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={inputFile?.name}
                statusLabel={tc?.converting ?? (isFr ? 'Extraction des données tabulaires...' : 'Extracting tabular data...')}
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename ?? 'extracted.xlsx'}
                resultFileSize={result.resultSize ?? 0}
                downloadBtnLabel={tc?.downloadXlsx ?? (isFr ? 'Télécharger le classeur Excel' : 'Download Excel workbook')}
                resetBtnLabel={tc?.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
