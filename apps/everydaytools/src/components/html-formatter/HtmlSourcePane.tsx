import React from 'react';
import { FileCode2, Upload } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface HtmlSourcePaneProps {
  input: string;
  hasContent: boolean;
  wordWrap: boolean;
  editorHeight: number;
  inputBytes: number;
  onInputChange: (val: string) => void;
  onFileUpload: (file: File) => void;
}

export function HtmlSourcePane({
  input,
  hasContent,
  wordWrap,
  editorHeight,
  inputBytes,
  onInputChange,
  onFileUpload,
}: HtmlSourcePaneProps) {
  const { isFr } = useLocale();

  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Source HTML
          </span>
          {hasContent && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({input.split('\n').length} {isFr ? 'lignes' : 'lines'} ·{' '}
              {inputBytes} {isFr ? 'octets' : 'bytes'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>{isFr ? 'Importer' : 'Import'}</span>
            <input
              type="file"
              accept=".html,.htm,.txt,text/html"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && onFileUpload(e.target.files[0])
              }
            />
          </label>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={
          isFr
            ? 'Collez ou tapez votre code HTML ici...'
            : 'Paste or type your HTML code here...'
        }
        spellCheck={false}
        wrap={wordWrap ? 'soft' : 'off'}
        style={{ height: `${editorHeight}px` }}
        className={`w-full p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-auto ${
          wordWrap
            ? 'whitespace-pre-wrap break-words'
            : 'whitespace-pre overflow-x-auto'
        }`}
      />
    </div>
  );
}
