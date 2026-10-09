import React from 'react';
import { UrlEncoderWorkflow } from '@/hooks/use-url-encoder-workflow';
import { UrlCommandBar } from './UrlCommandBar';
import { UrlInputPane } from './UrlInputPane';
import { UrlOutputPane } from './UrlOutputPane';
import { UrlQueryInspector } from './UrlQueryInspector';

interface UrlWorkbenchProps {
  isFr: boolean;
  workflow: UrlEncoderWorkflow;
  copiedLabel: string;
}

export const UrlWorkbench: React.FC<UrlWorkbenchProps> = ({
  isFr,
  workflow,
  copiedLabel,
}) => {
  const {
    input,
    output,
    error,
    mode,
    setMode,
    encodeMode,
    setEncodeMode,
    wordWrap,
    setWordWrap,
    history,
    isDragging,
    setIsDragging,
    urlInspection,
    hasInput,
    hasOutput,
    hasParams,
    inputStats,
    outputStats,
    handleUpdateInput,
    handleUndo,
    handleClear,
    handleRemoveParam,
    handleFileUpload,
    handleDownload,
  } = workflow;

  return (
    <div className="w-full space-y-4">
      {/* Barre de commande supérieure épurée */}
      <UrlCommandBar
        isFr={isFr}
        mode={mode}
        setMode={setMode}
        encodeMode={encodeMode}
        setEncodeMode={setEncodeMode}
        wordWrap={wordWrap}
        setWordWrap={setWordWrap}
        historyLength={history.length}
        onUndo={handleUndo}
        hasOutput={hasOutput}
        output={output}
        hasInput={hasInput}
        onClear={handleClear}
        hasParams={hasParams}
        urlInspection={urlInspection}
        onDownload={handleDownload}
        copiedLabel={copiedLabel}
      />

      {/* L'atelier principal : Deux volets architecturaux ouverts */}
      <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
        <UrlInputPane
          isFr={isFr}
          input={input}
          onUpdateInput={handleUpdateInput}
          mode={mode}
          wordWrap={wordWrap}
          error={error}
          hasInput={hasInput}
          inputStats={inputStats}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onFileUpload={handleFileUpload}
        />

        <UrlOutputPane
          isFr={isFr}
          output={output}
          mode={mode}
          encodeMode={encodeMode}
          wordWrap={wordWrap}
          hasInput={hasInput}
          hasOutput={hasOutput}
          outputStats={outputStats}
          copiedLabel={copiedLabel}
        />
      </div>

      {/* Inspecteur de composants d'URL & paramètres query */}
      {hasParams && (
        <UrlQueryInspector
          isFr={isFr}
          urlInspection={urlInspection}
          onRemoveParam={handleRemoveParam}
          copiedLabel={copiedLabel}
        />
      )}
    </div>
  );
};
