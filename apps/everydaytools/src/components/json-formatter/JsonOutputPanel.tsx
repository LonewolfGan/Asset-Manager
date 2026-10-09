import React from 'react';
import { toast } from 'sonner';
import { FileJson, AlertCircle, Search } from 'lucide-react';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import type { ViewTab } from '@/lib/json-repair-logic';
import { JsonTreeNode } from './JsonTreeNode';
import { JsonTableView } from './JsonTableView';

export interface JsonOutputPanelProps {
  viewTab: ViewTab;
  yamlMode: boolean;
  isMinified: boolean;
  outputCode: string;
  highlightedOutput: string;
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  outBytes: number;
  compressionRatio: number;
  parseResult: {
    ok: boolean;
    data: any;
    empty: boolean;
    error: any;
  };
  treeSearch: string;
  onTreeSearchChange: (val: string) => void;
  treeExpandAll: boolean;
  onToggleTreeExpandAll: () => void;
  isFr: boolean;
}

export function JsonOutputPanel({
  viewTab,
  yamlMode,
  isMinified,
  outputCode,
  highlightedOutput,
  wordWrap,
  onToggleWordWrap,
  outBytes,
  compressionRatio,
  parseResult,
  treeSearch,
  onTreeSearchChange,
  treeExpandAll,
  onToggleTreeExpandAll,
  isFr,
}: JsonOutputPanelProps) {
  return (
    <div className="flex flex-col min-h-[480px]">
      {/* En-tête sobre du volet droit */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {viewTab === 'code'
              ? yamlMode
                ? 'YAML'
                : isMinified
                  ? isFr
                    ? 'Minifié'
                    : 'Minified'
                  : isFr
                    ? 'Formaté'
                    : 'Formatted'
              : viewTab === 'tree'
                ? isFr
                  ? 'Arborescence'
                  : 'Tree View'
                : isFr
                  ? 'Tableau'
                  : 'Table'}
          </span>
          {outputCode && viewTab === 'code' && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({outBytes} {isFr ? 'octets' : 'bytes'}
              {compressionRatio !== 0 &&
                ` · ${compressionRatio > 0 ? '-' : '+'}${Math.abs(compressionRatio)}%`}
              )
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewTab === 'tree' && (
            <button
              onClick={onToggleTreeExpandAll}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              {treeExpandAll
                ? isFr
                  ? 'Tout replier'
                  : 'Collapse all'
                : isFr
                  ? 'Tout déplier'
                  : 'Expand all'}
            </button>
          )}
          {viewTab === 'code' && outputCode && (
            <>
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
                label={isFr ? 'Wrap' : 'Wrap'}
                size="sm"
              />
              <CopyButton
                text={outputCode}
                size="sm"
                variant="default"
                label={isFr ? 'Copier' : 'Copy'}
                copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              />
            </>
          )}
        </div>
      </div>

      {/* Contenu du volet droit */}
      <div className="flex-1 overflow-auto">
        {parseResult.empty ? (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <FileJson className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
            <p className="text-xs text-zinc-500">
              {isFr
                ? 'Collez du JSON ou chargez un exemple pour démarrer'
                : 'Paste JSON or upload a file to get started'}
            </p>
          </div>
        ) : !parseResult.ok ? (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center text-rose-500/80">
            <AlertCircle className="w-10 h-10 mb-2 stroke-[1.2]" />
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {isFr ? 'Syntaxe invalide' : 'Invalid syntax'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5 max-w-xs">
              {isFr
                ? "Consultez l'alerte supérieure pour corriger le JSON en un clic."
                : 'Check the alert above to repair JSON with one click.'}
            </p>
          </div>
        ) : viewTab === 'code' ? (
          <pre
            className={`json-hl p-4 font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 ${
              wordWrap
                ? 'whitespace-pre-wrap break-words'
                : 'whitespace-pre overflow-x-auto'
            }`}
            dangerouslySetInnerHTML={{ __html: highlightedOutput }}
          />
        ) : viewTab === 'tree' ? (
          <div className="p-3">
            <div className="mb-3 relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={treeSearch}
                onChange={(e) => onTreeSearchChange(e.target.value)}
                placeholder={
                  isFr
                    ? "Filtrer dans l'arborescence..."
                    : 'Filter in tree...'
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
            <JsonTreeNode
              data={parseResult.data}
              path=""
              filter={treeSearch.toLowerCase()}
              defaultOpen={treeExpandAll}
              isFr={isFr}
            />
          </div>
        ) : (
          <div className="p-3 overflow-x-auto">
            <JsonTableView data={parseResult.data} isFr={isFr} />
          </div>
        )}
      </div>
    </div>
  );
}
