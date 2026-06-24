import type { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';
import AdSlot from './AdSlot';
import { ToolPageSEO } from './ToolPageSEO';
import { PageTitle, PageSubtitle } from './Typography';

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
        className="container-wide"
        style={{
          paddingTop: '40px',
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
            <PageTitle>{title}</PageTitle>
            <PageSubtitle>{description}</PageSubtitle>
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
