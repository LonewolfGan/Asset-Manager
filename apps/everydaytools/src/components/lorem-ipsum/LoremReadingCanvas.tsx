import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import type { LoremUnit } from '@/lib/lorem-ipsum-logic';

interface LoremReadingCanvasProps {
  unit: LoremUnit;
  blocks: string[];
  isFr: boolean;
}

export function LoremReadingCanvas({
  unit,
  blocks,
  isFr,
}: LoremReadingCanvasProps) {
  return (
    <div className="p-6 sm:p-10 lg:p-12 min-h-[380px]">
      {unit === 'sentences' ? (
        /* Mode Phrases : Découpage net en phrases distinctes */
        <div className="space-y-3">
          {blocks.map((sentence, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl hover:bg-zinc-100/70 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1 shrink-0 select-none">
                {String(idx + 1).padStart(2, '0')}.
              </span>

              <p className="select-all flex-1 text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-[1.75]">
                {sentence}
              </p>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <CopyButton
                  text={sentence}
                  label={isFr ? 'Copier' : 'Copy'}
                  copiedLabel={isFr ? 'Copié' : 'Copied'}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
          ))}
        </div>
      ) : unit === 'lists' ? (
        /* Mode Listes */
        <div className="space-y-2">
          {blocks.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-center justify-between gap-4 p-2.5 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-center gap-3 select-all">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 text-base leading-relaxed">
                  {item}
                </span>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <CopyButton
                  text={item}
                  label={isFr ? 'Copier' : 'Copy'}
                  copiedLabel={isFr ? 'Copié' : 'Copied'}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
          ))}
        </div>
      ) : unit === 'words' ? (
        /* Mode Mots */
        <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30">
          <p className="select-all text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-[1.8]">
            {blocks[0]}
          </p>
        </div>
      ) : (
        /* Mode Paragraphes : Lecture fluide et naturelle */
        <div className="space-y-6 sm:space-y-8">
          {blocks.map((paragraph, idx) => (
            <div
              key={idx}
              className="group relative p-3 sm:p-4 -mx-3 sm:-mx-4 rounded-xl hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 transition-colors"
            >
              <p className="select-all tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 text-base sm:text-lg md:text-[19px] leading-[1.8]">
                {paragraph}
              </p>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton
                  text={paragraph}
                  label={isFr ? 'Copier' : 'Copy'}
                  copiedLabel={isFr ? 'Copié' : 'Copied'}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
