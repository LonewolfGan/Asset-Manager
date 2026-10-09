import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { AlertCircle, Plus, FileSpreadsheet } from 'lucide-react';
import {
  ConversionDropzone,
  DocumentNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { useCsvEditorWorkflow } from '@/hooks/use-csv-editor-workflow';
import { CsvEditorTopBar } from '@/components/csv-editor/CsvEditorTopBar';
import { CsvEditorTable } from '@/components/csv-editor/CsvEditorTable';
import { CsvEditorUndoToast } from '@/components/csv-editor/CsvEditorUndoToast';

export default function CsvEditor() {
  const { t, isFr } = useLocale();

  const sourceFormat: ConversionFormat = {
    name: isFr ? 'Tableur' : 'Spreadsheet',
    extension: 'csv, xlsx',
    icon: '/icons/csv.svg',
    color: '#10B981',
    subLabel: isFr ? 'Fichiers CSV, Excel (.xlsx, .xls) ou TSV' : 'CSV, Excel (.xlsx, .xls) or TSV files',
  };

  const {
    table,
    history,
    isDragging,
    showExportMenu,
    setShowExportMenu,
    isNextActionOpen,
    setIsNextActionOpen,
    exportResult,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    processUploadedFile,
    handleReset,
    handleExportCsv,
    handleExportExcel,
  } = useCsvEditorWorkflow(isFr);

  const titleText = t.tools['csv-editor']?.title ?? 'Éditeur CSV & Tableur';
  const descText =
    t.tools['csv-editor']?.description ??
    'Modifiez, organisez vos colonnes, filtrez et exportez vos fichiers CSV et Excel directement dans votre navigateur.';

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.documents,
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="csv-editor"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          <AnimatePresence>
            {table.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{table.error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => table.setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!table.isReady && (
              <div className="w-full max-w-5xl mx-auto space-y-6" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  accept=".csv,.xlsx,.xls,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  title={isFr ? 'Glissez-déposez votre fichier CSV ou Excel' : 'Drag & drop your CSV or Excel file'}
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos documents (.csv, .xlsx, .xls, .tsv) et éditer votre feuille de calcul instantanément.'
                      : 'or click to browse your documents (.csv, .xlsx, .xls, .tsv) and edit your spreadsheet instantly.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une feuille de calcul' : 'Select a spreadsheet'}
                  isDragging={isDragging}
                  onFileSelected={processUploadedFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={table.handleStartBlank}
                    className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all flex items-center gap-2.5 cursor-pointer active:scale-[0.98] shadow-sm"
                  >
                    <Plus size={16} />
                    <span>{isFr ? 'Créer un tableau vierge' : 'Create blank table'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={table.handleLoadSample}
                    className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all flex items-center gap-2.5 cursor-pointer active:scale-[0.98] shadow-sm"
                  >
                    <FileSpreadsheet size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <span>{isFr ? "Charger des données d'exemple" : 'Load sample data'}</span>
                  </button>
                </div>
              </div>
            )}

            {table.isReady && (
              <motion.div
                key="editor-scene"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full py-2 flex flex-col space-y-4"
              >
                <CsvEditorTopBar
                  documentName={table.documentName}
                  onDocumentNameChange={table.setDocumentName}
                  rowsCount={table.rows.length}
                  colsCount={table.headers.length}
                  searchQuery={table.searchQuery}
                  onSearchQueryChange={table.setSearchQuery}
                  onReset={handleReset}
                  historyLength={history.history.length}
                  futureLength={history.future.length}
                  onUndo={history.handleUndo}
                  onRedo={history.handleRedo}
                  onAddRow={table.addRow}
                  onAddCol={table.addCol}
                  onClearRows={table.clearAllRows}
                  showExportMenu={showExportMenu}
                  onShowExportMenuChange={setShowExportMenu}
                  onExportCsv={handleExportCsv}
                  onExportExcel={handleExportExcel}
                  isFr={isFr}
                />

                <CsvEditorTable
                  headers={table.headers}
                  onUpdateHeader={table.updateHeader}
                  processedRows={table.processedRows}
                  totalRowsCount={table.rows.length}
                  searchQuery={table.searchQuery}
                  sortConfig={table.sortConfig}
                  onSort={table.handleSort}
                  onDeleteCol={table.deleteCol}
                  onAddCol={table.addCol}
                  onUpdateCell={table.updateCell}
                  onDeleteRow={table.deleteRow}
                  onAddRow={table.addRow}
                  isFr={isFr}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CsvEditorUndoToast
          notification={history.undoNotification}
          onUndo={history.handleUndo}
          isFr={isFr}
        />

        <DocumentNextActionModal
          toolId="csv-editor"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={exportResult?.blob}
          resultFilename={exportResult?.filename}
          formatType={exportResult?.formatType || 'csv'}
        />
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
