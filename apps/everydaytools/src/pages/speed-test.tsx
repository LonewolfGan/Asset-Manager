import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useSpeedTestWorkflow } from '@/hooks/use-speed-test-workflow';
import {
  SpeedTestInstrumentPanel,
  SpeedTestDiagnosticCockpit,
} from '@/components/speed-test';

export default function SpeedTest() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';

  const {
    phase,
    currentSpeed,
    ping,
    jitter,
    downloadSpeed,
    uploadSpeed,
    assessment,
    waveform,
    errorMessage,
    runTest,
    cancelTest,
    getSummaryText,
  } = useSpeedTestWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.calculators,
        isFr ? 'Test de Débit' : 'Internet Speed Test',
      ]}
      title={isFr ? 'Test de Débit Internet & Latence' : 'Internet Speed & Latency Test'}
      description={
        isFr
          ? 'Mesurez en temps réel votre débit descendant, débit montant, latence de réponse et gigue avec une précision réseau professionnelle.'
          : 'Measure real-time download bandwidth, upload throughput, ping latency, and jitter with carrier-grade accuracy.'
      }
      seoSlug="speed-test"
    >
      <div className="w-full space-y-10">
        <SpeedTestInstrumentPanel
          phase={phase}
          currentSpeed={currentSpeed}
          downloadSpeed={downloadSpeed}
          uploadSpeed={uploadSpeed}
          ping={ping}
          jitter={jitter}
          assessment={assessment}
          waveform={waveform}
          errorMessage={errorMessage}
          isFr={isFr}
          onRunTest={runTest}
          onCancelTest={cancelTest}
          getSummaryText={getSummaryText}
        />

        {assessment && downloadSpeed !== null && ping !== null && (
          <SpeedTestDiagnosticCockpit
            assessment={assessment}
            downloadSpeed={downloadSpeed}
            uploadSpeed={uploadSpeed}
            ping={ping}
            isFr={isFr}
          />
        )}
      </div>
    </ToolPageLayout>
  );
}
