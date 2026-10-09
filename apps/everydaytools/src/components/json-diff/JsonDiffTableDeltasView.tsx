import React from 'react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { SemanticDelta } from '@/lib/json-diff-aligned-logic';

export interface JsonDiffTableDeltasViewProps {
  deltas: SemanticDelta[];
  isFr: boolean;
}

export function JsonDiffTableDeltasView({ deltas, isFr }: JsonDiffTableDeltasViewProps) {
  if (deltas.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-zinc-400">
        {isFr
          ? 'Aucune différence structurelle détectée entre les deux JSONs.'
          : 'No structural difference detected between both JSON payloads.'}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto max-h-[580px]">
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10">
          <tr>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 w-24">Type</th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {isFr ? 'Chemin (JSON Path)' : 'Path (JSON Path)'}
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {isFr ? 'Original' : 'Original'}
            </th>
            <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {isFr ? 'Modifié' : 'Modified'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
          {deltas.map((d, idx) => {
            let badge = (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {isFr ? '+ Ajouté' : '+ Added'}
              </span>
            );
            if (d.type === 'remove') {
              badge = (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {isFr ? '- Supprimé' : '- Removed'}
                </span>
              );
            } else if (d.type === 'modify') {
              badge = (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {isFr ? '~ Modifié' : '~ Modified'}
                </span>
              );
            }

            return (
              <tr
                key={idx}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <td className="py-2 px-3">{badge}</td>
                <td className="py-2 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{d.path}</td>
                <td className="py-2 px-3 text-rose-600 dark:text-rose-400 truncate max-w-xs">
                  {d.oldValue !== undefined ? (
                    JSON.stringify(d.oldValue).length > 25 ? (
                      <ActionTooltip label={JSON.stringify(d.oldValue)} side="top">
                        <span className="truncate block">{JSON.stringify(d.oldValue)}</span>
                      </ActionTooltip>
                    ) : (
                      JSON.stringify(d.oldValue)
                    )
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 truncate max-w-xs">
                  {d.newValue !== undefined ? (
                    JSON.stringify(d.newValue).length > 25 ? (
                      <ActionTooltip label={JSON.stringify(d.newValue)} side="top">
                        <span className="truncate block">{JSON.stringify(d.newValue)}</span>
                      </ActionTooltip>
                    ) : (
                      JSON.stringify(d.newValue)
                    )
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
