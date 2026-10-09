import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useUrlEncoderWorkflow } from '@/hooks/use-url-encoder-workflow';
import { UrlWorkbench } from '@/components/url-encoder';

export default function UrlEncoder() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';
  const title =
    t.tools['url-encoder']?.title ??
    (isFr ? 'Encodeur / Décodeur URL' : 'URL Encoder / Decoder');
  const desc =
    t.tools['url-encoder']?.description ??
    (isFr
      ? 'Encodez et décodez les chaînes URL, composants URI et paramètres de requête en temps réel avec inspection détaillée.'
      : 'Encode and decode URL strings, URI components, and query parameters in real time with deep parameter inspection.');

  const workflow = useUrlEncoderWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="url-encoder"
    >
      <UrlWorkbench
        isFr={isFr}
        workflow={workflow}
        copiedLabel={t.common.copied}
      />
    </ToolPageLayout>
  );
}
