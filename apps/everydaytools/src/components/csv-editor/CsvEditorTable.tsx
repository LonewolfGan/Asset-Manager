import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { SortConfig, ProcessedRow } from '@/lib/csv-editor-logic';

interface CsvEditorTableProps {
  headers: string[];
  onUpdateHeader: (colIdx: number, val: string) => void;
  processedRows: ProcessedRow[];
  totalRowsCount: number;
  searchQuery: string;
  sortConfig: SortConfig;
  onSort: (colIdx: number) => void;
  onDeleteCol: (colIdx: number) => void;
  onAddCol: () => void;
  onUpdateCell: (rowIdx: number, colIdx: number, val: string) => void;
  onDeleteRow: (rowIdx: number) => void;
  onAddRow: () => void;
  isFr: boolean;
}

export function CsvEditorTable({
  headers,
  onUpdateHeader,
  processedRows,
  totalRowsCount,
  searchQuery,
  sortConfig,
  onSort,
  onDeleteCol,
  onAddCol,
  onUpdateCell,
  onDeleteRow,
  onAddRow,
  isFr,
}: CsvEditorTableProps) {
  return (
    <div className="w-full space-y-2">
      <div className="w-full overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-950 shadow-sm">
        <table className="w-full border-collapse text-left select-text">
          <thead>
            <tr className="bg-neutral-50 dark:bg-zinc-900/80 border-b border-black/[0.08] dark:border-white/10 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <th className="w-12 px-3 py-3 text-center text-zinc-400 font-mono select-none">
                #
              </th>

              {headers.map((header, colIdx) => (
                <th
                  key={colIdx}
                  className="min-w-[160px] px-3 py-2 border-r border-black/[0.06] dark:border-white/5 last:border-r-0 group"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => onUpdateHeader(colIdx, e.target.value)}
                      className="w-full px-1.5 py-1 font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06] focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-colors"
                    />

                    <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <ActionTooltip label={isFr ? 'Trier cette colonne' : 'Sort this column'} side="top">
                        <button
                          type="button"
                          onClick={() => onSort(colIdx)}
                          className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer ${
                            sortConfig?.colIndex === colIdx ? 'text-[#10B981] opacity-100 font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {sortConfig?.colIndex === colIdx ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp size={13} />
                            ) : (
                              <ArrowDown size={13} />
                            )
                          ) : (
                            <ArrowUpDown size={13} />
                          )}
                        </button>
                      </ActionTooltip>

                      <ActionTooltip label={isFr ? 'Supprimer cette colonne' : 'Delete this column'} side="top">
                        <button
                          type="button"
                          onClick={() => onDeleteCol(colIdx)}
                          className="p-1 rounded text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </ActionTooltip>
                    </div>
                  </div>
                </th>
              ))}

              <th className="w-12 px-2 py-2 text-center select-none">
                <ActionTooltip label={isFr ? 'Ajouter une nouvelle colonne' : 'Add a new column'} side="top">
                  <button
                    type="button"
                    onClick={onAddCol}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </ActionTooltip>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/[0.04] dark:divide-white/5 text-sm font-normal">
            {processedRows.map(({ row, originalIndex }, displayIdx) => (
              <tr
                key={originalIndex}
                className="hover:bg-neutral-50/70 dark:hover:bg-zinc-900/40 transition-colors group"
              >
                <td className="px-3 py-2 text-center text-xs font-mono text-zinc-400 select-none">
                  {displayIdx + 1}
                </td>

                {row.map((cellValue, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-2 py-1.5 border-r border-black/[0.04] dark:border-white/5 last:border-r-0"
                  >
                    <input
                      type="text"
                      value={cellValue}
                      onChange={(e) => onUpdateCell(originalIndex, colIdx, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 bg-transparent rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.03] focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-colors"
                    />
                  </td>
                ))}

                <td className="px-2 py-1.5 text-center">
                  <ActionTooltip label={isFr ? 'Supprimer cette ligne' : 'Delete this row'} side="top">
                    <button
                      type="button"
                      onClick={() => onDeleteRow(originalIndex)}
                      className="p-1.5 rounded-lg text-zinc-300 hover:text-red-600 dark:text-zinc-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </ActionTooltip>
                </td>
              </tr>
            ))}

            {!searchQuery && (
              <tr
                onClick={onAddRow}
                className="hover:bg-neutral-50/80 dark:hover:bg-zinc-900/60 cursor-pointer text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors select-none group border-t border-dashed border-black/10 dark:border-white/10"
              >
                <td className="px-3 py-2.5 text-center">
                  <Plus size={14} className="mx-auto text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" />
                </td>
                <td
                  colSpan={headers.length + 1}
                  className="px-3 py-2.5 text-xs font-medium text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                >
                  <span>{isFr ? 'Ajouter une ligne...' : 'Add a row...'}</span>
                </td>
              </tr>
            )}

            {processedRows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 2}
                  className="py-12 text-center text-sm text-zinc-400 font-mono"
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

      {searchQuery && (
        <div className="w-full text-right text-xs font-mono text-zinc-400 pt-1">
          {isFr
            ? `${processedRows.length} sur ${totalRowsCount} lignes affichées`
            : `${processedRows.length} of ${totalRowsCount} rows displayed`}
        </div>
      )}
    </div>
  );
}
