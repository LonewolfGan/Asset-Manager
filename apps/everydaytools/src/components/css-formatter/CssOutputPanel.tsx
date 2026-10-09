import React from 'react';
import {
  Code2,
  Eye,
  FileCode2,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type {
  Mode,
  ViewOutput,
  DeviceWidth,
  CssMetrics,
} from '@/lib/css-formatter-logic';

export interface CssOutputPanelProps {
  outputView: ViewOutput;
  setOutputView: (v: ViewOutput) => void;
  mode: Mode;
  metrics: CssMetrics;
  deviceWidth: DeviceWidth;
  setDeviceWidth: (d: DeviceWidth) => void;
  editorHeight: number;
  wordWrap: boolean;
  hasContent: boolean;
  highlightedOutput: string;
  sandboxHtml: string;
  isFr: boolean;
}

export const CssOutputPanel: React.FC<CssOutputPanelProps> = ({
  outputView,
  setOutputView,
  mode,
  metrics,
  deviceWidth,
  setDeviceWidth,
  editorHeight,
  wordWrap,
  hasContent,
  highlightedOutput,
  sandboxHtml,
  isFr,
}) => {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Commutateur de vue : Code CSS vs Aperçu Sandbox */}
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
                  ? isFr
                    ? 'minifié'
                    : 'minified'
                  : isFr
                    ? 'formaté'
                    : 'formatted'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOutputView('sandbox')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                outputView === 'sandbox'
                  ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{isFr ? 'Aperçu direct' : 'Live Preview'}</span>
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

        {/* Sélecteur de device pour Sandbox */}
        <div className="flex items-center gap-2">
          {outputView === 'sandbox' && (
            <div className="flex items-center gap-0.5 p-0.5 rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
              <ActionTooltip
                label={isFr ? 'Vue Écran Standard (100%)' : 'Standard Desktop View (100%)'}
                side="bottom"
              >
                <button
                  type="button"
                  onClick={() => setDeviceWidth('desktop')}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    deviceWidth === 'desktop'
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                </button>
              </ActionTooltip>

              <ActionTooltip
                label={isFr ? 'Vue Tablette (768px)' : 'Tablet View (768px)'}
                side="bottom"
              >
                <button
                  type="button"
                  onClick={() => setDeviceWidth('tablet')}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    deviceWidth === 'tablet'
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Tablet className="w-3 h-3" />
                </button>
              </ActionTooltip>

              <ActionTooltip
                label={isFr ? 'Vue Mobile (375px)' : 'Mobile View (375px)'}
                side="bottom"
              >
                <button
                  type="button"
                  onClick={() => setDeviceWidth('mobile')}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    deviceWidth === 'mobile'
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </ActionTooltip>
            </div>
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
                  ? 'Collez ou déposez votre feuille de style CSS pour commencer'
                  : 'Paste or drop your CSS stylesheet to begin'}
              </p>
            </div>
          ) : (
            <pre
              className={`css-hl font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 select-all ${
                wordWrap ? 'whitespace-pre-wrap break-words break-all' : 'whitespace-pre'
              }`}
              dangerouslySetInnerHTML={{ __html: highlightedOutput }}
            />
          )}
        </div>
      ) : (
        <div
          style={{ height: `${editorHeight}px` }}
          className="w-full flex items-center justify-center p-3 bg-zinc-100/60 dark:bg-zinc-900/50 overflow-auto"
        >
          <div
            className="h-full bg-white rounded-lg shadow-sm border border-zinc-200 dark:border-white/10 overflow-hidden transition-all duration-200"
            style={{
              width:
                deviceWidth === 'mobile'
                  ? '375px'
                  : deviceWidth === 'tablet'
                    ? '768px'
                    : '100%',
            }}
          >
            <iframe
              sandbox=""
              srcDoc={sandboxHtml}
              title={isFr ? 'Aperçu CSS sécurisé' : 'Secure CSS preview'}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
