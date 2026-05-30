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
      borderTop: "1px solid var(--border)",
      background: "var(--bg-surface)",
      fontFamily: "var(--font-ui)",
      marginTop: "auto",
    }}>
      {/* Main footer grid */}
      <div style={{
        maxWidth: "var(--content-wide)",
        margin: "0 auto",
        padding: isMobile ? "40px 20px 32px" : "56px 24px 48px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 32 : 0,
      }}>
        {/* Brand column */}
        <div style={{ marginBottom: isMobile ? 0 : 40 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 12 }}>
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="#E7E7E7"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="#FF6B35"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="#111111"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="#111111"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              EverydayTools
            </span>
          </Link>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, maxWidth: 260 }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Tool link columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: isMobile ? "28px 24px" : "0 48px",
        }}>
          {TOOL_COLUMNS_KEYS.map((col) => (
            <div key={col.key}>
              <h3 style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                margin: "0 0 12px",
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
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: isMobile ? "14px 20px" : "16px 24px",
        maxWidth: "var(--content-wide)",
        margin: "0 auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 10 : 12,
      }}>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          &copy; {new Date().getFullYear()} EverydayTools Hub. {t.footer.rights}
        </span>
        <nav style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: isMobile ? "8px 16px" : 20 }}>
          {[
            { label: t.footer.privacyPolicy, href: "/privacy" },
            { label: t.footer.termsOfService, href: "/terms" },
            { label: t.footer.security, href: "/security" },
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
