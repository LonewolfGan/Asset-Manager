interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <div style={{ marginTop: 16 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
          <span style={{ fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', color: 'var(--muted)' }}>{pct}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: 6,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          borderRadius: 99,
          transition: 'width 0.15s ease',
        }} />
      </div>
    </div>
  );
}
