import React from 'react';
import { Code2, Terminal, FileCode2, Play } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { ActionTooltip } from '@/components/ui/tooltip';
import type {
  Mode,
  ViewOutput,
  JsMetrics,
  ExecutionLog,
} from '../../lib/js-formatter-logic';

interface JsOutputPanelProps {
  outputView: ViewOutput;
  setOutputView: (view: ViewOutput) => void;
  mode: Mode;
  metrics: JsMetrics;
  hasContent: boolean;
  wordWrap: boolean;
  editorHeight: number;
  highlightedOutput: string;
  executionLogs: ExecutionLog[];
  setExecutionLogs: (logs: ExecutionLog[]) => void;
  executionTime: number | null;
  setExecutionTime: (time: number | null) => void;
  onRunCode: () => void;
}

export function JsOutputPanel({
  outputView,
  setOutputView,
  mode,
  metrics,
  hasContent,
  wordWrap,
  editorHeight,
  highlightedOutput,
  executionLogs,
  setExecutionLogs,
  executionTime,
  setExecutionTime,
  onRunCode,
}: JsOutputPanelProps) {
  const { isFr } = useLocale();

  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Commutateur de vue : Code JS/TS vs Console d'Exécution */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOutputView('code')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                outputView === 'code'
                  ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>
                {isFr ? 'Code' : 'Code'}{' '}
                {mode === 'minify'
                  ? isFr ? 'minifié' : 'minified'
                  : isFr ? 'formaté' : 'formatted'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOutputView('console')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                outputView === 'console'
                  ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>{isFr ? "Console d'exécution" : 'Execution console'}</span>
            </button>
          </div>

          {/* Télémétrie en mode Minify */}
          {mode === 'minify' && metrics.savingsPercent > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              -{metrics.savingsPercent}% ({metrics.savingsBytes}{' '}
              {isFr ? 'octets gagnés' : 'bytes saved'})
            </span>
          )}
        </div>

        {/* Bouton Exécuter */}
        <div className="flex items-center gap-2">
          {hasContent && (
            <ActionTooltip
              label={
                isFr
                  ? 'Exécuter le code dans un environnement bac à sable sécurisé'
                  : 'Run code in a secure sandbox environment'
              }
              side="bottom"
            >
              <button
                type="button"
                onClick={onRunCode}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isFr ? 'Exécuter' : 'Run'}</span>
              </button>
            </ActionTooltip>
          )}
        </div>
      </div>

      {/* Contenu du volet de droite */}
      {outputView === 'code' ? (
        <div
          style={{ height: `${editorHeight}px` }}
          className={`w-full p-4 overflow-auto bg-zinc-50/20 dark:bg-zinc-900/10 ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
        >
          {!hasContent ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <FileCode2 className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
              <p className="text-xs text-zinc-500">
                {isFr
                  ? 'Collez ou déposez votre script pour commencer'
                  : 'Paste or drop your script to begin'}
              </p>
            </div>
          ) : (
            <pre
              className={`js-hl font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 select-all ${
                wordWrap ? 'whitespace-pre-wrap break-words break-all' : 'whitespace-pre'
              }`}
              dangerouslySetInnerHTML={{ __html: highlightedOutput }}
            />
          )}
        </div>
      ) : (
        <div
          style={{ height: `${editorHeight}px` }}
          className="w-full flex flex-col p-4 bg-zinc-50/50 dark:bg-zinc-950 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-auto select-text transition-colors"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span className="font-medium">
                {isFr ? "Terminal d'exécution JavaScript" : 'JavaScript Execution Terminal'}
              </span>
              {executionTime !== null && (
                <span className="text-zinc-400 dark:text-zinc-500">({executionTime} ms)</span>
              )}
            </div>
            {executionLogs.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setExecutionLogs([]);
                  setExecutionTime(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {isFr ? 'Effacer logs' : 'Clear logs'}
              </button>
            )}
          </div>

          {executionLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-500">
              <Terminal className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs max-w-sm">
                {isFr
                  ? 'Cliquez sur « Exécuter » pour évaluer votre code et observer les sorties console en direct'
                  : 'Click "Run" to evaluate your code and view console output live'}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 overflow-auto">
              {executionLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2.5 font-mono leading-relaxed">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600 select-none shrink-0 pt-0.5">
                    {log.time}
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 select-none ${
                      log.type === 'error'
                        ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30'
                        : log.type === 'warn'
                          ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30'
                          : log.type === 'return'
                            ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30'
                            : log.type === 'info'
                              ? 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 dark:border-sky-500/30'
                              : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {log.type === 'return' ? 'RET' : log.type}
                  </span>
                  <pre
                    className={`whitespace-pre-wrap break-words flex-1 font-mono text-xs ${
                      log.type === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : log.type === 'warn'
                          ? 'text-amber-700 dark:text-amber-300'
                          : log.type === 'return'
                            ? 'text-purple-700 dark:text-purple-300'
                            : 'text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {log.text}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
