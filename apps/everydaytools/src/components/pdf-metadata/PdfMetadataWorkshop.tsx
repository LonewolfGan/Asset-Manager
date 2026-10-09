import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { usePdfMetadataForm } from '@/hooks/use-pdf-metadata-form';
import { PdfMetadataSidebar } from './PdfMetadataSidebar';
import { PdfMetadataFormFields } from './PdfMetadataFormFields';
import { PdfMetadataAdvancedSection } from './PdfMetadataAdvancedSection';

interface PdfMetadataWorkshopProps {
  file: File;
  pageCount: number | null;
  creationDate: Date | null;
  isProcessing: boolean;
  onReset: () => void;
  onSave: () => void;
  form: ReturnType<typeof usePdfMetadataForm>;
  quickTagSuggestions: string[];
  isFr: boolean;
}

export function PdfMetadataWorkshop({
  file,
  pageCount,
  creationDate,
  isProcessing,
  onReset,
  onSave,
  form,
  quickTagSuggestions,
  isFr,
}: PdfMetadataWorkshopProps) {
  return (
    <motion.div
      key="staging-scene"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-6 flex flex-col"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file.name),
          pageCount: pageCount ?? undefined,
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        centerControls={
          <button
            type="button"
            onClick={form.handleRestoreInitial}
            disabled={isProcessing}
            className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFr ? 'Rétablir' : 'Restore'}</span>
          </button>
        }
        primaryAction={{
          label: isFr ? 'Enregistrer les métadonnées' : 'Save Metadata',
          loadingLabel: isFr ? 'Enregistrement...' : 'Saving...',
          onClick: onSave,
          isDisabled: isProcessing,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 items-start">
        <PdfMetadataSidebar
          file={file}
          pageCount={pageCount}
          creationDate={creationDate}
          originalAuthor={form.initialValues.author}
          onInferTitle={() => form.handleInferTitle(file.name)}
          onWipeMetadata={form.handleWipeMetadata}
          isFr={isFr}
        />

        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 pb-3 border-b border-black/[0.08] dark:border-white/10">
            {isFr ? 'Modifier les métadonnées' : 'Edit metadata'}
          </h3>

          <PdfMetadataFormFields
            title={form.title}
            onTitleChange={form.setTitle}
            showInTitleBar={form.showInTitleBar}
            onShowInTitleBarChange={form.setShowInTitleBar}
            author={form.author}
            onAuthorChange={form.setAuthor}
            subject={form.subject}
            onSubjectChange={form.setSubject}
            tags={form.tags}
            tagInput={form.tagInput}
            onTagInputChange={form.setTagInput}
            onAddTag={form.handleAddTag}
            onRemoveTag={form.handleRemoveTag}
            onTagKeyDown={form.handleTagKeyDown}
            quickTagSuggestions={quickTagSuggestions}
            isFr={isFr}
          />

          <PdfMetadataAdvancedSection
            showTechFields={form.showTechFields}
            onToggleTechFields={() => form.setShowTechFields(!form.showTechFields)}
            dateMode={form.dateMode}
            onDateModeChange={form.setDateMode}
            customDate={form.customDate}
            onCustomDateChange={form.setCustomDate}
            language={form.language}
            onLanguageChange={form.setLanguage}
            creator={form.creator}
            onCreatorChange={form.setCreator}
            producer={form.producer}
            onProducerChange={form.setProducer}
            isFr={isFr}
          />
        </div>
      </div>
    </motion.div>
  );
}
