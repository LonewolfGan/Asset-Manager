import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import { MARKDOWN_SAMPLE_FR, MARKDOWN_SAMPLE_EN } from '@/lib/markdown-to-pdf-logic';

interface MarkdownToPdfPastePaneProps {
  markdownInput: string;
  onMarkdownInputChange: (val: string) => void;
  onSubmit: () => void;
  isFr: boolean;
}

export function MarkdownToPdfPastePane({
  markdownInput,
  onMarkdownInputChange,
  onSubmit,
  isFr,
}: MarkdownToPdfPastePaneProps) {
  const placeholder = isFr
    ? 'Veuillez saisir votre texte ou syntaxe Markdown...'
    : 'Please enter your text or Markdown syntax...';

  const sampleText = isFr ? MARKDOWN_SAMPLE_FR : MARKDOWN_SAMPLE_EN;

  return (
    <div className="space-y-4">
      <CodeWorkspace
        value={markdownInput}
        onChange={onMarkdownInputChange}
        mode="input"
        format="markdown"
        formatLabel={isFr ? 'Document Markdown' : 'Markdown Document'}
        placeholder={placeholder}
        sampleText={sampleText}
        onSubmit={onSubmit}
        minHeight="380px"
        maxHeight="520px"
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!markdownInput.trim()}
          onClick={onSubmit}
          className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{isFr ? 'Valider et configurer' : 'Confirm and configure'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
