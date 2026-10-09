import React, { useMemo } from 'react';
import { RotateCw, Volume2, VolumeX } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';
import { PasswordStrengthDial } from './PasswordStrengthDial';
import type { PasswordVaultStrength } from '@/lib/password-generator-logic';
import type { GeneratorMode } from '@/hooks/use-password-generator-workflow';

export interface PasswordHeroStageProps {
  password: string;
  textSizeClass: string;
  strengthInfo: PasswordVaultStrength;
  isSpinning: boolean;
  regenerate: () => void;
  mode: GeneratorMode;
  pronounceable: boolean;
  isSpeaking: boolean;
  speakPassword: (pwd: string) => void;
  isFr: boolean;
  regenerateLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

export function PasswordHeroStage({
  password,
  textSizeClass,
  strengthInfo,
  isSpinning,
  regenerate,
  mode,
  pronounceable,
  isSpeaking,
  speakPassword,
  isFr,
  regenerateLabel,
  copyLabel,
  copiedLabel,
}: PasswordHeroStageProps) {
  const renderedCharacters = useMemo(() => {
    return password.split('').map((char, i) => {
      const isDigit = /[0-9]/.test(char);
      const isSymbol = /[^a-zA-Z0-9\s]/.test(char);

      let color = 'text-zinc-900 dark:text-zinc-100';
      if (isDigit) {
        color = 'text-sky-600 dark:text-sky-400 font-medium';
      } else if (isSymbol) {
        color = 'text-[#FF6B35] dark:text-[#FF8255] font-semibold';
      }

      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  }, [password]);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-10 sm:py-16 px-4 border-b border-zinc-200/80 dark:border-white/10 relative">
      {/* The Hero Monospace Output */}
      <div
        className={`w-full max-w-5xl font-mono ${textSizeClass} font-normal break-all select-all py-4 transition-opacity`}
      >
        {renderedCharacters}
      </div>

      {/* Inline Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 pt-4">
        <PasswordStrengthDial strengthInfo={strengthInfo} />

        {/* Quick Regenerate Action */}
        <ActionTooltip label={isFr ? 'Régénérer (Espace)' : 'Regenerate (Space)'} side="top">
          <button
            type="button"
            onClick={regenerate}
            className="h-11 px-4 rounded-xl inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] border border-zinc-200/80 dark:border-white/10 transition-all cursor-pointer"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 transition-transform ${
                isSpinning ? 'rotate-180 duration-300' : ''
              }`}
            />
            <span>{regenerateLabel}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-200/70 dark:bg-zinc-700 border border-zinc-300/60 dark:border-white/10 rounded">
              {isFr ? 'Espace' : 'Space'}
            </kbd>
          </button>
        </ActionTooltip>

        {/* Audio Pronunciation Button (When pronounceable mode is active) */}
        {mode === 'random' && pronounceable && (
          <ActionTooltip
            label={
              isFr
                ? isSpeaking
                  ? 'Arrêter la lecture audio'
                  : 'Écouter la prononciation'
                : isSpeaking
                  ? 'Stop audio playback'
                  : 'Listen to pronunciation'
            }
            side="top"
          >
            <button
              type="button"
              onClick={() => speakPassword(password)}
              className={`h-11 px-4 rounded-xl inline-flex items-center gap-2 text-xs font-mono font-medium transition-all cursor-pointer active:scale-[0.98] border ${
                isSpeaking
                  ? 'bg-[#FF6B35]/15 text-[#FF6B35] border-[#FF6B35]/40 shadow-xs'
                  : 'text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200/80 dark:border-white/10'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-[#FF6B35] animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              )}
              <span>
                {isFr
                  ? isSpeaking
                    ? 'Arrêter'
                    : 'Écouter'
                  : isSpeaking
                    ? 'Stop'
                    : 'Listen'}
              </span>
            </button>
          </ActionTooltip>
        )}

        <CopyButton
          text={password}
          label={copyLabel}
          copiedLabel={copiedLabel}
          toastMessage={isFr ? 'Mot de passe copié' : 'Password copied'}
          variant="custom"
          size="lg"
          onCopy={() => trackToolUsed('password-generator', 'copy-password')}
          className="h-11 px-5 rounded-xl inline-flex items-center justify-center gap-2 text-xs font-mono font-semibold text-white bg-[#FF6B35] hover:bg-[#e85a24] active:scale-[0.98] shadow-sm transition-all cursor-pointer"
        />
      </div>
    </div>
  );
}
