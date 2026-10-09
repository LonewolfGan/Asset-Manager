import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  Download,
  Trash2,
  Undo2,
  ChevronDown,
  FileJson,
  FileCode2,
} from 'lucide-react';
import { DecodedJwt } from '@/lib/jwt-logic';
import { JwtExportMode } from '@/lib/jwt-export-logic';

interface JwtCommandBarProps {
  isFr: boolean;
  hasToken: boolean;
  decoded: DecodedJwt;
  historyLength: number;
  onCleanToken: () => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: (mode: JwtExportMode | 'token') => void;
  copiedLabel: string;
}

export const JwtCommandBar: React.FC<JwtCommandBarProps> = ({
  isFr,
  hasToken,
  decoded,
  historyLength,
  onCleanToken,
  onUndo,
  onClear,
  onDownload,
  copiedLabel,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
      {/* Gauche : Statut du Jeton & Nettoyage 'Bearer' */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {hasToken ? (
          decoded.valid ? (
            <div className="flex items-center gap-2 text-xs font-mono">
              {decoded.isExpired ? (
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                  <span>
                    {isFr ? 'Expiré' : 'Expired'} ({decoded.timeRemaining})
                  </span>
                </span>
              ) : decoded.expDate ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>
                    {isFr ? 'Actif' : 'Active'} ({decoded.timeRemaining}{' '}
                    {isFr ? 'restants' : 'remaining'})
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                  <span>
                    {isFr ? 'Sans expiration (exp)' : 'No expiration (exp)'}
                  </span>
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-rose-500 font-mono">
              {isFr ? 'Format de jeton invalide' : 'Invalid token format'}
            </span>
          )
        ) : (
          <span className="text-xs text-zinc-400 font-mono">
            {isFr ? 'En attente de jeton...' : 'Waiting for token...'}
          </span>
        )}

        {hasToken && (
          <ActionTooltip
            label={
              isFr
                ? "Retirer 'Bearer ' et espaces superflus"
                : 'Remove \'Bearer \' and extra spaces'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={onCleanToken}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <span>{isFr ? "Nettoyer 'Bearer'" : "Clean 'Bearer'"}</span>
            </button>
          </ActionTooltip>
        )}
      </div>

      {/* Droite : Ordre Strict Règle 25 (... -> Annuler -> Copier -> Vider -> Exporter) */}
      <div className="flex items-center gap-1.5 ml-auto flex-wrap">
        {historyLength > 0 && (
          <ActionTooltip
            label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasToken && (
          <CopyButton
            text={() =>
              JSON.stringify(
                { header: decoded.header, payload: decoded.payload },
                null,
                2
              )
            }
            label={isFr ? 'Copier Décodé' : 'Copy Decoded'}
            copiedLabel={copiedLabel}
            size="sm"
          />
        )}

        {hasToken && (
          <ActionTooltip
            label={isFr ? 'Vider les champs' : 'Clear fields'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Menu Exporter (Permanent à droite, Règle 25 - Bouton Orange Signature) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!decoded.valid}>
            <button
              type="button"
              disabled={!decoded.valid}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer outline-none disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B35]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          >
            <DropdownMenuItem
              onClick={() => onDownload('full')}
              className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <FileJson className="w-4 h-4 mr-2 text-zinc-400" />
              <span>{isFr ? 'JSON complet (.json)' : 'Full JSON (.json)'}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDownload('payload')}
              className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <FileJson className="w-4 h-4 mr-2 text-zinc-400" />
              <span>{isFr ? 'Payload seul (.json)' : 'Payload only (.json)'}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDownload('header')}
              className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <FileJson className="w-4 h-4 mr-2 text-zinc-400" />
              <span>{isFr ? 'En-tête seul (.json)' : 'Header only (.json)'}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />

            <DropdownMenuItem
              onClick={() => onDownload('token')}
              className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 mr-2 text-zinc-400" />
              <span>{isFr ? 'Jeton nettoyé (.jwt)' : 'Cleaned token (.jwt)'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
