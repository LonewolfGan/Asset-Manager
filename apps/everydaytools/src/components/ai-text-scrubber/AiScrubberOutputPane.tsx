import React from 'react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import { ShieldCheck, ArrowRightLeft, Download } from 'lucide-react';
import type { AiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';

interface AiScrubberOutputPaneProps {
  workflow: AiScrubberWorkflow;
  isFr: boolean;
  cleanedOutputLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
}

export function AiScrubberOutputPane({
  workflow,
  isFr,
  cleanedOutputLabel,
  copyLabel,
  copiedLabel,
}: AiScrubberOutputPaneProps) {
  const {
    outputText,
    hasResult,
    handleApplyToInput,
    handleDownload,
  } = workflow;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/30 dark:bg-zinc-900/20">
      {/* En-tête du volet résultat avec actions */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200/70 dark:border-white/5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          {cleanedOutputLabel ?? (isFr ? 'Texte épuré' : 'Cleaned output')}
        </span>

        {hasResult && (
          <div className="flex items-center gap-1.5">
            <ActionTooltip
              label={
                isFr
                  ? 'Remplacer le texte source par ce résultat épuré'
                  : 'Replace source with this cleaned output'
              }
            >
              <button
                type="button"
                onClick={handleApplyToInput}
                className="flex items-center gap-1 h-7 px-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {isFr ? 'Remplacer source' : 'Apply'}
                </span>
              </button>
            </ActionTooltip>

            <CopyButton
              text={outputText}
              label={copyLabel ?? (isFr ? 'Copier' : 'Copy')}
              copiedLabel={copiedLabel ?? (isFr ? 'Copié' : 'Copied')}
              variant="ghost"
              size="sm"
              disabled={!outputText}
            />

            <ActionTooltip label={isFr ? 'Télécharger en fichier .txt' : 'Download .txt file'}>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1 h-7 px-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">.txt</span>
              </button>
            </ActionTooltip>
          </div>
        )}
      </div>

      {/* Zone de texte résultat pleine hauteur ou empty state */}
      {hasResult ? (
        <textarea
          readOnly
          value={outputText}
          className="w-full min-h-[420px] lg:min-h-[500px] p-4 bg-transparent font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 outline-none resize-none leading-relaxed select-all"
        />
      ) : (
        <div className="w-full min-h-[420px] lg:min-h-[500px] flex flex-col items-center justify-center p-8 text-center gap-3 text-zinc-400">
          <ShieldCheck className="w-8 h-8 stroke-[1.2] text-zinc-300 dark:text-zinc-700" />
          <div className="max-w-xs space-y-1">
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Aucun texte épuré pour le moment' : 'No cleaned output yet'}
            </p>
            <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
              {isFr
                ? 'Saisissez ou collez votre texte à gauche, puis cliquez sur « Nettoyer le texte ».'
                : 'Paste text on the left, then click "Scrub Text".'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
