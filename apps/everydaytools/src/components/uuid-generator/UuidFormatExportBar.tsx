import React from 'react';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { EnclosureType } from '@/lib/uuid-export-logic';

interface UuidFormatExportBarProps {
  hyphens: boolean;
  uppercase: boolean;
  enclosure: EnclosureType;
  uuids: string[];
  isFr: boolean;
  onHyphensChange: (hyphens: boolean) => void;
  onUppercaseChange: (uppercase: boolean) => void;
  onEnclosureChange: (enclosure: EnclosureType) => void;
  onDownloadTxt: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const UuidFormatExportBar: React.FC<UuidFormatExportBarProps> = ({
  hyphens,
  uppercase,
  enclosure,
  uuids,
  isFr,
  onHyphensChange,
  onUppercaseChange,
  onEnclosureChange,
  onDownloadTxt,
  onExportJson,
  onExportCsv,
}) => {
  return (
    <div className="px-4 sm:px-6 py-2.5 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3">
      {/* Options d'encodage et de formatage */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Bascule Tirets */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => onHyphensChange(true)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
              hyphens
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            8-4-4-4-12
          </button>
          <button
            type="button"
            onClick={() => onHyphensChange(false)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
              !hyphens
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {isFr ? 'Brut (32 hex)' : 'Raw (32 hex)'}
          </button>
        </div>

        {/* Bascule Casse */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => onUppercaseChange(false)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
              !uppercase
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            abc
          </button>
          <button
            type="button"
            onClick={() => onUppercaseChange(true)}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
              uppercase
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            ABC
          </button>
        </div>

        {/* Enveloppe */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => onEnclosureChange('none')}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
              enclosure === 'none'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Standard
          </button>
          <ActionTooltip label={isFr ? 'Format GUID {...}' : 'GUID format {...}'} side="top">
            <button
              type="button"
              onClick={() => onEnclosureChange('braces')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
                enclosure === 'braces'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {'{ }'}
            </button>
          </ActionTooltip>
          <ActionTooltip label={isFr ? 'Format chaîne "..."' : 'String format "..."'} side="top">
            <button
              type="button"
              onClick={() => onEnclosureChange('quotes')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
                enclosure === 'quotes'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-medium shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              &quot; &quot;
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* Actions de Copie & Export */}
      <div className="flex items-center gap-2">
        <CopyButton
          text={uuids.join('\n')}
          label={isFr ? 'Copier tout' : 'Copy all'}
          copiedLabel={isFr ? 'Copié' : 'Copied'}
          size="sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onDownloadTxt}>
              <FileText className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Fichier texte (.txt)' : 'Text file (.txt)'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJson}>
              <FileJson className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Tableau JSON (.json)' : 'JSON array (.json)'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportCsv}>
              <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Tableur CSV (.csv)' : 'CSV spreadsheet (.csv)'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
