import React from 'react';
import { Download, Trash2, Undo2 } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';
import type {
  Mode,
  Language,
  IndentSize,
  QuotesStyle,
} from '../../lib/js-formatter-logic';
import { JsFormatterOptions } from './JsFormatterOptions';

interface JsFormatterToolbarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  indent: IndentSize;
  setIndent: (indent: IndentSize) => void;
  semicolons: boolean;
  setSemicolons: (semis: boolean) => void;
  quotes: QuotesStyle;
  setQuotes: (quotes: QuotesStyle) => void;
  stripComments: boolean;
  setStripComments: (strip: boolean) => void;
  wordWrap: boolean;
  setWordWrap: (wrap: boolean) => void;
  historyLength: number;
  onUndo: () => void;
  hasContent: boolean;
  output: string;
  onClear: () => void;
  onDownload: () => void;
}

export function JsFormatterToolbar({
  mode,
  setMode,
  language,
  setLanguage,
  indent,
  setIndent,
  semicolons,
  setSemicolons,
  quotes,
  setQuotes,
  stripComments,
  setStripComments,
  wordWrap,
  setWordWrap,
  historyLength,
  onUndo,
  hasContent,
  output,
  onClear,
  onDownload,
}: JsFormatterToolbarProps) {
  const { isFr } = useLocale();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      <JsFormatterOptions
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        indent={indent}
        setIndent={setIndent}
        semicolons={semicolons}
        setSemicolons={setSemicolons}
        quotes={quotes}
        setQuotes={setQuotes}
        stripComments={stripComments}
        setStripComments={setStripComments}
        wordWrap={wordWrap}
        setWordWrap={setWordWrap}
      />

      {/* Groupe 2 : Actions Globales Sémantiques (Annuler, Vider, Copier, Télécharger) */}
      <div className="flex items-center gap-1.5 ml-auto">
        {historyLength > 0 && (
          <ActionTooltip
            label={
              isFr
                ? 'Annuler la dernière modification (Ctrl+Z)'
                : 'Undo last change (Ctrl+Z)'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasContent && (
          <>
            <CopyButton
              text={output}
              label={isFr ? 'Copier' : 'Copy'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              variant="default"
              size="sm"
              onCopy={() => trackToolUsed('js-formatter', 'copy')}
            />

            <ActionTooltip
              label={isFr ? 'Effacer le contenu JS / TS' : 'Clear JS / TS content'}
              side="bottom"
            >
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isFr ? 'Vider' : 'Clear'}</span>
              </button>
            </ActionTooltip>

            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isFr
                  ? `Télécharger .${language === 'typescript' ? 'ts' : 'js'}`
                  : `Download .${language === 'typescript' ? 'ts' : 'js'}`}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
