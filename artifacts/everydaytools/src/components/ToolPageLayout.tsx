import type { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';
import AdSlot from './AdSlot';
import { ToolPageSEO } from './ToolPageSEO';

interface ToolPageLayoutProps {
  breadcrumb: string[];
  title: string;
  description: string;
  seoSlug: string;
  children: ReactNode;
}

/**
 * ToolPageLayout — shared full‑width layout for every tool page.
 *
 * Provides:
 *   • Full‑width wrapper with responsive horizontal padding
 *   • Centered content region capped at --content-tool (1200px)
 *   • Clean hero area (breadcrumb, title, description)
 *   • Slot for tool content
 *   • Horizontal AdSlot at the bottom
 *   • ToolPageSEO (meta, related tools, about, how‑it‑works, FAQ)
 */
export default function ToolPageLayout({
  breadcrumb,
  title,
  description,
  seoSlug,
  children,
}: ToolPageLayoutProps) {
  return (
    <>
      <div
        style={{
          width: '100%',
          padding: `40px var(--tool-padding-x) 0`,
          boxSizing: 'border-box',
        }}
      >
          <Breadcrumb items={breadcrumb} />

          {/* Hero section */}
          <div
            style={{
              marginTop: 28,
              marginBottom: 48,
              paddingBottom: 40,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 16px',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xl)',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
                maxWidth: '72ch',
              }}
            >
              {description}
            </p>
          </div>

          {/* Tool content */}
          {children}

          {/* Ad slot */}
          <div style={{ marginTop: 56, paddingBottom: 96 }}>
            <AdSlot type="horizontal" />
          </div>
      </div>

      {/* SEO sections: related tools, about, how‑it‑works, FAQ */}
      <ToolPageSEO internalSlug={seoSlug} />
    </>
  );
}
