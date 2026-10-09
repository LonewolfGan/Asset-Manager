import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, Download, ChevronDown } from 'lucide-react';
import Papa from 'papaparse';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { trackToolUsed } from '@/lib/analytics';
import { CopyButton } from '@/components/ui/copy-button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CsvViewerTable } from './CsvViewerTable';
import { CsvViewerPagination } from './CsvViewerPagination';
import type { IndexedTabularRow, TabularSortDir } from '@/lib/csv-data-logic';

export interface CsvViewerWorkbenchProps {
  isFr: boolean;
  documentName: string;
  fileSize: string | null;
  rows: string[][];
  headers: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onReset: () => void;
  showExportMenu: boolean;
  setShowExportMenu: (show: boolean) => void;
  onDownloadCsv: (delimiter?: string) => void;
  onDownloadExcel: () => void;
  paginatedRows: IndexedTabularRow[];
  filteredAndSortedCount: number;
  sortCol: number | null;
  sortDir: TabularSortDir;
  onSort: (colIdx: number) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export const CsvViewerWorkbench: React.FC<CsvViewerWorkbenchProps> = ({
  isFr,
  documentName,
  fileSize,
  rows,
  headers,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onReset,
  showExportMenu,
  setShowExportMenu,
  onDownloadCsv,
  onDownloadExcel,
  paginatedRows,
  filteredAndSortedCount,
  sortCol,
  sortDir,
  onSort,
  currentPage,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
}) => {
  return (
    <motion.div
      key="viewer-scene"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-2 flex flex-col space-y-4"
    >
      <StudioCommandBar
        meta={{
          name: documentName,
          size: 0,
          icon: getFileFormatIcon(documentName.endsWith('.xlsx') ? 'file.xlsx' : 'file.csv'),
        }}
        resetLabel={isFr ? 'Changer de fichier' : 'Change file'}
        onReset={onReset}
        centerControls={
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                data-testid="csv-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isFr ? 'Rechercher dans les cellules...' : 'Search across cells...'
                }
                className="w-full h-8 pl-8 pr-7 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-850 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        }
        secondaryActions={
          <CopyButton
            text={() => Papa.unparse({ fields: headers, data: rows })}
            label={isFr ? 'Copier' : 'Copy'}
            copiedLabel={isFr ? 'Copié !' : 'Copied!'}
            size="sm"
            variant="default"
            className="h-8 px-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer active:scale-[0.98]"
            onCopy={() => trackToolUsed('csv-viewer', 'copy-csv')}
          />
        }
        actionSlot={
          <Popover open={showExportMenu} onOpenChange={setShowExportMenu}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-9 px-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Download size={13} />
                <span>{isFr ? 'Exporter' : 'Export'}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    showExportMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-64 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xl space-y-1"
            >
              <button
                type="button"
                onClick={() => onDownloadCsv(',')}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between whitespace-nowrap cursor-pointer"
              >
                <span>{isFr ? 'CSV standard (virgule)' : 'Standard CSV (comma)'}</span>
                <span className="text-[11px] font-mono text-zinc-400">.csv</span>
              </button>

              <button
                type="button"
                onClick={() => onDownloadCsv(';')}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between whitespace-nowrap cursor-pointer"
              >
                <span>
                  {isFr ? 'CSV Europe (point-virgule)' : 'European CSV (semicolon)'}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">.csv</span>
              </button>

              <div className="my-1 border-t border-black/[0.06] dark:border-white/10" />

              <button
                type="button"
                onClick={onDownloadExcel}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between whitespace-nowrap cursor-pointer"
              >
                <span>{isFr ? 'Classeur Excel' : 'Excel Workbook'}</span>
                <span className="text-[11px] font-mono text-zinc-400">.xlsx</span>
              </button>
            </PopoverContent>
          </Popover>
        }
      />

      <CsvViewerTable
        headers={headers}
        paginatedRows={paginatedRows}
        filteredAndSortedCount={filteredAndSortedCount}
        searchQuery={searchQuery}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={onSort}
        currentPage={currentPage}
        pageSize={pageSize}
        isFr={isFr}
      />

      <CsvViewerPagination
        isFr={isFr}
        filteredAndSortedCount={filteredAndSortedCount}
        totalRowsCount={rows.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        searchQuery={searchQuery}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
};
