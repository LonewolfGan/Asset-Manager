import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Link } from "wouter";
import { LocaleContext } from "@/contexts/locale-context";
import {
  getToolSeoByInternalSlug,
  SLUG_MAP_INTERNAL_TO_EN,
  SLUG_MAP_INTERNAL_TO_FR,
  type ToolSeoEntry,
} from "@/config/tools-seo-data";

const BASE_URL = "https://everydaytools.qzz.io";
const OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

const CALCULATOR_SLUGS = new Set([
  "tip-calculator",
  "percentage-calc",
  "unit-converter",
  "currency-converter",
]);

interface ToolPageSEOProps {
  internalSlug: string;
}

function buildSchemas(tool: ToolSeoEntry, locale: "en" | "fr"): object[] {
  const enSlug = SLUG_MAP_INTERNAL_TO_EN[tool.internalSlug];
  const frSlug = SLUG_MAP_INTERNAL_TO_FR[tool.internalSlug];
  const canonical = `${BASE_URL}/${locale}/${locale === "en" ? enSlug : frSlug}`;
  const toolName = tool.h1[locale];
  const desc = tool.description[locale];
  const faqs = tool.faqs[locale];
  const appCategory = CALCULATOR_SLUGS.has(tool.internalSlug)
    ? "CalculatorApplication"
    : "UtilitiesApplication";

  const softwareApp: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolName,
    url: canonical,
    description: desc,
    applicationCategory: appCategory,
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "No signup required",
      "Client-side processing",
      "Files never leave your device",
      "Free forever",
    ],
    browserRequirements: "Requires JavaScript. Works offline after first load.",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "fr" ? "Accueil" : "Home",
        item: `${BASE_URL}/${locale}`,
      },
      { "@type": "ListItem", position: 2, name: toolName, item: canonical },
    ],
  };

  const steps = tool.howItWorks[locale];
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name:
      locale === "fr"
        ? `Comment utiliser ${toolName}`
        : `How to use ${toolName}`,
    description: desc,
    totalTime: "PT10S",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return [softwareApp, faqPage, breadcrumb, howTo];
}

function SeoMeta({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const enSlug = SLUG_MAP_INTERNAL_TO_EN[tool.internalSlug];
  const frSlug = SLUG_MAP_INTERNAL_TO_FR[tool.internalSlug];
  const canonical = `${BASE_URL}/${locale}/${locale === "en" ? enSlug : frSlug}`;
  const enUrl = enSlug ? `${BASE_URL}/en/${enSlug}` : undefined;
  const frUrl = frSlug ? `${BASE_URL}/fr/${frSlug}` : undefined;
  const schemas = buildSchemas(tool, locale);
  const keywords = tool.keywords[locale].join(", ");

  return (
    <Helmet>
      <title>{tool.title[locale]}</title>
      <meta name="description" content={tool.description[locale]} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      {enUrl && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {frUrl && <link rel="alternate" hrefLang="fr" href={frUrl} />}
      {enUrl && <link rel="alternate" hrefLang="x-default" href={enUrl} />}
      <meta property="og:title" content={tool.title[locale]} />
      <meta property="og:description" content={tool.description[locale]} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="EverydayTools Hub" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tool.title[locale]} />
      <meta name="twitter:description" content={tool.description[locale]} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
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
      <h2
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: "20px",
          fontFamily: "var(--font-ui)",
          fontWeight: 600,
          margin: "0 0 20px",
        }}
      >
        {label}
      </h2>
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
  const content = tool.about[locale]?.trim();
  if (!content) return null;
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <section
      aria-label={label}
      style={{
        marginTop: "var(--space-8, 32px)",
        paddingTop: "var(--space-8, 32px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontWeight: 600,
          margin: "0 0 20px",
        }}
      >
        {label}
      </h2>
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
      <h2
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontWeight: 600,
          margin: "0 0 20px",
        }}
      >
        {label}
      </h2>
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

function RelatedToolsSection({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const label = locale === "fr" ? "Outils associés" : "Related tools";
  const related = tool.relatedTools
    .map((slug) => {
      const entry = getToolSeoByInternalSlug(slug);
      if (!entry) return null;
      const localeSlug = locale === "en"
        ? SLUG_MAP_INTERNAL_TO_EN[slug]
        : SLUG_MAP_INTERNAL_TO_FR[slug];
      if (!localeSlug) return null;
      return {
        title: entry.h1[locale],
        href: `/${locale}/${localeSlug}`,
        description: entry.description[locale],
      };
    })
    .filter((x): x is { title: string; href: string; description: string } => x !== null);

  if (related.length === 0) return null;

  return (
    <nav
      aria-label={label}
      style={{
        marginTop: "var(--space-8, 32px)",
        paddingTop: "var(--space-8, 32px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontWeight: 600,
          margin: "0 0 20px",
        }}
      >
        {label}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
          alignItems: "stretch",
        }}
      >
        {related.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
            aria-label={r.title}
          >
            <div
              style={{
                padding: "14px 16px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-surface)",
                transition: "border-color 140ms ease, background 140ms ease",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: "0 0 6px",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {r.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {r.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
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
          padding: "0 var(--tool-padding-x) 80px",
        }}
      >
        <RelatedToolsSection tool={tool} locale={locale} />
        <AboutSection tool={tool} locale={locale} />
        <HowItWorksSection tool={tool} locale={locale} />
        <FaqSection tool={tool} locale={locale} />
      </div>
    </>
  );
}

export default ToolPageSEO;
