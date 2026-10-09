import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CsvToExcelPastePaneProps {
  csvText: string;
  onCsvTextChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isFr: boolean;
}

export function CsvToExcelPastePane({
  csvText,
  onCsvTextChange,
  onSubmit,
  placeholder,
  isFr,
}: CsvToExcelPastePaneProps) {
  const defaultPlaceholder = isFr
    ? 'Nom,Email,Rôle,Ville\nJean Dupont,jean@example.com,Développeur,Paris\nMarie Curie,marie@example.com,Chercheuse,Lyon'
    : 'Name,Email,Role,City\nJohn Doe,john@example.com,Developer,New York\nJane Smith,jane@example.com,Researcher,London';

  return (
    <div className="relative rounded-3xl p-3 sm:p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 shadow-sm">
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-black/5 dark:border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {isFr
              ? 'Saisissez ou collez vos données CSV brutes ci-dessous'
              : 'Enter or paste your raw CSV data below'}
          </span>
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {csvText.length.toLocaleString()} {isFr ? 'caractères' : 'characters'}
          </span>
        </div>

        <textarea
          placeholder={placeholder || defaultPlaceholder}
          value={csvText}
          onChange={(e) => onCsvTextChange(e.target.value)}
          rows={10}
          className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-zinc-950 border border-black/5 dark:border-white/10 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-y leading-relaxed"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={!csvText.trim()}
            onClick={onSubmit}
            className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>{isFr ? 'Valider et configurer' : 'Validate & configure'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
