import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { CompareReveal } from '@/components/ui/compare-reveal';
import { type QueueItem, type ViewMode } from '@/lib/background-remover-logic';

interface RemoverStudioViewportProps {
  item: QueueItem;
  viewMode: ViewMode;
  stageBackgroundStyle: React.CSSProperties;
  onRetry: () => void;
  isFr: boolean;
}

export function RemoverStudioViewport({
  item,
  viewMode,
  stageBackgroundStyle,
  onRetry,
  isFr,
}: RemoverStudioViewportProps) {
  return (
    <div
      style={viewMode === 'cutout' ? stageBackgroundStyle : undefined}
      className={`w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 ${
        viewMode === 'cutout' ? '' : 'bg-[#f8f9fa] dark:bg-[#101012]'
      } p-6 min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden relative transition-colors duration-200`}
    >
      {/* 1. En cours de traitement */}
      {item.status === 'processing' && (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <img
            src={item.previewUrl}
            alt={isFr ? 'En cours' : 'Processing'}
            className="max-h-[540px] sm:max-h-[600px] w-auto max-w-full object-contain rounded-lg opacity-40 select-none filter blur-[1px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-zinc-800 dark:text-zinc-200 animate-spin" />
            <span className="text-xs font-medium tracking-wider uppercase text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-xs">
              {isFr ? 'Détourage automatique en cours...' : 'Automatic cutout in progress...'}
            </span>
          </div>
        </div>
      )}

      {/* 2. Mode Avant / Après avec CompareReveal */}
      {item.status === 'done' && item.resultUrl && viewMode === 'split' && (
        <div className="w-full flex items-center justify-center">
          <CompareReveal
            className="w-full aspect-[16/10] min-h-[520px] sm:min-h-[600px] max-h-[720px] rounded-xl shadow-lg border border-black/10 dark:border-white/10"
            before={{ src: item.previewUrl, alt: isFr ? 'Original' : 'Original' }}
            after={{ src: item.resultUrl, alt: isFr ? 'Détouré' : 'Cutout' }}
            afterStyle={stageBackgroundStyle}
            labels={[isFr ? 'Original' : 'Original', isFr ? 'Détouré' : 'Cutout']}
            defaultPosition={50}
            introSweep={true}
            snapOnDoubleClick={50}
          />
        </div>
      )}

      {/* 3. Mode Sujet Détouré (Grand format direct sans boîte) */}
      {item.status === 'done' && item.resultUrl && viewMode === 'cutout' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            src={item.resultUrl}
            alt={isFr ? 'Sujet détouré' : 'Cutout subject'}
            className="relative z-10 max-h-[560px] sm:max-h-[640px] w-auto max-w-full object-contain drop-shadow-md select-none"
          />
        </div>
      )}

      {/* 4. Mode Original seul */}
      {item.status === 'done' && viewMode === 'original' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <img
            src={item.previewUrl}
            alt={isFr ? 'Photo originale' : 'Original photo'}
            className="max-h-[560px] sm:max-h-[640px] w-auto max-w-full object-contain rounded-lg drop-shadow-sm select-none"
          />
        </div>
      )}

      {/* 5. Erreur */}
      {item.status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-3 text-center p-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {item.error || (isFr ? 'Le détourage de cette image a échoué.' : 'Background removal failed for this image.')}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isFr ? 'Réessayer le détourage' : 'Retry removal'}
          </button>
        </div>
      )}
    </div>
  );
}
