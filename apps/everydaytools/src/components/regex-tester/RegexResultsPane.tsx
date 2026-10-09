import React from 'react';
import { toast } from 'sonner';
import { Search, Replace, BookOpen, Download } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import type {
  ResultTab,
  MatchDisplayMode,
  MatchResult,
  TextChunk,
  CheatSheetCategory,
} from '@/lib/regex-tester-logic';
import { RegexMatchesTab } from './RegexMatchesTab';
import { RegexReplaceTab } from './RegexReplaceTab';
import { RegexCheatsheetTab } from './RegexCheatsheetTab';

interface RegexResultsPaneProps {
  resultTab: ResultTab;
  onTabChange: (tab: ResultTab) => void;
  matches: MatchResult[];
  matchDisplayMode: MatchDisplayMode;
  onDisplayModeChange: (mode: MatchDisplayMode) => void;
  wordWrap: boolean;
  onToggleWordWrap: (val: boolean) => void;
  hasTestContent: boolean;
  isValid: boolean;
  highlightedChunks: TextChunk[];
  selectedMatchIndex: number | null;
  onSelectMatchIndex: (idx: number | null) => void;
  replaceWith: string;
  onReplaceWithChange: (val: string) => void;
  replacedText: string;
  testString: string;
  onDownloadReplacedText: () => void;
  cheatSheet: CheatSheetCategory[];
  onInsertToken: (token: string) => void;
  editorHeight: number;
  isFr: boolean;
}

export function RegexResultsPane({
  resultTab,
  onTabChange,
  matches,
  matchDisplayMode,
  onDisplayModeChange,
  wordWrap,
  onToggleWordWrap,
  hasTestContent,
  isValid,
  highlightedChunks,
  selectedMatchIndex,
  onSelectMatchIndex,
  replaceWith,
  onReplaceWithChange,
  replacedText,
  testString,
  onDownloadReplacedText,
  cheatSheet,
  onInsertToken,
  editorHeight,
  isFr,
}: RegexResultsPaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        {/* Onglets */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => onTabChange('matches')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              resultTab === 'matches'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isFr ? 'Correspondances' : 'Matches'}</span>
            <span className="font-mono text-[10px] ml-0.5 opacity-80">({matches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('replace')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              resultTab === 'replace'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Replace className="w-3.5 h-3.5" />
            <span>{isFr ? 'Remplacement' : 'Replace'}</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('cheatsheet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              resultTab === 'cheatsheet'
                ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isFr ? 'Antisèche' : 'Cheatsheet'}</span>
          </button>
        </div>

        {/* Actions contextuelles */}
        <div className="flex items-center gap-1.5">
          {resultTab === 'matches' && matches.length > 0 && (
            <div className="flex items-center gap-1">
              <ActionTooltip label={isFr ? 'Afficher le texte avec les correspondances surlignées' : 'Show text with highlighted matches'} side="bottom">
                <button
                  type="button"
                  onClick={() => onDisplayModeChange('highlight')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                    matchDisplayMode === 'highlight'
                      ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {isFr ? 'Surligné' : 'Highlight'}
                </button>
              </ActionTooltip>

              <ActionTooltip label={isFr ? 'Afficher la liste détaillée avec les groupes de capture' : 'Show detailed list with capture groups'} side="bottom">
                <button
                  type="button"
                  onClick={() => onDisplayModeChange('list')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                    matchDisplayMode === 'list'
                      ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {isFr ? 'Détails' : 'Details'}
                </button>
              </ActionTooltip>

              <WrapButton
                wrapped={wordWrap}
                onToggle={(next) => {
                  onToggleWordWrap(next);
                  toast.info(next ? (isFr ? 'Retour à la ligne activé' : 'Word wrap enabled') : (isFr ? 'Retour à la ligne désactivé' : 'Word wrap disabled'));
                }}
                label="Wrap"
                size="sm"
                className="ml-1"
              />

              <CopyButton
                text={() => matches.map((m) => m.value).join('\n')}
                label={isFr ? 'Copier correspondances' : 'Copy matches'}
                copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                size="sm"
                variant="default"
                disabled={matches.length === 0}
                onCopy={() => trackToolUsed('regex-tester', 'copy-matches')}
                toastMessage={isFr ? `${matches.length} correspondance(s) copiée(s)` : `${matches.length} match(es) copied`}
              />
            </div>
          )}

          {resultTab === 'replace' && (
            <div className="flex items-center gap-1.5">
              <WrapButton
                wrapped={wordWrap}
                onToggle={(next) => {
                  onToggleWordWrap(next);
                  toast.info(next ? (isFr ? 'Retour à la ligne activé' : 'Word wrap enabled') : (isFr ? 'Retour à la ligne désactivé' : 'Word wrap disabled'));
                }}
                label="Wrap"
                size="sm"
              />

              <CopyButton
                text={replacedText}
                label={isFr ? 'Copier résultat' : 'Copy result'}
                copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                size="sm"
                variant="default"
                onCopy={() => trackToolUsed('regex-tester', 'copy-replaced')}
                toastMessage={isFr ? 'Texte remplacé copié' : 'Replaced text copied'}
              />

              <ActionTooltip label={isFr ? 'Télécharger le texte après remplacement' : 'Download text after replacement'} side="bottom">
                <button
                  type="button"
                  onClick={onDownloadReplacedText}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{isFr ? 'Télécharger .txt' : 'Download .txt'}</span>
                </button>
              </ActionTooltip>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: `${editorHeight}px` }} className="w-full p-4 overflow-auto font-mono text-xs leading-relaxed">
        {resultTab === 'matches' && (
          <RegexMatchesTab
            hasTestContent={hasTestContent}
            matches={matches}
            isValid={isValid}
            matchDisplayMode={matchDisplayMode}
            highlightedChunks={highlightedChunks}
            selectedMatchIndex={selectedMatchIndex}
            onSelectMatchIndex={onSelectMatchIndex}
            wordWrap={wordWrap}
            isFr={isFr}
          />
        )}

        {resultTab === 'replace' && (
          <RegexReplaceTab
            replaceWith={replaceWith}
            onReplaceWithChange={onReplaceWithChange}
            replacedText={replacedText}
            testString={testString}
            wordWrap={wordWrap}
            isFr={isFr}
          />
        )}

        {resultTab === 'cheatsheet' && (
          <RegexCheatsheetTab
            cheatSheet={cheatSheet}
            onInsertToken={onInsertToken}
            isFr={isFr}
          />
        )}
      </div>
    </div>
  );
}
