import React from 'react';
import type { PageRangeSelectorProps } from './types';

export function parsePageRange(rangeStr: string, totalPages: number): { isValid: boolean; error?: string; pages: number[] } {
  if (!rangeStr.trim()) {
    return { isValid: true, pages: [] };
  }

  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean);
  const pagesSet = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start > end || start < 1) {
        return { isValid: false, error: `Plage invalide "${part}"`, pages: [] };
      }
      if (end > totalPages) {
        return { isValid: false, error: `Page ${end} supérieure au total (${totalPages})`, pages: [] };
      }
      for (let i = start; i <= end; i++) {
        pagesSet.add(i);
      }
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 1) {
        return { isValid: false, error: `Numéro de page invalide "${part}"`, pages: [] };
      }
      if (num > totalPages) {
        return { isValid: false, error: `Page ${num} supérieure au total (${totalPages})`, pages: [] };
      }
      pagesSet.add(num);
    }
  }

  return { isValid: true, pages: Array.from(pagesSet).sort((a, b) => a - b) };
}

export const PageRangeSelector: React.FC<PageRangeSelectorProps> = ({
  value,
  onChange,
  totalPages,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  const displayLabel = label || (isFr ? 'Plage de pages' : 'Page range');
  const parsed = parsePageRange(value, totalPages);

  const handleSelectAll = () => {
    onChange(`1-${totalPages}`);
  };

  const handleSelectOdd = () => {
    const odds: number[] = [];
    for (let i = 1; i <= totalPages; i += 2) odds.push(i);
    onChange(odds.join(', '));
  };

  const handleSelectEven = () => {
    const evens: number[] = [];
    for (let i = 2; i <= totalPages; i += 2) evens.push(i);
    onChange(evens.join(', '));
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* En-tête : Libellé + Nombre total de pages */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {displayLabel}
        </span>
        <span className="font-mono text-[11px]">
          {isFr ? `sur ${totalPages} pages` : `of ${totalPages} pages`}
        </span>
      </div>

      {/* Champ textuel */}
      <div className="relative">
        <input
          type="text"
          data-testid="page-range-input"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isFr ? 'Ex: 1-3, 5, 8-10' : 'E.g. 1-3, 5, 8-10'}
          className={`w-full h-9 px-3 text-xs font-mono rounded-lg border bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] disabled:opacity-50 ${
            !parsed.isValid
              ? 'border-red-500/80 ring-1 ring-red-500/30'
              : 'border-zinc-200 dark:border-white/10'
          }`}
        />
      </div>

      {/* Erreur de validation */}
      {!parsed.isValid && parsed.error && (
        <span data-testid="range-error" className="text-[11px] font-mono text-red-500">
          {parsed.error}
        </span>
      )}

      {/* Raccourcis de sélection */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs font-mono">
        <button
          type="button"
          data-testid="range-quick-all"
          disabled={disabled || totalPages === 0}
          onClick={handleSelectAll}
          className="px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer disabled:opacity-40"
        >
          {isFr ? 'Toutes' : 'All'}
        </button>
        <button
          type="button"
          data-testid="range-quick-odd"
          disabled={disabled || totalPages === 0}
          onClick={handleSelectOdd}
          className="px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer disabled:opacity-40"
        >
          {isFr ? 'Impaires' : 'Odd'}
        </button>
        <button
          type="button"
          data-testid="range-quick-even"
          disabled={disabled || totalPages === 0}
          onClick={handleSelectEven}
          className="px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer disabled:opacity-40"
        >
          {isFr ? 'Paires' : 'Even'}
        </button>
        {value && (
          <button
            type="button"
            data-testid="range-quick-clear"
            disabled={disabled}
            onClick={handleClear}
            className="px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
          >
            {isFr ? 'Vider' : 'Clear'}
          </button>
        )}
      </div>
    </div>
  );
};
