import React from 'react';
import { Upload } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface JsonDiffInputWorkbenchProps {
  inputLeft: string;
  onInputLeftChange: (val: string) => void;
  inputRight: string;
  onInputRightChange: (val: string) => void;
  editorHeight: number;
  onMouseDownResize: (e: React.MouseEvent) => void;
  onFileUploadA: (file: File) => void;
  onFileUploadB: (file: File) => void;
  isFr: boolean;
}

export function JsonDiffInputWorkbench({
  inputLeft,
  onInputLeftChange,
  inputRight,
  onInputRightChange,
  editorHeight,
  onMouseDownResize,
  onFileUploadA,
  onFileUploadB,
  isFr,
}: JsonDiffInputWorkbenchProps) {
  const lineCountLeft = inputLeft ? inputLeft.split('\n').length : 0;
  const lineCountRight = inputRight ? inputRight.split('\n').length : 0;

  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
        {/* Volet Gauche : Original */}
        <div className="flex flex-col">
          <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {isFr ? 'Original' : 'Original'}
              </span>
              {inputLeft && (
                <span className="text-[11px] font-mono text-zinc-400">
                  ({lineCountLeft} {isFr ? 'lignes' : 'lines'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>{isFr ? 'Importer' : 'Import'}</span>
                <input
                  type="file"
                  accept=".json,.txt,application/json"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onFileUploadA(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <textarea
            value={inputLeft}
            onChange={(e) => onInputLeftChange(e.target.value)}
            placeholder={isFr ? 'Collez le JSON original ici...' : 'Paste original JSON here...'}
            spellCheck={false}
            style={{ height: `${editorHeight}px` }}
            className="p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-y-auto"
          />
        </div>

        {/* Volet Droit : Modifié */}
        <div className="flex flex-col">
          <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {isFr ? 'Modifié' : 'Modified'}
              </span>
              {inputRight && (
                <span className="text-[11px] font-mono text-zinc-400">
                  ({lineCountRight} {isFr ? 'lignes' : 'lines'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>{isFr ? 'Importer' : 'Import'}</span>
                <input
                  type="file"
                  accept=".json,.txt,application/json"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onFileUploadB(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <textarea
            value={inputRight}
            onChange={(e) => onInputRightChange(e.target.value)}
            placeholder={isFr ? 'Collez le JSON modifié ici...' : 'Paste modified JSON here...'}
            spellCheck={false}
            style={{ height: `${editorHeight}px` }}
            className="p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-y-auto"
          />
        </div>
      </div>

      {/* Poignée de redimensionnement vertical synchronisé à 100% */}
      <ActionTooltip
        label={
          isFr
            ? 'Glisser verticalement pour ajuster la hauteur des deux éditeurs'
            : 'Drag vertically to adjust height of both editors'
        }
        side="top"
      >
        <div
          onMouseDown={onMouseDownResize}
          className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
        >
          <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
        </div>
      </ActionTooltip>
    </div>
  );
}
