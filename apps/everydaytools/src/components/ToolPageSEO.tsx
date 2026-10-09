import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { LocaleContext } from "@/contexts/locale-context";
import HowItWorks, { type Step } from "@/components/ui/how-it-works";
import Faq05 from "@/components/ui/faq-05";
import {
  getToolSeoByInternalSlug,
  SLUG_MAP_INTERNAL_TO_EN,
  SLUG_MAP_INTERNAL_TO_FR,
  type ToolSeoEntry,
} from "@/config/tools-seo-data";

const BASE_URL = "https://everydaytools.qzz.io";
const OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

const CALCULATOR_SLUGS = new Set([
  "unit-converter",
  "currency-converter",
]);

interface ToolPageSEOProps {
  internalSlug: string;
  hideRelatedTools?: boolean;
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
  const title = locale === "fr" ? "Comment ça marche" : "How it works";

  const features: Step[] = steps.map((step, idx) => ({
    title: step.name,
    description: step.text,
    colorTheme: idx === 0 ? "orange" : idx === 1 ? "blue" : "purple",
  }));

  return (
    <section aria-label={title} className="w-full mt-20 sm:mt-28 md:mt-36">
      <HowItWorks
        title={title}
        features={features}
      />
    </section>
  );
}

function FaqSection({ tool, locale }: { tool: ToolSeoEntry; locale: "en" | "fr" }) {
  const faqs = tool.faqs[locale];
  const tag = "FAQ";
  const title = locale === "fr" ? "Questions fréquentes" : "Questions, answered.";
  const description =
    locale === "fr"
      ? "Les réponses aux questions les plus courantes sur cet outil et la sécurité de vos fichiers."
      : "The things people ask most often about this tool and its processing.";

  return (
    <section aria-label={title} className="w-full mt-24 sm:mt-36 md:mt-48 mb-20 sm:mb-28 md:mb-36">
      <Faq05
        faqs={faqs}
        tag={tag}
        title={title}
        description={description}
        className="py-0"
      />
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
      <div className="w-full">
        <HowItWorksSection tool={tool} locale={locale} />
        <FaqSection tool={tool} locale={locale} />
      </div>
    </>
  );
}

export default ToolPageSEO;
