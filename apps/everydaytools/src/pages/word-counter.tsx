import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DocumentNextActionModal } from '@/components/conversion';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { useWordCounterWorkflow } from '@/hooks/use-word-counter-workflow';
import {
  WordCounterCommandBar,
  WordCounterMetricRibbon,
  WordCounterCanvas,
  WordCounterDensityBar,
} from '@/components/word-counter';

export default function WordCounter() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const pageTitle =
    t.tools['word-counter']?.title ??
    (isFr ? 'Compteur de Mots & Caractères' : 'Word & Character Counter');
  const pageDesc =
    t.tools['word-counter']?.description ??
    (isFr
      ? 'Analysez en temps réel vos textes : décompte de mots, caractères, temps de lecture/parole et densité lexicale.'
      : 'Analyze your text in real time: word and character count, reading/speaking time, and lexical density.');

  const {
    text,
    undoStack,
    redoStack,
    loadedFile,
    isDraggingOver,
    isNextActionOpen,
    stats,
    fileInputRef,
    textareaRef,
    setIsNextActionOpen,
    handleTextChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleFileUpload,
    handleDetachFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTransformCase,
    handleCopyText,
    handleDownloadTxt,
    handleCopyReport,
    handleExportJson,
  } = useWordCounterWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="word-counter"
    >
      <TooltipProvider>
        <div className="w-full">
          {/* Studio Atelier Pleine Largeur */}
          <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
            {/* 1. Barre de commande supérieure */}
            <WordCounterCommandBar
              loadedFile={loadedFile}
              text={text}
              undoStackLength={undoStack.length}
              redoStackLength={redoStack.length}
              fileInputRef={fileInputRef}
              isFr={isFr}
              onFileUpload={handleFileUpload}
              onDetachFile={handleDetachFile}
              onTransformCase={handleTransformCase}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              onCopyText={handleCopyText}
              onDownloadTxt={handleDownloadTxt}
              onCopyReport={handleCopyReport}
              onExportJson={handleExportJson}
            />

            {/* 2. Ruban métrique architectural */}
            <WordCounterMetricRibbon stats={stats} isFr={isFr} />

            {/* 3. Canvas d'écriture & d'analyse */}
            <WordCounterCanvas
              text={text}
              isDraggingOver={isDraggingOver}
              textareaRef={textareaRef}
              isFr={isFr}
              copiedLabel={t.common.copied}
              onTextChange={handleTextChange}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onQuickCopy={() => {
                toast.success(
                  isFr
                    ? 'Texte copié dans le presse-papier'
                    : 'Text copied to clipboard'
                );
                trackToolUsed('word-counter', 'copy-text');
              }}
            />

            {/* 4. Registre de densité lexicale */}
            <WordCounterDensityBar
              topKeywords={stats.topKeywords}
              lines={stats.lines}
              avgWordLength={stats.avgWordLength}
              isFr={isFr}
            />
          </div>
        </div>

        <DocumentNextActionModal
          toolId="word-counter"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={new Blob([text], { type: 'text/plain;charset=utf-8' })}
          resultFilename="document.txt"
          formatType="txt"
        />
      </TooltipProvider>
    </ToolPageLayout>
  );
}
