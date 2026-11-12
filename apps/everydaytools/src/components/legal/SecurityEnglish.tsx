import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getSecurityEnglishSections = (): LegalSection[] => [
  {
    id: 'responsible-disclosure',
    title: '1. Responsible Vulnerability Disclosure',
    content: (
      <>
        <p>
          Protecting user workflows and data confidentiality is our highest technical priority.
          If you discover a potential vulnerability, security oversight, or edge-case flaw, we encourage
          you to disclose it responsibly so we can remediate it promptly:
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.security}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.security}
          </a>
        </p>
        <p>To help us triage and patch the issue efficiently, please include:</p>
        <ul>
          <li>A clear summary and severity assessment of the vulnerability.</li>
          <li>Reproducible step-by-step instructions or non-destructive Proof of Concept.</li>
          <li>Observed or theoretical impact on data privacy or availability.</li>
        </ul>
        <div className="p-3 sm:p-4 rounded-xl border border-border/70 bg-surface/50 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          A machine-readable security contact policy is available per RFC 9116 at{' '}
          <a
            href="/.well-known/security.txt"
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono"
          >
            /.well-known/security.txt
          </a>.
        </div>
      </>
    ),
  },
  {
    id: 'defense-in-depth',
    title: '2. Defense-in-Depth Architecture',
    content: (
      <>
        <p>
          EverydayTools Hub implements strict isolation and least-privilege principles across every layer of execution:
        </p>
        <ul>
          <li>
            <strong>Zero-Network Local Execution:</strong> Routine conversions and utilities operate purely within your browser&apos;s WebAssembly memory. Files never touch the internet.
          </li>
          <li>
            <strong>Isolated Computing Workspaces (Oracle Cloud):</strong> Advanced conversions are handled by sandboxed, unprivileged execution instances on our dedicated Oracle Cloud infrastructure, preventing lateral host access.
          </li>
          <li>
            <strong>Strict Content Sanitization:</strong> All user-supplied document previews, markdown renderings, and HTML structures are filtered through DOMPurify to eliminate cross-site scripting (XSS).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'isolation-eviction',
    title: '3. Ephemeral Isolation & Guaranteed Data Eviction',
    content: (
      <>
        <p>
          We do not operate persistent file databases or long-term storage buckets.
        </p>
        <p>
          Each conversion job is isolated in a unique, transient session. Once the processed output is streamed back to your browser,
          the workspace is immediately deleted. An automated garbage collection monitor guarantees complete eviction of temporary buffers within 15 minutes.
        </p>
      </>
    ),
  },
  {
    id: 'network-hardening',
    title: '4. Network Hardening & HTTP Security Headers',
    content: (
      <>
        <p>
          All network traffic is encrypted via modern TLS 1.3 with mandatory HTTPS enforcement (HSTS with preload).
        </p>
        <p>
          Our HTTP response headers enforce strict defensive directives:
        </p>
        <ul>
          <li><strong>Content-Security-Policy (CSP):</strong> Hardened script and resource sources to block remote injection.</li>
          <li><strong>X-Content-Type-Options:</strong> Disables MIME-type sniffing (nosniff).</li>
          <li><strong>Referrer-Policy:</strong> Preserves privacy across cross-origin transitions.</li>
          <li><strong>Permissions-Policy:</strong> Disables unnecessary browser APIs (camera, microphone, geolocation).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'scope',
    title: '5. Research Scope & Safe Harbor',
    content: (
      <>
        <p>The following surfaces are in scope for coordinated vulnerability disclosure:</p>
        <ul>
          <li>The production web application: <code>{SITE_CONFIG.domain}</code>.</li>
          <li>The backend processing endpoints and API gateways.</li>
          <li>TLS configuration and HTTP defense headers.</li>
        </ul>
        <p>
          Out of scope: Denial of Service (DoS/DDoS) attacks, automated bulk scanning that degrades performance, and social engineering.
        </p>
      </>
    ),
  },
];

export const SecurityEnglish: React.FC = () => {
  const sections = getSecurityEnglishSections();
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
