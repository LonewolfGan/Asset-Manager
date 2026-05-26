interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <div style={{ marginTop: 20 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{pct}%</span>
        </div>
      )}
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%', height: 3, background: 'var(--bg-hover)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 80ms linear' }} />
      </div>
    </div>
  );
}
