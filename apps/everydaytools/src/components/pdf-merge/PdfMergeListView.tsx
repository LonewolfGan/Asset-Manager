import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import type { StagedFile } from '@/lib/pdf-merge-logic';

export interface PdfMergeListViewProps {
  files: StagedFile[];
  formatIcon: string;
  totalSize: number;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  isFr: boolean;
  onItemDragStart: (e: React.DragEvent, index: number) => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onItemDragEnd: () => void;
  onItemDrop: (e: React.DragEvent, index: number) => void;
  onMoveItem: (index: number, direction: 'prev' | 'next') => void;
  onRemoveFile: (id: string) => void;
  onAddMore: () => void;
}

export const PdfMergeListView: React.FC<PdfMergeListViewProps> = ({
  files,
  formatIcon,
  totalSize,
  draggedIndex,
  dragOverIndex,
  isFr,
  onItemDragStart,
  onItemDragOver,
  onItemDragEnd,
  onItemDrop,
  onMoveItem,
  onRemoveFile,
  onAddMore,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/10 overflow-hidden divide-y divide-black/[0.06] dark:divide-white/10">
      {/* Entête du tableau */}
      <div className="px-5 py-3 bg-black/[0.02] dark:bg-white/[0.02] grid grid-cols-12 gap-4 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        <div className="col-span-1">#</div>
        <div className="col-span-6 sm:col-span-7">Document</div>
        <div className="col-span-3 sm:col-span-2 text-right">{isFr ? 'Poids' : 'Size'}</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {files.map((item, idx) => {
          const isBeingDragged = draggedIndex === idx;
          const isOver = dragOverIndex === idx && draggedIndex !== idx;
          const weightRatio = totalSize > 0 ? (item.file.size / totalSize) * 100 : 0;

          return (
            <motion.div
              key={item.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isBeingDragged ? 0.35 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              draggable
              onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, idx)}
              onDragOver={(e) => onItemDragOver(e as unknown as React.DragEvent, idx)}
              onDragEnd={onItemDragEnd}
              onDrop={(e) => onItemDrop(e as unknown as React.DragEvent, idx)}
              className={`px-5 py-3.5 grid grid-cols-12 gap-4 items-center cursor-grab active:cursor-grabbing transition-colors duration-150 ${
                isOver
                  ? 'bg-[#FF6B35]/5 border-l-4 border-l-[#FF6B35]'
                  : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
              }`}
            >
              {/* Index & Drag Handle */}
              <div className="col-span-1 flex items-center gap-2">
                <GripVertical
                  size={14}
                  className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500"
                />
                <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Nom du document */}
              <div className="col-span-6 sm:col-span-7 flex items-center gap-3 min-w-0">
                <img
                  src={formatIcon}
                  alt="PDF"
                  className="w-5 h-5 object-contain shrink-0"
                />
                {item.file.name.length > 25 ? (
                  <ActionTooltip label={item.file.name}>
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate cursor-default">
                      {item.file.name}
                    </span>
                  </ActionTooltip>
                ) : (
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {item.file.name}
                  </span>
                )}
              </div>

              {/* Poids & Jauge Proportionnelle */}
              <div className="col-span-3 sm:col-span-2 text-right">
                <div className="text-xs font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
                  {formatBytes(item.file.size)}
                </div>
                <div className="w-full h-1 bg-black/[0.05] dark:bg-white/[0.08] rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 dark:bg-zinc-500 rounded-full"
                    style={{ width: `${Math.max(weightRatio, 4)}%` }}
                  />
                </div>
              </div>

              {/* Actions de réorganisation tactile */}
              <div className="col-span-2 flex items-center justify-end gap-1">
                <ActionTooltip label={isFr ? "Monter d'une position" : 'Move up'}>
                  <button
                    type="button"
                    onClick={() => onMoveItem(idx, 'prev')}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ArrowUp size={14} />
                  </button>
                </ActionTooltip>
                <ActionTooltip label={isFr ? "Descendre d'une position" : 'Move down'}>
                  <button
                    type="button"
                    onClick={() => onMoveItem(idx, 'next')}
                    disabled={idx === files.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ArrowDown size={14} />
                  </button>
                </ActionTooltip>
                <ActionTooltip label={isFr ? 'Retirer ce document' : 'Remove document'}>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </ActionTooltip>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Ligne d'ajout rapide au registre */}
      {files.length < 20 && (
        <button
          type="button"
          onClick={onAddMore}
          className="w-full px-5 py-3 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 hover:text-[#FF6B35] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.2} />
          <span>
            {isFr
              ? `Ajouter un autre fichier PDF (${20 - files.length} disponibles)`
              : `Add another PDF file (${20 - files.length} available)`}
          </span>
        </button>
      )}
    </div>
  );
};
