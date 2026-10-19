import React, { useMemo } from 'react';
import { RotateCw, Volume2, VolumeX, Undo2, Redo2, ShieldCheck, Zap } from 'lucide-react';
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
  entropyBits: number;
  crackTime: { offlineFast: string; onlineThrottled: string };
  isSpinning: boolean;
  regenerate: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  entropyBits,
  crackTime,
  isSpinning,
  regenerate,
  undo,
  redo,
  canUndo,
  canRedo,
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
        color = 'text-[var(--accent,#f97316)] font-semibold';
      }

      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  }, [password]);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-8 sm:py-14 px-4 border-b border-zinc-200/80 dark:border-white/10 relative">
      {/* The Hero Monospace Output */}
      <div
        className={`w-full max-w-5xl font-mono ${textSizeClass} font-normal break-all select-all py-3 transition-opacity duration-150`}
      >
        {renderedCharacters}
      </div>

      {/* Security Metrics Pill */}
      <div className="flex items-center gap-3 mt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/70 dark:border-white/10">
          <Zap className="w-3.5 h-3.5 text-[var(--accent,#f97316)]" />
          <span>{entropyBits} bits d'entropie</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/70 dark:border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isFr ? 'Attaque GPU : ' : 'GPU Attack: '}
            <strong className="text-zinc-700 dark:text-zinc-200">{crackTime.offlineFast}</strong>
          </span>
        </span>
      </div>

      {/* Inline Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 pt-2">
        <PasswordStrengthDial strengthInfo={strengthInfo} />

        {/* Undo / Redo Actions */}
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10">
          <ActionTooltip label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'} side="top">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors duration-150 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </ActionTooltip>
          <ActionTooltip label={isFr ? 'Rétablir (Ctrl+Y)' : 'Redo (Ctrl+Y)'} side="top">
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors duration-150 cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </ActionTooltip>
        </div>

        {/* Quick Regenerate Action */}
        <ActionTooltip label={isFr ? 'Régénérer (Espace)' : 'Regenerate (Space)'} side="top">
          <button
            type="button"
            onClick={regenerate}
            className="h-11 px-4 rounded-xl inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] border border-zinc-200/80 dark:border-white/10 transition-colors duration-150 cursor-pointer"
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
              className={`h-11 px-4 rounded-xl inline-flex items-center gap-2 text-xs font-mono font-medium transition-colors duration-150 cursor-pointer active:scale-[0.98] border ${
                isSpeaking
                  ? 'bg-[var(--accent,#f97316)]/15 text-[var(--accent,#f97316)] border-[var(--accent,#f97316)]/40 shadow-xs'
                  : 'text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200/80 dark:border-white/10'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-[var(--accent,#f97316)] animate-pulse" />
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
          className="h-11 px-5 rounded-xl inline-flex items-center justify-center gap-2 text-xs font-mono font-semibold text-white bg-[var(--accent,#f97316)] hover:brightness-110 active:scale-[0.98] shadow-sm transition-[filter,transform] duration-150 cursor-pointer"
        />
      </div>
    </div>
  );
}
