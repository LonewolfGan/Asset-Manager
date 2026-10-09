import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useDiffCheckerWorkflow } from '@/hooks/use-diff-checker-workflow';
import { DiffCheckerTopBar } from '@/components/diff-checker/DiffCheckerTopBar';
import { DiffCheckerTelemetry } from '@/components/diff-checker/DiffCheckerTelemetry';
import { DiffWorkbench } from '@/components/diff-checker/DiffWorkbench';

export default function DiffChecker() {
  const { t, isFr } = useLocale();
  const title = t.tools['diff-checker']?.title ?? 'Text Diff Checker';
  const desc =
    t.tools['diff-checker']?.description ??
    'Compare two text documents or code snippets to highlight line-by-line differences and modifications.';

  const {
    textA,
    textB,
    history,
    viewMode,
    setViewMode,
    wordWrap,
    setWordWrap,
    ignoreWhitespace,
    setIgnoreWhitespace,
    ignoreCase,
    setIgnoreCase,
    activeChangeIndex,
    changeRefs,
    diffScrollContainerRef,
    editorHeight,
    isDragOverOriginal,
    setIsDragOverOriginal,
    isDragOverModified,
    setIsDragOverModified,
    handleUpdateOriginal,
    handleUpdateModified,
    handleUndo,
    handleSwap,
    handleClear,
    handleFileUpload,
    handleMouseDownResize,
    scrollToChange,
    diffResult,
    changedLineIndices,
    unifiedPatchText,
    handleDownloadPatch,
    handleDownloadOriginal,
    handleDownloadModified,
    hasContent,
    hasDiffs,
  } = useDiffCheckerWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="diff-checker"
    >
      <div className="w-full space-y-3">
        {/* Barre de commande supérieure épurée */}
        <DiffCheckerTopBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          ignoreWhitespace={ignoreWhitespace}
          onToggleIgnoreWhitespace={() => setIgnoreWhitespace(!ignoreWhitespace)}
          ignoreCase={ignoreCase}
          onToggleIgnoreCase={() => setIgnoreCase(!ignoreCase)}
          wordWrap={wordWrap}
          onToggleWordWrap={setWordWrap}
          hasDiffs={hasDiffs}
          activeChangeIndex={activeChangeIndex}
          totalChanges={changedLineIndices.length}
          onScrollToChange={scrollToChange}
          canUndo={history.length > 0}
          onUndo={handleUndo}
          hasContent={hasContent}
          onSwap={handleSwap}
          onClear={handleClear}
          unifiedPatchText={unifiedPatchText}
          onDownloadPatch={handleDownloadPatch}
          onDownloadOriginal={handleDownloadOriginal}
          onDownloadModified={handleDownloadModified}
          isFr={isFr}
        />

        {/* Bandeau de télémétrie du diff */}
        {hasContent && (
          <DiffCheckerTelemetry stats={diffResult.stats} isFr={isFr} />
        )}

        {/* Atelier principal avec redimensionnement vertical */}
        <DiffWorkbench
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          textA={textA}
          textB={textB}
          onUpdateOriginal={handleUpdateOriginal}
          onUpdateModified={handleUpdateModified}
          onFileUpload={handleFileUpload}
          onSwap={handleSwap}
          hasContent={hasContent}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          isDragOverOriginal={isDragOverOriginal}
          onDragOverOriginal={setIsDragOverOriginal}
          isDragOverModified={isDragOverModified}
          onDragOverModified={setIsDragOverModified}
          diffLines={diffResult.lines}
          changeRefs={changeRefs}
          scrollContainerRef={diffScrollContainerRef}
          onMouseDownResize={handleMouseDownResize}
          isFr={isFr}
        />
      </div>
    </ToolPageLayout>
  );
}
