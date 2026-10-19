import type React from 'react';
import { S } from './security-styles';

export const SecurityEnglish: React.FC = () => {
  return (
    <>
      <section style={S.section}>
        <h2 style={S.h2}>Reporting a Vulnerability</h2>
        <p style={S.p}>
          We take the security of EverydayTools Hub seriously. If you discover a security vulnerability,
          please report it to us responsibly by emailing{' '}
          <a href="mailto:security@everydaytools.app" style={S.email}>
            security@everydaytools.app
          </a>.
        </p>
        <p style={S.p}>Please include:</p>
        <ul style={S.ul}>
          <li style={S.li}>A description of the vulnerability</li>
          <li style={S.li}>Steps to reproduce the issue</li>
          <li style={S.li}>Potential impact on security or privacy</li>
          <li style={S.li}>Any suggested fixes (optional)</li>
        </ul>
        <div style={S.callout}>
          A machine-readable security contact is available at{' '}
          <a href="/.well-known/security.txt" style={S.email}>
            /.well-known/security.txt
          </a>{' '}
          per RFC 9116.
        </div>
      </section>

      <hr style={S.divider} />

      <section style={S.section}>
        <h2 style={S.h2}>Our Security Practices</h2>
        <ul style={S.ul}>
          <li style={S.li}>
            <strong>Secure Hybrid Architecture (Oracle VM).</strong> Lightweight utilities run purely in your browser's memory.
            Heavy document transformations are performed ephemerally on our dedicated Oracle Cloud VM API server (Port 3001)
            using unprivileged sandboxes (UID 10001) with automatic 15-minute file eviction.
          </li>
          <li style={S.li}>
            <strong>Content Security Policy (CSP).</strong> Strict CSP headers are applied to every HTTP response
            to prevent script injection, clickjacking, and unauthorized origins.
          </li>
          <li style={S.li}>
            <strong>HSTS.</strong> Strict-Transport-Security with a two-year duration and preload to enforce HTTPS on all connections.
          </li>
          <li style={S.li}>
            <strong>Zero Permanent File Storage.</strong> No user files or documents are ever permanently stored on disk or in databases.
            Workspaces are completely transient.
          </li>
          <li style={S.li}>
            <strong>Input Sanitization.</strong> All HTML rendered from user-provided files is sanitized with DOMPurify.
          </li>
        </ul>
      </section>

      <hr style={S.divider} />

      <section style={S.section}>
        <h2 style={S.h2}>Scope</h2>
        <p style={S.p}>The following surfaces are in scope for responsible disclosure:</p>
        <ul style={S.ul}>
          <li style={S.li}>The everydaytools.app web application</li>
          <li style={S.li}>The backend API server and ephemeral conversion pipelines</li>
          <li style={S.li}>HTTP security header configuration</li>
        </ul>
      </section>
    </>
  );
};
