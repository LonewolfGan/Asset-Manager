import React from 'react';
import { Link } from 'wouter';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { ACCENT_BG, ACCENT_BORDER, type DashTool, type CategoryDef } from '@/lib/home-tools-data';

export interface ToolCardProps {
  tool: DashTool;
  cat?: CategoryDef;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { Icon } = tool;
  const tl = t.tools[tool.slug];
  const name = tl?.title ?? tool.name;
  const description = tl?.description ?? tool.description;

  return (
    <Link href={tool.route} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        data-testid="tool-card"
        className="tool-card"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = ACCENT_BORDER;
          el.style.boxShadow = 'var(--shadow-hover)';
          const tint = el.querySelector<HTMLElement>('.card-tint');
          if (tint) tint.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--border)';
          el.style.boxShadow = 'var(--shadow-sm)';
          const tint = el.querySelector<HTMLElement>('.card-tint');
          if (tint) tint.style.opacity = '0';
        }}
      >
        {/* Hover tint overlay */}
        <div
          className="card-tint"
          style={{
            position: 'absolute',
            inset: 0,
            background: ACCENT_BG,
            opacity: 0,
            transition: 'opacity 150ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Icon — top-left */}
        <div
          className="tool-card-icon"
          style={{
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: ACCENT_BG,
            color: 'var(--accent)',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <Icon size={22} strokeWidth={1.6} />
        </div>

        {/* Name + badge + description — left-aligned, natural top-to-bottom flow */}
        <div
          className="tool-card-text"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            className="tool-card-title"
            style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
          >
            <span
              style={{
                fontSize: isMobile ? '13px' : '15px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-ui)',
                lineHeight: 'inherit',
              }}
            >
              {name}
            </span>
            {tool.badge && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  background: ACCENT_BG,
                  color: 'var(--accent)',
                  lineHeight: 1.4,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: isMobile ? '11px' : '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: 'var(--font-ui)',
              width: '100%',
            }}
          >
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}
