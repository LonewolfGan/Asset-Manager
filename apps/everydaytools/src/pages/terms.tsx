import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getTermsFrenchSections } from '@/components/legal/TermsFrench';
import { getTermsEnglishSections } from '@/components/legal/TermsEnglish';
import { SITE_CONFIG } from '@/config/site.config';

export default function Terms() {
  const { isFr } = useLocale();

  const sections = isFr ? getTermsFrenchSections() : getTermsEnglishSections();

  return (
    <>
      <Helmet>
        <title>{isFr ? "Conditions d'utilisation — EverydayTools Hub" : "Terms of Service — EverydayTools Hub"}</title>
        <meta
          name="description"
          content={
            isFr
              ? "Conditions d'utilisation d'EverydayTools Hub — cadre d'utilisation libre, traitement éphémère et respect absolu de vos données."
              : "Terms of Service for EverydayTools Hub — free access, ephemeral data processing, and full file sovereignty."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? '/fr/terms' : '/terms'}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/terms" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/terms" />
      </Helmet>

      <LegalPageLayout
        title={isFr ? "Conditions d'utilisation" : "Terms of Service"}
        effectiveDate={isFr ? "7 novembre 2026" : "November 7, 2026"}
        summaryTitle={isFr ? "En résumé (TL;DR)" : "Executive Summary (TL;DR)"}
        summaryPoints={
          isFr
            ? [
                "Accès 100% gratuit et sans compte requis pour l'ensemble des 114 outils.",
                "Traitement éphémère : vos fichiers sont traités en mémoire locale ou purgés automatiquement sous 15 minutes sur nos serveurs.",
                "Vous conservez l'entière propriété intellectuelle et les droits d'auteur sur vos fichiers traités.",
                "Usage responsable : interdiction formelle des scripts abusifs, surcharges et contenus malveillants.",
                "Transparence totale : aucune conservation de fichier, aucune revente de données.",
              ]
            : [
                "100% free access with no account, subscription, or credit card required across all 114 tools.",
                "Ephemeral processing: files are kept in local memory or isolated in temporary sandboxes wiped within 15 minutes.",
                "Full ownership: you retain 100% copyright and intellectual property rights over your data.",
                "Responsible usage: automated abuse, scraping, and harmful payloads are strictly prohibited.",
                "Zero monetization of your files: no persistent storage, no analytics tracking on your content.",
              ]
        }
        tocTitle={isFr ? "Sommaire" : "On this page"}
        sections={sections}
        contactTitle={isFr ? "Une question juridique ou de conformité ?" : "Legal or compliance inquiry?"}
        contactText={
          isFr
            ? "Pour toute question relative à nos conditions d'utilisation, à la protection des données ou à l'utilisation équitable de notre plateforme, contactez notre équipe légale :"
            : "For any questions regarding our terms of service, data sovereignty, or acceptable use policies, contact our legal team:"
        }
        contactEmail={SITE_CONFIG.emails.legal}
        lang={isFr ? "fr" : "en"}
      />
    </>
  );
}
