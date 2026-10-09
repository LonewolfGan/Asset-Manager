import React from 'react';

interface RegexReplaceTabProps {
  replaceWith: string;
  onReplaceWithChange: (val: string) => void;
  replacedText: string;
  testString: string;
  wordWrap: boolean;
  isFr: boolean;
}

export function RegexReplaceTab({
  replaceWith,
  onReplaceWithChange,
  replacedText,
  testString,
  wordWrap,
  isFr,
}: RegexReplaceTabProps) {
  return (
    <div className="h-full flex flex-col gap-3 font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2 border-b border-zinc-200/60 dark:border-white/10">
        <label htmlFor="replace-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
          {isFr ? 'Remplacer chaque correspondance par :' : 'Replace each match with:'}
        </label>
        <input
          id="replace-input"
          type="text"
          value={replaceWith}
          onChange={(e) => onReplaceWithChange(e.target.value)}
          placeholder={isFr ? 'Texte de remplacement (supporte $1, $2...)' : 'Replacement text (supports $1, $2...)'}
          className="flex-1 px-2.5 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          {isFr ? 'Aperçu du texte après remplacement :' : 'Preview after replacement:'}
        </span>
        <pre className={`flex-1 p-2 rounded bg-zinc-50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200 font-mono text-xs overflow-auto ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
          {replacedText || testString}
        </pre>
      </div>
    </div>
  );
}
