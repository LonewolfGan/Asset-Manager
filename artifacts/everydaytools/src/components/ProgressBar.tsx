interface ProgressBarProps {
  progress: number;
  label?: string;
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  // treat 0 or 100 as indeterminate (no real progress info)
  const indeterminate = pct === 0 || pct >= 100;
  const filled = indeterminate ? 0 : (pct / 100) * CIRCUMFERENCE;

  return (
    <div
      role="status"
      aria-label={label ? `${label} ${indeterminate ? "" : `${pct}%`}` : "Processing…"}
      style={{
        marginTop: 20,
        padding: "32px 24px 28px",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Spinner ring */}
      <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          aria-hidden="true"
          style={indeterminate ? { animation: "et-spin 900ms linear infinite", display: "block" } : { display: "block" }}
        >
          {/* Track */}
          <circle cx="26" cy="26" r={RADIUS} stroke="var(--border)" strokeWidth="3.5" />
          {/* Arc */}
          {indeterminate ? (
            <circle
              cx="26"
              cy="26"
              r={RADIUS}
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE * 0.28} ${CIRCUMFERENCE * 0.72}`}
              strokeDashoffset="0"
            />
          ) : (
            <circle
              cx="26"
              cy="26"
              r={RADIUS}
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE / 4}
              style={{ transition: "stroke-dasharray 120ms ease" }}
              transform="scale(1,-1) translate(0,-52)"
            />
          )}
        </svg>

        {/* Percentage inside circle */}
        {!indeterminate && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              letterSpacing: "-0.02em",
            }}
          >
            {pct}%
          </span>
        )}
      </div>

      {/* Label */}
      <span style={{
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        textAlign: "center",
        lineHeight: 1.4,
      }}>
        {label ?? "Processing…"}
      </span>

      {/* Determinate bar */}
      {!indeterminate && (
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-hidden="true"
          style={{ width: "100%", maxWidth: 260, height: 3, background: "var(--bg-hover)", borderRadius: 2 }}
        >
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--accent)",
            borderRadius: 2,
            transition: "width 100ms linear",
          }} />
        </div>
      )}

      {/* Indeterminate shimmer bar */}
      {indeterminate && (
        <div style={{ width: "100%", maxWidth: 260, height: 3, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: "40%",
            background: "var(--accent)",
            borderRadius: 2,
            animation: "et-shimmer 1.4s ease-in-out infinite",
          }} />
        </div>
      )}

      <style>{`
        @keyframes et-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes et-shimmer {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
