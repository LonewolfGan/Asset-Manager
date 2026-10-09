import React from 'react';
import { Download } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { FAVICON_ASSETS } from '@/lib/favicon-logic';

interface FaviconSizesGridProps {
  compositedUrl: string;
  onDownloadSingle: (size: number, filename: string) => void;
  isFr: boolean;
}

export function FaviconSizesGrid({
  compositedUrl,
  onDownloadSingle,
  isFr,
}: FaviconSizesGridProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-1">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? 'Inventaire des 9 formats générés' : 'Inventory of 9 generated formats'}
        </span>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {isFr ? "Cliquez sur une taille pour l'exporter directement" : 'Click on a size to download directly'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {FAVICON_ASSETS.map((asset) => (
          <div
            key={asset.filename}
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/90 flex items-center justify-between gap-3 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-14 h-14 rounded-lg border border-zinc-200/90 dark:border-zinc-700 p-1 flex items-center justify-center shrink-0 relative overflow-hidden bg-zinc-100/60 dark:bg-zinc-800/80"
                style={{
                  backgroundImage: 'radial-gradient(circle, #888888 12%, transparent 13%)',
                  backgroundSize: '6px 6px',
                }}
              >
                {compositedUrl ? (
                  <img src={compositedUrl} alt={asset.label} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-4 h-4 rounded-xs bg-zinc-300 dark:bg-zinc-700" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {asset.label}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {isFr ? asset.targetFr : asset.targetEn}
                </p>
              </div>
            </div>

            <ActionTooltip label={isFr ? `Télécharger directement ${asset.filename}` : `Download ${asset.filename}`}>
              <button
                type="button"
                onClick={() => onDownloadSingle(asset.size, asset.filename)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.96] transition-colors cursor-pointer shrink-0 border border-zinc-200/80 dark:border-zinc-700"
              >
                <Download className="w-4 h-4" />
              </button>
            </ActionTooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
