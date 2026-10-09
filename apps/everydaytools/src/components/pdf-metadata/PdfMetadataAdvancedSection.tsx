import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '@/lib/pdf-metadata-logic';

interface PdfMetadataAdvancedSectionProps {
  showTechFields: boolean;
  onToggleTechFields: () => void;
  dateMode: 'keep' | 'today' | 'custom' | 'clear';
  onDateModeChange: (mode: 'keep' | 'today' | 'custom' | 'clear') => void;
  customDate: string;
  onCustomDateChange: (date: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  creator: string;
  onCreatorChange: (creator: string) => void;
  producer: string;
  onProducerChange: (producer: string) => void;
  isFr: boolean;
}

export function PdfMetadataAdvancedSection({
  showTechFields,
  onToggleTechFields,
  dateMode,
  onDateModeChange,
  customDate,
  onCustomDateChange,
  language,
  onLanguageChange,
  creator,
  onCreatorChange,
  producer,
  onProducerChange,
  isFr,
}: PdfMetadataAdvancedSectionProps) {
  return (
    <div className="pt-2 border-t border-black/[0.06] dark:border-white/10">
      <button
        type="button"
        onClick={onToggleTechFields}
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 cursor-pointer py-1.5"
      >
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            showTechFields ? 'rotate-180' : ''
          }`}
        />
        <span>
          {showTechFields
            ? (isFr ? 'Masquer les options avancées (Date, Langue, Logiciels)' : 'Hide advanced options (Date, Language, Software)')
            : (isFr ? 'Options avancées (Date de création, Langue, Logiciels sources)' : 'Advanced options (Creation date, Language, Source software)')}
        </span>
      </button>

      <AnimatePresence>
        {showTechFields && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden pt-4 space-y-5"
          >
            {/* 1. Date de création */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-400" />
                <span>{isFr ? 'Date de création du document' : 'Document creation date'}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onDateModeChange('keep')}
                  className={`py-2 px-2.5 rounded-lg border transition-all cursor-pointer font-medium text-center ${
                    dateMode === 'keep'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.03]'
                  }`}
                >
                  {isFr ? "Conserver l'originale" : 'Keep original'}
                </button>

                <button
                  type="button"
                  onClick={() => onDateModeChange('today')}
                  className={`py-2 px-2.5 rounded-lg border transition-all cursor-pointer font-medium text-center ${
                    dateMode === 'today'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.03]'
                  }`}
                >
                  {isFr ? "Aujourd'hui" : 'Today'}
                </button>

                <button
                  type="button"
                  onClick={() => onDateModeChange('custom')}
                  className={`py-2 px-2.5 rounded-lg border transition-all cursor-pointer font-medium text-center ${
                    dateMode === 'custom'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.03]'
                  }`}
                >
                  {isFr ? 'Personnalisée' : 'Custom'}
                </button>

                <button
                  type="button"
                  onClick={() => onDateModeChange('clear')}
                  className={`py-2 px-2.5 rounded-lg border transition-all cursor-pointer font-medium text-center ${
                    dateMode === 'clear'
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.03]'
                  }`}
                >
                  {isFr ? 'Supprimer la date' : 'Clear date'}
                </button>
              </div>

              {dateMode === 'custom' && (
                <div className="pt-2">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => onCustomDateChange(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100"
                  />
                </div>
              )}
            </div>

            {/* 2. Langue du document */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Globe size={13} className="text-zinc-400" />
                <span>{isFr ? 'Langue du document (Accessibilité & Liseuses)' : 'Document language (Accessibility & Screen readers)'}</span>
              </label>
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Logiciels sources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {isFr ? 'Application source (Creator)' : 'Source Application (Creator)'}
                </label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => onCreatorChange(e.target.value)}
                  placeholder="ex. Microsoft Word, InDesign"
                  className="w-full h-11 px-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {isFr ? 'Moteur de conversion (Producer)' : 'Conversion Engine (Producer)'}
                </label>
                <input
                  type="text"
                  value={producer}
                  onChange={(e) => onProducerChange(e.target.value)}
                  placeholder="ex. Acrobat Distiller, pdf-lib"
                  className="w-full h-11 px-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
