import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wrench } from 'lucide-react';

interface PdfRepairDiagnosticsProps {
  isProcessing: boolean;
  isFr: boolean;
}

export function PdfRepairDiagnostics({
  isProcessing,
  isFr,
}: PdfRepairDiagnosticsProps) {
  return (
    <>
      {/* Filet de télémétrie pendant la réparation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden pt-6 pb-2 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Loader2 size={13} className="animate-spin text-[#FF6B35] shrink-0" />
                <span className="font-semibold">
                  {isFr ? 'Reconstruction en cours' : 'Reconstruction in progress'}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {isFr
                    ? 'Reconstruction de la table XREF, linéarisation et récupération des flux'
                    : 'Reconstructing XREF table, linearization and recovering byte streams'}
                </span>
              </div>
              <span className="text-[11px] text-[#FF6B35] font-semibold tracking-wide">
                QPDF + Ghostscript
              </span>
            </div>
            <div className="h-0.5 w-full bg-black/[0.06] dark:bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-[#FF6B35]"
                initial={{ x: '-100%', width: '40%' }}
                animate={{ x: '300%', width: '40%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostic & Présentation architecturale */}
      <div
        className={`py-12 sm:py-16 max-w-lg mx-auto w-full space-y-6 text-center transition-opacity duration-200 ${
          isProcessing ? 'opacity-40 pointer-events-none select-none' : ''
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center mx-auto mb-3">
          <Wrench size={22} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? 'Prêt pour la reconstruction' : 'Ready for reconstruction'}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            {isFr
              ? "L'outil analysera l'en-tête du document, réparera la table des références croisées (XREF) et reconstruira les flux d'objets endommagés."
              : 'The tool will parse document headers, repair the cross-reference table (XREF), and restore damaged object streams.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left pt-2">
          <div className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/10 space-y-1 bg-black/[0.01] dark:bg-white/[0.02]">
            <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              {isFr ? 'Moteur 1' : 'Engine 1'}
            </div>
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
              QPDF & Ghostscript
            </div>
            <div className="text-[11px] text-zinc-500">
              {isFr
                ? 'Reconstruction binaire serveur'
                : 'Server binary reconstruction'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/10 space-y-1 bg-black/[0.01] dark:bg-white/[0.02]">
            <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              {isFr ? 'Moteur 2' : 'Engine 2'}
            </div>
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
              Client pdf-lib
            </div>
            <div className="text-[11px] text-zinc-500">
              {isFr ? 'Repli local sécurisé' : 'Secure local fallback'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
