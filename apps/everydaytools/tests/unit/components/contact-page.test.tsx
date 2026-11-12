import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import Contact from "@/pages/contact";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/locale-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_CONFIG } from "@/config/site.config";

describe("Contact Page Component Suite", () => {
  const renderContactHtml = () => {
    return renderToString(
      <HelmetProvider>
        <LocaleProvider>
          <TooltipProvider>
            <Contact />
          </TooltipProvider>
        </LocaleProvider>
      </HelmetProvider>
    );
  };

  it("renders the contact heading cleanly", () => {
    const html = renderContactHtml();
    expect(html).toContain("Contact");
  });

  it("surfaces all official contact channels from site.config without hardcoding", () => {
    const html = renderContactHtml();
    expect(html).toContain(SITE_CONFIG.emails.contact);
    expect(html).toContain(SITE_CONFIG.emails.security);
    expect(html).toContain(SITE_CONFIG.emails.privacy);
  });

  it("renders the interactive dispatch form fields (email, subject, message)", () => {
    const html = renderContactHtml();
    expect(html).toMatch(/Email|Courriel/i);
    expect(html).toMatch(/Sujet|Subject|Objet/i);
    expect(html).toMatch(/Message/i);
  });

  it("re-uses the Faq05 accordion component with identical FAQ tag matching tool pages", () => {
    const html = renderContactHtml();
    expect(html).toContain('data-slot="faq"');
    expect(html).toContain("FAQ");
  });

  it("uses container-wide for the header and contained max-w-[1400px] for the sections", () => {
    const html = renderContactHtml();
    expect(html).toContain("container-wide");
    expect(html).toContain("max-w-[1400px]");
    expect(html).toContain("lg:grid-cols-2");
    // Removed spam / 24h reassurance line
    expect(html).not.toContain("Zéro spam");
  });

  it("strictly complies with Anti-Slop: zero infrastructure leakage and zero forbidden buzzwords", () => {
    const html = renderContactHtml();
    // Zero infrastructure leakage
    expect(html).not.toMatch(/Oracle/i);
    expect(html).not.toMatch(/ARM64/i);
    expect(html).not.toMatch(/Frankfurt/i);
    expect(html).not.toMatch(/SLA 99/i);

    // Zero AI buzzwords
    expect(html).not.toMatch(/game-changer/i);
    expect(html).not.toMatch(/next-gen/i);
    expect(html).not.toMatch(/seamlessly/i);
    expect(html).not.toMatch(/elevate your/i);
  });
});
