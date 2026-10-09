import React from 'react';
import { CodeWorkspaceSplit } from '@workspace/ui';
import type { ViewTab, JsonErrorInfo } from '@/lib/json-repair-logic';
import { JsonSourcePanel } from './JsonSourcePanel';
import { JsonOutputPanel } from './JsonOutputPanel';

export interface JsonFormatterWorkbenchProps {
  rawInput: string;
  onRawInputChange: (val: string) => void;
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  rawBytes: number;
  outBytes: number;
  compressionRatio: number;
  parseResult: {
    ok: boolean;
    data: any;
    empty: boolean;
    error: JsonErrorInfo | null;
  };
  viewTab: ViewTab;
  yamlMode: boolean;
  isMinified: boolean;
  outputCode: string;
  highlightedOutput: string;
  treeSearch: string;
  onTreeSearchChange: (val: string) => void;
  treeExpandAll: boolean;
  onToggleTreeExpandAll: () => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  isFr: boolean;
}

export function JsonFormatterWorkbench({
  rawInput,
  onRawInputChange,
  wordWrap,
  onToggleWordWrap,
  rawBytes,
  outBytes,
  compressionRatio,
  parseResult,
  viewTab,
  yamlMode,
  isMinified,
  outputCode,
  highlightedOutput,
  treeSearch,
  onTreeSearchChange,
  treeExpandAll,
  onToggleTreeExpandAll,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  isFr,
}: JsonFormatterWorkbenchProps) {
  return (
    <CodeWorkspaceSplit
      isDragOver={isDragging}
      dragMessage={isFr ? 'Déposez votre fichier .json ici' : 'Drop your .json file here'}
      className="w-full"
    >
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="w-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10"
      >
        {/* VOLET GAUCHE : Saisie Source */}
        <JsonSourcePanel
          rawInput={rawInput}
          onRawInputChange={onRawInputChange}
          wordWrap={wordWrap}
          onToggleWordWrap={onToggleWordWrap}
          rawBytes={rawBytes}
          errorInfo={parseResult.error}
          isFr={isFr}
        />

        {/* VOLET DROIT : Rendu Formaté / Arborescence / Tableau */}
        <JsonOutputPanel
          viewTab={viewTab}
          yamlMode={yamlMode}
          isMinified={isMinified}
          outputCode={outputCode}
          highlightedOutput={highlightedOutput}
          wordWrap={wordWrap}
          onToggleWordWrap={onToggleWordWrap}
          outBytes={outBytes}
          compressionRatio={compressionRatio}
          parseResult={parseResult}
          treeSearch={treeSearch}
          onTreeSearchChange={onTreeSearchChange}
          treeExpandAll={treeExpandAll}
          onToggleTreeExpandAll={onToggleTreeExpandAll}
          isFr={isFr}
        />
      </div>
    </CodeWorkspaceSplit>
  );
}
