import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { S } from '@/components/legal/legal-styles';
import { PrivacyFrench } from '@/components/legal/PrivacyFrench';
import { PrivacyEnglish } from '@/components/legal/PrivacyEnglish';

export default function Privacy() {
  const { isFr } = useLocale();

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Politique de confidentialité — EverydayTools Hub' : 'Privacy Policy — EverydayTools Hub'}</title>
        <meta
          name="description"
          content={
            isFr
              ? 'Comment EverydayTools Hub gère vos données. Traitement éphémère et sécurisé, aucune conservation permanente.'
              : 'How EverydayTools Hub handles your data. Ephemeral, secure processing with zero persistent storage.'
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/privacy" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? 'Politique de confidentialité' : 'Privacy Policy'}</h1>
        <p style={S.date}>{isFr ? 'Dernière mise à jour : 26 mai 2025' : 'Last updated: May 26, 2025'}</p>

        {isFr ? <PrivacyFrench /> : <PrivacyEnglish />}
      </div>
    </>
  );
}
