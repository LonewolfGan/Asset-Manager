import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getLegalNoticeFrenchSections } from "@/components/legal/LegalNoticeFrench";
import { getLegalNoticeEnglishSections } from "@/components/legal/LegalNoticeEnglish";
import { SITE_CONFIG } from "@/config/site.config";

export function LegalNotice() {
  const { isFr } = useLocale();
  const sections = isFr ? getLegalNoticeFrenchSections() : getLegalNoticeEnglishSections();
  const summaryPoints = isFr
    ? [
        "Éditeur : EverydayTools Hub — Collectif technique d'outils libres et gratuits.",
        "Directeur de publication : Équipe de coordination EverydayTools Hub.",
        "Hébergeur : Oracle Cloud Infrastructure (Oracle France SAS, 92700 Colombes).",
        "Zéro conservation : suppression automatique de tous les fichiers éphémères sous 15 minutes.",
        "Protection des données : conformité RGPD intégrale, zéro revente de données.",
      ]
    : [
        "Publisher: EverydayTools Hub — Free and open-source utility collective.",
        "Editorial Director: EverydayTools Hub core coordination team.",
        "Hosting Provider: Oracle Cloud Infrastructure (Oracle France SAS, 92700 Colombes).",
        "Zero permanent storage: automatic eviction of all temporary files within 15 minutes.",
        "Full GDPR compliance: zero personal data selling, zero third-party ad tracking.",
      ];

  return (
    <>
      <Helmet>
        <title>{isFr ? "Mentions légales — EverydayTools Hub" : "Legal Notice — EverydayTools Hub"}</title>
        <meta
          name="description"
          content={
            isFr
              ? "Mentions légales officielles et obligations LCEN pour EverydayTools Hub."
              : "Official statutory legal notice and host disclosure for EverydayTools Hub."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? "/fr/mentions-legales" : "/legal-notice"}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/legal-notice" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/mentions-legales" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/legal-notice" />
      </Helmet>
      <LegalPageLayout
        title={isFr ? "Mentions légales" : "Legal Notice"}
        effectiveDate={isFr ? "7 novembre 2026" : "November 7, 2026"}
        summaryTitle={isFr ? "En résumé (Obligations LCEN)" : "Summary (Statutory Disclosure)"}
        summaryPoints={summaryPoints}
        sections={sections}
        contactTitle={isFr ? "Une question d'ordre légal ou administratif ?" : "Questions regarding statutory information?"}
        contactText={
          isFr
            ? "Notre référent juridique et conformité répond à vos notifications et demandes officielles :"
            : "Our legal and compliance officer is directly available for formal inquiries:"
        }
        contactEmail={SITE_CONFIG.emails.legal}
        lang={isFr ? "fr" : "en"}
      />
    </>
  );
}

export default LegalNotice;
