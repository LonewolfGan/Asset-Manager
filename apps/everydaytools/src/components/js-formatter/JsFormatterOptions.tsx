import React from 'react';
import { Code2, Minimize2, MessageSquareOff, Braces } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { WrapButton } from '@/components/ui/wrap-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import type {
  Mode,
  Language,
  IndentSize,
  QuotesStyle,
} from '../../lib/js-formatter-logic';

interface JsFormatterOptionsProps {
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
}

export function JsFormatterOptions({
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
}: JsFormatterOptionsProps) {
  const { isFr } = useLocale();

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMode('format')}
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
          onClick={() => setMode('minify')}
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

      <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
        <button
          type="button"
          onClick={() => setLanguage('javascript')}
          className={`px-2 py-0.5 text-xs rounded transition-colors font-mono font-medium cursor-pointer ${
            language === 'javascript'
              ? 'bg-[#FF6B35] text-white font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          JS
        </button>
        <button
          type="button"
          onClick={() => setLanguage('typescript')}
          className={`px-2 py-0.5 text-xs rounded transition-colors font-mono font-medium cursor-pointer ${
            language === 'typescript'
              ? 'bg-[#FF6B35] text-white font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          TS
        </button>
      </div>

      {mode === 'format' && (
        <>
          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 select-none">
              {isFr ? 'Indentation :' : 'Indent:'}
            </span>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
              {([2, 4, 'tab'] as IndentSize[]).map((val) => (
                <button
                  type="button"
                  key={String(val)}
                  onClick={() => setIndent(val)}
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

          <ActionTooltip
            label={
              isFr
                ? "Conserver ou insérer les points-virgules de fin d'instruction"
                : 'Preserve or insert semicolons at statement ends'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => {
                const next = !semicolons;
                setSemicolons(next);
                toast.info(
                  next
                    ? isFr ? 'Points-virgules activés (;)' : 'Semicolons enabled (;)'
                    : isFr ? 'Points-virgules désactivés (style ASI)' : 'Semicolons disabled (ASI style)'
                );
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                semicolons
                  ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Braces className="w-3.5 h-3.5" />
              <span>{isFr ? 'Points-virgules' : 'Semicolons'}</span>
            </button>
          </ActionTooltip>

          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 select-none">
              {isFr ? 'Guillemets :' : 'Quotes:'}
            </span>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
              <button
                type="button"
                onClick={() => {
                  setQuotes('preserve');
                  toast.info(isFr ? "Guillemets d'origine conservés" : 'Original quotes preserved');
                }}
                className={`px-2 py-0.5 text-xs rounded transition-colors font-mono cursor-pointer ${
                  quotes === 'preserve'
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuotes('single');
                  toast.info(isFr ? "Guillemets simples imposés ('')" : "Single quotes enforced ('')");
                }}
                className={`px-2 py-0.5 text-xs rounded transition-colors font-mono cursor-pointer ${
                  quotes === 'single'
                    ? 'bg-[#FF6B35] text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                ' '
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuotes('double');
                  toast.info(isFr ? 'Guillemets doubles imposés ("")' : 'Double quotes enforced ("")');
                }}
                className={`px-2 py-0.5 text-xs rounded transition-colors font-mono cursor-pointer ${
                  quotes === 'double'
                    ? 'bg-[#FF6B35] text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                " "
              </button>
            </div>
          </div>
        </>
      )}

      <ActionTooltip
        label={
          stripComments
            ? isFr ? 'Conserver les commentaires' : 'Keep comments'
            : isFr ? 'Masquer / supprimer les commentaires' : 'Strip / remove comments'
        }
        side="bottom"
      >
        <button
          type="button"
          onClick={() => {
            const next = !stripComments;
            setStripComments(next);
            toast.info(
              next
                ? isFr ? 'Suppression des commentaires activée' : 'Comments removal enabled'
                : isFr ? 'Conservation des commentaires activée' : 'Comments preservation enabled'
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

      <WrapButton
        wrapped={wordWrap}
        onToggle={(next) => {
          setWordWrap(next);
          toast.info(
            next
              ? isFr ? 'Retour à la ligne activé' : 'Line wrap enabled'
              : isFr ? 'Retour à la ligne désactivé' : 'Line wrap disabled'
          );
        }}
        label={isFr ? 'Retour à la ligne' : 'Line wrap'}
        size="sm"
      />
    </div>
  );
}
