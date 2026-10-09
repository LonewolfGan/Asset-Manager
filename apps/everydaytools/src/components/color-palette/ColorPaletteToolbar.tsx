import React from 'react';
import {
  ChevronDown,
  RefreshCw,
  Eye,
  Code,
  FileCode,
  FileText,
  Braces,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';
import {
  exportHexList,
  exportCssVariables,
  exportTailwindColors,
  exportSvg,
  exportJson,
} from '@/lib/color-palette-export';
import type { PaletteColor, HarmonyMode } from '@/lib/color-palette-logic';
import type { ColorFormat, HarmonyOption } from '@/hooks/use-color-palette-workflow';

interface ColorPaletteToolbarProps {
  mode: HarmonyMode;
  count: number;
  format: ColorFormat;
  palette: PaletteColor[];
  harmonyModes: HarmonyOption[];
  isRefreshing: boolean;
  onModeChange: (newMode: HarmonyMode) => void;
  onCountChange: (newCount: number) => void;
  onFormatChange: (newFormat: ColorFormat) => void;
  onRegenerate: () => void;
  onOpenMockupModal: () => void;
  onCopyCode: (code: string, label: string) => void;
  onDownload: (content: string, filename: string, mimeType: string) => void;
  isFr: boolean;
}

export function ColorPaletteToolbar({
  mode,
  count,
  format,
  palette,
  harmonyModes,
  isRefreshing,
  onModeChange,
  onCountChange,
  onFormatChange,
  onRegenerate,
  onOpenMockupModal,
  onCopyCode,
  onDownload,
  isFr,
}: ColorPaletteToolbarProps) {
  return (
    <div className="p-4 sm:px-6 sm:py-3.5 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Gauche : Sélecteur d'harmonie, Paliers rapides et Format */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Sélecteur de Mode d'Harmonie */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <span className="text-zinc-400">{isFr ? 'Harmonie :' : 'Harmony:'}</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {harmonyModes.find((m) => m.id === mode)?.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {harmonyModes.map((m) => (
              <DropdownMenuItem
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className="flex flex-col items-start gap-0.5 cursor-pointer py-1.5"
              >
                <span
                  className={`text-xs font-medium ${
                    mode === m.id ? 'text-[#FF6B35] font-semibold' : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {m.label}
                </span>
                <span className="text-[11px] text-zinc-400">{m.desc}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quantité de couleurs : 3 à 8 */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900">
          <span className="text-[11px] text-zinc-400 px-2 font-mono uppercase tracking-wider hidden sm:inline">
            {isFr ? 'Teintes' : 'Colors'}
          </span>
          {[3, 4, 5, 6, 7, 8].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onCountChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded-md font-mono text-xs transition-colors cursor-pointer active:scale-[0.96] ${
                count === p
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Bascule de Format (HEX / RGB / HSL) */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs">
          {(['hex', 'rgb', 'hsl'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onFormatChange(fmt)}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] uppercase transition-colors cursor-pointer active:scale-[0.98] ${
                format === fmt
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Droite : Mises en situation, Régénérer, Copier / Exporter */}
      <div className="flex items-center justify-end gap-2">
        <ActionTooltip
          label={isFr ? 'Visualiser la palette en conditions réelles' : 'Preview palette in mockups'}
          side="bottom"
        >
          <button
            type="button"
            onClick={onOpenMockupModal}
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer active:scale-[0.96]"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>{isFr ? 'Mises en situation' : 'Mockups'}</span>
          </button>
        </ActionTooltip>

        <button
          type="button"
          onClick={onRegenerate}
          className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer active:scale-[0.96] ${
            isRefreshing ? 'bg-zinc-200 dark:bg-zinc-700' : ''
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isFr ? 'Régénérer' : 'Regenerate'}</span>
        </button>

        {/* Bouton Copier palette (#FF6B35) + Menu déroulant Exportations */}
        <div className="flex items-center">
          <CopyButton
            text={() => exportHexList(palette)}
            label={isFr ? 'Copier palette' : 'Copy palette'}
            copiedLabel={isFr ? 'Copié !' : 'Copied!'}
            variant="custom"
            size="sm"
            className="flex items-center gap-1.5 h-8 px-3.5 text-xs font-semibold rounded-l-lg rounded-r-none bg-[#FF6B35] text-white hover:bg-[#e85a24] active:scale-[0.98] shadow-xs cursor-pointer"
            onCopy={() => trackToolUsed('color-palette', 'copy-all')}
            toastMessage={isFr ? 'Liste des couleurs HEX copiée' : 'HEX color list copied'}
          />

          <DropdownMenu>
            <ActionTooltip label={isFr ? "Options d'exportation de la palette" : 'Palette export options'} side="bottom">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-8 rounded-r-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] border-l border-white/20 transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
            </ActionTooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => onCopyCode(exportCssVariables(palette), isFr ? 'Variables CSS' : 'CSS Variables')}
                className="cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                <span>{isFr ? 'Copier variables CSS' : 'Copy CSS variables'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onCopyCode(exportTailwindColors(palette), isFr ? 'Config Tailwind' : 'Tailwind Config')}
                className="cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                <span>{isFr ? 'Copier config Tailwind' : 'Copy Tailwind config'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDownload(exportSvg(palette), 'palette.svg', 'image/svg+xml')}
                className="cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                <span>{isFr ? 'Télécharger palette .svg' : 'Download palette .svg'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDownload(exportJson(palette), 'palette.json', 'application/json')}
                className="cursor-pointer"
              >
                <Braces className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                <span>{isFr ? 'Télécharger palette .json' : 'Download palette .json'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
