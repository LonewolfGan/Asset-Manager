import { Link } from 'wouter';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

const TOOL_COLUMNS_KEYS = [
  {
    key: "pdf" as const,
    links: [
      { slug: "pdf-to-word", href: "/pdf-to-word" },
      { slug: "pdf-to-text", href: "/pdf-to-text" },
      { slug: "pdf-compress", href: "/pdf-compress" },
      { slug: "pdf-merge", href: "/pdf-merge" },
      { slug: "pdf-split", href: "/pdf-split" },
      { slug: "pdf-protect", href: "/pdf-protect" },
    ],
  },
  {
    key: "images" as const,
    links: [
      { slug: "image-converter", href: "/image-converter" },
      { slug: "background-remover", href: "/background-remover" },
      { slug: "image-compress", href: "/image-compress" },
      { slug: "image-resize", href: "/image-resize" },
      { slug: "heic-to-jpg", href: "/heic-to-jpg" },
      { slug: "image-to-pdf", href: "/image-to-pdf" },
    ],
  },
  {
    key: "utilities" as const,
    links: [
      { slug: "metadata-cleaner", href: "/metadata-cleaner" },
      { slug: "ai-text-scrubber", href: "/ai-text-scrubber" },
      { slug: "password-generator", href: "/password-generator" },
      { slug: "currency-converter", href: "/currency-converter" },
      { slug: "unit-converter", href: "/unit-converter" },
      { slug: "percentage-calc", href: "/percentage-calc" },
    ],
  },
];

export default function Footer() {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  const manageConsent = () => {
    window.dispatchEvent(new Event('et:show-consent'));
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-elevated)',
      fontFamily: 'var(--font-ui)',
      marginTop: 'auto',
    }}>
      {/* 4-column grid: brand + 3 tool categories */}
      <div
        className="container-wide"
        style={{
          paddingTop: isMobile ? 48 : 72,
          paddingBottom: isMobile ? 48 : 72,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr',
          gap: isMobile ? '40px 32px' : '0 40px',
        }}
      >
        {/* Brand — spans full width on mobile */}
        <div style={{
          gridColumn: isMobile ? '1 / -1' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', width: 'fit-content' }}>
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="var(--bg-surface)"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="var(--accent)"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="var(--text-primary)"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="var(--text-primary)"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              EverydayTools
            </span>
          </Link>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: 0,
            maxWidth: 240,
          }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Tool link columns */}
        {TOOL_COLUMNS_KEYS.map((col) => (
          <div key={col.key}>
            <p style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 16px',
            }}>
              {t.footer.columns[col.key]}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 120ms ease',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {t.nav.links[l.slug] ?? l.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="container-wide"
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: isMobile ? 16 : 20,
          paddingBottom: isMobile ? 20 : 24,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 12 : 16,
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          &copy; {new Date().getFullYear()} EverydayTools Hub. {t.footer.rights}
        </span>
        <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: isMobile ? '8px 20px' : 24 }}>
          {[
            { label: t.footer.privacyPolicy, href: '/privacy' },
            { label: t.footer.termsOfService, href: '/terms' },
            { label: t.footer.security, href: '/security' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textDecoration: 'none',
                transition: 'color 120ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={manageConsent}
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-ui)',
              transition: 'color 120ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')}
          >
            {t.footer.cookiePreferences}
          </button>
        </nav>
      </div>
    </footer>
  );
}
