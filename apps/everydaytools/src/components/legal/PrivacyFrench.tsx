import type React from 'react';
import { S } from './legal-styles';

const linkStyle = { color: 'var(--text-primary)', textDecoration: 'underline' } as React.CSSProperties;

export const PrivacyFrench: React.FC = () => {
  return (
    <>
      <section style={S.section}>
        <h2 style={S.h2}>En résumé</h2>
        <p style={S.p}>
          EverydayTools Hub repose sur une architecture hybride conçue pour la confidentialité.
          Les outils légers (calculateurs, formateurs de code, aperçus) s'exécutent directement dans la mémoire de votre navigateur.
          Pour les conversions avancées nécessitant des calculs haute fidélité (documents bureautiques, PDF complexes, IA),
          le traitement est réalisé de façon strictement éphémère et sécurisée sur nos serveurs dédiés : vos fichiers sont placés dans des espaces isolés,
          traités, puis automatiquement et définitivement supprimés sous 15 minutes. Aucun fichier n'est conservé, revendu ou analysé.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Ce que nous stockons dans votre navigateur</h2>
        <p style={S.p}>
          Les informations suivantes sont conservées uniquement dans le stockage local (localStorage) de votre navigateur et ne nous sont jamais transmises :
        </p>
        <ul style={S.ul}>
          <li>Votre préférence linguistique (français ou anglais)</li>
          <li>Votre préférence d'affichage (thème sombre ou clair)</li>
          <li>Les taux de change de devises — mis en cache pendant une heure pour réduire les appels API externes</li>
          <li>Votre choix de consentement aux cookies — conservé pendant un an</li>
        </ul>
        <p style={S.p}>
          Vous pouvez supprimer ces données à tout moment en effaçant les données de site ou le stockage local de votre navigateur.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Statistiques et mesure d'audience</h2>
        <p style={S.p}>
          Nous utilisons <a style={linkStyle} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
          une plateforme de statistiques open-source respectueuse de la vie privée et hébergée dans l'Union européenne. Plausible n'utilise pas de cookies,
          ne recueille aucune donnée personnelle et est exempté des exigences de consentement RGPD. Il comptabilise les pages vues à partir de données strictement agrégées.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Publicité</h2>
        <p style={S.p}>
          Les publicités permettent de maintenir tous nos outils gratuits. Avec votre accord, nous affichons des annonces diffusées par{' '}
          <a style={linkStyle} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>.
          Si vous sélectionnez « Essentiels uniquement », aucun cookie publicitaire n'est déposé et seules des annonces non personnalisées sont affichées.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Vos droits (RGPD / CCPA)</h2>
        <p style={S.p}>
          Comme nous ne conservons aucun fichier ni donnée personnelle sur nos serveurs, vos documents restent sous votre contrôle exclusif.
          Pour les traitements éphémères assistés par serveur, les fichiers sont automatiquement détruits immédiatement après conversion.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>Contact</h2>
        <p style={S.p}>
          Une question relative à la confidentialité ? Écrivez-nous à{' '}
          <a style={linkStyle} href="mailto:privacy@everydaytoolshub.com">privacy@everydaytoolshub.com</a>.
        </p>
      </section>
    </>
  );
};
