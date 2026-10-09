import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import type { FaviconWorkflowResult } from '@/hooks/use-favicon-workflow';

interface FaviconAlertsProps {
  error: string | null;
  result: FaviconWorkflowResult | null;
  onRetry: () => void;
  onDownloadCachedZip: () => void;
  isFr: boolean;
}

export function FaviconAlerts({
  error,
  result,
  onRetry,
  onDownloadCachedZip,
  isFr,
}: FaviconAlertsProps) {
  if (!error && !result) return null;

  return (
    <>
      {error && (
        <div className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="font-medium underline hover:no-underline cursor-pointer"
          >
            {isFr ? 'Réessayer' : 'Retry'}
          </button>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">
              {isFr ? 'Pack complet généré avec succès' : 'Full pack successfully generated'} ({formatBytes(result.sizeAfter)}).
            </span>
          </div>
          <button
            type="button"
            onClick={onDownloadCachedZip}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 active:scale-[0.98] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isFr ? 'Télécharger à nouveau' : 'Download again'}</span>
          </button>
        </motion.div>
      )}
    </>
  );
}
