import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { useAiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';
import { AiScrubberWorkbench } from '@/components/ai-text-scrubber';

export default function AiTextScrubber() {
  const { t, locale } = useLocale();
  const tc = t.aiTextScrubber;
  const isFr = locale === 'FR';

  const workflow = useAiScrubberWorkflow(isFr);

  const title =
    t.tools['ai-text-scrubber']?.title ??
    (isFr ? 'Purificateur de texte IA' : 'AI Text Scrubber');
  const desc =
    t.tools['ai-text-scrubber']?.description ??
    (isFr
      ? 'Supprimez les caractères invisibles, tirets cadratins, clichés et symboles IA pour obtenir un texte fluide et naturel.'
      : 'Remove invisible zero-width characters, AI em-dashes, clichés, and decorative symbols for natural text.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.privacy, title]}
      title={title}
      description={desc}
      seoSlug="ai-text-scrubber"
    >
      <ToolWorkspace noGrid={true}>
        <AiScrubberWorkbench
          workflow={workflow}
          isFr={isFr}
          placeholder={tc.placeholder}
          cleanedOutputLabel={tc.cleanedOutput}
          copyLabel={tc.copy}
          copiedLabel={t.common.copied}
          disclaimer={tc.disclaimer}
        />
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
