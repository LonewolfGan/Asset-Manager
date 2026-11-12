import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getPrivacyFrenchSections } from '@/components/legal/PrivacyFrench';
import { getPrivacyEnglishSections } from '@/components/legal/PrivacyEnglish';
import { SITE_CONFIG } from '@/config/site.config';

export default function Privacy() {
  const { isFr } = useLocale();
  const sections = isFr ? getPrivacyFrenchSections() : getPrivacyEnglishSections();
  const summaryPoints = isFr
    ? [
        'Traitement local en priorité dans la mémoire vive de votre navigateur.',
        'Purge automatique : conteneurs serveurs détruits immédiatement ou sous 15 minutes.',
        'Zéro régie publicitaire, zéro cookie de ciblage tiers et zéro revente de données.',
        'Respect intégral des normes européennes RGPD et de souveraineté des données.',
      ]
    : [
        'Client-side processing prioritized within browser RAM whenever viable.',
        'Automated eviction: ephemeral server sandboxes purged immediately or within 15 minutes.',
        'Zero advertising networks, zero third-party tracking pixels, and zero data resale.',
        'Strict compliance with GDPR standards and data sovereignty principles.',
      ];

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Politique de confidentialité — EverydayTools Hub' : 'Privacy Policy — EverydayTools Hub'}</title>
        <meta name="description" content={isFr ? 'Politique de confidentialité et RGPD EverydayTools Hub.' : 'Privacy Policy for EverydayTools Hub.'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? '/fr/privacy' : '/privacy'}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/privacy" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/privacy" />
      </Helmet>
      <LegalPageLayout
        title={isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
        effectiveDate={isFr ? '7 novembre 2026' : 'November 7, 2026'}
        summaryTitle={isFr ? 'En résumé (TL;DR)' : 'Executive Summary (TL;DR)'}
        summaryPoints={summaryPoints}
        tocTitle={isFr ? 'Sommaire' : 'On this page'}
        sections={sections}
        contactTitle={isFr ? 'Une question sur la confidentialité de vos données ?' : 'Questions regarding your data privacy?'}
        contactText={isFr ? 'Pour toute interrogation relative à la protection de vos données :' : 'For questions concerning data protection:'}
        contactEmail={SITE_CONFIG.emails.privacy}
        lang={isFr ? 'fr' : 'en'}
      />
    </>
  );
}
