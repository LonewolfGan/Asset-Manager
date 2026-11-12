import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '@/config/site.config';

describe('SITE_CONFIG - Centralized Site and Contact Configuration', () => {
  it('exports site name, domain, and base url', () => {
    expect(SITE_CONFIG.name).toBe('EverydayTools Hub');
    expect(SITE_CONFIG.domain).toBe('everydaytools.qzz.io');
    expect(SITE_CONFIG.url).toBe('https://everydaytools.qzz.io');
  });

  it('exports verified, consistent email addresses for contact, legal, and security', () => {
    expect(SITE_CONFIG.emails.contact).toMatch(/^[a-z0-9._%+-]+@everydaytools\.qzz\.io$/);
    expect(SITE_CONFIG.emails.legal).toMatch(/^[a-z0-9._%+-]+@everydaytools\.qzz\.io$/);
    expect(SITE_CONFIG.emails.security).toMatch(/^[a-z0-9._%+-]+@everydaytools\.qzz\.io$/);

    expect(SITE_CONFIG.emails.contact).toBe('contact@everydaytools.qzz.io');
    expect(SITE_CONFIG.emails.legal).toBe('legal@everydaytools.qzz.io');
    expect(SITE_CONFIG.emails.security).toBe('security@everydaytools.qzz.io');
  });

  it('contains strictly zero legacy dummy domains in email configurations', () => {
    const allEmails = Object.values(SITE_CONFIG.emails);
    allEmails.forEach((email) => {
      expect(email).not.toContain('everydaytoolshub.com');
      expect(email).not.toContain('everydaytools.app');
      expect(email).not.toContain('example.com');
    });
  });
});
