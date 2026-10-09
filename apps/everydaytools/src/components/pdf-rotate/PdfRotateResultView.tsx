import React from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, ArrowRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import { downloadBlob } from '@/lib/download';
import type { RotateResultData } from '@/hooks/use-pdf-rotate-workflow';

export interface PdfRotateResultViewProps {
  result: RotateResultData;
  formatIcon: string;
  isFr: boolean;
  t: any;
  onReset: () => void;
  onOpenNextAction?: () => void;
}

export const PdfRotateResultView: React.FC<PdfRotateResultViewProps> = ({
  result,
  formatIcon,
  isFr,
  t,
  onReset,
  onOpenNextAction,
}) => {
  const tc = t?.pdfRotate ?? {};

  const handleDownload = () => {
    downloadBlob(result.blob, result.filename);
    setTimeout(() => {
      onOpenNextAction?.();
    }, 450);
  };

  return (
    <motion.div
      key="result-showcase"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-12 sm:py-16 flex flex-col items-center text-center select-none"
    >
      {/* VRAI GRAND LOGO PDF LIBRE */}
      <img
        src={formatIcon}
        alt="PDF"
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-5"
      />

      {/* Nom du document pivoté */}
      {result.filename.length > 25 ? (
        <ActionTooltip label={result.filename}>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-xl truncate mb-12 cursor-default">
            {result.filename}
          </h3>
        </ActionTooltip>
      ) : (
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-xl truncate mb-12">
          {result.filename}
        </h3>
      )}

      {/* Comparaison Métrique Monumentale */}
      <div className="w-full py-14 border-y border-black/[0.08] dark:border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 mb-14">
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
            {isFr ? 'Pages pivotées' : 'Rotated pages'}
          </span>
          <span className="text-4xl sm:text-5xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tabular-nums tracking-tight">
            {result.rotatedCount}
            <span className="text-lg sm:text-xl font-normal text-zinc-400 dark:text-zinc-500 ml-1">
              /{result.totalPages}
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-zinc-400 dark:text-zinc-500">
          <ArrowRight size={18} strokeWidth={2.2} />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
            {isFr ? 'Poids source' : 'Original size'}
          </span>
          <span className="text-2xl sm:text-3xl font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
            {formatBytes(result.sizeBefore)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
            {isFr ? 'Poids final' : 'Final size'}
          </span>
          <span className="text-4xl sm:text-5xl font-mono font-bold text-[#FF6B35] tabular-nums tracking-tight">
            {formatBytes(result.sizeAfter)}
          </span>
        </div>
      </div>

      {/* Actions Décisives */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleDownload}
          className="group w-full sm:w-auto h-12 px-8 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-sm font-semibold active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 shadow-xs cursor-pointer"
        >
          <Download size={16} strokeWidth={2.2} />
          <span>
            {tc.downloadRotated ??
              (isFr ? 'Télécharger le PDF pivoté' : 'Download rotated PDF')}
          </span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto h-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{isFr ? 'Nouvelle rotation' : 'Rotate another'}</span>
        </button>
      </div>
    </motion.div>
  );
};
