import React from 'react';
import { Link } from 'wouter';
import type { LucideIcon } from 'lucide-react';

export interface SearchResultItemProps {
  slug: string;
  title: string;
  description: string;
  formats: string[];
  icon: LucideIcon;
  isActive: boolean;
  onNavigate: () => void;
  onMouseEnter: () => void;
}

export const SearchResultRow: React.FC<SearchResultItemProps> = ({
  slug,
  title,
  description,
  formats,
  icon: Icon,
  isActive,
  onNavigate,
  onMouseEnter,
}) => {
  return (
    <Link
      href={`/${slug}`}
      data-testid="search-result-item"
      role="option"
      aria-selected={isActive}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 16px',
        background: isActive ? 'var(--bg-elevated)' : 'transparent',
        textDecoration: 'none',
        transition: 'background 80ms ease',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive ? 'var(--bg-hover)' : 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'background 80ms ease, color 80ms ease',
        }}
      >
        <Icon size={15} strokeWidth={1.75} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.4,
            marginTop: 1,
          }}
        >
          {description}
        </div>
      </div>

      {formats.length > 0 && (
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {formats.slice(0, 3).map((f) => (
            <span
              key={f}
              style={{
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1px 5px',
                letterSpacing: '0.04em',
                lineHeight: 1.6,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};
