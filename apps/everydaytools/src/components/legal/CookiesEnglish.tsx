import React from "react";
import { Link } from "wouter";
import { LegalSection } from "./LegalPageLayout";
import { SITE_CONFIG } from "@/config/site.config";
import { SlidersHorizontal } from "lucide-react";

export function getCookiesEnglishSections(): LegalSection[] {
  return [
    {
      id: "what-is-a-cookie",
      title: "1. What is a Cookie or Local Tracker?",
      content: (
        <>
          <p>
            A <strong>cookie</strong> is a small text file stored on your device (computer, tablet, or smartphone)
            when visiting a website. It allows the issuing service to identify the browser during future visits.
          </p>
          <p>
            Modern client-side storage technologies, such as <code>localStorage</code> and <code>sessionStorage</code>,
            store technical configuration directly on your machine without automatically attaching data headers to every network request.
          </p>
          <p>
            In strict compliance with <strong>CNIL guidelines</strong> and the General Data Protection Regulation (GDPR),
            <strong>EverydayTools Hub</strong> enforces a Privacy-by-Design architecture: no cross-site profiling is conducted,
            and all utilities operate without requiring user registration.
          </p>
        </>
      ),
    },
    {
      id: "trackers-inventory",
      title: "2. Transparent Inventory of Trackers Used",
      content: (
        <div className="space-y-4">
          <p>
            The table below provides a comprehensive list of all local storage keys and technical mechanisms
            necessary for EverydayTools Hub operation:
          </p>

          <div className="w-full overflow-x-auto rounded-xl border border-border/70 bg-surface/30">
            <table className="w-full text-left text-sm font-ui border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-surface-raised/50 text-foreground font-medium font-display text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Storage Key</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Technical Purpose</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Regulatory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-muted-foreground text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:theme</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Stores visual theme preference (light, dark, or system).</td>
                  <td className="py-3 px-4">Persistent</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempt from consent (Strictly necessary)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:locale</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Stores selected interface language (FR or EN).</td>
                  <td className="py-3 px-4">Persistent</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempt from consent (Strictly necessary)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et_consent</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Stores user choices regarding analytics and optional trackers.</td>
                  <td className="py-3 px-4">13 months max</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempt from consent (Proof of consent)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:recents</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Provides quick access to recently used tools (100% local, never uploaded).</td>
                  <td className="py-3 px-4">Persistent</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempt from consent (Local convenience)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:job:*</td>
                  <td className="py-3 px-4">sessionStorage</td>
                  <td className="py-3 px-4">Maintains ephemeral conversion job status in the active tab.</td>
                  <td className="py-3 px-4">Active session</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempt from consent (Strictly necessary)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "audience-and-third-parties",
      title: "3. Third-Party Trackers & Audience Measurement",
      content: (
        <>
          <p>
            <strong>Zero third-party advertising cookies:</strong> EverydayTools Hub does not place any commercial profiling
            or behavioral ad tracking cookies without consent. No user data is cross-referenced with social networks or data brokers.
          </p>
          <p>
            <strong>Audience Measurement Standards:</strong> Any anonymous performance measurement in place strictly complies
            with regulatory exemption guidelines (full IP anonymization, no cross-site tracking, aggregate statistical outputs only).
          </p>
          <p>
            If optional contextual sponsorships are displayed to support server hosting costs, their loading is strictly contingent
            upon explicit opt-in via our consent preferences banner.
          </p>
        </>
      ),
    },
    {
      id: "manage-preferences",
      title: "4. Managing and Customizing Your Preferences",
      content: (
        <div className="space-y-4">
          <p>
            You retain complete control over your tracking choices at all times. You can accept, reject, or adjust your tracker
            preferences with one click using the interactive control below:
          </p>
          <div className="pt-2">
            <button
              type="button"
              data-testid="open-cookie-preferences-btn"
              onClick={() => window.dispatchEvent(new Event("et:show-consent"))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-surface hover:bg-surface-raised text-foreground font-ui text-sm font-medium transition-colors shadow-sm active:scale-[0.98]"
            >
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span>Customize my preferences</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            This preference manager can also be accessed at any time via the &quot;Cookie Preferences&quot; link in the site footer.
          </p>
        </div>
      ),
    },
    {
      id: "browser-configuration",
      title: "5. Configuring or Clearing Trackers from Your Browser",
      content: (
        <>
          <p>
            You can configure your browser at any time to reject cookies or purge existing local storage records:
          </p>
          <ul className="space-y-1.5 pl-6 list-disc text-muted-foreground">
            <li>
              <strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party cookies and site data.
            </li>
            <li>
              <strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data.
            </li>
            <li>
              <strong>Apple Safari:</strong> Settings &gt; Safari &gt; Privacy &gt; Block all cookies.
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions.
            </li>
          </ul>
          <p>
            <em>Note:</em> Completely purging local storage will reset your client-side visual preferences
            (such as dark mode or language choice) on your next visit.
          </p>
        </>
      ),
    },
    {
      id: "contact-dpo",
      title: "6. Contact & Data Protection Officer",
      content: (
        <p>
          For any questions concerning this policy or to exercise your GDPR rights of access, rectification, or objection,
          please consult our{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium"
          >
            Privacy Policy
          </Link>{" "}
          or reach our privacy officer at:{" "}
          <a
            href={`mailto:${SITE_CONFIG.emails.privacy}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
          >
            {SITE_CONFIG.emails.privacy}
          </a>.
        </p>
      ),
    },
  ];
}
