import React from 'react';
import type { AiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';
import { AiScrubberCommandBar } from './AiScrubberCommandBar';
import { AiScrubberInputPane } from './AiScrubberInputPane';
import { AiScrubberOutputPane } from './AiScrubberOutputPane';

interface AiScrubberWorkbenchProps {
  workflow: AiScrubberWorkflow;
  isFr: boolean;
  placeholder?: string;
  cleanedOutputLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  disclaimer?: string;
}

export function AiScrubberWorkbench({
  workflow,
  isFr,
  placeholder,
  cleanedOutputLabel,
  copyLabel,
  copiedLabel,
  disclaimer,
}: AiScrubberWorkbenchProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Barre de commande supérieure épurée */}
      <AiScrubberCommandBar workflow={workflow} isFr={isFr} />

      {/* Zone d'atelier : Split Workbench (2 colonnes) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <AiScrubberInputPane
          workflow={workflow}
          isFr={isFr}
          placeholder={placeholder}
        />
        <AiScrubberOutputPane
          workflow={workflow}
          isFr={isFr}
          cleanedOutputLabel={cleanedOutputLabel}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </div>

      {/* Note technique sobre au bas de l'atelier */}
      <div className="pt-2 text-center">
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          {disclaimer ??
            (isFr
              ? 'Traitement 100% local dans votre navigateur. Les caractères zero-width, tirets cadratins et expressions IA sont neutralisés sans transmission de vos données.'
              : '100% client-side processing. Zero-width watermarks, em-dashes, and AI patterns are purged privately in your browser.')}
        </span>
      </div>
    </div>
  );
}
