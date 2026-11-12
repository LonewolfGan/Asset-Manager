import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getTermsEnglishSections = (): LegalSection[] => [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    content: (
      <>
        <p>
          By accessing EverydayTools Hub or using any of our tools, you agree to be bound by these Terms of Service.
        </p>
        <p>
          If you do not agree to these terms, please do not use the service. Access to our tools is free and does not
          require creating an account or providing personal credentials.
        </p>
      </>
    ),
  },
  {
    id: 'service-description',
    title: '2. Description of service',
    content: (
      <>
        <p>
          EverydayTools Hub provides a curated collection of digital productivity utilities, including PDF manipulation,
          multimedia conversion, data optimization, and developer calculators.
        </p>
        <p>
          Our platform prioritizes local in-browser processing via WebAssembly, HTML5 Canvas, and Web Workers whenever possible.
          For advanced operations requiring high-fidelity conversion engines, tasks are dispatched to ephemeral, isolated server
          environments without persistent file storage.
        </p>
        <p>
          The service is provided free of charge for all users.
        </p>
      </>
    ),
  },
  {
    id: 'files-and-data',
    title: '3. Your files and data',
    content: (
      <>
        <p>
          Data privacy and sovereignty are foundational to our platform architecture:
        </p>
        <ul>
          <li>
            <strong>Client-Side Processing First:</strong> For client-compatible tools, data processing executes locally within your browser memory.
          </li>
          <li>
            <strong>Ephemeral Isolated Environments:</strong> Server-assisted conversions execute in sandboxed workspaces automatically purged upon completion or within a 15-minute retention cutoff.
          </li>
          <li>
            <strong>Zero Persistent Retention:</strong> We do not store, index, monetize, or share your files with any third party.
          </li>
          <li>
            <strong>100% Ownership:</strong> You retain complete intellectual property and copyright ownership of all submitted files and generated results.
          </li>
        </ul>
        <p>
          You are solely responsible for ensuring you have the necessary legal rights to process any files you upload.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: '4. Acceptable use',
    content: (
      <>
        <p>You agree to use EverydayTools Hub responsibly and ethically:</p>
        <ul>
          <li>Do not submit malicious files, harmful payloads, or unlawful materials.</li>
          <li>Do not attempt to disrupt, overload, or degrade the platform infrastructure through automated denial-of-service attacks.</li>
          <li>Do not scrape or execute programmatic requests at a rate that degrades system availability for other users.</li>
          <li>Do not probe, scan, or attempt to exploit vulnerabilities in our systems.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual property',
    content: (
      <>
        <p>
          EverydayTools Hub&apos;s source code, application interface, branding, and design elements are protected by intellectual
          property rights.
        </p>
        <p>
          Open-source libraries and components integrated into the platform remain governed by their respective licenses (MIT, Apache 2.0, etc.).
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer',
    title: '6. Disclaimer of warranties',
    content: (
      <>
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.
          While we strive for high precision and stability across all tools, we cannot guarantee uninterrupted access or error-free outputs.
        </p>
        <p>
          You should always maintain a backup copy of your original files before executing compression or format transformations.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-liability',
    title: '7. Limitation of liability',
    content: (
      <>
        <p>
          To the maximum extent permitted by applicable law, EverydayTools Hub and its maintainers shall not be liable for any
          indirect, incidental, or consequential damages (including loss of data or revenue) arising out of the use or inability
          to use our tools.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: '8. Contact & Legal inquiries',
    content: (
      <>
        <p>
          For questions, legal notices, or compliance inquiries regarding these Terms of Service, please contact our legal team:
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.legal}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.legal}
          </a>
        </p>
      </>
    ),
  },
];

export const TermsEnglish: React.FC = () => {
  const sections = getTermsEnglishSections();
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
