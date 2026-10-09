import React from 'react';
import { CodeWorkspaceSplit } from '@workspace/ui';
import type {
  Mode,
  ViewOutput,
  DeviceWidth,
  CssMetrics,
} from '@/lib/css-formatter-logic';
import { CssSourcePanel } from './CssSourcePanel';
import { CssOutputPanel } from './CssOutputPanel';
import { CssResizeHandle } from './CssResizeHandle';

export interface CssFormatterWorkbenchProps {
  input: string;
  setInput: (val: string) => void;
  wordWrap: boolean;
  editorHeight: number;
  isDragOver: boolean;
  setIsDragOver: (over: boolean) => void;
  metrics: CssMetrics;
  hasContent: boolean;
  outputView: ViewOutput;
  setOutputView: (v: ViewOutput) => void;
  mode: Mode;
  deviceWidth: DeviceWidth;
  setDeviceWidth: (d: DeviceWidth) => void;
  highlightedOutput: string;
  sandboxHtml: string;
  isFr: boolean;
  onFileUpload: (file: File) => void;
  onMouseDownResize: (e: React.MouseEvent) => void;
}

export const CssFormatterWorkbench: React.FC<CssFormatterWorkbenchProps> = ({
  input,
  setInput,
  wordWrap,
  editorHeight,
  isDragOver,
  setIsDragOver,
  metrics,
  hasContent,
  outputView,
  setOutputView,
  mode,
  deviceWidth,
  setDeviceWidth,
  highlightedOutput,
  sandboxHtml,
  isFr,
  onFileUpload,
  onMouseDownResize,
}) => {
  return (
    <CodeWorkspaceSplit
      isDragOver={isDragOver}
      dragMessage={
        isFr
          ? 'Déposez votre fichier .css pour le formater'
          : 'Drop your .css file to format it'
      }
      onDropFile={onFileUpload}
      footerSlot={<CssResizeHandle isFr={isFr} onMouseDown={onMouseDownResize} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
        <CssSourcePanel
          input={input}
          setInput={setInput}
          wordWrap={wordWrap}
          editorHeight={editorHeight}
          metrics={metrics}
          hasContent={hasContent}
          isFr={isFr}
          onFileUpload={onFileUpload}
        />

        <CssOutputPanel
          outputView={outputView}
          setOutputView={setOutputView}
          mode={mode}
          metrics={metrics}
          deviceWidth={deviceWidth}
          setDeviceWidth={setDeviceWidth}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          hasContent={hasContent}
          highlightedOutput={highlightedOutput}
          sandboxHtml={sandboxHtml}
          isFr={isFr}
        />
      </div>
    </CodeWorkspaceSplit>
  );
};
