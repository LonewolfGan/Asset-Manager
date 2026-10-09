import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { IndexedTabularRow, TabularSortDir } from '@/lib/csv-data-logic';

export interface CsvViewerTableProps {
  headers: string[];
  paginatedRows: IndexedTabularRow[];
  filteredAndSortedCount: number;
  searchQuery: string;
  sortCol: number | null;
  sortDir: TabularSortDir;
  onSort: (colIdx: number) => void;
  currentPage: number;
  pageSize: number;
  isFr: boolean;
}

export const CsvViewerTable: React.FC<CsvViewerTableProps> = ({
  headers,
  paginatedRows,
  filteredAndSortedCount,
  searchQuery,
  sortCol,
  sortDir,
  onSort,
  currentPage,
  pageSize,
  isFr,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-950 shadow-sm">
      <table className="w-full border-collapse text-left select-text">
        <thead>
          <tr className="bg-neutral-50 dark:bg-zinc-900/80 border-b border-black/[0.08] dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {/* Numéro de ligne # */}
            <th className="w-12 px-3 py-3 text-center text-zinc-400 font-mono select-none">
              #
            </th>

            {/* En-têtes de colonnes triables */}
            {headers.map((header, colIdx) => (
              <th
                key={colIdx}
                onClick={() => onSort(colIdx)}
                className="min-w-[140px] px-3.5 py-3 border-r border-black/[0.06] dark:border-white/5 last:border-r-0 cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors select-none group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                    {header}
                  </span>
                  <div className="shrink-0 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                    {sortCol === colIdx ? (
                      sortDir === 'asc' ? (
                        <ArrowUp size={13} className="text-zinc-900 dark:text-zinc-100" />
                      ) : (
                        <ArrowDown size={13} className="text-zinc-900 dark:text-zinc-100" />
                      )
                    ) : (
                      <ArrowUpDown
                        size={12}
                        className="opacity-0 group-hover:opacity-60 transition-opacity"
                      />
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-black/[0.04] dark:divide-white/5 text-sm font-normal">
          {paginatedRows.map(({ row, originalIndex }, idx) => (
            <tr
              key={originalIndex}
              className="hover:bg-neutral-50/70 dark:hover:bg-zinc-900/40 transition-colors"
            >
              {/* Numéro de ligne absolu */}
              <td className="px-3 py-2.5 text-center text-xs font-mono text-zinc-400 select-none">
                {(currentPage - 1) * pageSize + idx + 1}
              </td>

              {/* Cellules de données */}
              {row.map((cellValue, colIdx) => {
                const strVal = String(cellValue ?? '');
                return (
                  <td
                    key={colIdx}
                    className="px-3.5 py-2.5 border-r border-black/[0.04] dark:border-white/5 last:border-r-0 max-w-[260px] truncate text-zinc-800 dark:text-zinc-200"
                  >
                    {strVal.length > 25 ? (
                      <ActionTooltip label={strVal} side="top">
                        <span className="truncate block">
                          {cellValue !== '' ? (
                            cellValue
                          ) : (
                            <span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs">
                              —
                            </span>
                          )}
                        </span>
                      </ActionTooltip>
                    ) : cellValue !== '' ? (
                      cellValue
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs">
                        —
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {filteredAndSortedCount === 0 && (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="py-14 text-center text-sm text-zinc-400 font-mono"
              >
                {isFr
                  ? `Aucune ligne ne correspond à votre recherche "${searchQuery}".`
                  : `No rows match your search "${searchQuery}".`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
