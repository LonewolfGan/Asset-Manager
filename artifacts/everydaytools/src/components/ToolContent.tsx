import { ReactNode, useState } from 'react';

// ─── ToolWorkspace ───────────────────────────────────────
/** Wraps the tool content area with a subtle grid background */
export function ToolWorkspace({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 24, width: '100%',
        position: 'relative',
      }}
    >
      {/* Subtle workspace texture */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          opacity: 0.3,
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </div>
  );
}

// ─── ToolCard ────────────────────────────────────────────
interface ToolCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'settings' | 'result';
  padding?: string;
}

export function ToolCard({
  title, icon, children, actions,
  variant = 'default', padding = '20px',
}: ToolCardProps) {
  const boxShadow: Record<string, string> = {
    default: 'var(--shadow-sm)',
    settings: 'var(--shadow-sm)',
    result: '0 0 0 1px var(--accent-subtle, rgba(255,107,53,0.15))',
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        transition: 'box-shadow 200ms ease',
        background: 'var(--bg-surface)',
        border: variant === 'result'
          ? '1px solid var(--accent)'
          : '1px solid var(--border)',
        boxShadow: boxShadow[variant],
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon && (
              <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex', lineHeight: 1 }}>
                {icon}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              {title}
            </span>
          </div>
          {actions}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

// ─── ToolPanel (input / output) ──────────────────────────
interface ToolPanelProps {
  label: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  error?: string;
  accent?: boolean;
}

export function ToolPanel({
  label, children, actions, footer, error, accent,
}: ToolPanelProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        border: `1px solid ${
          error ? 'var(--danger)' : accent ? 'var(--accent)' : 'var(--border)'
        }`,
        background: 'var(--bg-surface)',
        transition: 'border-color 200ms ease',
        display: 'flex', flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
          minHeight: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: error ? 'var(--danger)' : 'var(--text-tertiary)',
            }}
          >
            {label}
          </span>
          {error && (
            <span
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                color: 'var(--danger)',
              }}
            >
              — {error}
            </span>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {actions}
          </div>
        )}
      </div>

      {/* Body */}
      {children}

      {/* Footer */}
      {footer && (
        <div
          style={{
            padding: '8px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            flexShrink: 0,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

// ─── ToolActionBar ───────────────────────────────────────
interface ToolActionBarProps {
  children: ReactNode;
  label?: string;
}

export function ToolActionBar({ children, label }: ToolActionBarProps) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '12px 20px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-tertiary)', marginRight: 4,
          }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

// ─── ToolSplitPane ───────────────────────────────────────
interface ToolSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  ratio?: string;
  mobileStack?: boolean;
}

export function ToolSplitPane({
  left, right, ratio = '1fr 1fr', mobileStack = true,
}: ToolSplitPaneProps) {
  return (
    <div
      className={mobileStack ? 'tool-split-pane' : ''}
      style={{
        display: 'grid',
        gridTemplateColumns: ratio,
        gap: 24,
        width: '100%',
        alignItems: 'start',
      }}
    >
      {left}
      {right}
    </div>
  );
}

// ─── ToolModeSwitch ─────────────────────────────────────
interface ToolModeSwitchProps<T extends string> {
  modes: T[];
  active: T;
  onChange: (mode: T) => void;
  labels?: Partial<Record<T, string>>;
  size?: 'sm' | 'md';
}

export function ToolModeSwitch<T extends string>({
  modes, active, onChange, labels, size = 'md',
}: ToolModeSwitchProps<T>) {
  const pad = size === 'sm' ? '5px 12px' : '7px 16px';
  const fSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--bg-base)',
        flexShrink: 0,
      }}
    >
      {modes.map((m, i) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            padding: pad,
            border: 'none',
            borderRight: i < modes.length - 1 ? '1px solid var(--border)' : 'none',
            background: active === m ? 'var(--accent)' : 'transparent',
            color: active === m ? 'var(--accent-text)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)', fontSize: fSize,
            fontWeight: active === m ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 120ms ease',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}
        >
          {labels?.[m] ?? m}
        </button>
      ))}
    </div>
  );
}

// ─── ToolButton ──────────────────────────────────────────
interface ToolButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

