import React from 'react';
import { Download, ChevronDown, FileCode2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface DiffDownloadMenuProps {
  onDownloadPatch: () => void;
  onDownloadOriginal: () => void;
  onDownloadModified: () => void;
  isFr: boolean;
}

export function DiffDownloadMenu({
  onDownloadPatch,
  onDownloadOriginal,
  onDownloadModified,
  isFr,
}: DiffDownloadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer outline-none"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isFr ? 'Télécharger' : 'Download'}</span>
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuItem
          onSelect={onDownloadPatch}
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
        >
          <FileCode2 className="w-4 h-4 text-zinc-500 shrink-0" />
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {isFr ? 'Fichier de Diff (.diff)' : 'Diff File (.diff)'}
            </div>
            <div className="text-[10px] text-zinc-400">
              {isFr ? 'Patch unifié standard' : 'Standard unified patch'}
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onDownloadOriginal}
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
        >
          <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {isFr ? 'Texte Original (.txt)' : 'Original Text (.txt)'}
            </div>
            <div className="text-[10px] text-zinc-400">
              {isFr ? 'Version de référence' : 'Reference version'}
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onDownloadModified}
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
        >
          <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {isFr ? 'Texte Modifié (.txt)' : 'Modified Text (.txt)'}
            </div>
            <div className="text-[10px] text-zinc-400">
              {isFr ? 'Version révisée' : 'Revised version'}
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
