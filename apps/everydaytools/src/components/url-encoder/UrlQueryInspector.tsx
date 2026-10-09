import React from 'react';
import { Link2, Trash2 } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { UrlDetails } from '@/lib/url-logic';

interface UrlQueryInspectorProps {
  isFr: boolean;
  urlInspection: UrlDetails;
  onRemoveParam: (key: string) => void;
  copiedLabel: string;
}

export const UrlQueryInspector: React.FC<UrlQueryInspectorProps> = ({
  isFr,
  urlInspection,
  onRemoveParam,
  copiedLabel,
}) => {
  return (
    <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* En-tête de l'inspecteur */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-semibold">
            {isFr
              ? 'Paramètres de Requête Décomposés'
              : 'Parsed Query Parameters'}{' '}
            ({urlInspection.params.length})
          </span>
        </div>
      </div>

      {/* Résumé de structure d'URL (Protocole, Hôte & Chemin) */}
      {(urlInspection.host || urlInspection.pathname) && (
        <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-900/10 flex items-center gap-4 text-xs font-mono flex-wrap">
          {urlInspection.protocol && (
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[10px] uppercase text-zinc-400">
                {isFr ? 'Protocole :' : 'Protocol:'}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                {urlInspection.protocol}
              </span>
            </div>
          )}
          {urlInspection.host && (
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[10px] uppercase text-zinc-400">
                {isFr ? 'Hôte :' : 'Host:'}
              </span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {urlInspection.host}
              </span>
            </div>
          )}
          {urlInspection.pathname && (
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[10px] uppercase text-zinc-400">
                {isFr ? 'Chemin :' : 'Path:'}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {urlInspection.pathname}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tableau des Paramètres Query */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/20 text-zinc-500 text-[10px] uppercase">
              <th className="py-2 px-4 w-12 text-zinc-400">#</th>
              <th className="py-2 px-4 w-1/3">
                {isFr ? 'Clé (Paramètre)' : 'Key (Parameter)'}
              </th>
              <th className="py-2 px-4">
                {isFr ? 'Valeur Décodée' : 'Decoded Value'}
              </th>
              <th className="py-2 px-4 w-28 text-right">
                {isFr ? 'Actions' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {urlInspection.params.map((param: { key: string; value: string }, idx: number) => (
              <tr
                key={`${param.key}-${idx}`}
                className="hover:bg-zinc-500/5 transition-colors group"
              >
                <td className="py-2.5 px-4 text-zinc-400 text-[11px]">{idx + 1}</td>
                <td className="py-2.5 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                  <span>{param.key}</span>
                </td>
                <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-300 break-all select-text">
                  {param.value || (
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {isFr ? 'vide' : 'empty'}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CopyButton
                      text={param.value}
                      variant="ghost"
                      size="icon"
                      label={isFr ? 'Copier la valeur' : 'Copy value'}
                      copiedLabel={copiedLabel}
                    />
                    <ActionTooltip
                      label={
                        isFr
                          ? `Supprimer "${param.key}" de l'URL`
                          : `Remove "${param.key}" from URL`
                      }
                      side="top"
                    >
                      <button
                        type="button"
                        onClick={() => onRemoveParam(param.key)}
                        className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </ActionTooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
