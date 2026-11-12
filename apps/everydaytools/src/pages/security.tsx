import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getSecurityFrenchSections } from '@/components/legal/SecurityFrench';
import { getSecurityEnglishSections } from '@/components/legal/SecurityEnglish';
import { SITE_CONFIG } from '@/config/site.config';

export default function Security() {
  const { isFr } = useLocale();
  const sections = isFr ? getSecurityFrenchSections() : getSecurityEnglishSections();
  const summaryPoints = isFr
    ? [
        'Exécution locale privilégiée dans la mémoire vive de votre navigateur.',
        'Cloisonnement strict sur instances éphémères dédiées Oracle Cloud.',
        'Zéro rétention permanente : purge irréversible sous 15 minutes max.',
        'Défense en profondeur : HTTPS forcé, CSP strict, et DOMPurify.',
        'Canal direct pour les chercheurs en sécurité (RFC 9116).',
      ]
    : [
        'Client-side execution prioritized inside your browser memory.',
        'Sandboxed isolation on dedicated ephemeral Oracle Cloud instances.',
        'Zero permanent file storage: 15-minute garbage collection sweep.',
        'Hardened defenses: mandatory HTTPS, strict CSP, and DOMPurify.',
        'Coordinated vulnerability reporting channel (RFC 9116).',
      ];

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Sécurité & Signalement — EverydayTools Hub' : 'Security & Disclosure — EverydayTools Hub'}</title>
        <meta name="description" content={isFr ? 'Pratiques de sécurité et signalement responsable EverydayTools.' : 'Security practices and responsible disclosure.'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://everydaytools.qzz.io${isFr ? '/fr/security' : '/security'}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/security" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr/security" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/security" />
      </Helmet>
      <LegalPageLayout
        title={isFr ? 'Sécurité' : 'Security'}
        effectiveDate={isFr ? '7 novembre 2026' : 'November 7, 2026'}
        summaryTitle={isFr ? 'En résumé (TL;DR)' : 'Executive Summary (TL;DR)'}
        summaryPoints={summaryPoints}
        tocTitle={isFr ? 'Sommaire' : 'On this page'}
        sections={sections}
        contactTitle={isFr ? 'Signalement de vulnérabilité éthique' : 'Ethical Vulnerability Reporting'}
        contactText={isFr ? 'Pour signaler une anomalie de sécurité :' : 'To report a vulnerability or security bug:'}
        contactEmail={SITE_CONFIG.emails.security}
        lang={isFr ? 'fr' : 'en'}
      />
    </>
  );
}
