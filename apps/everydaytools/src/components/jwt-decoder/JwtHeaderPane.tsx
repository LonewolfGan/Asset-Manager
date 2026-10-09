import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { DecodedJwt } from '@/lib/jwt-logic';
import { JwtJsonView } from './JwtJsonView';

interface JwtHeaderPaneProps {
  isFr: boolean;
  decoded: DecodedJwt;
  copiedLabel: string;
}

export const JwtHeaderPane: React.FC<JwtHeaderPaneProps> = ({
  isFr,
  decoded,
  copiedLabel,
}) => {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
            {isFr ? 'En-tête (Header)' : 'Header'}
          </span>
          {decoded.algorithm && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] font-semibold border border-[#FF6B35]/20">
              alg: {decoded.algorithm}
            </span>
          )}
        </div>

        {decoded.valid && (
          <CopyButton
            text={() => JSON.stringify(decoded.header, null, 2)}
            label={isFr ? 'Copier' : 'Copy'}
            copiedLabel={copiedLabel}
            size="sm"
            variant="ghost"
          />
        )}
      </div>

      <JwtJsonView
        obj={decoded.header}
        isPayload={false}
        decoded={decoded}
        isFr={isFr}
      />
    </div>
  );
};
