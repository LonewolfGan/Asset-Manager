import { Helmet } from 'react-helmet-async';

const S = {
  page: {
    padding: '48px 0 80px',
    fontFamily: 'var(--font-ui)',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 400,
    margin: '0 0 8px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  date: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-tertiary)',
    margin: '0 0 48px',
  } as React.CSSProperties,
  section: {
    marginBottom: 40,
  } as React.CSSProperties,
  h2: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    margin: '0 0 12px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  p: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 12px',
  } as React.CSSProperties,
  ul: {
    paddingLeft: 20,
    margin: '0 0 12px',
  } as React.CSSProperties,
  li: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: 6,
  } as React.CSSProperties,
  email: {
    color: 'var(--accent)',
    textDecoration: 'none',
  } as React.CSSProperties,
  callout: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    marginBottom: 16,
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
  } as React.CSSProperties,
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

export default function Security() {
  return (
    <>
      <Helmet>
        <title>Security — EverydayTools Hub</title>
        <meta name="description" content="Our security practices, responsible disclosure policy, and how to report a vulnerability." />
        <link rel="canonical" href="https://everydaytools.qzz.io/security" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/security" />
      </Helmet>

      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>Security</h1>
        <p style={S.date}>Updated May 2026</p>

        <section style={S.section}>
          <h2 style={S.h2}>Reporting a vulnerability</h2>
          <p style={S.p}>
            If you discover a security vulnerability in EverydayTools, please report it responsibly
            by emailing{' '}
            <a href="mailto:security@everydaytools.app" style={S.email}>
              security@everydaytools.app
            </a>.
          </p>
          <p style={S.p}>Please include:</p>
          <ul style={S.ul}>
            <li style={S.li}>A description of the vulnerability</li>
            <li style={S.li}>Steps to reproduce the issue</li>
            <li style={S.li}>The potential impact</li>
            <li style={S.li}>Any suggested remediation (optional)</li>
          </ul>
          <p style={S.p}>
            We will acknowledge your report within 48 hours and keep you informed throughout the
            resolution process. We do not currently offer a bug bounty program, but we deeply
            appreciate responsible disclosure.
          </p>
          <div style={S.callout}>
            A machine-readable security contact is also available at{' '}
            <a href="/.well-known/security.txt" style={S.email}>
              /.well-known/security.txt
            </a>{' '}
            per{' '}
            <a
              href="https://securitytxt.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={S.email}
            >
              RFC 9116
            </a>.
          </div>
        </section>

        <hr style={S.divider} />

        <section style={S.section}>
          <h2 style={S.h2}>Our security practices</h2>
          <ul style={S.ul}>
            <li style={S.li}>
              <strong>All file processing is client-side only.</strong> Your files are processed
              entirely in your browser using WebAssembly and Web APIs. No file data is ever
              transmitted to our servers.
            </li>
            <li style={S.li}>
              <strong>Content Security Policy.</strong> Strict CSP headers are enforced on every
              response, blocking inline script injection, unauthorized third-party resources, and
              framing attacks.
            </li>
            <li style={S.li}>
              <strong>HSTS.</strong> Strict-Transport-Security with a two-year max-age and
              preload is set to enforce HTTPS on all connections.
            </li>
            <li style={S.li}>
              <strong>No tracking cookies.</strong> We use Plausible Analytics — cookieless, no
              personal data collected, EU-hosted. No consent banner is required.
            </li>
            <li style={S.li}>
              <strong>No data retention.</strong> We have no user accounts, no database, and store
              no file content. localStorage is used only for UI preferences (theme, locale) and
              currency rate caching with a 1-hour TTL.
            </li>
            <li style={S.li}>
              <strong>Input sanitization.</strong> All HTML rendered in the browser from user
              files is sanitized with DOMPurify before display.
            </li>
            <li style={S.li}>
              <strong>Dependency scanning.</strong> Dependencies are audited regularly for known
              CVEs. Critical and high-severity vulnerabilities are remediated before deployment.
            </li>
          </ul>
        </section>

        <hr style={S.divider} />

        <section style={S.section}>
          <h2 style={S.h2}>Security headers</h2>
          <p style={S.p}>
            You can verify our security header configuration independently:
          </p>
          <ul style={S.ul}>
            <li style={S.li}>
              <a
                href="https://securityheaders.com/?q=everydaytools.app"
                target="_blank"
                rel="noopener noreferrer"
                style={S.email}
              >
                securityheaders.com
              </a>
            </li>
            <li style={S.li}>
              <a
                href="https://observatory.mozilla.org/analyze/everydaytools.app"
                target="_blank"
                rel="noopener noreferrer"
                style={S.email}
              >
                Mozilla Observatory
              </a>
            </li>
          </ul>
        </section>

        <hr style={S.divider} />

        <section style={S.section}>
          <h2 style={S.h2}>Scope</h2>
          <p style={S.p}>The following are considered in scope for vulnerability reports:</p>
          <ul style={S.ul}>
            <li style={S.li}>The everydaytools.app web application</li>
            <li style={S.li}>Client-side processing logic (XSS, data leakage, logic errors)</li>
            <li style={S.li}>Security header misconfiguration</li>
          </ul>
          <p style={S.p}>Out of scope:</p>
          <ul style={S.ul}>
            <li style={S.li}>Denial-of-service attacks against our hosting infrastructure</li>
            <li style={S.li}>Social engineering of EverydayTools personnel</li>
            <li style={S.li}>Vulnerabilities in third-party services (Plausible, Vercel)</li>
          </ul>
        </section>
      </div>
    </>
  );
}
