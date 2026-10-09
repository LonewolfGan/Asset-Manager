import React from 'react';
import { CheckCircle2, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';

export interface ResultPanelProps {
  filename: string;
  sizeBefore?: number;
  sizeAfter?: number;
  blob?: Blob;
  downloadUrl?: string;
  onDownload?: () => void;
  onReset?: () => void;
  textOutput?: string;
  warning?: string;
  actionLabel?: string;
  resetLabel?: string;
}

export default function ResultPanel({
  filename,
  sizeBefore,
  sizeAfter,
  blob,
  downloadUrl,
  onDownload,
  onReset,
  textOutput,
  warning,
  actionLabel,
  resetLabel,
}: ResultPanelProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const url = downloadUrl || (blob ? URL.createObjectURL(blob) : undefined);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (blob && !downloadUrl) {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const hasCompression =
    typeof sizeBefore === 'number' &&
    typeof sizeAfter === 'number' &&
    sizeBefore > 0 &&
    sizeAfter < sizeBefore;

  const reductionPct = hasCompression
    ? Math.round((1 - (sizeAfter as number) / (sizeBefore as number)) * 100)
    : 0;

  return (
    <div
      style={{
        marginTop: 24,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
      data-testid="result-panel"
    >
      {/* Success banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Your file is ready
        </span>
      </div>

      {/* Compression summary or clean file size */}
      {hasCompression ? (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          {formatSize(sizeBefore as number)} → {formatSize(sizeAfter as number)} ·{' '}
          <span style={{ color: 'var(--success)', fontWeight: 500 }}>
            {reductionPct}% smaller
          </span>
        </p>
      ) : typeof sizeAfter === 'number' && sizeAfter > 0 ? (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          File size: {formatSize(sizeAfter)}
        </p>
      ) : null}

      {/* Warning message if any */}
      {warning && (
        <div
          role="status"
          style={{
            padding: '10px 14px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-xs)',
            color: 'var(--warning)',
          }}
        >
          {warning}
        </div>
      )}

      {/* Optional text output (e.g. extracted text) */}
      {textOutput && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '12px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-primary)',
            }}
          >
            {textOutput}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <CopyButton
              text={textOutput}
              label="Copy text"
              copiedLabel="Copied"
              size="sm"
              variant="default"
            />
          </div>
        </div>
      )}

      {/* Primary Download CTA & Reset */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleDownload}
          aria-label={actionLabel || `Download ${filename}`}
        >
          <Download size={18} />
          <span>{actionLabel || `Download ${filename}`}</span>
        </Button>

        {onReset && (
          <Button variant="ghost" size="md" fullWidth onClick={onReset}>
            <RotateCcw size={14} />
            {resetLabel || 'Process another file'}
          </Button>
        )}
      </div>
    </div>
  );
}
