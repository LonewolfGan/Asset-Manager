import React from 'react';
import { DecodedJwt } from '@/lib/jwt-logic';
import { JwtTokenStats } from '@/lib/jwt-export-logic';
import { VerificationState } from '@/hooks/use-jwt-decoder-workflow';
import { JwtInputPane } from './JwtInputPane';
import { JwtHeaderPane } from './JwtHeaderPane';
import { JwtPayloadPane } from './JwtPayloadPane';
import { JwtSignaturePane } from './JwtSignaturePane';

interface JwtWorkbenchProps {
  isFr: boolean;
  tokenInput: string;
  hasToken: boolean;
  decoded: DecodedJwt;
  stats: JwtTokenStats;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onUpdateToken: (val: string) => void;
  onFileUpload: (file: File) => void;
  copiedLabel: string;
  verificationResult: VerificationState;
  secretKey: string;
  setSecretKey: (secret: string) => void;
  showSecret: boolean;
  setShowSecret: (show: boolean) => void;
  isBase64Secret: boolean;
  setIsBase64Secret: (base64: boolean) => void;
}

export const JwtWorkbench: React.FC<JwtWorkbenchProps> = ({
  isFr,
  tokenInput,
  hasToken,
  decoded,
  stats,
  isDragging,
  setIsDragging,
  onUpdateToken,
  onFileUpload,
  copiedLabel,
  verificationResult,
  secretKey,
  setSecretKey,
  showSecret,
  setShowSecret,
  isBase64Secret,
  setIsBase64Secret,
}) => {
  return (
    <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
      {/* Volet gauche : Jeton encodé (saisie, import, drag&drop) */}
      <JwtInputPane
        isFr={isFr}
        tokenInput={tokenInput}
        hasToken={hasToken}
        decoded={decoded}
        stats={stats}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onUpdateToken={onUpdateToken}
        onFileUpload={onFileUpload}
      />

      {/* Volet droit : En-tête, Payload & Signature */}
      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 min-h-[580px]">
        <JwtHeaderPane
          isFr={isFr}
          decoded={decoded}
          copiedLabel={copiedLabel}
        />

        <JwtPayloadPane
          isFr={isFr}
          decoded={decoded}
          copiedLabel={copiedLabel}
        />

        <JwtSignaturePane
          isFr={isFr}
          algorithm={decoded.algorithm}
          verificationResult={verificationResult}
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          showSecret={showSecret}
          setShowSecret={setShowSecret}
          isBase64Secret={isBase64Secret}
          setIsBase64Secret={setIsBase64Secret}
        />
      </div>
    </div>
  );
};
