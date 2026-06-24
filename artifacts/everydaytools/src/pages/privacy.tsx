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
  h3: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    margin: '16px 0 6px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  p: {
    margin: '0 0 12px',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  ul: {
    margin: '0 0 12px',
    paddingLeft: 20,
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  a: {
    color: 'var(--text-primary)',
    textDecoration: 'underline',
  } as React.CSSProperties,
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — EverydayTools Hub</title>
        <meta name="description" content="How EverydayTools Hub handles your data. All file processing runs in your browser — nothing is uploaded." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/privacy" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.date}>Last updated: May 26, 2025</p>

        <section style={S.section}>
          <h2 style={S.h2}>The short version</h2>
          <p style={S.p}>
            EverydayTools Hub is a browser-based utility suite. Every file you upload — PDFs, images, documents
            — is processed entirely inside your own browser using JavaScript. Nothing is ever sent to our servers.
            We do not have accounts, we do not collect your files or their contents, and we do not sell data.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>What we store in your browser</h2>
          <p style={S.p}>
            The following is saved only to your browser's localStorage and is never transmitted to us:
          </p>
          <ul style={S.ul}>
            <li>Your language preference (English or French)</li>
            <li>Your theme preference (dark or light)</li>
            <li>Currency exchange rates — cached for one hour to reduce external API calls</li>
            <li>Your cookie consent choice — stored for one year</li>
          </ul>
          <p style={S.p}>
            You can clear this data at any time by clearing your browser's site data or local storage.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Analytics</h2>
          <p style={S.p}>
            We use <a style={S.a} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
            a privacy-first, open-source analytics platform hosted in the EU. Plausible does not use cookies,
            does not collect personal data, and is exempt from GDPR, PECR, and CCPA consent requirements.
            It counts page views and custom events (e.g., which tool was used) using aggregated, non-identifiable
            data only.
          </p>
          <p style={S.p}>
            See <a style={S.a} href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer">Plausible's privacy policy</a> for full details.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Advertising</h2>
          <p style={S.p}>
            Ads keep all tools free. With your consent, we display ads served by{' '}
            <a style={S.a} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>.
            AdSense may use cookies and device identifiers to show personalised ads based on your browsing history
            across the web.
          </p>
          <p style={S.p}>
            If you click "Essential only" on the consent banner, no advertising cookies are set and only
            non-personalised ads (if any) may be shown. You can change this preference at any time via
            "Manage cookies" in the footer.
          </p>
          <p style={S.p}>
            You can also manage Google's ad personalisation directly at{' '}
            <a style={S.a} href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Third-party services</h2>
          <ul style={S.ul}>
            <li>
              <strong>Currency exchange rates</strong> — fetched from{' '}
              <a style={S.a} href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">open.er-api.com</a>.
              Only your IP address is incidentally exposed as part of the HTTP request; no other data is sent.
            </li>
            <li>
              <strong>AI background removal</strong> — the AI model (~40 MB) is downloaded from a CDN operated
              by <a style={S.a} href="https://img.ly" target="_blank" rel="noopener noreferrer">img.ly</a> and
              runs entirely in your browser using WebAssembly. Your images are not uploaded.
            </li>
            <li>
              <strong>Google Fonts</strong> — display and UI fonts are loaded from Google's servers. This exposes
              your IP address to Google as part of the font request.
            </li>
          </ul>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Your rights (GDPR / CCPA)</h2>
          <p style={S.p}>
            Because we do not collect personal data on our servers, most data subject rights (access, erasure,
            portability, rectification) are automatically satisfied — there is nothing for us to provide or delete.
            Any data stored locally in your browser is entirely under your control.
          </p>
          <p style={S.p}>
            EU and UK residents may withdraw consent for personalised advertising at any time using the
            "Manage cookies" link in the footer. California residents may opt out of the "sale" or "sharing"
            of personal data — as we do not sell data, this right is automatically satisfied.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Children</h2>
          <p style={S.p}>
            This service is not directed at children under 13 (or under 16 in the EU/UK). We do not knowingly
            process data from children. If you believe a child has provided personal data, please contact us.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Changes to this policy</h2>
          <p style={S.p}>
            We will update the date at the top of this page when our data practices change materially. Continued
            use of the service after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>Contact</h2>
          <p style={S.p}>
            Questions or concerns? Email us at{' '}
            <a style={S.a} href="mailto:privacy@everydaytoolshub.com">privacy@everydaytoolshub.com</a>.
          </p>
        </section>
      </div>
    </>
  );
}
