import React from 'react';
import {
  PASSWORD_PRESETS,
  type PasswordPreset,
} from '@/lib/password-generator-presets';

export interface PasswordPresetsBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: PasswordPreset) => void;
  isFr: boolean;
}

export function PasswordPresetsBar({
  activePresetId,
  onSelectPreset,
  isFr,
}: PasswordPresetsBarProps) {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          {isFr ? 'Profils de sécurité prédéfinis' : 'Security presets'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PASSWORD_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`h-8 px-3 rounded-lg text-xs font-mono font-medium transition-colors duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200/80 dark:border-white/10'
              }`}
            >
              <span>{isFr ? preset.nameFr : preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
