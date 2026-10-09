import React from 'react';
import type { AiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';

interface AiScrubberInputPaneProps {
  workflow: AiScrubberWorkflow;
  isFr: boolean;
  placeholder?: string;
}

export function AiScrubberInputPane({
  workflow,
  isFr,
  placeholder,
}: AiScrubberInputPaneProps) {
  const { inputText, setInputText, isDragging, setIsDragging, handleFileDrop } =
    workflow;

  return (
    <div
      className={`flex flex-col rounded-xl border transition-colors ${
        isDragging
          ? 'border-zinc-400 dark:border-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50'
          : 'border-zinc-200/80 dark:border-white/10 bg-zinc-50/30 dark:bg-zinc-900/20'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleFileDrop}
    >
      {/* En-tête sobre du volet source */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200/70 dark:border-white/5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          {isFr ? 'Texte source' : 'Source text'}
        </span>
      </div>

      {/* Textarea source pleine hauteur */}
      <textarea
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
        placeholder={
          placeholder ??
          (isFr
            ? 'Collez ou déposez votre texte ici (prompt, réponse IA, article, document)...'
            : 'Paste or drop your text here (prompt, AI output, article)...')
        }
        className="w-full min-h-[420px] lg:min-h-[500px] p-4 bg-transparent font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none resize-none leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
