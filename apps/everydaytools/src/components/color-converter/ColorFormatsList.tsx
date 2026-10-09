import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

interface ColorFormatsListProps {
  workflow: ColorConverterWorkflow;
  isFr: boolean;
}

export function ColorFormatsList({
  workflow,
  isFr,
}: ColorFormatsListProps) {
  const { formats } = workflow;

  return (
    <div className="w-full space-y-3">
      {formats.map((fmt) => (
        <div
          key={fmt.key}
          className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-colors flex items-center justify-between gap-4"
        >
          <div className="w-20 shrink-0 font-mono">
            <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 block">
              {fmt.label}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tight block">
              {fmt.sub}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={fmt.value}
              onChange={(e) => fmt.onUpdate(e.target.value)}
              className="w-full bg-transparent font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 outline-none tracking-tight truncate selection:bg-zinc-200 dark:selection:bg-zinc-800"
            />
          </div>

          <CopyButton
            text={fmt.value}
            label={isFr ? 'Copier' : 'Copy'}
            copiedLabel={isFr ? 'Copié !' : 'Copied!'}
            toastMessage={isFr ? 'Couleur copiée' : 'Color copied'}
            size="sm"
            variant="default"
          />
        </div>
      ))}
    </div>
  );
}