export function ToolButton({
  children, onClick, variant = 'primary', disabled, fullWidth, type = 'button', style,
}: ToolButtonProps) {
  const styleMap: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)', color: 'var(--accent-text)', border: 'none',
    },
    secondary: {
      background: 'var(--bg-surface)', color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'transparent', color: 'var(--danger)',
      border: '1px solid var(--border)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 20px',
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 150ms ease',
        width: fullWidth ? '100%' : 'auto',
        lineHeight: 1.4,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        justifyContent: 'center',
        ...styleMap[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') el.style.opacity = '0.88';
        else if (variant === 'secondary') el.style.borderColor = 'var(--accent)';
        else if (variant === 'danger') el.style.borderColor = 'var(--danger)';
        else el.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') el.style.opacity = '1';
        else if (variant === 'secondary') el.style.borderColor = 'var(--border)';
        else if (variant === 'danger') el.style.borderColor = 'var(--border)';
        else el.style.color = 'var(--text-secondary)';
      }}
    >
      {children}
    </button>
  );
}

// ─── ToolBadge ──────────────────────────────────────────
interface ToolBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
}

export function ToolBadge({ children, variant = 'neutral' }: ToolBadgeProps) {
  const colors: Record<string, { bg: string; fg: string; dot: string }> = {
    success: { bg: 'rgba(34,197,94,0.10)', fg: 'var(--success)', dot: '#22c55e' },
    error:    { bg: 'rgba(239,68,68,0.10)', fg: 'var(--danger)', dot: '#ef4444' },
    warning:  { bg: 'rgba(245,158,11,0.10)', fg: 'var(--warning)', dot: '#f59e0b' },
    info:     { bg: 'rgba(59,130,246,0.10)', fg: '#3b82f6', dot: '#3b82f6' },
    neutral:  { bg: 'var(--bg-elevated)', fg: 'var(--text-tertiary)', dot: 'var(--text-tertiary)' },
  };

  const c = colors[variant];

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 10px 2px 7px',
        borderRadius: 99,
        background: c.bg,
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
        color: c.fg,
        lineHeight: 1.6,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

// ─── ToolStat ────────────────────────────────────────────
interface ToolStatProps {
  label: string;
  value: string;
}

export function ToolStat({ label, value }: ToolStatProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)', marginRight: 4 }}>
        {label}:
      </span>
      {value}
    </span>
  );
}

// ─── ToolEmptyState ─────────────────────────────────────
interface ToolEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function ToolEmptyState({ icon, title, description }: ToolEmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12,
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)',
          fontWeight: 500, color: 'var(--text-primary)', margin: 0,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)', margin: 0, maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ─── ToolSegmentedControl ────────────────────────────────
interface ToolSegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}

export function ToolSegmentedControl<T extends string>({
  options, value, onChange, size = 'sm',
}: ToolSegmentedControlProps<T>) {
  const pad = size === 'sm' ? '5px 10px' : '7px 16px';
  const fSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      {options.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: pad,
            border: 'none',
            borderRight: i < options.length - 1 ? '1px solid var(--border)' : 'none',
            background: value === opt.value ? 'var(--accent)' : 'transparent',
            color: value === opt.value ? 'var(--accent-text)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)', fontSize: fSize,
            fontWeight: value === opt.value ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 120ms ease',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── ToolProgressBar ─────────────────────────────────────
interface ToolProgressBarProps {
  progress: number;
  label?: string;
}

export function ToolProgressBar({ progress, label }: ToolProgressBarProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '16px 20px',
      }}
    >
      {label && (
        <p
          style={{
            fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)', margin: '0 0 10px',
          }}
        >
          {label}
        </p>
      )}
      <div
        style={{
          height: 6,
          background: 'var(--border)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, progress))}%`,
            background: 'var(--accent)',
            borderRadius: 99,
            transition: 'width 250ms ease',
          }}
        />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)', margin: '6px 0 0',
          textAlign: 'right',
        }}
      >
        {progress}%
      </p>
    </div>
  );
}

// ─── ToolCopyButton ──────────────────────────────────────
interface ToolCopyButtonProps {
  value: string;
  label?: string;
  onCopy?: () => void;
}

export function ToolCopyButton({ value, label = 'Copy', onCopy }: ToolCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      onCopy?.();
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      style={{
        padding: '4px 10px',
        border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 6,
        background: copied ? 'var(--accent-subtle, rgba(255,107,53,0.08))' : 'transparent',
        fontFamily: 'var(--font-ui)', fontSize: 11,
        color: copied ? 'var(--accent)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        lineHeight: 1,
      }}
    >
      {copied ? '✓' : '⎘'} {copied ? 'Copied' : label}
    </button>
  );
}

// ─── ToolDownloadButton ──────────────────────────────────
interface ToolDownloadButtonProps {
  onClick: () => void;
  label?: string;
}

export function ToolDownloadButton({ onClick, label = 'Download' }: ToolDownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        padding: '4px 10px',
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'transparent',
        fontFamily: 'var(--font-ui)', fontSize: 11,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        lineHeight: 1,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
    >
      ⬇ {label}
    </button>
  );
}
