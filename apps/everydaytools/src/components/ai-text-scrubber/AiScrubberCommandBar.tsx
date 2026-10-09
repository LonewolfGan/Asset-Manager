import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  Trash2,
  ShieldCheck,
  RotateCcw,
  FileCode,
  EyeOff,
  Minus,
  Bot,
  Quote,
  Space,
} from 'lucide-react';
import type { AiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';

interface AiScrubberCommandBarProps {
  workflow: AiScrubberWorkflow;
  isFr: boolean;
}

export function AiScrubberCommandBar({ workflow, isFr }: AiScrubberCommandBarProps) {
  const {
    optInvisibles,
    setOptInvisibles,
    optEmDashes,
    setOptEmDashes,
    optStylistic,
    setOptStylistic,
    optSymbols,
    setOptSymbols,
    optWhitespace,
    setOptWhitespace,
    analysis,
    hasAnomalies,
    undoStack,
    handleUndo,
    handleLoadSample,
    hasContent,
    handleClear,
    handleScrub,
    hasActiveOptions,
  } = workflow;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200/80 dark:border-white/10">
      {/* Gauche : Options de traitement sélectives (avec vraies icônes) + Télémétrie */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* 1. Filigranes invisibles */}
          <ActionTooltip
            label={
              isFr
                ? 'Supprimer les caractères et filigranes invisibles (zero-width spaces, BOM, etc.)'
                : 'Purge zero-width characters and invisible watermarks'
            }
          >
            <button
              type="button"
              onClick={() => setOptInvisibles(!optInvisibles)}
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                optInvisibles
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <EyeOff
                className={`w-3.5 h-3.5 shrink-0 ${
                  optInvisibles ? 'text-[#FF6B35]' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span>{isFr ? 'Filigranes invisibles' : 'Invisible watermarks'}</span>
            </button>
          </ActionTooltip>

          {/* 2. Tirets IA (em-dashes) */}
          <ActionTooltip
            label={
              isFr
                ? 'Remplacer les tirets longs cadratins (—) par une ponctuation humaine'
                : 'Convert AI em-dashes (—) into natural punctuation'
            }
          >
            <button
              type="button"
              onClick={() => setOptEmDashes(!optEmDashes)}
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                optEmDashes
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Minus
                className={`w-3.5 h-3.5 shrink-0 ${
                  optEmDashes ? 'text-[#FF6B35]' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span>{isFr ? 'Tirets IA (—)' : 'AI Dashes (—)'}</span>
            </button>
          </ActionTooltip>

          {/* 3. Clichés IA */}
          <ActionTooltip
            label={
              isFr
                ? 'Remplacer les tics d’écriture et expressions récurrentes de l’IA'
                : 'Humanize recognizable AI phrases and clichés'
            }
          >
            <button
              type="button"
              onClick={() => setOptStylistic(!optStylistic)}
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                optStylistic
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Bot
                className={`w-3.5 h-3.5 shrink-0 ${
                  optStylistic ? 'text-[#FF6B35]' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span>{isFr ? 'Clichés IA' : 'AI Clichés'}</span>
            </button>
          </ActionTooltip>

          {/* 4. Symboles & Puces */}
          <ActionTooltip
            label={
              isFr
                ? 'Normaliser les puces décoratives (✦, ❖...) et guillemets courbes'
                : 'Sanitize decorative bullet symbols (✦, ❖...) and smart quotes'
            }
          >
            <button
              type="button"
              onClick={() => setOptSymbols(!optSymbols)}
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                optSymbols
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Quote
                className={`w-3.5 h-3.5 shrink-0 ${
                  optSymbols ? 'text-[#FF6B35]' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span>{isFr ? 'Symboles & Puces' : 'Symbols & Quotes'}</span>
            </button>
          </ActionTooltip>

          {/* 5. Espaces */}
          <ActionTooltip
            label={
              isFr
                ? 'Normaliser les doubles espaces et retours à la ligne consécutifs'
                : 'Condense consecutive spaces and redundant newlines'
            }
          >
            <button
              type="button"
              onClick={() => setOptWhitespace(!optWhitespace)}
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                optWhitespace
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Space
                className={`w-3.5 h-3.5 shrink-0 ${
                  optWhitespace ? 'text-[#FF6B35]' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span>{isFr ? 'Espaces' : 'Whitespace'}</span>
            </button>
          </ActionTooltip>
        </div>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0 hidden lg:block" />

        {/* Télémétrie en direct */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {analysis.wordCount}{' '}
            {isFr
              ? analysis.wordCount > 1
                ? 'mots'
                : 'mot'
              : analysis.wordCount > 1
              ? 'words'
              : 'word'}
          </span>
          <span>•</span>
          <span>
            {analysis.charCount} {isFr ? 'car.' : 'chars'}
          </span>

          {hasAnomalies && (
            <>
              <span>•</span>
              <span className="text-[#FF6B35] font-medium">
                {analysis.invisiblesCount > 0 &&
                  `${analysis.invisiblesCount} ${isFr ? 'inv.' : 'inv.'} `}
                {analysis.emDashesCount > 0 &&
                  `${analysis.emDashesCount} ${isFr ? 'tirets' : 'dashes'} `}
                {analysis.stylisticCount > 0 && `${analysis.stylisticCount} clichés `}
                {analysis.symbolsCount > 0 && `${analysis.symbolsCount} ${isFr ? 'sym.' : 'sym.'}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Droite : Actions rapides & Bouton d'action signature Orange */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {undoStack.length > 0 && (
          <ActionTooltip label={isFr ? 'Annuler la dernière action' : 'Undo'}>
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        <ActionTooltip
          label={isFr ? 'Charger un texte d’exemple représentatif' : 'Load sample AI text'}
        >
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{isFr ? 'Exemple' : 'Sample'}</span>
          </button>
        </ActionTooltip>

        {hasContent && (
          <ActionTooltip label={isFr ? 'Effacer tout le contenu' : 'Clear all'}>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={handleScrub}
          disabled={!hasContent || !hasActiveOptions}
          className="h-8 px-4 text-xs font-medium bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs border-transparent"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          <span>{isFr ? 'Nettoyer le texte' : 'Scrub Text'}</span>
        </Button>
      </div>
    </div>
  );
}
