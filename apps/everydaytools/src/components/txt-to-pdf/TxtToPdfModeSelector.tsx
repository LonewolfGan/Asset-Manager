import React from 'react';
import { FileText, AlignLeft } from 'lucide-react';
import type { TxtToPdfMode } from '@/lib/txt-to-pdf-logic';

interface TxtToPdfModeSelectorProps {
  mode: TxtToPdfMode;
  onModeChange: (mode: TxtToPdfMode) => void;
  uploadLabel: string;
  pasteLabel: string;
}

export function TxtToPdfModeSelector({
  mode,
  onModeChange,
  uploadLabel,
  pasteLabel,
}: TxtToPdfModeSelectorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex p-1 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileText size={14} />
          <span>{uploadLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => onModeChange('paste')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'paste'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <AlignLeft size={14} />
          <span>{pasteLabel}</span>
        </button>
      </div>
    </div>
  );
}
