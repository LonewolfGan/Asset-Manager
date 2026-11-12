import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getPrivacyEnglishSections = (): LegalSection[] => [
  {
    id: 'principles',
    title: '1. Foundational Principles',
    content: (
      <>
        <p>
          EverydayTools Hub operates under a strict engineering ethos: absolute user privacy and sovereign file control.
        </p>
        <p>
          We employ a client-first computing architecture whenever technologically viable. Daily productivity tools
          (calculators, code formatters, encoders, text tools) run entirely inside your browser&apos;s volatile RAM using
          WebAssembly and modern HTML5 APIs. In these modes, your files never cross the network or touch external servers.
        </p>
        <p>
          When complex transformations require server-assisted conversion engines, files are processed inside isolated,
          ephemeral workspaces and purged immediately upon task delivery (with a strict automated 15-minute garbage collection sweep).
        </p>
      </>
    ),
  },
  {
    id: 'local-storage',
    title: '2. Data Stored Locally in Your Browser',
    content: (
      <>
        <p>
          We do not require user accounts, passwords, or persistent profiles. The only information retained is saved exclusively
          in your browser&apos;s local storage (localStorage) to maintain your preferences:
        </p>
        <ul>
          <li>Language selection (English or French).</li>
          <li>Visual theme preference (Dark or Light mode).</li>
          <li>Hourly cache of currency exchange rates (to reduce redundant network requests).</li>
        </ul>
        <p>
          This data remains on your machine, is never synchronized with our systems, and can be cleared at any time via your browser settings.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: '3. Respectful Aggregated Telemetry & Zero Advertising',
    content: (
      <>
        <p>
          EverydayTools Hub does not include third-party advertising networks, invasive tracking pixels, or cross-site tracking scripts.
        </p>
        <p>
          To monitor platform stability and traffic volume responsibly, we utilize aggregated, privacy-first telemetry compliant with
          GDPR and international standards. No IP addresses are stored, no individual fingerprints are constructed, and no tracking cookies are set.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: '4. Your Rights (GDPR, CCPA & Data Sovereignty)',
    content: (
      <>
        <p>
          Because we never archive files or compile personal databases, your work remains strictly your own:
        </p>
        <ul>
          <li><strong>Zero Data Brokerage:</strong> Your documents are never sold, rented, or shared with third parties.</li>
          <li><strong>Zero Non-Consensual AI Training:</strong> No files processed through our platform are harvested to train external machine learning models.</li>
          <li><strong>Irreversible Eviction:</strong> Transient processing sandboxes are permanently destroyed once the conversion concludes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'contact',
    title: '5. Privacy Officer & Inquiries',
    content: (
      <>
        <p>
          If you have questions regarding our privacy architecture, data isolation practices, or compliance inquiries, contact our privacy officer directly:
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.privacy}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.privacy}
          </a>
        </p>
      </>
    ),
  },
];

export const PrivacyEnglish: React.FC = () => {
  const sections = getPrivacyEnglishSections();
  return (
    <div>
      {sections.map((sec) => (
        <section key={sec.id} id={sec.id} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>{sec.title}</h2>
          <div>{sec.content}</div>
        </section>
      ))}
    </div>
  );
};
