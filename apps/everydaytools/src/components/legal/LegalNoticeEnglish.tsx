import React from "react";
import { Link } from "wouter";
import { LegalPageLayout, LegalSection } from "./LegalPageLayout";
import { SITE_CONFIG } from "@/config/site.config";

export function getLegalNoticeEnglishSections(): LegalSection[] {
  return [
    {
      id: "publisher",
      title: "1. Service Publisher",
      content: (
        <>
          <p>
            The website <strong>EverydayTools Hub</strong> (accessible at{" "}
            <a
              href={SITE_CONFIG.url}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.domain}
            </a>
            ) is published by the EverydayTools Hub open technical collective, dedicated to providing free,
            accessible, and privacy-first digital file utilities.
          </p>
          <p>
            Official legal contact email:{" "}
            <a
              href={`mailto:${SITE_CONFIG.emails.legal}`}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.emails.legal}
            </a>
          </p>
        </>
      ),
    },
    {
      id: "publication-director",
      title: "2. Editorial & Publication Director",
      content: (
        <p>
          The publication director and editorial coordinator is the EverydayTools Hub core team, reachable
          directly via email at:{" "}
          <a
            href={`mailto:${SITE_CONFIG.emails.contact}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
          >
            {SITE_CONFIG.emails.contact}
          </a>.
        </p>
      ),
    },
    {
      id: "hosting",
      title: "3. Infrastructure & Hosting Provider (Statutory Disclosure)",
      content: (
        <>
          <p>
            Pursuant to applicable regulations (including French LCEN law n° 2004-575), website hosting and computational
            infrastructure services are provided by:
          </p>
          <div className="p-4 rounded-xl border border-border/70 bg-surface/50 text-sm text-foreground/90 space-y-1 font-mono">
            <p className="font-semibold text-foreground">Oracle Cloud Infrastructure (Oracle France SAS)</p>
            <p>15 boulevard Charles de Gaulle</p>
            <p>92700 Colombes, France</p>
            <p className="text-muted-foreground text-xs pt-1">
              Phone: +33 1 57 60 20 20 — Official Website:{" "}
              <a
                href="https://www.oracle.com/cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                oracle.com/cloud
              </a>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Server instances perform file conversions within the European Union using temporary in-memory and ephemeral
            sandboxes.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "4. Intellectual Property & Third-Party Software",
      content: (
        <>
          <p>
            All website structure, branding, interface components, and custom scripts are the property of EverydayTools Hub
            or used under approved open-source licenses (MIT, Apache 2.0).
          </p>
          <p>
            Integrated document and image processing engines rely on audited open-source binaries (LibreOffice, Ghostscript,
            qpdf, potrace, rembg ONNX, Tesseract OCR). Third-party product names and formats (PDF, Word, Excel, PowerPoint)
            are referenced solely for technical descriptive accuracy.
          </p>
        </>
      ),
    },
    {
      id: "data-protection",
      title: "5. Personal Data & Privacy Compliance",
      content: (
        <>
          <p>
            EverydayTools operates under a strict Privacy-by-Design architecture: uploaded files are never permanently stored.
            All processing workspaces are automatically purged within 15 minutes of completion.
          </p>
          <p>
            For information on data subject rights under the GDPR or our anonymous metrics model, please consult our full{" "}
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium"
            >
              Privacy Policy
            </Link>{" "}
            or contact our privacy team at:{" "}
            <a
              href={`mailto:${SITE_CONFIG.emails.privacy}`}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.emails.privacy}
            </a>.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "6. Limitation of Liability",
      content: (
        <p>
          Online conversion tools are provided free of charge on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
          without warranties of any kind. Users are advised to retain local copies of their original documents prior to processing.
        </p>
      ),
    },
  ];
}

export const LegalNoticeEnglish: React.FC = () => {
  const sections = getLegalNoticeEnglishSections();

  return (
    <LegalPageLayout
      title="Legal Notice"
      effectiveDate="November 7, 2026"
      summaryTitle="Summary (Statutory Disclosure)"
      summaryPoints={[
        "Publisher: EverydayTools Hub — Free and open-source utility collective.",
        "Hosting Provider: Oracle Cloud Infrastructure (Oracle France SAS, 92700 Colombes).",
        "Zero permanent storage: automatic eviction of all temporary files within 15 minutes.",
        "Full GDPR compliance: zero personal data selling, zero third-party ad tracking.",
      ]}
      sections={sections}
      contactTitle="Questions regarding statutory information?"
      contactText="Our legal and compliance officer is directly available for formal inquiries."
      contactEmail={SITE_CONFIG.emails.legal}
      lang="en"
    />
  );
};
