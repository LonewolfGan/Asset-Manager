import { AlertCircle, RotateCcw } from 'lucide-react';

export interface ToolLoadingStateProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  progress?: number;
  label?: string;
  steps?: string[];
  currentStep?: number;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function ToolLoadingState({
  status,
  progress,
  label,
  steps = [],
  currentStep = 0,
  errorMessage,
  onRetry,
}: ToolLoadingStateProps) {
  if (status === 'idle') return null;

  const safeProgress = typeof progress === 'number' ? Math.min(100, Math.max(0, Math.round(progress))) : undefined;
  const isIndeterminate = safeProgress === undefined;
  const currentMessage = steps[currentStep] ?? steps[0] ?? label ?? 'Processing…';

  if (status === 'loading') {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        role="status"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '20px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Header: spinner + step message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0, animation: 'tool-spin 0.75s linear infinite' }}
          >
            <circle
              cx="9"
              cy="9"
              r="7.5"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <path
              d="M9 1.5A7.5 7.5 0 0 1 16.5 9"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              flex: 1,
            }}
          >
            {currentMessage}
          </span>
          {!isIndeterminate && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                flexShrink: 0,
              }}
            >
              {safeProgress}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={currentMessage}
          style={{
            height: 5,
            background: 'var(--border)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {isIndeterminate ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '40%',
                height: '100%',
                background: 'var(--accent)',
                borderRadius: 'var(--radius-pill)',
                transformOrigin: 'left center',
                animation: 'tls-pulse 1.4s ease-in-out infinite',
              }}
            />
          ) : (
            <div
              style={{
                height: '100%',
                width: `${safeProgress}%`,
                background: 'var(--accent)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width 250ms ease',
              }}
            />
          )}
        </div>

        {/* Step indicator dots */}
        {steps.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
            aria-hidden="true"
          >
            {steps.map((step, i) => (
              <div
                key={i}
                title={step}
                style={{
                  width: i === currentStep ? 18 : 6,
                  height: 5,
                  borderRadius: 'var(--radius-pill)',
                  background: i < currentStep
                    ? 'var(--accent)'
                    : i === currentStep
                      ? 'var(--accent)'
                      : 'var(--border)',
                  opacity: i > currentStep ? 0.4 : 1,
                  transition: 'width 200ms ease, background 200ms ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          background: 'color-mix(in srgb, var(--success) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--success) 25%, transparent)',
          borderRadius: 'var(--radius-card)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7.5" fill="color-mix(in srgb, var(--success) 12%, transparent)" stroke="color-mix(in srgb, var(--success) 50%, transparent)" />
          <path d="M5 8l2 2 4-4" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--success)' }}>
          {label ?? 'Done'}
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          background: 'color-mix(in srgb, var(--danger) 5%, transparent)',
          border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
          borderRadius: 'var(--radius-card)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <AlertCircle
          size={16}
          style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }}
          aria-hidden="true"
        />
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--danger)',
              lineHeight: 1.5,
            }}
          >
            {errorMessage ?? 'Something went wrong. Please try again.'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid color-mix(in srgb, var(--danger) 40%, transparent)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--danger)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'border-color 150ms, background 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--danger) 8%, transparent)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--danger)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in srgb, var(--danger) 40%, transparent)';
            }}
          >
            <RotateCcw size={12} aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
