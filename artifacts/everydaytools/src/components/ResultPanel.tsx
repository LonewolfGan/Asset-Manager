import { CheckCircle2, Download, Copy } from 'lucide-react';
import { useState } from 'react';
import { copyWithToast } from '@/utils/copy';

interface ResultPanelProps {
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  blob: Blob;
  textOutput?: string;
  warning?: string;
}

export default function ResultPanel({ filename, sizeBefore, sizeAfter, blob, textOutput, warning }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? (bytes / 1024).toFixed(1) + ' KB'
      : (bytes / 1024 / 1024).toFixed(2) + ' MB';

  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (textOutput) {
      await copyWithToast(textOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reduction = sizeBefore && sizeAfter < sizeBefore
    ? Math.round((1 - sizeAfter / sizeBefore) * 100)
    : null;

  return (
    <div style={{
      marginTop: 24,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
      }}>
        <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          Ready to download
        </span>
      </div>

      {/* File info */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-surface)' }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {filename}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
        }}>
          {sizeBefore && (
            <>
              <span style={{ textDecoration: 'line-through' }}>{formatSize(sizeBefore)}</span>
              <span>→</span>
            </>
          )}
          <span style={{ color: 'var(--text-primary)' }}>{formatSize(sizeAfter)}</span>
          {reduction !== null && (
            <span style={{
              color: 'var(--success)',
              background: 'rgba(34,197,94,0.10)',
              borderRadius: 3,
              padding: '1px 6px',
            }}>
              -{reduction}%
            </span>
          )}
        </div>
      </div>

      {/* Warning note */}
      {warning && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-xs)',
          color: 'var(--warning)',
          lineHeight: 1.5,
        }}>
          {warning}
        </div>
      )}

      {/* Download button */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-surface)' }}>
        <button
          onClick={handleDownload}
          aria-label={`Download ${filename}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 20px',
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
        >
          <Download size={14} aria-hidden="true" />
          Download {filename.split('.').pop()?.toUpperCase()}
        </button>
      </div>

      {/* Text output preview */}
      {textOutput && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}>
              Extracted Text
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleCopy}
                aria-label="Copy extracted text"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 12px',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >
                <Copy size={11} aria-hidden="true" />
                {copied ? 'Copied' : 'Copy all'}
              </button>
              <button
                onClick={handleDownload}
                aria-label="Download extracted text as .txt"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 12px',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              >
                <Download size={11} aria-hidden="true" />
                .txt
              </button>
            </div>
          </div>
          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            background: 'var(--bg-base)',
            margin: 0,
            padding: '12px 16px',
            overflowY: 'auto',
            maxHeight: 360,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}>
            {textOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
