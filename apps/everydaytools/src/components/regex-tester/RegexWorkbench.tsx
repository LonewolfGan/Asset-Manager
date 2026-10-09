import React from 'react';
import { Upload } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useRegexTesterWorkflow } from '@/hooks/use-regex-tester-workflow';
import { RegexSourcePane } from './RegexSourcePane';
import { RegexResultsPane } from './RegexResultsPane';

interface RegexWorkbenchProps {
  workflow: ReturnType<typeof useRegexTesterWorkflow>;
  isFr: boolean;
}

export function RegexWorkbench({ workflow, isFr }: RegexWorkbenchProps) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        workflow.setIsDragOver(true);
      }}
      onDragLeave={() => workflow.setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        workflow.setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) workflow.handleFileUpload(file);
      }}
      className={`relative w-full rounded-2xl border transition-colors bg-white dark:bg-zinc-950 overflow-hidden ${
        workflow.isDragOver
          ? 'border-zinc-500 ring-2 ring-zinc-400/30'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Overlay de glisser-déposer de fichier */}
      {workflow.isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 shadow-lg">
            <Upload className="w-4 h-4 text-[#FF6B35]" />
            <span>{isFr ? 'Déposez votre fichier texte pour l’analyser' : 'Drop your text file to analyze'}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
        <RegexSourcePane
          testString={workflow.testString}
          onInputChange={workflow.handleInputChange}
          editorHeight={workflow.editorHeight}
          wordWrap={workflow.wordWrap}
          onToggleWordWrap={workflow.setWordWrap}
          hasTestContent={workflow.hasTestContent}
          historyLength={workflow.history.length}
          onUndo={workflow.handleUndo}
          onClear={workflow.handleClearTestString}
          onFileUpload={workflow.handleFileUpload}
          isFr={isFr}
        />

        <RegexResultsPane
          resultTab={workflow.resultTab}
          onTabChange={workflow.setResultTab}
          matches={workflow.matches}
          matchDisplayMode={workflow.matchDisplayMode}
          onDisplayModeChange={workflow.setMatchDisplayMode}
          wordWrap={workflow.wordWrap}
          onToggleWordWrap={workflow.setWordWrap}
          hasTestContent={workflow.hasTestContent}
          isValid={workflow.isValid}
          highlightedChunks={workflow.highlightedChunks}
          selectedMatchIndex={workflow.selectedMatchIndex}
          onSelectMatchIndex={workflow.setSelectedMatchIndex}
          replaceWith={workflow.replaceWith}
          onReplaceWithChange={workflow.setReplaceWith}
          replacedText={workflow.replacedText}
          testString={workflow.testString}
          onDownloadReplacedText={workflow.handleDownloadReplacedText}
          cheatSheet={workflow.cheatSheet}
          onInsertToken={workflow.handleInsertToken}
          editorHeight={workflow.editorHeight}
          isFr={isFr}
        />
      </div>

      {/* Poignée de redimensionnement vertical synchronisé */}
      <ActionTooltip label={isFr ? 'Glisser verticalement pour ajuster la hauteur des deux volets' : 'Drag vertically to adjust pane height'} side="top">
        <div
          onMouseDown={workflow.handleMouseDownResize}
          className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
        >
          <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
        </div>
      </ActionTooltip>
    </div>
  );
}
