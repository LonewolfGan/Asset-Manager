import React from 'react';
import { FileText, AlignLeft } from 'lucide-react';
import type { MarkdownToDocxMode } from '@/lib/markdown-to-docx-logic';

interface MarkdownToDocxModeSelectorProps {
  mode: MarkdownToDocxMode;
  onModeChange: (mode: MarkdownToDocxMode) => void;
  uploadLabel: string;
  pasteLabel: string;
}

export function MarkdownToDocxModeSelector({
  mode,
  onModeChange,
  uploadLabel,
  pasteLabel,
}: MarkdownToDocxModeSelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          aria-pressed={mode === 'upload'}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-[background-color,color,box-shadow] duration-150 cursor-pointer ${
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
          aria-pressed={mode === 'paste'}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-[background-color,color,box-shadow] duration-150 cursor-pointer ${
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
