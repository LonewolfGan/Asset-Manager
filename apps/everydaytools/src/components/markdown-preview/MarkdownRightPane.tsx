import React, { RefObject } from 'react';
import { Eye, Code2, Code, FileText } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import type { RightPaneView } from '@/hooks/use-markdown-preview-workflow';

export interface MarkdownRightPaneProps {
  rightPaneView: RightPaneView;
  onRightPaneViewChange: (view: RightPaneView) => void;
  previewRef: RefObject<HTMLDivElement | null>;
  htmlViewRef: RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  editorHeight: number;
  wordWrap: boolean;
  hasContent: boolean;
  safeHtml: string;
  highlightedHtmlSource: string;
  metrics: {
    headings: number;
    readMinutes: number;
  };
  isFr: boolean;
}

export function MarkdownRightPane({
  rightPaneView,
  onRightPaneViewChange,
  previewRef,
  htmlViewRef,
  onScroll,
  editorHeight,
  wordWrap,
  hasContent,
  safeHtml,
  highlightedHtmlSource,
  metrics,
  isFr,
}: MarkdownRightPaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        {/* Commutateur de Volet Droit : [Aperçu visuel] vs [Code HTML] */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRightPaneViewChange('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              rightPaneView === 'preview'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFr ? 'Aperçu visuel' : 'Visual preview'}</span>
          </button>

          <button
            onClick={() => onRightPaneViewChange('html')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              rightPaneView === 'html'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isFr ? 'Code HTML' : 'HTML Code'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasContent && (
            rightPaneView === 'html' ? (
              <CopyButton
                text={safeHtml}
                label={isFr ? "Copier HTML" : "Copy HTML"}
                copiedLabel={isFr ? "HTML copié !" : "HTML copied!"}
                variant="ghost"
                size="sm"
                onCopy={() => trackToolUsed('markdown-preview', 'copy-html')}
              />
            ) : (
              <CopyButton
                text={() => {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = safeHtml;
                  return tempDiv.textContent || tempDiv.innerText || '';
                }}
                label={isFr ? "Copier texte" : "Copy text"}
                copiedLabel={isFr ? "Texte copié !" : "Text copied!"}
                variant="ghost"
                size="sm"
                onCopy={() => trackToolUsed('markdown-preview', 'copy-txt')}
              />
            )
          )}

          {hasContent && (
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              {metrics.headings} {isFr ? 'titres' : 'headings'} · ~{metrics.readMinutes} min
            </span>
          )}
        </div>
      </div>

      {rightPaneView === 'html' ? (
        <div
          ref={htmlViewRef}
          onScroll={onScroll}
          style={{ height: `${editorHeight}px` }}
          className="w-full p-4 overflow-auto bg-zinc-50/20 dark:bg-zinc-900/10 font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed select-all"
        >
          {!hasContent ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <Code className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
              <p className="text-xs text-zinc-500">{isFr ? 'Aucun contenu HTML généré pour le moment' : 'No HTML content generated yet'}</p>
            </div>
          ) : (
            <pre
              className={`html-src font-mono text-xs transition-all ${
                wordWrap
                  ? 'whitespace-pre-wrap break-all sm:break-words [overflow-wrap:anywhere]'
                  : 'whitespace-pre overflow-x-auto'
              }`}
              dangerouslySetInnerHTML={{ __html: highlightedHtmlSource }}
            />
          )}
        </div>
      ) : (
        <div
          ref={previewRef}
          onScroll={onScroll}
          style={{ height: `${editorHeight}px` }}
          className="w-full p-6 overflow-auto bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-text"
        >
          {!hasContent ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <FileText className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
              <p className="text-xs text-zinc-500">{isFr ? "Rédigez dans l'éditeur de gauche pour voir l'aperçu en direct" : "Write in the left editor to see the live preview"}</p>
            </div>
          ) : (
            <div
              className="md-preview max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          )}
        </div>
      )}
    </div>
  );
}
