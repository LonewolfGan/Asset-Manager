import { Link } from 'wouter';

const TOOL_COLUMNS = [
  {
    heading: "PDF Tools",
    links: [
      { label: "PDF to Word", href: "/pdf-to-word" },
      { label: "PDF to Text", href: "/pdf-to-text" },
      { label: "Compress PDF", href: "/pdf-compress" },
      { label: "Merge PDFs", href: "/pdf-merge" },
      { label: "Split PDF", href: "/pdf-split" },
      { label: "Protect PDF", href: "/pdf-protect" },
    ],
  },
  {
    heading: "Image Tools",
    links: [
      { label: "Image Converter", href: "/image-converter" },
      { label: "Background Remover", href: "/background-remover" },
      { label: "Compress Image", href: "/image-compress" },
      { label: "Resize Image", href: "/image-resize" },
      { label: "HEIC to JPG", href: "/heic-to-jpg" },
      { label: "Image to PDF", href: "/image-to-pdf" },
    ],
  },
  {
    heading: "Utilities",
    links: [
      { label: "Metadata Cleaner", href: "/metadata-cleaner" },
      { label: "AI Text Scrubber", href: "/ai-text-scrubber" },
      { label: "Password Generator", href: "/password-generator" },
      { label: "Currency Converter", href: "/currency-converter" },
      { label: "Unit Converter", href: "/unit-converter" },
      { label: "Tip Calculator", href: "/percentage-calc" },
    ],
  },
];

export default function Footer() {
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
            A collection of browser-based tools for everyday file tasks. Fast, private, and free.
          </p>
        </div>

        {/* Tool link columns */}
        {TOOL_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 14px",
            }}>
              {col.heading}
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
                    {l.label}
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
          &copy; {new Date().getFullYear()} EverydayTools Hub. All rights reserved.
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
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
            Cookie Preferences
          </button>
        </nav>
      </div>
    </footer>
  );
}
