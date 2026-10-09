import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { TooltipProvider } from '@/components/ui/tooltip';
import { trackToolUsed } from '@/lib/analytics';
import { useUuidGeneratorWorkflow } from '@/hooks/use-uuid-generator-workflow';
import {
  UuidTabBar,
  UuidConfigBar,
  UuidFormatExportBar,
  UuidDisplayWorkbench,
  UuidInspectorWorkbench,
} from '@/components/uuid-generator';

export default function UuidGenerator() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const pageTitle =
    t.tools['uuid-generator']?.title ??
    (isFr ? 'Générateur d’UUID / GUID' : 'UUID / GUID Generator');
  const pageDesc =
    t.tools['uuid-generator']?.description ??
    (isFr
      ? 'Générez des identifiants universels uniques RFC 4122 (v4) et RFC 9562 (v7 horodaté) à l’unité ou en lot.'
      : 'Generate RFC 4122 (v4) and RFC 9562 (v7 timestamped) universally unique identifiers individually or in batches.');

  const {
    activeTab,
    version,
    count,
    hyphens,
    uppercase,
    enclosure,
    uuids,
    singleUuid,
    isRefreshing,
    inspectInput,
    inspectedData,
    setActiveTab,
    setVersion,
    setCount,
    setHyphens,
    setUppercase,
    setEnclosure,
    setInspectInput,
    generate,
    handleDownloadTxt,
    handleExportJson,
    handleExportCsv,
  } = useUuidGeneratorWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="uuid-generator"
    >
      <TooltipProvider>
        <div className="w-full">
          {/* Studio Atelier Pleine Largeur */}
          <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
            {/* Barre d'onglets : Générateur vs Inspecteur */}
            <UuidTabBar
              activeTab={activeTab}
              isFr={isFr}
              onTabChange={setActiveTab}
            />

            {activeTab === 'generator' ? (
              <div>
                {/* Configuration : Version, Quantité, Régénérer */}
                <UuidConfigBar
                  version={version}
                  count={count}
                  isRefreshing={isRefreshing}
                  isFr={isFr}
                  onVersionChange={setVersion}
                  onCountChange={setCount}
                  onGenerate={generate}
                />

                {/* Options : Tirets, Casse, Enveloppe, Copier tout, Exporter */}
                <UuidFormatExportBar
                  hyphens={hyphens}
                  uppercase={uppercase}
                  enclosure={enclosure}
                  uuids={uuids}
                  isFr={isFr}
                  onHyphensChange={setHyphens}
                  onUppercaseChange={setUppercase}
                  onEnclosureChange={setEnclosure}
                  onDownloadTxt={handleDownloadTxt}
                  onExportJson={handleExportJson}
                  onExportCsv={handleExportCsv}
                />

                {/* Atelier d'affichage : Monumental ou Registre de lot */}
                <UuidDisplayWorkbench
                  count={count}
                  uuids={uuids}
                  singleUuid={singleUuid}
                  isFr={isFr}
                  copiedLabel={t.common.copied}
                  onCopySingle={() => trackToolUsed('uuid-generator', 'copy-single')}
                />
              </div>
            ) : (
              /* Inspecteur structural RFC */
              <UuidInspectorWorkbench
                inspectInput={inspectInput}
                inspectedData={inspectedData}
                isFr={isFr}
                copiedLabel={t.common.copied}
                onInputChange={setInspectInput}
                onClearInput={() => setInspectInput('')}
              />
            )}
          </div>
        </div>
      </TooltipProvider>
    </ToolPageLayout>
  );
}
