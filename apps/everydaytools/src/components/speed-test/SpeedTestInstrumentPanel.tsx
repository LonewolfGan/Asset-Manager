import React from 'react';
import { Play, RotateCcw, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import type { SpeedTestAssessment } from '@/lib/speed-test-logic';
import type { TestPhase } from '@/hooks/use-speed-test-workflow';
import { SpeedTestDial } from './SpeedTestDial';
import { SpeedTestWaveform } from './SpeedTestWaveform';
import { SpeedTestTelemetryStrip } from './SpeedTestTelemetryStrip';

interface SpeedTestInstrumentPanelProps {
  phase: TestPhase;
  currentSpeed: number;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  jitter: number | null;
  assessment: SpeedTestAssessment | null;
  waveform: number[];
  errorMessage: string | null;
  isFr: boolean;
  onRunTest: () => void;
  onCancelTest: () => void;
  getSummaryText: () => string;
}

export const SpeedTestInstrumentPanel: React.FC<SpeedTestInstrumentPanelProps> = ({
  phase,
  currentSpeed,
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  assessment,
  waveform,
  errorMessage,
  isFr,
  onRunTest,
  onCancelTest,
  getSummaryText,
}) => {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden p-6 sm:p-10">
      {/* Speedometer Visualizer Area */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        <SpeedTestDial
          phase={phase}
          currentSpeed={currentSpeed}
          downloadSpeed={downloadSpeed}
          ping={ping}
          isFr={isFr}
        />

        {/* Live Packet Waveform during stream */}
        {(phase === 'download' || phase === 'upload') && (
          <SpeedTestWaveform waveform={waveform} isFr={isFr} />
        )}

        {/* Action Buttons: Clean & Ergonomic */}
        <div className="mt-6 flex items-center gap-3">
          {phase === 'idle' && downloadSpeed === null && (
            <Button
              size="md"
              onClick={onRunTest}
              className="bg-[#FF6B35] hover:bg-[#E55A25] text-white font-medium px-8 h-11 rounded-xl shadow-sm text-sm"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {isFr ? 'Démarrer le test' : 'Start Speed Test'}
            </Button>
          )}

          {(phase === 'ping' || phase === 'download' || phase === 'upload') && (
            <Button
              variant="outline"
              size="md"
              onClick={onCancelTest}
              className="rounded-xl border-border/80 text-muted-foreground hover:text-foreground text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              {isFr ? 'Annuler' : 'Cancel'}
            </Button>
          )}

          {(phase === 'complete' || phase === 'error' || (phase === 'idle' && downloadSpeed !== null)) && (
            <div className="flex items-center gap-3">
              <Button
                size="md"
                onClick={onRunTest}
                className="bg-[#FF6B35] hover:bg-[#E55A25] text-white font-medium px-6 h-10 rounded-xl shadow-sm text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                {isFr ? 'Tester à nouveau' : 'Test Again'}
              </Button>

              {assessment && (
                <CopyButton
                  text={getSummaryText}
                  label={isFr ? 'Copier le rapport' : 'Copy Report'}
                  copiedLabel={isFr ? 'Rapport copié !' : 'Report Copied!'}
                  variant="default"
                  size="md"
                  className="rounded-xl font-sans"
                />
              )}
            </div>
          )}
        </div>

        {/* Error Message banner */}
        {phase === 'error' && errorMessage && (
          <div className="mt-4 w-full max-w-md p-3 rounded-xl border border-border bg-zinc-100/80 dark:bg-zinc-900/80 text-foreground flex items-center gap-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF6B35]" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Full-width Direct Telemetry Strip */}
      <SpeedTestTelemetryStrip
        phase={phase}
        downloadSpeed={downloadSpeed}
        uploadSpeed={uploadSpeed}
        ping={ping}
        jitter={jitter}
        isFr={isFr}
      />
    </div>
  );
};
