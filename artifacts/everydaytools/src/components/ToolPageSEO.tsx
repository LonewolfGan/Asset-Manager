import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { LocaleContext } from "@/contexts/locale-context";
import {
  getToolSeoByInternalSlug,
  SLUG_MAP_INTERNAL_TO_EN,
  SLUG_MAP_INTERNAL_TO_FR,
  type ToolSeoEntry,
} from "@/config/tools-seo-data";

const BASE_URL = "https://everydaytoolshub.com";

interface ToolPageSEOProps {
  internalSlug: string;
}

function SeoMeta({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const enSlug = SLUG_MAP_INTERNAL_TO_EN[tool.internalSlug];
  const frSlug = SLUG_MAP_INTERNAL_TO_FR[tool.internalSlug];
  const canonical = `${BASE_URL}/${locale}/${locale === "en" ? enSlug : frSlug}`;
  const enUrl = enSlug ? `${BASE_URL}/en/${enSlug}` : undefined;
  const frUrl = frSlug ? `${BASE_URL}/fr/${frSlug}` : undefined;

  return (
    <Helmet>
      <title>{tool.title[locale]}</title>
      <meta name="description" content={tool.description[locale]} />
      {canonical && <link rel="canonical" href={canonical} />}
      {enUrl && <link rel="alternate" hreflang="en" href={enUrl} />}
      {frUrl && <link rel="alternate" hreflang="fr" href={frUrl} />}
      {enUrl && <link rel="alternate" hreflang="x-default" href={enUrl} />}
      <meta property="og:title" content={tool.title[locale]} />
      <meta property="og:description" content={tool.description[locale]} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tool.title[locale]} />
      <meta name="twitter:description" content={tool.description[locale]} />
    </Helmet>
  );
}

function HowItWorksSection({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const steps = tool.howItWorks[locale];
  const label = locale === "fr" ? "Comment ça marche" : "How it works";

  return (
    <section
      aria-label={label}
      style={{
        marginTop: "var(--space-12, 48px)",
        paddingTop: "var(--space-8, 32px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: "20px",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
        {steps.map((step, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "16px",
              padding: "16px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "28px",
                height: "28px",
                background: "var(--bg-elevated)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                color: "var(--text-tertiary)",
                flexShrink: 0,
                marginTop: "2px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {i + 1}
            </span>
            <div>
              <strong
                style={{
                  display: "block",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {step.name}
              </strong>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutSection({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const label = locale === "fr" ? "À propos de cet outil" : "About this tool";
  const paragraphs = tool.about[locale].split("\n\n").filter(Boolean);

  return (
    <section
      aria-label={label}
      style={{
        marginTop: "var(--space-8, 32px)",
        paddingTop: "var(--space-8, 32px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: "20px",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
      </p>
      <div style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--text-secondary)" }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ margin: "0 0 14px" }}>
            {para.trim()}
          </p>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const faqs = tool.faqs[locale];
  const label = locale === "fr" ? "Questions fréquentes" : "Frequently asked questions";

  return (
    <section
      aria-label={label}
      style={{
        marginTop: "var(--space-8, 32px)",
        paddingTop: "var(--space-8, 32px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: "20px",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <summary
              style={{
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-primary)",
                background: "var(--bg-surface)",
                cursor: "pointer",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-ui)",
                userSelect: "none",
              }}
            >
              {faq.q}
            </summary>
            <div
              style={{
                padding: "14px 16px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                background: "var(--bg-base)",
                borderTop: "1px solid var(--border)",
              }}
            >
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ToolPageSEO({ internalSlug }: ToolPageSEOProps) {
  const ctx = useContext(LocaleContext);
  const locale: "en" | "fr" = ctx?.locale?.toLowerCase().startsWith("fr") ? "fr" : "en";
  const tool = getToolSeoByInternalSlug(internalSlug);

  if (!tool) return null;

  return (
    <>
      <SeoMeta tool={tool} locale={locale} />
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
        <HowItWorksSection tool={tool} locale={locale} />
        <AboutSection tool={tool} locale={locale} />
        <FaqSection tool={tool} locale={locale} />
      </div>
    </>
  );
}

export default ToolPageSEO;
