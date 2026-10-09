import React, { useState } from 'react';
import { Search, X, Tag } from 'lucide-react';
import type { MetadataViewerGridProps } from './types';

export const MetadataViewerGrid: React.FC<MetadataViewerGridProps> = ({
  data,
  allowSearch = false,
  allowRemove = false,
  onRemoveTag,
  label,
  isFr = false,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const entries = Object.entries(data).filter(([key, val]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchKey = key.toLowerCase().includes(q);
    const matchVal = String(val ?? '').toLowerCase().includes(q);
    return matchKey || matchVal;
  });

  return (
    <div className={`space-y-2.5 ${className}`}>
      {(label || allowSearch) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {label && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{label}</span>
              <span className="text-[11px] font-mono text-zinc-400">
                ({entries.length})
              </span>
            </div>
          )}

          {allowSearch && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="metadata-search"
                placeholder={isFr ? 'Filtrer les balises...' : 'Filter tags...'}
                className="w-full sm:w-44 h-7 pl-6 pr-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-md focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
              />
              <Search className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="py-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          {isFr ? 'Aucune métadonnée trouvée' : 'No metadata found'}
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
          {entries.map(([key, val]) => (
            <div
              key={key}
              data-testid="metadata-item"
              className="flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 max-w-[45%]">
                <span className="font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                  {key}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                <span className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 truncate select-all">
                  {val !== null && val !== undefined ? String(val) : '—'}
                </span>

                {allowRemove && onRemoveTag && (
                  <button
                    type="button"
                    onClick={() => onRemoveTag(key)}
                    data-testid={`remove-tag-${key}`}
                    title={isFr ? `Supprimer ${key}` : `Remove ${key}`}
                    className="p-0.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
