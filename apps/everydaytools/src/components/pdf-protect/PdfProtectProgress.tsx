import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface PdfProtectProgressProps {
  isProcessing: boolean;
}

export function PdfProtectProgress({ isProcessing }: PdfProtectProgressProps) {
  const { isFr } = useLocale();

  return (
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
                {isFr ? 'Chiffrement AES-256 en cours' : 'AES-256 encryption in progress'}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {isFr
                  ? 'Verrouillage des permissions et encodage du document'
                  : 'Locking permissions and encoding document'}
              </span>
            </div>
            <span className="text-[11px] text-[#FF6B35] font-semibold tracking-wide">
              ISO 32000-2
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
  );
}
