import React from 'react';
import type { TestPhase } from '@/hooks/use-speed-test-workflow';
import {
  DIAL_TICKS,
  DIAL_CX,
  DIAL_CY,
  DIAL_R,
  DIAL_ARC_LENGTH,
  speedToNormalized,
} from '@/lib/speed-test-dial-logic';

interface SpeedTestDialProps {
  phase: TestPhase;
  currentSpeed: number;
  downloadSpeed: number | null;
  ping: number | null;
  isFr: boolean;
}

export const SpeedTestDial: React.FC<SpeedTestDialProps> = ({
  phase,
  currentSpeed,
  downloadSpeed,
  ping,
  isFr,
}) => {
  const currentNormalized = speedToNormalized(currentSpeed);
  const strokeDashoffset = DIAL_ARC_LENGTH * (1 - currentNormalized);

  return (
    <div className="relative w-full max-w-[340px] aspect-[280/215] flex items-center justify-center">
      <svg viewBox="0 0 280 220" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="speedDialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF8C42" />
          </linearGradient>
        </defs>

        {/* Dial Track Arc */}
        <circle
          cx={DIAL_CX}
          cy={DIAL_CY}
          r={DIAL_R}
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
          strokeWidth="8"
          strokeDasharray={`${DIAL_ARC_LENGTH} 600`}
          strokeLinecap="round"
          transform={`rotate(150 ${DIAL_CX} ${DIAL_CY})`}
        />

        {/* Dial Active Progress Arc */}
        <circle
          cx={DIAL_CX}
          cy={DIAL_CY}
          r={DIAL_R}
          fill="none"
          stroke="url(#speedDialGrad)"
          strokeWidth="8"
          strokeDasharray={`${DIAL_ARC_LENGTH} 600`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(150 ${DIAL_CX} ${DIAL_CY})`}
          style={{
            transition: 'stroke-dashoffset 140ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        />

        {/* Calibration Graduation Ticks */}
        {DIAL_TICKS.map((tick) => {
          const norm = speedToNormalized(tick.val);
          const angleDeg = 150 + norm * 240;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x1 = DIAL_CX + 80 * Math.cos(angleRad);
          const y1 = DIAL_CY + 80 * Math.sin(angleRad);
          const x2 = DIAL_CX + 86 * Math.cos(angleRad);
          const y2 = DIAL_CY + 86 * Math.sin(angleRad);
          const tx = DIAL_CX + 70 * Math.cos(angleRad);
          const ty = DIAL_CY + 70 * Math.sin(angleRad);

          return (
            <g key={tick.val}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-zinc-300 dark:text-zinc-700"
                strokeWidth="1.5"
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[9px] font-mono select-none"
              >
                {tick.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Central Numerical Telemetry Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
        <span className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tight text-foreground tabular-nums select-none">
          {phase === 'ping' ? (
            <span className="text-4xl sm:text-5xl text-muted-foreground">{ping ?? '--'}</span>
          ) : phase === 'idle' && downloadSpeed === null ? (
            '0.0'
          ) : (
            currentSpeed.toFixed(1)
          )}
        </span>

        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1 select-none">
          {phase === 'ping' ? (isFr ? 'ms (Latence)' : 'ms (Latency)') : 'Mbps'}
        </span>
      </div>
    </div>
  );
};
