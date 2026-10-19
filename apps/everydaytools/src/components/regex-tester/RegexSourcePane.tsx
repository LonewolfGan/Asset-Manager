import React from 'react';
import { toast } from 'sonner';
import { FileText, Upload, Undo2, Trash2 } from 'lucide-react';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';

import type { RegexPreset } from '@/lib/regex-tester-logic';

interface RegexSourcePaneProps {
  testString: string;
  onInputChange: (val: string) => void;
  editorHeight: number;
  wordWrap: boolean;
  onToggleWordWrap: (val: boolean) => void;
  hasTestContent: boolean;
  historyLength: number;
  onUndo: () => void;
  onClear: () => void;
  onFileUpload: (file: File) => void;
  presets?: RegexPreset[];
  onApplyPreset?: (preset: RegexPreset) => void;
  isFr: boolean;
}

export function RegexSourcePane({
  testString,
  onInputChange,
  editorHeight,
  wordWrap,
  onToggleWordWrap,
  hasTestContent,
  historyLength,
  onUndo,
  onClear,
  onFileUpload,
  presets,
  onApplyPreset,
  isFr,
}: RegexSourcePaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isFr ? 'Texte de test' : 'Test text'}
          </span>
          {hasTestContent && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({testString.split('\n').length} {isFr ? 'lignes' : 'lines'} · {testString.length} {isFr ? 'caractères' : 'chars'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>{isFr ? 'Importer' : 'Import'}</span>
            <input
              type="file"
              accept=".txt,.log,.json,.csv,.md,.html"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onFileUpload(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
          </label>

          <WrapButton
            wrapped={wordWrap}
            onToggle={(next) => {
              onToggleWordWrap(next);
              toast.info(next ? (isFr ? 'Retour à la ligne activé' : 'Word wrap enabled') : (isFr ? 'Retour à la ligne désactivé' : 'Word wrap disabled'));
            }}
            label="Wrap"
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
          />

          {historyLength > 0 && (
            <ActionTooltip label={isFr ? 'Annuler la modification (Ctrl+Z)' : 'Undo edit (Ctrl+Z)'} side="bottom">
              <button
                type="button"
                onClick={onUndo}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Undo2 className="w-3 h-3" />
                <span>{isFr ? 'Annuler' : 'Undo'}</span>
              </button>
            </ActionTooltip>
          )}

          {hasTestContent && (
            <>
              <CopyButton
                text={testString}
                label={isFr ? 'Copier' : 'Copy'}
                copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                size="sm"
                variant="ghost"
                onCopy={() => trackToolUsed('regex-tester', 'copy-test-string')}
                toastMessage={isFr ? 'Texte de test copié' : 'Test text copied'}
                className="h-6 px-2 text-xs"
              />

              <ActionTooltip label={isFr ? 'Vider le texte de test' : 'Clear test text'} side="bottom">
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isFr ? 'Vider' : 'Clear'}</span>
                </button>
              </ActionTooltip>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col">
        <textarea
          value={testString}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isFr ? 'Collez ou tapez votre texte de test ici...' : 'Paste or type your test text here...'}
          spellCheck={false}
          wrap={wordWrap ? 'soft' : 'off'}
          style={{ height: `${editorHeight}px` }}
          className={`w-full p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-auto ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
        />

        {!hasTestContent && presets && onApplyPreset && presets.length > 0 && (
          <div className="p-3 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/40 dark:bg-zinc-900/20 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 font-medium text-[11px] mr-1">
              {isFr ? 'Exemples rapides :' : 'Quick samples:'}
            </span>
            {presets.slice(0, 4).map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
