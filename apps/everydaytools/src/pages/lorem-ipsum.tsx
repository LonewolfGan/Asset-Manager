import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useLoremIpsumWorkflow } from '@/hooks/use-lorem-ipsum-workflow';
import {
  LoremCommandBar,
  LoremReadingCanvas,
  LoremTelemetryFooter,
} from '@/components/lorem-ipsum';

export default function LoremIpsum() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';
  const pageTitle =
    t.tools?.['lorem-ipsum']?.title ??
    (isFr ? 'Générateur de Lorem Ipsum' : 'Lorem Ipsum Generator');
  const pageDesc =
    t.tools?.['lorem-ipsum']?.description ??
    (isFr
      ? 'Générez et copiez instantanément vos faux-textes de composition en quelques clics.'
      : 'Instantly generate and copy placeholder text for your mockups and designs.');

  const {
    unit,
    count,
    flavor,
    format,
    startWithClassic,
    setCount,
    setFlavor,
    setFormat,
    setStartWithClassic,
    isRefreshing,
    blocks,
    fullText,
    stats,
    handleRegenerate,
    handleCountChange,
    handleUnitSelect,
    handleApplyPreset,
    handleDownload,
  } = useLoremIpsumWorkflow();

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="lorem-ipsum"
    >
      <div className="w-full pb-16">
        <div className="w-full rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          {/* Barre de commande supérieure unifiée */}
          <LoremCommandBar
            unit={unit}
            count={count}
            flavor={flavor}
            format={format}
            startWithClassic={startWithClassic}
            isRefreshing={isRefreshing}
            fullText={fullText}
            onUnitSelect={handleUnitSelect}
            onCountChange={handleCountChange}
            onCountSet={setCount}
            onFlavorChange={setFlavor}
            onFormatChange={setFormat}
            onToggleStartWithClassic={() => setStartWithClassic(!startWithClassic)}
            onApplyPreset={handleApplyPreset}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
            isFr={isFr}
          />

          {/* Feuille de lecture et blocs de texte */}
          <LoremReadingCanvas
            unit={unit}
            format={format}
            blocks={blocks}
            fullText={fullText}
            isFr={isFr}
          />

          {/* Télémétrie inférieure et raccourci clavier */}
          <LoremTelemetryFooter
            words={stats.words}
            chars={stats.chars}
            lines={stats.lines}
            format={format}
            isFr={isFr}
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
