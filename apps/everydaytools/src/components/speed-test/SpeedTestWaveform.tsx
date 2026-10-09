import React from 'react';

interface SpeedTestWaveformProps {
  waveform: number[];
  isFr: boolean;
}

export const SpeedTestWaveform: React.FC<SpeedTestWaveformProps> = ({
  waveform,
  isFr,
}) => {
  if (waveform.length <= 2) return null;

  const maxVal = Math.max(10, ...waveform);
  const points = waveform
    .map((val, idx) => {
      const x = (idx / (waveform.length - 1)) * 320;
      const y = 22 - (val / maxVal) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full max-w-sm h-10 mt-3 flex flex-col items-center">
      <div className="w-full h-6 relative">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
        {isFr ? 'Flux en temps réel' : 'Real-time throughput'}
      </span>
    </div>
  );
};
