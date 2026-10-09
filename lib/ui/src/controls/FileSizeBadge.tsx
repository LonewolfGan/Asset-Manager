import React from 'react';
import type { FileSizeBadgeProps } from './types';
import { formatBytes } from '../utils';

export const FileSizeBadge: React.FC<FileSizeBadgeProps> = ({
  bytes,
  originalBytes,
  compressedBytes,
  showSavings = false,
  isFr = false,
  className = '',
}) => {
  if (originalBytes !== undefined && compressedBytes !== undefined) {
    const savingsPct =
      originalBytes > 0
        ? Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
        : 0;
    const isSaved = savingsPct > 0;

    return (
      <div className={`inline-flex items-center gap-2 text-xs font-mono ${className}`}>
        <span className="text-zinc-400 line-through">
          {formatBytes(originalBytes, 1, isFr)}
        </span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {formatBytes(compressedBytes, 1, isFr)}
        </span>
        {showSavings && (
          <span
            data-testid="savings-badge"
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
              isSaved
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {isSaved ? `-${savingsPct}%` : `${savingsPct}%`}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60 ${className}`}
    >
      {formatBytes(bytes ?? 0, 1, isFr)}
    </span>
  );
};
