import React from 'react';
import { X, Plus, Images } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import { ALLOWED_IMAGE_EXTENSIONS } from '@/lib/image-to-pdf-logic';

interface ImageToPdfFileListProps {
  files: File[];
  totalSize: number;
  onRemoveFile: (index: number) => void;
  onAddFiles: (newFiles: File[]) => void;
  isFr: boolean;
}

export function ImageToPdfFileList({
  files,
  totalSize,
  onRemoveFile,
  onAddFiles,
  isFr,
}: ImageToPdfFileListProps) {
  const acceptAttr = `image/*,${ALLOWED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(',')}`;

  return (
    <div className="w-full rounded-2xl p-4 bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 shadow-sm space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Images size={15} className="text-emerald-500" />
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr
              ? `Images sélectionnées (${files.length})`
              : `Selected images (${files.length})`}
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          {isFr ? 'Total :' : 'Total:'} {formatBytes(totalSize)}
        </span>
      </div>

      {/* Image Items List */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {files.map((f, idx) => (
          <div
            key={`${f.name}-${idx}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300 shadow-xs group"
          >
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
              #{idx + 1}
            </span>
            {f.name.length > 18 ? (
              <ActionTooltip label={f.name}>
                <span className="max-w-[140px] truncate font-medium cursor-default">
                  {f.name}
                </span>
              </ActionTooltip>
            ) : (
              <span className="max-w-[140px] truncate font-medium">{f.name}</span>
            )}
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {formatBytes(f.size)}
            </span>
            <ActionTooltip label={isFr ? `Supprimer ${f.name}` : `Remove ${f.name}`}>
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                aria-label={isFr ? `Supprimer ${f.name}` : `Remove ${f.name}`}
                className="text-zinc-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            </ActionTooltip>
          </div>
        ))}

        {/* Add more button */}
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer transition-colors bg-black/[0.01] dark:bg-white/[0.01]">
          <Plus size={13} />
          <span>{isFr ? 'Ajouter' : 'Add'}</span>
          <input
            type="file"
            accept={acceptAttr}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onAddFiles(Array.from(e.target.files));
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
