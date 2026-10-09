import React from 'react';
import { FileText, AlignLeft } from 'lucide-react';
import type { MarkdownToPdfMode } from '@/lib/markdown-to-pdf-logic';

interface MarkdownToPdfModeSelectorProps {
  mode: MarkdownToPdfMode;
  onModeChange: (mode: MarkdownToPdfMode) => void;
  uploadLabel: string;
  pasteLabel: string;
}

export function MarkdownToPdfModeSelector({
  mode,
  onModeChange,
  uploadLabel,
  pasteLabel,
}: MarkdownToPdfModeSelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileText size={14} />
          <span>{uploadLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => onModeChange('paste')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            mode === 'paste'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <AlignLeft size={14} />
          <span>{pasteLabel}</span>
        </button>
      </div>
    </div>
  );
}
