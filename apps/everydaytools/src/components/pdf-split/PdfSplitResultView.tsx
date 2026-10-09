import React from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, ArrowRight, Archive } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import { downloadBlob } from '@/lib/download';

export interface SplitResultData {
  blob: Blob;
  filename: string;
  isZip: boolean;
  sizeAfter: number;
  sizeBefore?: number;
  title: string;
  details: string;
}

export interface PdfSplitResultViewProps {
  result: SplitResultData;
  formatIcon: string;
  isFr: boolean;
  t: any;
  onReset: () => void;
  onOpenNextAction?: () => void;
}

export const PdfSplitResultView: React.FC<PdfSplitResultViewProps> = ({
  result,
  formatIcon,
  isFr,
  t,
  onReset,
  onOpenNextAction,
}) => {
  const handleDownload = () => {
    downloadBlob(result.blob, result.filename);
    setTimeout(() => {
      onOpenNextAction?.();
    }, 450);
  };

  return (
    <motion.div
      key="result-split"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-12 sm:py-20 flex flex-col items-center justify-center text-center select-none"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
        {result.isZip ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
            <Archive size={40} strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={formatIcon}
            alt="PDF"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        )}
      </div>

      {result.filename.length > 25 ? (
        <ActionTooltip label={result.filename}>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-xl truncate mb-2 cursor-default">
            {result.filename}
          </h3>
        </ActionTooltip>
      ) : (
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-xl truncate mb-2">
          {result.filename}
        </h3>
      )}

      <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-12">
        {result.details}
      </p>

      {/* Monumental Metric Comparison */}
      <div className="w-full py-14 border-y border-black/[0.08] dark:border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 mb-14">
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
            {isFr ? 'Format du livrable' : 'Output format'}
          </span>
          <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            {result.isZip ? (isFr ? 'Archive ZIP' : 'ZIP Archive') : (isFr ? 'Document PDF' : 'PDF Document')}
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
            {formatBytes(result.sizeBefore ?? 0)}
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

      {/* Decisive Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleDownload}
          className="group w-full sm:w-auto h-12 px-8 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-sm font-semibold active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 shadow-xs cursor-pointer"
        >
          <Download size={16} strokeWidth={2.2} />
          <span>
            {result.isZip
              ? (t.pdfSplit?.downloadZip ?? (isFr ? 'Télécharger l’archive ZIP' : 'Download ZIP archive'))
              : (t.pdfSplit?.downloadPdf ?? (isFr ? 'Télécharger le nouveau PDF' : 'Download extracted PDF'))}
          </span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto h-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{t.pdfSplit?.splitAnother ?? (isFr ? 'Nouvelle opération' : 'Split another PDF')}</span>
        </button>
      </div>
    </motion.div>
  );
};
