import React from 'react';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface JsonTableViewProps {
  data: any;
  isFr: boolean;
}

export function JsonTableView({ data, isFr }: JsonTableViewProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-zinc-400">
        {isFr
          ? "Les données ne sont pas un tableau d'objets visualisable en grille."
          : 'Data is not an array of objects viewable as a grid.'}
      </div>
    );
  }

  const allColumns = Array.from(
    new Set(
      data.reduce<string[]>((acc, row) => {
        if (row && typeof row === 'object' && !Array.isArray(row)) {
          acc.push(...Object.keys(row));
        }
        return acc;
      }, [])
    )
  );

  return (
    <div className="w-full border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden text-xs">
      <table className="w-full text-left border-collapse font-mono">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10">
          <tr>
            <th className="py-2 px-3 text-[11px] font-semibold text-zinc-400 w-10 text-center">
              #
            </th>
            {allColumns.map((col) => (
              <th
                key={col}
                className="py-2 px-3 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <td className="py-2 px-3 text-zinc-400 text-center font-mono text-[10px]">
                {idx + 1}
              </td>
              {allColumns.map((col) => {
                const val = row && typeof row === 'object' ? row[col] : undefined;
                const formatted =
                  val === undefined
                    ? '—'
                    : typeof val === 'object'
                      ? JSON.stringify(val)
                      : String(val);
                return (
                  <td
                    key={col}
                    className="py-2 px-3 text-zinc-800 dark:text-zinc-200 truncate max-w-xs"
                  >
                    {formatted.length > 25 ? (
                      <ActionTooltip label={formatted} side="top">
                        <span className="truncate block">{formatted}</span>
                      </ActionTooltip>
                    ) : (
                      formatted
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
