import React from 'react';
import { CodeWorkspaceSplit } from '@workspace/ui';
import { useLocale } from '@/hooks/use-locale';
import type {
  Mode,
  Language,
  IndentSize,
  QuotesStyle,
  ViewOutput,
  JsMetrics,
  ExecutionLog,
} from '../../lib/js-formatter-logic';
import { JsFormatterToolbar } from './JsFormatterToolbar';
import { JsSourcePanel } from './JsSourcePanel';
import { JsOutputPanel } from './JsOutputPanel';
import { JsResizeHandle } from './JsResizeHandle';

interface JsFormatterWorkbenchProps {
  input: string;
  onInputChange: (val: string) => void;
  historyLength: number;
  onUndo: () => void;
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
  outputView: ViewOutput;
  setOutputView: (view: ViewOutput) => void;
  executionLogs: ExecutionLog[];
  setExecutionLogs: (logs: ExecutionLog[]) => void;
  executionTime: number | null;
  setExecutionTime: (time: number | null) => void;
  editorHeight: number;
  isDragOver: boolean;
  setIsDragOver: (drag: boolean) => void;
  output: string;
  highlightedOutput: string;
  metrics: JsMetrics;
  hasContent: boolean;
  onMouseDownResize: (e: React.MouseEvent) => void;
  onRunCode: () => void;
  onDownload: () => void;
  onClear: () => void;
  onFileUpload: (file: File) => void;
}

export function JsFormatterWorkbench({
  input,
  onInputChange,
  historyLength,
  onUndo,
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
  outputView,
  setOutputView,
  executionLogs,
  setExecutionLogs,
  executionTime,
  setExecutionTime,
  editorHeight,
  isDragOver,
  setIsDragOver,
  output,
  highlightedOutput,
  metrics,
  hasContent,
  onMouseDownResize,
  onRunCode,
  onDownload,
  onClear,
  onFileUpload,
}: JsFormatterWorkbenchProps) {
  const { isFr } = useLocale();

  return (
    <div className="w-full space-y-4">
      <JsFormatterToolbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        indent={indent}
        setIndent={setIndent}
        semicolons={semicolons}
        setSemicolons={setSemicolons}
        quotes={quotes}
        setQuotes={setQuotes}
        stripComments={stripComments}
        setStripComments={setStripComments}
        wordWrap={wordWrap}
        setWordWrap={setWordWrap}
        historyLength={historyLength}
        onUndo={onUndo}
        hasContent={hasContent}
        output={output}
        onClear={onClear}
        onDownload={onDownload}
      />

      <CodeWorkspaceSplit
        isDragOver={isDragOver}
        dragMessage={
          isFr
            ? `Déposez votre fichier .${language === 'typescript' ? 'ts' : 'js'} pour le formater`
            : `Drop your .${language === 'typescript' ? 'ts' : 'js'} file to format it`
        }
        onDropFile={onFileUpload}
        footerSlot={<JsResizeHandle onMouseDownResize={onMouseDownResize} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
          <JsSourcePanel
            input={input}
            onInputChange={onInputChange}
            language={language}
            metrics={metrics}
            hasContent={hasContent}
            wordWrap={wordWrap}
            editorHeight={editorHeight}
            onFileUpload={onFileUpload}
          />

          <JsOutputPanel
            outputView={outputView}
            setOutputView={setOutputView}
            mode={mode}
            metrics={metrics}
            hasContent={hasContent}
            wordWrap={wordWrap}
            editorHeight={editorHeight}
            highlightedOutput={highlightedOutput}
            executionLogs={executionLogs}
            setExecutionLogs={setExecutionLogs}
            executionTime={executionTime}
            setExecutionTime={setExecutionTime}
            onRunCode={onRunCode}
          />
        </div>
      </CodeWorkspaceSplit>
    </div>
  );
}
