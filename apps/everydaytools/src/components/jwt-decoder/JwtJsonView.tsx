import React from 'react';
import { DecodedJwt } from '@/lib/jwt-logic';
import { getClaimAnnotation } from '@/lib/jwt-export-logic';

interface JwtJsonViewProps {
  obj: Record<string, unknown> | undefined;
  isPayload: boolean;
  decoded: DecodedJwt;
  isFr: boolean;
}

export const JwtJsonView: React.FC<JwtJsonViewProps> = ({
  obj,
  isPayload,
  decoded,
  isFr,
}) => {
  if (!obj || Object.keys(obj).length === 0) {
    return (
      <div className="p-4 text-xs font-mono text-zinc-400">
        {isFr ? '(En attente de jeton...)' : '(Waiting for token...)'}
      </div>
    );
  }

  const entries = Object.entries(obj);

  return (
    <div className="p-4 font-mono text-xs leading-relaxed select-text overflow-x-auto text-zinc-800 dark:text-zinc-200">
      <div className="text-zinc-400 dark:text-zinc-600">{'{'}</div>
      {entries.map(([key, val], idx) => {
        const isLast = idx === entries.length - 1;
        const comma = isLast ? '' : ',';
        const renderedVal = JSON.stringify(val);
        const annotation = isPayload
          ? getClaimAnnotation(key, val, decoded, isFr)
          : null;

        return (
          <div
            key={key}
            className="flex items-start justify-between gap-4 py-0.5 hover:bg-zinc-500/5 px-1 rounded transition-colors group"
          >
            <div className="whitespace-pre">
              <span className="text-zinc-400">  </span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                "{key}"
              </span>
              <span className="text-zinc-400">: </span>
              <span className="text-zinc-900 dark:text-zinc-100">{renderedVal}</span>
              <span className="text-zinc-400">{comma}</span>
            </div>

            {annotation && (
              <div className="text-[11px] font-sans text-zinc-400 dark:text-zinc-500 shrink-0 text-right select-none pl-2">
                // {annotation}
              </div>
            )}
          </div>
        );
      })}
      <div className="text-zinc-400 dark:text-zinc-600">{'}'}</div>
    </div>
  );
};
