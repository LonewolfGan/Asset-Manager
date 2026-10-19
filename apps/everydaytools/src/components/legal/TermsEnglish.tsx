import type React from 'react';
import { S } from './legal-styles';

export const TermsEnglish: React.FC = () => {
  return (
    <>
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
          EverydayTools Hub provides a collection of free utility tools including document conversion,
          image processing, text manipulation, and productivity calculators. Lightweight utilities run directly
          in your browser. Advanced high-fidelity conversions (office documents, complex PDFs, AI models) are
          performed securely and ephemerally on our dedicated cloud infrastructure without permanent storage.
        </p>
        <p style={S.p}>
          The Service is provided free of charge and is supported by advertising revenue.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>3. Your files and data</h2>
        <p style={S.p}>
          File privacy is our absolute priority. Client-side tools operate exclusively in your browser memory.
          For server-assisted processing, files are processed in isolated, ephemeral sandboxes and automatically
          purged immediately after processing. No user files are stored, analyzed, or shared with third parties.
          You retain full ownership of any files you process.
        </p>
        <p style={S.p}>
          You are solely responsible for ensuring you have the right to process any files you upload to the
          tools, including compliance with applicable copyright and data protection laws.
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
    </>
  );
};
