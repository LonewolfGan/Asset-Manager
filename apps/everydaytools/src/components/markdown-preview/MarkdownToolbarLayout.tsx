import React from 'react';
import {
  Columns2,
  FileText,
  Maximize2,
  ArrowUpDown,
  Undo2,
  Redo2,
  Trash2,
  Download,
  ChevronDown,
  Code2,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { ViewLayout } from '@/hooks/use-markdown-preview-workflow';

export interface MarkdownToolbarLayoutProps {
  viewLayout: ViewLayout;
  onViewLayoutChange: (layout: ViewLayout) => void;
  syncScroll: boolean;
  onToggleSyncScroll: () => void;
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  hasContent: boolean;
  markdown: string;
  safeHtml: string;
  onClear: () => void;
  onDownloadMd: () => void;
  onDownloadHtml: () => void;
  isFr: boolean;
}

export function MarkdownToolbarLayout({
  viewLayout,
  onViewLayoutChange,
  syncScroll,
  onToggleSyncScroll,
  wordWrap,
  onToggleWordWrap,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  hasContent,
  markdown,
  safeHtml,
  onClear,
  onDownloadMd,
  onDownloadHtml,
  isFr,
}: MarkdownToolbarLayoutProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      {/* Groupe 1 : Configuration de la Disposition (Partagé, Éditeur, Aperçu) & Toggles */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
          <ActionTooltip label={isFr ? "Vue partagée 50/50 (Éditeur + Aperçu)" : "50/50 Split view (Editor + Preview)"} side="bottom">
            <button
              onClick={() => onViewLayoutChange('split')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewLayout === 'split'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Partagé' : 'Split'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? "Éditeur Markdown uniquement" : "Markdown editor only"} side="bottom">
            <button
              onClick={() => onViewLayoutChange('editor')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewLayout === 'editor'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Éditeur' : 'Editor'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? "Aperçu du document rendu uniquement" : "Rendered document preview only"} side="bottom">
            <button
              onClick={() => onViewLayoutChange('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                viewLayout === 'preview'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Aperçu seul' : 'Preview only'}</span>
            </button>
          </ActionTooltip>
        </div>

        {/* Toggle Défilement Synchronisé */}
        {viewLayout === 'split' && (
          <ActionTooltip label={isFr ? "Synchroniser le défilement entre l'éditeur et l'aperçu" : "Synchronize scrolling between editor and preview"} side="bottom">
            <button
              onClick={onToggleSyncScroll}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                syncScroll
                  ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sync Scroll</span>
            </button>
          </ActionTooltip>
        )}

        <WrapButton
          wrapped={wordWrap}
          onToggle={onToggleWordWrap}
          label="Wrap"
          size="sm"
        />
      </div>

      {/* Groupe 2 : Actions Globales (Undo, Redo, Copier MD, Copier HTML, Vider, Télécharger) */}
      <div className="flex items-center gap-1.5 ml-auto flex-wrap">
        {canUndo && (
          <ActionTooltip label={isFr ? "Annuler (Ctrl+Z)" : "Undo (Ctrl+Z)"} side="bottom">
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {canRedo && (
          <ActionTooltip label={isFr ? "Rétablir (Ctrl+Y)" : "Redo (Ctrl+Y)"} side="bottom">
            <button
              onClick={onRedo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Rétablir' : 'Redo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasContent && (
          <>
            <CopyButton
              text={markdown}
              label={isFr ? "Copier Markdown" : "Copy Markdown"}
              copiedLabel={isFr ? "Markdown copié !" : "Markdown copied!"}
              variant="default"
              size="sm"
              onCopy={() => trackToolUsed('markdown-preview', 'copy-md')}
            />

            <CopyButton
              text={safeHtml}
              label={isFr ? "Copier HTML" : "Copy HTML"}
              copiedLabel={isFr ? "HTML copié !" : "HTML copied!"}
              variant="default"
              size="sm"
              onCopy={() => trackToolUsed('markdown-preview', 'copy-html')}
            />

            <ActionTooltip label={isFr ? "Effacer tout le texte Markdown" : "Clear all Markdown text"} side="bottom">
              <button
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isFr ? 'Vider' : 'Clear'}</span>
              </button>
            </ActionTooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer outline-none">
                  <Download className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Télécharger' : 'Download'}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuItem
                  onSelect={onDownloadMd}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{isFr ? 'Document Markdown' : 'Markdown Document'}</div>
                    <div className="text-[10px] text-zinc-400">{isFr ? 'Fichier source .md' : 'Source .md file'}</div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={onDownloadHtml}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{isFr ? 'Page Web HTML' : 'HTML Web Page'}</div>
                    <div className="text-[10px] text-zinc-400">{isFr ? 'Fichier autonome .html avec CSS' : 'Standalone .html file with CSS'}</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
