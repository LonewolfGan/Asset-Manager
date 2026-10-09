import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { DecodedJwt } from '@/lib/jwt-logic';
import { JwtJsonView } from './JwtJsonView';

interface JwtPayloadPaneProps {
  isFr: boolean;
  decoded: DecodedJwt;
  copiedLabel: string;
}

export const JwtPayloadPane: React.FC<JwtPayloadPaneProps> = ({
  isFr,
  decoded,
  copiedLabel,
}) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="h-10 px-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
            {isFr ? 'Payload (Données)' : 'Payload (Data)'}
          </span>
          {decoded.claimsCount !== undefined && (
            <span className="text-[10px] font-mono text-zinc-400">
              ({decoded.claimsCount} {isFr ? 'revendications' : 'claims'})
            </span>
          )}
        </div>

        {decoded.valid && (
          <CopyButton
            text={() => JSON.stringify(decoded.payload, null, 2)}
            label={isFr ? 'Copier' : 'Copy'}
            copiedLabel={copiedLabel}
            size="sm"
            variant="ghost"
          />
        )}
      </div>

      <JwtJsonView
        obj={decoded.payload}
        isPayload={true}
        decoded={decoded}
        isFr={isFr}
      />
    </div>
  );
};
