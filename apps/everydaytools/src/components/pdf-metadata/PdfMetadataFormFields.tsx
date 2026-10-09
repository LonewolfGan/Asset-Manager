import React from 'react';
import { X } from 'lucide-react';

interface PdfMetadataFormFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  showInTitleBar: boolean;
  onShowInTitleBarChange: (val: boolean) => void;
  author: string;
  onAuthorChange: (val: string) => void;
  subject: string;
  onSubjectChange: (val: string) => void;
  tags: string[];
  tagInput: string;
  onTagInputChange: (val: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  quickTagSuggestions: string[];
  isFr: boolean;
}

export function PdfMetadataFormFields({
  title,
  onTitleChange,
  showInTitleBar,
  onShowInTitleBarChange,
  author,
  onAuthorChange,
  subject,
  onSubjectChange,
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagKeyDown,
  quickTagSuggestions,
  isFr,
}: PdfMetadataFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Champ : Titre */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isFr ? 'Titre du document' : 'Document Title'}
          </label>
          <span className="text-xs font-mono text-zinc-400">
            {title.length} {isFr ? 'car.' : 'chars'}
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={isFr ? 'ex. Rapport annuel 2026' : 'e.g. Annual Report 2026'}
          className="w-full h-12 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-base sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors"
        />
        <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showInTitleBar}
            onChange={(e) => onShowInTitleBarChange(e.target.checked)}
            className="w-4 h-4 rounded border-black/20 dark:border-white/20 text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer accent-[#FF6B35]"
          />
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {isFr
              ? "Afficher ce titre dans l'en-tête du lecteur PDF à l'ouverture"
              : 'Display this title in the PDF viewer title bar when opened'}
          </span>
        </label>
      </div>

      {/* Champ : Auteur */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? 'Auteur ou Organisation' : 'Author / Creator'}
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder={isFr ? 'ex. Direction Générale ou Marie Curie' : 'e.g. Acme Corp or Jane Doe'}
          className="w-full h-12 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-base sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors"
        />
      </div>

      {/* Champ : Sujet / Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? 'Sujet ou Description' : 'Subject'}
        </label>
        <textarea
          rows={3}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder={
            isFr
              ? 'ex. Synthèse détaillée des performances trimestrielles et des orientations stratégiques...'
              : 'e.g. Detailed overview of quarterly performance and strategic goals...'
          }
          className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-base sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors resize-y leading-relaxed"
        />
      </div>

      {/* Champ : Mots-clés / Tags */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? 'Mots-clés et étiquettes' : 'Keywords and tags'}
        </label>

        <div className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent flex flex-wrap items-center gap-2 min-h-[48px] focus-within:border-zinc-950 dark:focus-within:border-zinc-100 transition-colors">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/[0.05] dark:bg-white/[0.08] text-sm font-medium text-zinc-800 dark:text-zinc-200 select-none"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(idx)}
                className="hover:text-red-500 transition-colors cursor-pointer p-0.5"
                aria-label={isFr ? `Supprimer ${tag}` : `Remove ${tag}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagKeyDown}
            onBlur={() => {
              if (tagInput.trim()) onAddTag(tagInput);
            }}
            placeholder={
              tags.length === 0
                ? isFr
                  ? 'Tapez un mot-clé puis appuyez sur Entrée...'
                  : 'Type a keyword and press Enter...'
                : isFr
                  ? 'Ajouter un mot-clé...'
                  : 'Add a keyword...'
            }
            className="flex-1 min-w-[140px] bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none px-2 py-1"
          />
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-zinc-400 mr-1.5">
            {isFr ? 'Suggestions :' : 'Suggestions:'}
          </span>
          {quickTagSuggestions.map((sug) => {
            const isSelected = tags.includes(sug);
            return (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onRemoveTag(tags.indexOf(sug));
                  } else {
                    onAddTag(sug);
                  }
                }}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                    : 'border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {sug}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
