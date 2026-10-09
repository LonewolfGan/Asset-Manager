import React, { useMemo } from 'react';
import { FileText, Trash2, ArrowRight } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { formatDate } from '@/lib/pdf-metadata-logic';
import { MetadataViewerGrid } from '@workspace/ui/controls';

interface PdfMetadataSidebarProps {
  file: File;
  pageCount: number | null;
  creationDate: Date | null;
  originalAuthor: string;
  onInferTitle: () => void;
  onWipeMetadata: () => void;
  isFr: boolean;
}

export function PdfMetadataSidebar({
  file,
  pageCount,
  creationDate,
  originalAuthor,
  onInferTitle,
  onWipeMetadata,
  isFr,
}: PdfMetadataSidebarProps) {
  const propertiesData = useMemo(() => ({
    [isFr ? 'Nombre de pages' : 'Page count']:
      pageCount !== null
        ? `${pageCount} page${pageCount > 1 ? 's' : ''}`
        : isFr
        ? 'Analyse...'
        : 'Analyzing...',
    [isFr ? 'Taille du fichier' : 'File size']: formatBytes(file.size),
    [isFr ? 'Date de création' : 'Creation date']: formatDate(creationDate, isFr),
    [isFr ? 'Format du document' : 'Document format']: 'PDF 1.7',
    ...(originalAuthor ? { [isFr ? 'Auteur d’origine' : 'Original author']: originalAuthor } : {}),
  }), [pageCount, file.size, creationDate, isFr, originalAuthor]);

  return (
    <div className="lg:col-span-5 space-y-8">
      {/* Liste signalétique ouverte Clé / Valeur */}
      <MetadataViewerGrid
        data={propertiesData}
        label={isFr ? 'Propriétés actuelles du fichier' : 'Current file properties'}
        isFr={isFr}
      />

      {/* Actions d'assistance rapides */}
      <div className="space-y-3 pt-6 border-t border-black/[0.08] dark:border-white/10">
        <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400 block">
          {isFr ? 'Actions rapides' : 'Quick actions'}
        </span>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onInferTitle}
            className="w-full h-11 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100/80 dark:bg-zinc-900/80 hover:bg-neutral-200/70 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all flex items-center justify-between gap-3 active:scale-[0.98] cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <FileText
                size={16}
                className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors shrink-0"
              />
              <span>{isFr ? 'Déduire le titre du nom de fichier' : 'Infer title from filename'}</span>
            </span>
            <ArrowRight
              size={15}
              className="text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0"
            />
          </button>

          <button
            type="button"
            onClick={onWipeMetadata}
            className="w-full h-11 px-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.08] text-sm font-medium text-red-600 dark:text-red-400 transition-all flex items-center justify-between gap-3 active:scale-[0.98] cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <Trash2 size={16} className="shrink-0" />
              <span>{isFr ? 'Vider tous les champs (Anonymiser)' : 'Clear all fields (Anonymize)'}</span>
            </span>
            <span className="text-xs font-mono uppercase opacity-75">
              {isFr ? 'Effacer' : 'Clear'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
