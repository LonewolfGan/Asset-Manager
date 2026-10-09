import React from 'react';
import { ArrowDown, ArrowUp, Zap, Activity } from 'lucide-react';
import type { TestPhase } from '@/hooks/use-speed-test-workflow';

interface SpeedTestTelemetryStripProps {
  phase: TestPhase;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  jitter: number | null;
  isFr: boolean;
}

export const SpeedTestTelemetryStrip: React.FC<SpeedTestTelemetryStripProps> = ({
  phase,
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  isFr,
}) => {
  return (
    <div className="mt-10 pt-6 border-t border-border/60">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60 text-center">
        {/* 1. Download */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isFr ? 'Téléchargement' : 'Download'}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
              {downloadSpeed !== null ? downloadSpeed.toFixed(1) : '--'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">Mbps</span>
          </div>
          {phase === 'download' && (
            <span className="w-8 h-0.5 bg-[#FF6B35] rounded-full mt-2 animate-pulse" />
          )}
        </div>

        {/* 2. Upload */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isFr ? 'Envoi' : 'Upload'}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
              {uploadSpeed !== null ? uploadSpeed.toFixed(1) : '--'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">Mbps</span>
          </div>
          {phase === 'upload' && (
            <span className="w-8 h-0.5 bg-[#FF6B35] rounded-full mt-2 animate-pulse" />
          )}
        </div>

        {/* 3. Latency / Ping */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isFr ? 'Latence (Ping)' : 'Latency (Ping)'}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
              {ping !== null ? ping : '--'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">ms</span>
          </div>
          {phase === 'ping' && (
            <span className="w-8 h-0.5 bg-[#FF6B35] rounded-full mt-2 animate-pulse" />
          )}
        </div>

        {/* 4. Jitter */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isFr ? 'Gigue (Jitter)' : 'Jitter'}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
              {jitter !== null ? jitter : '--'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
