import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { S } from '@/components/legal/legal-styles';
import { TermsFrench } from '@/components/legal/TermsFrench';
import { TermsEnglish } from '@/components/legal/TermsEnglish';

export default function Terms() {
  const { isFr } = useLocale();

  return (
    <>
      <Helmet>
        <title>{isFr ? "Conditions d'utilisation — EverydayTools Hub" : "Terms of Service — EverydayTools Hub"}</title>
        <meta
          name="description"
          content={
            isFr
              ? "Conditions d'utilisation d'EverydayTools Hub — suite gratuite d'outils de conversion de fichiers et de productivité."
              : "Terms of service for EverydayTools Hub — free file conversion and productivity tools."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/terms" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? "Conditions d'utilisation" : "Terms of Service"}</h1>
        <p style={S.date}>{isFr ? "Date d'effet : 26 mai 2025" : "Effective: May 26, 2025"}</p>

        {isFr ? <TermsFrench /> : <TermsEnglish />}
      </div>
    </>
  );
}
