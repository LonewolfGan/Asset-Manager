import React from 'react';
import type { DataPreviewTableLiteProps } from './types';

export const DataPreviewTableLite: React.FC<DataPreviewTableLiteProps> = ({
  headers,
  rows,
  totalRows,
  maxRows = 5,
  label,
  isFr = false,
  className = '',
  emptyMessage,
}) => {
  const effectiveTotal = totalRows ?? rows.length;
  const displayedRows = rows.slice(0, maxRows);
  const defaultEmpty = isFr ? 'Aucune donnée disponible' : 'No data available';

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || effectiveTotal > 0) && (
        <div className="flex items-center justify-between text-xs">
          {label ? (
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          ) : (
            <span />
          )}
          {effectiveTotal > 0 && (
            <span
              data-testid="data-preview-counter"
              className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400"
            >
              {isFr
                ? `Affichage de ${displayedRows.length} sur ${effectiveTotal} lignes`
                : `Showing ${displayedRows.length} of ${effectiveTotal} rows`}
            </span>
          )}
        </div>
      )}

      {displayedRows.length === 0 ? (
        <div className="py-6 px-4 text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400">
          {emptyMessage || defaultEmpty}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60">
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="py-2 px-3 font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap text-[11px] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 font-mono text-[11px] sm:text-xs">
              {displayedRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  {headers.map((_, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-2 px-3 text-zinc-700 dark:text-zinc-300 whitespace-nowrap max-w-xs truncate"
                    >
                      {row[cIdx] !== null && row[cIdx] !== undefined ? String(row[cIdx]) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
