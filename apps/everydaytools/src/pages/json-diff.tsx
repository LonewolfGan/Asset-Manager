import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useJsonDiffWorkflow } from '@/hooks/use-json-diff-workflow';
import {
  JsonDiffToolbar,
  JsonDiffErrorBanners,
  JsonDiffInputWorkbench,
  JsonDiffResultsWorkbench,
} from '@/components/json-diff';

export default function JsonDiff() {
  const { t, isFr } = useLocale();
  const title = t.tools['json-diff']?.title ?? (isFr ? 'Comparateur JSON' : 'JSON Diff & Comparator');
  const desc =
    t.tools['json-diff']?.description ??
    (isFr
      ? 'Comparez deux structures JSON côte à côte pour détecter les ajouts, suppressions et modifications.'
      : 'Compare two JSON payloads side-by-side to highlight additions, deletions, and modifications.');

  const {
    inputLeft,
    setInputLeft,
    inputRight,
    setInputRight,
    editorHeight,
    hasInputs,
    hasBothInputs,
    viewMode,
    setViewMode,
    normalizeKeys,
    setNormalizeKeys,
    filterOnlyDiffs,
    setFilterOnlyDiffs,
    wordWrap,
    setWordWrap,
    parseLeft,
    parseRight,
    deltas,
    metrics,
    alignedLines,
    unifiedLines,
    handleSwap,
    handleClear,
    handleAutoRepairA,
    handleAutoRepairB,
    getDiffSummary,
    handleFileUploadA,
    handleFileUploadB,
    handleMouseDownResize,
  } = useJsonDiffWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="json-diff"
    >
      <div className="w-full space-y-4">
        {/* Barre de commande supérieure épurée */}
        <JsonDiffToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          deltasCount={deltas.length}
          normalizeKeys={normalizeKeys}
          onToggleNormalizeKeys={() => setNormalizeKeys(!normalizeKeys)}
          filterOnlyDiffs={filterOnlyDiffs}
          onToggleFilterOnlyDiffs={() => setFilterOnlyDiffs(!filterOnlyDiffs)}
          hasBothInputs={hasBothInputs}
          hasInputs={hasInputs}
          onSwap={handleSwap}
          onClear={handleClear}
          getDiffSummary={getDiffSummary}
          isFr={isFr}
        />

        {/* Bandeaux d'alertes syntaxe chirurgicaux */}
        <JsonDiffErrorBanners
          errorLeft={!parseLeft.ok ? parseLeft.error : null}
          errorRight={!parseRight.ok ? parseRight.error : null}
          onAutoRepairLeft={handleAutoRepairA}
          onAutoRepairRight={handleAutoRepairB}
          isFr={isFr}
        />

        {/* Volet de saisie & source avec redimensionnement synchronisé */}
        <JsonDiffInputWorkbench
          inputLeft={inputLeft}
          onInputLeftChange={setInputLeft}
          inputRight={inputRight}
          onInputRightChange={setInputRight}
          editorHeight={editorHeight}
          onMouseDownResize={handleMouseDownResize}
          onFileUploadA={handleFileUploadA}
          onFileUploadB={handleFileUploadB}
          isFr={isFr}
        />

        {/* Banc de visualisation du diff */}
        {hasBothInputs && (
          <JsonDiffResultsWorkbench
            viewMode={viewMode}
            metrics={metrics}
            deltas={deltas}
            alignedLines={alignedLines}
            unifiedLines={unifiedLines}
            wordWrap={wordWrap}
            onToggleWordWrap={setWordWrap}
            isFr={isFr}
          />
        )}

        {hasInputs && !hasBothInputs && (
          <div className="py-6 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {isFr
              ? 'Renseignez les deux versions (original et modifié) pour lancer la comparaison.'
              : 'Fill in both versions (original and modified) to start comparing.'}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
