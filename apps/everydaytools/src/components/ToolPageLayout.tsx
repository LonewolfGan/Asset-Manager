import type { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';
import AdSlot from './AdSlot';
import { ToolPageSEO } from './ToolPageSEO';
import { PageTitle, PageSubtitle } from './Typography';

interface ToolPageLayoutProps {
  breadcrumb: string[];
  title: ReactNode;
  description?: ReactNode;
  seoSlug?: string;
  actions?: ReactNode;
  hideAdSlot?: boolean;
  hideRelatedTools?: boolean;
  children: ReactNode;
}

/**
 * ToolPageLayout — shared layout for every tool page.
 * Keeps breadcrumb, title, and description, but removes the separation line for an open, airy layout.
 */
export default function ToolPageLayout({
  breadcrumb,
  title,
  description,
  seoSlug,
  actions,
  hideAdSlot = false,
  hideRelatedTools = false,
  children,
}: ToolPageLayoutProps) {
  return (
    <>
      <div
        className="container-wide"
        style={{
          paddingTop: '28px',
        }}
      >
        <Breadcrumb items={breadcrumb} />

        {/* Hero section (without borderBottom separation line) */}
        <div
          className="mt-4 mb-12 sm:mb-14 lg:mb-16"
          style={{
            ...(actions
              ? {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: 16,
                  flexWrap: 'wrap',
                }
              : {}),
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <PageTitle>{title}</PageTitle>
            {description && <PageSubtitle>{description}</PageSubtitle>}
          </div>
          {actions && <div>{actions}</div>}
        </div>

        {/* Tool content */}
        {children}

        {/* Ad slot */}
        {!hideAdSlot && (
          <div style={{ marginTop: 56, paddingBottom: 96 }}>
            <AdSlot type="horizontal" />
          </div>
        )}
      </div>

      {/* SEO sections: how‑it‑works, FAQ */}
      {seoSlug && <ToolPageSEO internalSlug={seoSlug} hideRelatedTools={hideRelatedTools} />}
    </>
  );
}
