import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Loader2 } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import { type QueueItem, IMAGE_FORMAT } from '@/lib/background-remover-logic';

interface RemoverBatchGalleryProps {
  queue: QueueItem[];
  isProcessing: boolean;
  doneCountTotal: number;
  allBatchFinished: boolean;
  onFullReset: () => void;
  onCancel: () => void;
  onDownloadItem: (item: QueueItem) => void;
  onDownloadBatchZip: () => void;
  onInspectItem: (index: number) => void;
  isFr: boolean;
}

export function RemoverBatchGallery({
  queue,
  isProcessing,
  doneCountTotal,
  allBatchFinished,
  onFullReset,
  onCancel,
  onDownloadItem,
  onDownloadBatchZip,
  onInspectItem,
  isFr,
}: RemoverBatchGalleryProps) {
  const totalSize = queue.reduce((acc, q) => acc + q.file.size, 0);

  return (
    <motion.div
      key="batch-screen"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full space-y-6"
    >
      {/* En-tête canonique Studio du lot */}
      <StudioCommandBar
        meta={{
          name: `${queue.length} image${queue.length > 1 ? 's' : ''}`,
          size: totalSize,
          icon: IMAGE_FORMAT.icon,
        }}
        onReset={onFullReset}
        resetLabel={isFr ? 'Changer de fichiers' : 'Change files'}
        centerControls={
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {isProcessing && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-[11px]">
                <Loader2 className="w-3 h-3 animate-spin" />
                {isFr ? 'Traitement en cours...' : 'Processing...'}
              </span>
            )}
            <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              {doneCountTotal} / {queue.length} {isFr ? 'traitées' : 'processed'}
            </span>
          </div>
        }
        secondaryActions={
          isProcessing ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-red-600 hover:text-red-700 h-8 px-3 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              {isFr ? 'Arrêter' : 'Stop'}
            </button>
          ) : undefined
        }
        primaryAction={{
          label: isFr ? 'Télécharger le lot (.ZIP)' : 'Download batch (.ZIP)',
          loadingLabel: isFr ? 'Génération du ZIP...' : 'Creating ZIP...',
          onClick: onDownloadBatchZip,
          isDisabled: !allBatchFinished,
          isLoading: false,
          icon: Download,
        }}
      />

      {/* Grille Contact-Sheet des images détourées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {queue.map((item, index) => (
          <div
            key={item.id}
            className="group relative rounded-xl border border-black/[0.08] dark:border-white/10 overflow-hidden bg-white dark:bg-zinc-900/40 p-3 flex flex-col justify-between transition-all hover:shadow-md"
          >
            {/* Vignette avec damier de transparence */}
            <div
              className="w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center relative select-none"
              style={{
                backgroundImage:
                  'repeating-conic-gradient(rgba(0,0,0,0.12) 0% 25%, transparent 0% 50%)',
                backgroundSize: '12px 12px',
              }}
            >
              {item.status === 'processing' ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-zinc-700 dark:text-zinc-300 animate-spin" />
                  <span className="text-[11px] font-mono text-zinc-500">
                    {isFr ? 'Détourage...' : 'Processing...'}
                  </span>
                </div>
              ) : (
                <img
                  src={item.resultUrl || item.previewUrl}
                  alt=""
                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                />
              )}

              {/* Actions au survol de la vignette */}
              {item.status === 'done' && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <ActionTooltip label={isFr ? 'Inspecter dans le studio' : 'Inspect in studio'}>
                    <button
                      type="button"
                      onClick={() => onInspectItem(index)}
                      aria-label={isFr ? `Inspecter ${item.file.name}` : `Inspect ${item.file.name}`}
                      className="p-2 rounded-lg bg-white/90 text-zinc-900 hover:bg-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </ActionTooltip>
                  <ActionTooltip label={isFr ? 'Télécharger ce PNG' : 'Download this PNG'}>
                    <button
                      type="button"
                      onClick={() => onDownloadItem(item)}
                      aria-label={isFr ? `Télécharger ${item.file.name}` : `Download ${item.file.name}`}
                      className="p-2 rounded-lg bg-white/90 text-zinc-900 hover:bg-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </ActionTooltip>
                </div>
              )}
            </div>

            {/* Métadonnées de l'image */}
            <div className="mt-2.5 flex items-center justify-between text-xs">
              {item.file.name.length > 18 ? (
                <ActionTooltip label={item.file.name}>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[130px] cursor-default">
                    {item.file.name}
                  </span>
                </ActionTooltip>
              ) : (
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[130px]">
                  {item.file.name}
                </span>
              )}
              <span className="font-mono text-zinc-500">
                {item.status === 'done' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {isFr ? 'Prêt' : 'Ready'}
                  </span>
                ) : item.status === 'error' ? (
                  <span className="text-red-500">{isFr ? 'Erreur' : 'Error'}</span>
                ) : (
                  formatBytes(item.file.size)
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Barre d'Action du Lot */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-black/[0.08] dark:border-white/10 gap-4 flex-wrap">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          {allBatchFinished
            ? isFr
              ? `${doneCountTotal} images détourées avec succès en PNG`
              : `${doneCountTotal} images successfully cut out to PNG`
            : isFr
            ? `Traitement de ${queue.length} images...`
            : `Processing ${queue.length} images...`}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {allBatchFinished && (
            <button
              type="button"
              onClick={onDownloadBatchZip}
              className="h-11 px-6 rounded-xl text-sm font-semibold bg-[#18181b] dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{isFr ? 'Télécharger toutes les images (.ZIP)' : 'Download all images (.ZIP)'}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
