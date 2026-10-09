import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2 } from 'lucide-react';

interface CsvEditorUndoToastProps {
  notification: { id: number; message: string } | null;
  onUndo: () => void;
  isFr: boolean;
}

export function CsvEditorUndoToast({
  notification,
  onUndo,
  isFr,
}: CsvEditorUndoToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-2xl border border-white/10 dark:border-black/10 text-xs font-medium"
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={onUndo}
            className="px-2.5 py-1 rounded-xl bg-white/15 dark:bg-black/10 hover:bg-white/25 dark:hover:bg-black/20 text-white dark:text-zinc-950 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <Undo2 size={13} />
            <span>{isFr ? 'Annuler' : 'Undo'}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
