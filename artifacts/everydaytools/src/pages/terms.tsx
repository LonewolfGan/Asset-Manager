import { Helmet } from 'react-helmet-async';

const S = {
  page: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '48px 24px 80px',
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
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service — EverydayTools Hub</title>
        <meta name="description" content="Terms of service for EverydayTools Hub — free browser-based file conversion and productivity tools." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/terms" />
      </Helmet>
      <div style={S.page}>
        <h1 style={S.h1}>Terms of Service</h1>
        <p style={S.date}>Effective: May 26, 2025</p>

        <section style={S.section}>
          <h2 style={S.h2}>1. Acceptance of terms</h2>
          <p style={S.p}>
            By using EverydayTools Hub ("the Service"), you agree to these Terms of Service. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>2. Description of service</h2>
          <p style={S.p}>
            EverydayTools Hub provides a collection of free, browser-based utility tools including PDF conversion,
            image processing, text generation, unit conversion, and calculators. All file processing runs entirely
            in your browser using client-side JavaScript. No files are uploaded to our servers.
          </p>
          <p style={S.p}>
            The Service is provided free of charge and is supported by advertising revenue.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>3. Your files and data</h2>
          <p style={S.p}>
            Files you process using the Service remain on your device at all times. We have no access to your
            files, their contents, or any output you generate. You retain full ownership of any files you process.
          </p>
          <p style={S.p}>
            You are solely responsible for ensuring you have the right to process any files you upload to the
            browser-based tools, including compliance with applicable copyright and data protection laws.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>4. Acceptable use</h2>
          <p style={S.p}>You agree not to use the Service to:</p>
          <ul style={S.ul}>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe the intellectual property rights of others</li>
            <li>Process files containing child sexual abuse material or other illegal content</li>
            <li>Attempt to reverse-engineer, scrape, or overload the Service</li>
            <li>Use automated bots or scripts to access the Service at a rate that impairs others' use</li>
          </ul>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>5. Age requirement</h2>
          <p style={S.p}>
            You must be at least 13 years old (or 16 years old in the EU/UK) to use the Service.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>6. Intellectual property</h2>
          <p style={S.p}>
            The Service, its source code, design, and branding are the property of EverydayTools Hub. You may
            not reproduce, distribute, or create derivative works without prior written permission, except as
            permitted by applicable open-source licences covering individual components.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>7. Disclaimer of warranties</h2>
          <p style={S.p}>
            The Service is provided "as is" and "as available" without warranty of any kind, express or implied,
            including but not limited to warranties of merchantability, fitness for a particular purpose, or
            non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that
            output files will be accurate or suitable for any specific purpose.
          </p>
          <p style={S.p}>
            Always keep a backup of your original files. Some conversions (e.g., PDF compression, PDF to image)
            may reduce quality or remove features such as selectable text.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>8. Limitation of liability</h2>
          <p style={S.p}>
            To the maximum extent permitted by law, EverydayTools Hub and its operators shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits,
            or goodwill, arising from your use of or inability to use the Service.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>9. Third-party services</h2>
          <p style={S.p}>
            The Service may load resources from third parties (Google Fonts, Google AdSense, analytics providers,
            AI model CDNs). Your use of those services is subject to their respective terms and privacy policies.
            We are not responsible for the practices of third-party services.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>10. Changes to these terms</h2>
          <p style={S.p}>
            We reserve the right to modify these Terms at any time. Changes will be reflected by an updated
            effective date at the top of this page. Continued use of the Service after changes constitutes
            acceptance of the revised Terms.
          </p>
        </section>

        <hr style={S.hr} />

        <section style={S.section}>
          <h2 style={S.h2}>11. Contact</h2>
          <p style={S.p}>
            Questions about these Terms? Email us at{' '}
            <a href="mailto:legal@everydaytoolshub.com" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
              legal@everydaytoolshub.com
            </a>.
          </p>
        </section>
      </div>
    </>
  );
}
