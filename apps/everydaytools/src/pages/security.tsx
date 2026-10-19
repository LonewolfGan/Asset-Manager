import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';
import { S } from '@/components/legal/security-styles';
import { SecurityFrench } from '@/components/legal/SecurityFrench';
import { SecurityEnglish } from '@/components/legal/SecurityEnglish';

export default function Security() {
  const { isFr } = useLocale();

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Sécurité — EverydayTools Hub' : 'Security — EverydayTools Hub'}</title>
        <meta
          name="description"
          content={
            isFr
              ? 'Pratiques de sécurité et signalement des vulnérabilités chez EverydayTools Hub. Architecture hybride et isolation par conteneurs.'
              : 'Security practices and vulnerability reporting for EverydayTools Hub. Secure hybrid architecture and container sandboxing.'
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/security" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/security" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? 'Sécurité' : 'Security'}</h1>
        <p style={S.date}>{isFr ? 'Dernière mise à jour : 26 mai 2025' : 'Last updated: May 26, 2025'}</p>

        {isFr ? <SecurityFrench /> : <SecurityEnglish />}
      </div>
    </>
  );
}
