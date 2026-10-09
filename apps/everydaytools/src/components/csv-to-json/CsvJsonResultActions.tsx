import React from 'react';
import { Eye } from 'lucide-react';
import CopyButton from '@/components/ui/copy-button';

interface CsvJsonResultActionsProps {
  onOpenPreview: () => void;
  textOutput: string;
  targetFormatName: string;
  isFr: boolean;
}

export function CsvJsonResultActions({
  onOpenPreview,
  textOutput,
  targetFormatName,
  isFr,
}: CsvJsonResultActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onOpenPreview}
        className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
      >
        <Eye size={16} strokeWidth={2.2} />
        <span>
          {isFr ? 'Aperçu' : 'Preview'} {targetFormatName}
        </span>
      </button>

      <CopyButton
        text={textOutput}
        variant="pill"
        label={isFr ? `Copier le ${targetFormatName}` : `Copy ${targetFormatName}`}
        className="h-12 px-6 text-sm"
      />
    </div>
  );
}
