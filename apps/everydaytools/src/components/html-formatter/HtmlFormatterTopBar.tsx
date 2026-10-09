import React from 'react';
import {
  Code2,
  Minimize2,
  MessageSquareOff,
  Undo2,
  Trash2,
  Download,
} from 'lucide-react';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import type { Mode, IndentSize } from '@/lib/html-formatter-logic';

interface HtmlFormatterTopBarProps {
  mode: Mode;
  indent: IndentSize;
  stripComments: boolean;
  wordWrap: boolean;
  historyLength: number;
  hasContent: boolean;
  output: string;
  onSetMode: (mode: Mode) => void;
  onSetIndent: (indent: IndentSize) => void;
  onToggleStripComments: (val: boolean) => void;
  onToggleWordWrap: (val: boolean) => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export function HtmlFormatterTopBar({
  mode,
  indent,
  stripComments,
  wordWrap,
  historyLength,
  hasContent,
  output,
  onSetMode,
  onSetIndent,
  onToggleStripComments,
  onToggleWordWrap,
  onUndo,
  onClear,
  onDownload,
}: HtmlFormatterTopBarProps) {
  const { isFr } = useLocale();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      {/* Groupe 1 : Modes de Traitement & Options */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSetMode('format')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
              mode === 'format'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isFr ? 'Formater' : 'Format'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSetMode('minify')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
              mode === 'minify'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{isFr ? 'Minifier' : 'Minify'}</span>
          </button>
        </div>

        {/* Sélecteur d'Indentation (uniquement en mode Formater) */}
        {mode === 'format' && (
          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 select-none">
              {isFr ? 'Indentation :' : 'Indent:'}
            </span>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
              {([2, 4, 'tab'] as IndentSize[]).map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => onSetIndent(val)}
                  className={`px-2 py-0.5 text-xs rounded transition-colors font-mono cursor-pointer ${
                    indent === val
                      ? 'bg-[#FF6B35] text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {val === 'tab' ? 'Tab' : `${val}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nettoyer commentaires */}
        <ActionTooltip
          label={
            stripComments
              ? isFr
                ? 'Conserver les commentaires'
                : 'Keep comments'
              : isFr
              ? 'Masquer / supprimer les commentaires'
              : 'Strip / remove comments'
          }
          side="bottom"
        >
          <button
            type="button"
            onClick={() => {
              const next = !stripComments;
              onToggleStripComments(next);
              toast.info(
                next
                  ? isFr
                    ? 'Suppression des commentaires activée'
                    : 'Comments removal enabled'
                  : isFr
                  ? 'Conservation des commentaires activée'
                  : 'Comments preservation enabled'
              );
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              stripComments
                ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <MessageSquareOff className="w-3.5 h-3.5" />
            <span>{isFr ? 'Nettoyer commentaires' : 'Strip comments'}</span>
          </button>
        </ActionTooltip>

        {/* Retour à la ligne global */}
        <WrapButton
          wrapped={wordWrap}
          onToggle={(next) => {
            onToggleWordWrap(next);
            toast.info(
              next
                ? isFr
                  ? 'Retour à la ligne activé'
                  : 'Line wrap enabled'
                : isFr
                ? 'Retour à la ligne désactivé'
                : 'Line wrap disabled'
            );
          }}
          label={isFr ? 'Retour à la ligne' : 'Line wrap'}
          size="sm"
        />
      </div>

      {/* Groupe 2 : Actions Globales Sémantiques */}
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
          <ActionTooltip
            label={isFr ? 'Effacer le contenu HTML' : 'Clear HTML content'}
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
        )}

        {hasContent && (
          <>
            <CopyButton
              text={output}
              label={isFr ? 'Copier' : 'Copy'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              variant="default"
              size="sm"
              onCopy={() => trackToolUsed('html-formatter', 'copy')}
            />

            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Télécharger .html' : 'Download .html'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
