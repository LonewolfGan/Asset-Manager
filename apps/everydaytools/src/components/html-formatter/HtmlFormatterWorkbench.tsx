import React from 'react';
import { CodeWorkspaceSplit } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import { HtmlSourcePane } from './HtmlSourcePane';
import { HtmlResultPane } from './HtmlResultPane';
import type {
  Mode,
  ViewOutput,
  DeviceWidth,
  HtmlMetrics,
} from '@/lib/html-formatter-logic';

interface HtmlFormatterWorkbenchProps {
  input: string;
  hasContent: boolean;
  wordWrap: boolean;
  editorHeight: number;
  isDragOver: boolean;
  mode: Mode;
  outputView: ViewOutput;
  deviceWidth: DeviceWidth;
  output: string;
  highlightedOutput: string;
  metrics: HtmlMetrics;
  onInputChange: (val: string) => void;
  onFileUpload: (file: File) => void;
  onSetOutputView: (view: ViewOutput) => void;
  onSetDeviceWidth: (device: DeviceWidth) => void;
  onMouseDownResize: (e: React.MouseEvent) => void;
  setIsDragOver: (val: boolean) => void;
}

export function HtmlFormatterWorkbench({
  input,
  hasContent,
  wordWrap,
  editorHeight,
  isDragOver,
  mode,
  outputView,
  deviceWidth,
  output,
  highlightedOutput,
  metrics,
  onInputChange,
  onFileUpload,
  onSetOutputView,
  onSetDeviceWidth,
  onMouseDownResize,
  setIsDragOver,
}: HtmlFormatterWorkbenchProps) {
  const { isFr } = useLocale();

  return (
    <CodeWorkspaceSplit
      isDragOver={isDragOver}
      dragMessage={
        isFr
          ? 'Déposez votre fichier .html pour le formater'
          : 'Drop your .html file to format it'
      }
      onDropFile={onFileUpload}
      footerSlot={
        <ActionTooltip
          label={
            isFr
              ? 'Glisser verticalement pour ajuster la hauteur'
              : 'Drag vertically to adjust height'
          }
          side="bottom"
        >
          <div
            onMouseDown={onMouseDownResize}
            className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
          >
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
          </div>
        </ActionTooltip>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
        <HtmlSourcePane
          input={input}
          hasContent={hasContent}
          wordWrap={wordWrap}
          editorHeight={editorHeight}
          inputBytes={metrics.inputBytes}
          onInputChange={onInputChange}
          onFileUpload={onFileUpload}
        />

        <HtmlResultPane
          mode={mode}
          outputView={outputView}
          deviceWidth={deviceWidth}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          hasContent={hasContent}
          output={output}
          input={input}
          highlightedOutput={highlightedOutput}
          metrics={metrics}
          onSetOutputView={onSetOutputView}
          onSetDeviceWidth={onSetDeviceWidth}
        />
      </div>
    </CodeWorkspaceSplit>
  );
}
