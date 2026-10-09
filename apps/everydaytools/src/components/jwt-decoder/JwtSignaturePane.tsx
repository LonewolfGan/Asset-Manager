import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { VerificationState } from '@/hooks/use-jwt-decoder-workflow';

interface JwtSignaturePaneProps {
  isFr: boolean;
  algorithm: string | undefined;
  verificationResult: VerificationState;
  secretKey: string;
  setSecretKey: (secret: string) => void;
  showSecret: boolean;
  setShowSecret: (show: boolean) => void;
  isBase64Secret: boolean;
  setIsBase64Secret: (base64: boolean) => void;
}

export const JwtSignaturePane: React.FC<JwtSignaturePaneProps> = ({
  isFr,
  algorithm,
  verificationResult,
  secretKey,
  setSecretKey,
  showSecret,
  setShowSecret,
  isBase64Secret,
  setIsBase64Secret,
}) => {
  return (
    <div className="p-4 flex flex-col gap-3 bg-zinc-50/30 dark:bg-zinc-900/10">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
          {isFr ? 'Vérification Signature' : 'Signature Verification'} (
          {algorithm || 'HS256'})
        </span>

        <div className="font-mono text-xs">
          {verificationResult.status === 'valid' ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ● {isFr ? 'Signature authentique' : 'Valid signature'}
            </span>
          ) : verificationResult.status === 'invalid' ? (
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              ● {isFr ? 'Signature non concordante' : 'Invalid signature'}
            </span>
          ) : verificationResult.status === 'unsupported' ? (
            <span className="text-zinc-400">{verificationResult.message}</span>
          ) : (
            <span className="text-zinc-400">
              {verificationResult.message || (isFr ? 'Non vérifiée' : 'Unverified')}
            </span>
          )}
        </div>
      </div>

      {/* Champ clé secrète sobre, sur une seule ligne */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <input
            type={showSecret ? 'text' : 'password'}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={
              isFr
                ? 'Clé secrète pour vérifier la signature...'
                : 'Secret key to verify signature...'
            }
            spellCheck={false}
            className="w-full h-8 px-2.5 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          <ActionTooltip
            label={
              showSecret
                ? isFr
                  ? 'Masquer'
                  : 'Hide'
                : isFr
                ? 'Afficher'
                : 'Show'
            }
            side="top"
          >
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              {showSecret ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </ActionTooltip>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isBase64Secret}
            onChange={(e) => setIsBase64Secret(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-700 text-[#FF6B35] focus:ring-0 accent-[#FF6B35]"
          />
          <span>{isFr ? 'Secret Base64' : 'Base64 Secret'}</span>
        </label>
      </div>
    </div>
  );
};
