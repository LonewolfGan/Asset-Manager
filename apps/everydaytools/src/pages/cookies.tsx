import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getCookiesFrenchSections } from "@/components/legal/CookiesFrench";
import { getCookiesEnglishSections } from "@/components/legal/CookiesEnglish";
import { SITE_CONFIG } from "@/config/site.config";

export function Cookies() {
  const { isFr } = useLocale();
  const sections = isFr ? getCookiesFrenchSections() : getCookiesEnglishSections();
  const summaryPoints = isFr
    ? [
        "Zéro cookie publicitaire tiers : aucun ciblage commercial intrusif n'est activé à votre insu.",
        "Stockage local technique : localStorage strictement réservé au confort (thème, langue, historique local).",
        "Recommandations CNIL : respect rigoureux des délibérations CNIL relatives aux traceurs exemptés.",
        "Contrôle absolu : modifiez, retirez ou personnalisez vos préférences à tout moment en un clic.",
      ]
    : [
        "Zero third-party advertising cookies: no intrusive commercial profiling is conducted.",
        "Technical local storage: localStorage strictly reserved for preferences (theme, language, local history).",
        "CNIL & GDPR guidelines: strict compliance with regulatory tracker exemptions.",
        "Absolute user control: modify, withdraw, or customize your preferences anytime in one click.",
      ];

  return (
    <>
      <Helmet>
        <title>{isFr ? "Politique des cookies et traceurs — EverydayTools Hub" : "Cookie & Tracker Policy — EverydayTools Hub"}</title>
        <meta
          name="description"
          content={
            isFr
              ? "Politique de transparence sur les cookies et le stockage local d'EverydayTools Hub, conforme CNIL et RGPD."
              : "Transparency policy regarding cookies and client-side storage for EverydayTools Hub, compliant with CNIL and GDPR."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? "/fr/cookies" : "/cookies"}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/cookies" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/cookies" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/cookies" />
      </Helmet>
      <LegalPageLayout
        title={isFr ? "Politique des cookies et traceurs" : "Cookie & Tracker Policy"}
        effectiveDate={isFr ? "7 novembre 2026" : "November 7, 2026"}
        summaryTitle={isFr ? "En résumé (Transparence traceurs)" : "Summary (Tracker Transparency)"}
        summaryPoints={summaryPoints}
        sections={sections}
        contactTitle={isFr ? "Une question relative aux cookies ou au stockage local ?" : "Questions regarding cookies or storage?"}
        contactText={
          isFr
            ? "Notre délégué à la protection des données et notre équipe technique répondent à vos interrogations :"
            : "Our data protection officer and technical team are directly available to assist you:"
        }
        contactEmail={SITE_CONFIG.emails.privacy}
        lang={isFr ? "fr" : "en"}
      />
    </>
  );
}

export default Cookies;
