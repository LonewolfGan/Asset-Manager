import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getPrivacyFrenchSections = (): LegalSection[] => [
  {
    id: 'principles',
    title: '1. Principes fondamentaux',
    content: (
      <>
        <p>
          EverydayTools Hub repose sur un engagement technique strict : la protection intégrale de votre vie privée et de la souveraineté de vos fichiers.
        </p>
        <p>
          Notre modèle repose sur une ingénierie locale prioritaire. Les outils du quotidien (calculs, formateurs, encodeurs, manipulation de texte)
          s&apos;exécutent intégralement au sein de la mémoire vive de votre navigateur via WebAssembly et les standards HTML5. Vos fichiers ne transitent
          jamais par un quelconque serveur.
        </p>
        <p>
          Pour les conversions documentaires complexes nécessitant des calculs haute fidélité, les fichiers sont traités dans des environnements
          strictement isolés et éphémères, puis supprimés immédiatement dès la génération du résultat (ou sous 15 minutes maximum par purge automatisée).
        </p>
      </>
    ),
  },
  {
    id: 'local-storage',
    title: '2. Données stockées localement dans votre navigateur',
    content: (
      <>
        <p>
          Nous ne créons aucun profil utilisateur et n&apos;exigeons aucun compte. Les seules données persistées le sont localement dans votre propre navigateur
          (localStorage) afin d&apos;améliorer votre confort d&apos;utilisation :
        </p>
        <ul>
          <li>Votre préférence linguistique (Français ou Anglais).</li>
          <li>Votre thème d&apos;interface (mode Sombre ou Clair).</li>
          <li>Le cache horaire des taux de conversion de devises (afin de limiter les appels réseau externes).</li>
        </ul>
        <p>
          Ces préférences restent cantonnées à votre navigateur et ne sont jamais téléversées ni exploitées à des fins d&apos;identification.
          Vous pouvez les purger à tout instant via les paramètres de confidentialité de votre navigateur.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: '3. Mesure d&apos;audience respectueuse & Zéro publicité',
    content: (
      <>
        <p>
          EverydayTools Hub n&apos;intègre aucune régie publicitaire, aucun cookie de pistage tiers et aucun tracker invasif.
        </p>
        <p>
          Pour mesurer la fréquentation globale de la plateforme de manière éthique, nous utilisons une télémétrie anonyme et agrégée respectueuse des
          recommandations de la CNIL et du RGPD. Aucune adresse IP n&apos;est persistée, aucun profil individuel n&apos;est constitué et aucun cookie n&apos;est déposé.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: '4. Vos droits (RGPD, CCPA & Souveraineté)',
    content: (
      <>
        <p>
          Puisque nous n&apos;archivons aucun document et ne collectons aucune donnée personnelle identifiable, vos fichiers demeurent sous votre maîtrise exclusive :
        </p>
        <ul>
          <li><strong>Zéro revente :</strong> Vos fichiers ne sont ni vendus, ni partagés, ni cédés à des courtiers de données.</li>
          <li><strong>Zéro entraînement d&apos;IA non consenti :</strong> Aucun document traité sur notre plateforme n&apos;est utilisé pour alimenter ou entraîner des modèles d&apos;apprentissage machine tiers.</li>
          <li><strong>Droit à l&apos;oubli automatique :</strong> Les espaces temporaires de conversion sont détruits de manière irréversible dès achèvement de la tâche.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'contact',
    title: '5. Contact DPO & Confidentialité',
    content: (
      <>
        <p>
          Pour toute question relative à notre architecture de confidentialité ou pour exercer vos droits conformément au RGPD, contactez directement notre référent :
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.privacy}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.privacy}
          </a>
        </p>
      </>
    ),
  },
];

export const PrivacyFrench: React.FC = () => {
  const sections = getPrivacyFrenchSections();
  return (
    <div>
      {sections.map((sec) => (
        <section key={sec.id} id={sec.id} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>{sec.title}</h2>
          <div>{sec.content}</div>
        </section>
      ))}
    </div>
  );
};
