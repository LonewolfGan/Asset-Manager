import type React from 'react';
import { S } from './legal-styles';

const linkStyle = { color: 'var(--text-primary)', textDecoration: 'underline' } as React.CSSProperties;

export const PrivacyEnglish: React.FC = () => {
  return (
    <>
      <section style={S.section}>
        <h2 style={S.h2}>The short version</h2>
        <p style={S.p}>
          EverydayTools Hub is built on a privacy-first hybrid architecture. Lightweight tools
          (calculators, formatters, interactive previews) execute directly in your browser memory.
          For advanced high-fidelity document conversions (office files, complex PDFs, AI models), processing
          is performed securely and ephemerally on dedicated cloud servers: files reside in isolated workspaces
          and are automatically and permanently purged within 15 minutes. We never store, sell, or analyze your files.
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
          We use <a style={linkStyle} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
          a privacy-first, open-source analytics platform hosted in the EU. Plausible does not use cookies,
          does not collect personal data, and is exempt from GDPR consent requirements. It uses aggregated, non-identifiable data only.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Advertising</h2>
        <p style={S.p}>
          Ads keep our tools free. With your consent, we display ads served by{' '}
          <a style={linkStyle} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>.
          If you select "Essential only", no advertising cookies are set and only non-personalized ads are shown.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Your rights (GDPR / CCPA)</h2>
        <p style={S.p}>
          Because we never permanently store personal data or documents on our servers, your data remains under your full control.
          For ephemeral server conversions, workspaces are automatically purged upon task completion.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Contact</h2>
        <p style={S.p}>
          Questions about privacy? Email us at{' '}
          <a style={linkStyle} href="mailto:privacy@everydaytoolshub.com">privacy@everydaytoolshub.com</a>.
        </p>
      </section>
    </>
  );
};
