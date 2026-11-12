import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDirectChannels } from "@/components/contact/ContactDirectChannels";
import { ContactConsole } from "@/components/contact/ContactConsole";
import { ContactFaq } from "@/components/contact/ContactFaq";

export default function Contact() {
  const { isFr } = useLocale();

  const pageTitle = isFr
    ? "Contact & Assistance — EverydayTools Hub"
    : "Contact & Support — EverydayTools Hub";

  const pageDescription = isFr
    ? "Contactez l'équipe EverydayTools : support, signalement d'anomalies, questions de confidentialité et partenariats. Réponse sous 24h ouvrées."
    : "Get in touch with the EverydayTools team: technical support, bug reports, privacy inquiries, and partnerships. Response within 24h.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? "/fr/contact" : "/contact"}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/contact" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/contact" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/contact" />
      </Helmet>

      <div className="w-full min-h-[calc(100vh-140px)] bg-transparent text-foreground">
        {/* Top Header in container-wide — identical structure & breathing to ToolPageLayout */}
        <div
          className="container-wide"
          style={{
            paddingTop: '28px',
          }}
        >
          <ContactHero />
        </div>

        {/* Section Direct Channels & Console — 50/50 balance with grand gap in wide container */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 mt-2 mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-start">
            <div>
              <ContactDirectChannels />
            </div>
            <div>
              <ContactConsole />
            </div>
          </div>
        </div>

        {/* Reusable FAQ Component at root level — matching ToolPageSEO layout and spacing */}
        <ContactFaq />
      </div>
    </>
  );
}
