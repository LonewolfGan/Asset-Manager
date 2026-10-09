import React from 'react';

interface ExcelToPdfSheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSelectSheet: (sheet: string) => void;
  label: string;
}

export function ExcelToPdfSheetSelector({
  sheets,
  selectedSheet,
  onSelectSheet,
  label,
}: ExcelToPdfSheetSelectorProps) {
  if (sheets.length <= 1) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-8 p-4 rounded-2xl bg-neutral-100/80 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex flex-col items-center gap-2.5">
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {sheets.map((sheet) => {
          const isSelected = selectedSheet === sheet;
          return (
            <button
              key={sheet}
              type="button"
              onClick={() => onSelectSheet(sheet)}
              className={`h-8 px-3.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-[#107C41] text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              {sheet}
            </button>
          );
        })}
      </div>
    </div>
  );
}
