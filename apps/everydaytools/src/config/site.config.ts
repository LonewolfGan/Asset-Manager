export interface SiteConfig {
  name: string;
  domain: string;
  url: string;
  emails: {
    contact: string;
    legal: string;
    privacy: string;
    security: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "EverydayTools Hub",
  domain: "everydaytools.qzz.io",
  url:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    "https://everydaytools.qzz.io",
  emails: {
    contact:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_CONTACT_EMAIL) ||
      "contact@everydaytools.qzz.io",
    legal:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_LEGAL_EMAIL) ||
      "legal@everydaytools.qzz.io",
    privacy:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_PRIVACY_EMAIL) ||
      "privacy@everydaytools.qzz.io",
    security:
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SECURITY_EMAIL) ||
      "security@everydaytools.qzz.io",
  },
};
