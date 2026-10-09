import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useRegexTesterWorkflow } from '@/hooks/use-regex-tester-workflow';
import { RegexTopBar } from '@/components/regex-tester/RegexTopBar';
import { RegexWorkbench } from '@/components/regex-tester/RegexWorkbench';

export default function RegexTester() {
  const { t, isFr } = useLocale();
  const title = t.tools['regex-tester']?.title ?? 'Regex Tester';
  const desc =
    t.tools['regex-tester']?.description ??
    'Test and debug regular expressions in real-time with pattern presets, cheat sheet, and match explanations.';

  const workflow = useRegexTesterWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home ?? 'Home',
        t.nav.breadcrumb.textCode ?? 'Data & Code',
        title,
      ]}
      title={title}
      description={desc}
      seoSlug="regex-tester"
    >
      <div className="w-full space-y-4">
        <RegexTopBar
          pattern={workflow.pattern}
          onPatternChange={workflow.setPattern}
          patternInputRef={workflow.patternInputRef}
          flags={workflow.flags}
          onToggleFlag={workflow.toggleFlag}
          activeFlagsCount={workflow.activeFlagsCount}
          flagOptions={workflow.flagOptions}
          presets={workflow.presets}
          showPresetsMenu={workflow.showPresetsMenu}
          onShowPresetsMenuChange={workflow.setShowPresetsMenu}
          onApplyPreset={workflow.handleApplyPreset}
          isValid={workflow.isValid}
          errorMsg={workflow.errorMsg}
          isFr={isFr}
        />

        <RegexWorkbench workflow={workflow} isFr={isFr} />
      </div>
    </ToolPageLayout>
  );
}
