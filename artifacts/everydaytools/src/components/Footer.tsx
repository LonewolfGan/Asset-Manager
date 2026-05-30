import { Link } from 'wouter';
import { useLocale } from '@/hooks/use-locale';

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

  const manageConsent = () => {
    window.dispatchEvent(new Event('et:show-consent'));
  };

  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg-surface)",
      fontFamily: "var(--font-ui)",
      marginTop: "auto",
    }}>
      {/* Main footer grid */}
      <div className="footer-grid" style={{
        maxWidth: "var(--content-wide)",
        margin: "0 auto",
        padding: "56px 24px 48px",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
        gap: 48,
      }}>
        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 16 }}>
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="#EDEDEE"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#FF6B35"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#1A1916"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#1A1916"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              EverydayTools
            </span>
          </Link>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 20px", maxWidth: 240 }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Tool link columns */}
        {TOOL_COLUMNS_KEYS.map((col) => (
          <div key={col.key}>
            <h3 style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 14px",
            }}>
              {t.footer.columns[col.key]}
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", transition: "color 120ms ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
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
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 24px",
        maxWidth: "var(--content-wide)",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          &copy; {new Date().getFullYear()} EverydayTools Hub. {t.footer.rights}
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { label: t.footer.privacyPolicy, href: "/privacy" },
            { label: t.footer.termsOfService, href: "/terms" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: 12, color: "var(--text-tertiary)", textDecoration: "none", transition: "color 120ms ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={manageConsent}
            style={{ fontSize: 12, color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-ui)", transition: "color 120ms ease" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
          >
            {t.footer.cookiePreferences}
          </button>
        </nav>
      </div>
    </footer>
  );
}
