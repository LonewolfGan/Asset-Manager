import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CsvViewerPaginationProps {
  isFr: boolean;
  filteredAndSortedCount: number;
  totalRowsCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchQuery: string;
  onPageSizeChange: (size: number) => void;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export const CsvViewerPagination: React.FC<CsvViewerPaginationProps> = ({
  isFr,
  filteredAndSortedCount,
  totalRowsCount,
  currentPage,
  totalPages,
  pageSize,
  searchQuery,
  onPageSizeChange,
  onPageChange,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="font-mono">
        {isFr
          ? `Affichage de ${filteredAndSortedCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} à ${Math.min(currentPage * pageSize, filteredAndSortedCount)} sur ${filteredAndSortedCount} lignes`
          : `Showing ${filteredAndSortedCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredAndSortedCount)} of ${filteredAndSortedCount} rows`}
        {searchQuery &&
          (isFr
            ? ` (filtré depuis ${totalRowsCount} au total)`
            : ` (filtered from ${totalRowsCount} total)`)}
      </div>

      <div className="flex items-center gap-3">
        {/* Taille de page */}
        <div className="flex items-center gap-1.5 font-mono">
          <span>{isFr ? 'Par page :' : 'Per page:'}</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
        </div>

        {/* Navigation de pagination */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="px-2 font-mono">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
