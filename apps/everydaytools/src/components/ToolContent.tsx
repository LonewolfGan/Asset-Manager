import { ReactNode, useState } from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Download } from 'lucide-react';

// ─── ToolWorkspace ───────────────────────────────────────
/** Wraps the tool content area, with optional grid background */
export function ToolWorkspace({ children, noGrid = false }: { children: ReactNode; noGrid?: boolean }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 24, width: '100%',
        position: 'relative',
      }}
    >
      {/* Subtle workspace texture */}
      {!noGrid && (
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
      )}
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

// ─── ToolButton (Unified with Shadcn Button) ─────────────
import { Button } from '@/components/ui/button';
export { Button as ToolButton };

// ─── ToolBadge ──────────────────────────────────────────
interface ToolBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
}

export function ToolBadge({ children, variant = 'neutral' }: ToolBadgeProps) {
  const colors: Record<string, { bg: string; fg: string; dot: string }> = {
    success: { bg: 'color-mix(in srgb, var(--success) 10%, transparent)', fg: 'var(--success)', dot: 'var(--success)' },
    error:    { bg: 'color-mix(in srgb, var(--danger) 10%, transparent)', fg: 'var(--danger)', dot: 'var(--danger)' },
    warning:  { bg: 'color-mix(in srgb, var(--warning) 10%, transparent)', fg: 'var(--warning)', dot: 'var(--warning)' },
    info:     { bg: 'color-mix(in srgb, var(--text-secondary) 10%, transparent)', fg: 'var(--text-secondary)', dot: 'var(--text-secondary)' },
    neutral:  { bg: 'var(--bg-elevated)', fg: 'var(--text-tertiary)', dot: 'var(--text-tertiary)' },
  };

  const c = colors[variant];

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 10px 2px 7px',
        borderRadius: 'var(--radius-pill)',
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
            width: 48, height: 48, borderRadius: 'var(--radius-card)',
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
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, progress))}%`,
            background: 'var(--accent)',
            borderRadius: 'var(--radius-pill)',
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
  return (
    <CopyButton
      text={value}
      label={label}
      copiedLabel="Copied"
      onCopy={onCopy}
      variant="default"
      size="sm"
    />
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
        borderRadius: 'var(--radius-md)',
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
      <Download size={11} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
