import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { InspectionResult, MetadataTag } from '@/lib/metadata-inspector';
import { MetadataViewerGrid } from '@workspace/ui/controls';

interface MetadataTagsInspectorProps {
  inspection: InspectionResult | null;
  visibleTags: MetadataTag[];
  activeFilter: 'all' | 'sensitive';
  isInspecting: boolean;
  isFr: boolean;
  onFilterChange: (filter: 'all' | 'sensitive') => void;
}

export const MetadataTagsInspector: React.FC<MetadataTagsInspectorProps> = ({
  inspection,
  visibleTags,
  activeFilter,
  isInspecting,
  isFr,
  onFilterChange,
}) => {
  const tagsRecord = useMemo(() => {
    const record: Record<string, string> = {};
    visibleTags.forEach((tag) => {
      record[tag.label || tag.key] = tag.value;
    });
    return record;
  }, [visibleTags]);

  return (
    <div className="lg:col-span-7 flex flex-col gap-3">
      {/* Onglets de filtres sobres */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          {isFr ? 'Balises détectées' : 'Detected tags'} ({inspection?.totalTags ?? 0})
        </span>

        {inspection && inspection.totalTags > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className={`transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'text-zinc-950 dark:text-white font-semibold underline underline-offset-4'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {isFr ? 'Toutes' : 'All'} ({inspection.totalTags})
            </button>
            {inspection.sensitiveTagsCount > 0 && (
              <button
                type="button"
                onClick={() => onFilterChange('sensitive')}
                className={`transition-colors cursor-pointer ${
                  activeFilter === 'sensitive'
                    ? 'text-amber-600 dark:text-amber-400 font-semibold underline underline-offset-4'
                    : 'text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                {isFr ? 'Sensibles' : 'Sensitive'} ({inspection.sensitiveTagsCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grille de métadonnées avec recherche instantanée */}
      <div className="flex flex-col">
        {isInspecting ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {isFr ? 'Analyse...' : 'Analyzing...'}
          </div>
        ) : (
          <MetadataViewerGrid
            data={tagsRecord}
            allowSearch={false}
            isFr={isFr}
          />
        )}
      </div>
    </div>
  );
};
