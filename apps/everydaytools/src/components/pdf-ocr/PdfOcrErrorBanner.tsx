import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface PdfOcrErrorBannerProps {
  error: string | null;
  onDismiss: () => void;
  isFr: boolean;
}

export function PdfOcrErrorBanner({
  error,
  onDismiss,
  isFr,
}: PdfOcrErrorBannerProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 max-w-2xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm shadow-sm"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
