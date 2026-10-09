import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import type { StagedFile } from '@/lib/pdf-merge-logic';

export interface PdfMergeGridViewProps {
  files: StagedFile[];
  formatIcon: string;
  totalSize: number;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  isFr: boolean;
  t: any;
  onItemDragStart: (e: React.DragEvent, index: number) => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onItemDragEnd: () => void;
  onItemDrop: (e: React.DragEvent, index: number) => void;
  onMoveItem: (index: number, direction: 'prev' | 'next') => void;
  onRemoveFile: (id: string) => void;
  onAddMore: () => void;
}

export const PdfMergeGridView: React.FC<PdfMergeGridViewProps> = ({
  files,
  formatIcon,
  totalSize,
  draggedIndex,
  dragOverIndex,
  isFr,
  t,
  onItemDragStart,
  onItemDragOver,
  onItemDragEnd,
  onItemDrop,
  onMoveItem,
  onRemoveFile,
  onAddMore,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      <AnimatePresence initial={false} mode="popLayout">
        {files.map((item, idx) => {
          const isBeingDragged = draggedIndex === idx;
          const isOver = dragOverIndex === idx && draggedIndex !== idx;
          const weightRatio = totalSize > 0 ? (item.file.size / totalSize) * 100 : 0;

          return (
            <motion.div
              key={item.id}
              layout="position"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: isBeingDragged ? 0.35 : 1,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              draggable
              onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, idx)}
              onDragOver={(e) => onItemDragOver(e as unknown as React.DragEvent, idx)}
              onDragEnd={onItemDragEnd}
              onDrop={(e) => onItemDrop(e as unknown as React.DragEvent, idx)}
              className={`group relative rounded-2xl bg-white dark:bg-zinc-900 border p-5 flex flex-col justify-between min-h-[230px] cursor-grab active:cursor-grabbing transition-colors duration-150 ${
                isOver
                  ? 'border-zinc-500 ring-2 ring-zinc-400/30'
                  : 'border-black/[0.08] dark:border-white/10 hover:border-black/[0.15] dark:hover:border-white/20 shadow-xs'
              }`}
            >
              {/* En-tête de la planche : Numéro d'index, Grip, Bouton supprimer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical
                    size={14}
                    className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors"
                  />
                  <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <ActionTooltip label={isFr ? 'Retirer ce document' : 'Remove document'}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(item.id);
                    }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </ActionTooltip>
              </div>

              {/* Cœur de la planche : Document & Poids */}
              <div className="flex flex-col items-center my-3 text-center px-1">
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <img
                    src={formatIcon}
                    alt="PDF"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                {item.file.name.length > 25 ? (
                  <ActionTooltip label={item.file.name}>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-relaxed mb-1.5 break-words cursor-default">
                      {item.file.name}
                    </p>
                  </ActionTooltip>
                ) : (
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-relaxed mb-1.5 break-words">
                    {item.file.name}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                  <span>{formatBytes(item.file.size)}</span>
                  <span>·</span>
                  <span>{weightRatio.toFixed(0)}%</span>
                </div>
              </div>

              {/* Pied de planche : Réorganisation tactile gauche/droite */}
              <div className="pt-3 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between">
                <ActionTooltip label={isFr ? 'Déplacer vers la gauche' : 'Move left'}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveItem(idx, 'prev');
                    }}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={15} strokeWidth={2.2} />
                  </button>
                </ActionTooltip>

                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Position {idx + 1}
                </span>

                <ActionTooltip label={isFr ? 'Déplacer vers la droite' : 'Move right'}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveItem(idx, 'next');
                    }}
                    disabled={idx === files.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight size={15} strokeWidth={2.2} />
                  </button>
                </ActionTooltip>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Slot Terminal : "+ Ajouter un document" */}
      {files.length < 20 && (
        <button
          type="button"
          onClick={onAddMore}
          className="rounded-2xl border-2 border-dashed border-black/[0.08] dark:border-white/[0.1] hover:border-[#FF6B35] dark:hover:border-[#FF6B35] flex flex-col items-center justify-center gap-3 p-6 min-h-[230px] transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/[0.05] group-hover:bg-[#FF6B35]/10 flex items-center justify-center text-zinc-400 group-hover:text-[#FF6B35] transition-colors">
            <Plus size={18} strokeWidth={2.2} />
          </div>
          <div className="text-center">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 block">
              {t.pdfMerge?.addMore ?? (isFr ? 'Ajouter un document' : 'Add document')}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 block">
              {isFr
                ? `${20 - files.length} emplacement${20 - files.length > 1 ? 's' : ''} libre${20 - files.length > 1 ? 's' : ''}`
                : `${20 - files.length} slot${20 - files.length > 1 ? 's' : ''} available`}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
