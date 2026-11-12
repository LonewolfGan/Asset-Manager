import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getTermsFrenchSections = (): LegalSection[] => [
  {
    id: 'acceptance',
    title: '1. Acceptation des conditions',
    content: (
      <>
        <p>
          En accédant à EverydayTools Hub ou en utilisant l&apos;un quelconque de nos outils, vous acceptez sans réserve
          d&apos;être lié par les présentes Conditions d&apos;utilisation.
        </p>
        <p>
          Si vous n&apos;acceptez pas ces conditions dans leur intégralité, vous êtes invité à ne pas utiliser nos services.
          L&apos;accès à notre plateforme est entièrement libre et ne requiert aucune création de compte personnel.
        </p>
      </>
    ),
  },
  {
    id: 'service-description',
    title: '2. Description du service',
    content: (
      <>
        <p>
          EverydayTools Hub met à disposition une collection d&apos;outils de productivité numérique couvrant la manipulation
          de documents (PDF), la conversion de formats visuels et audio, l&apos;optimisation de données et le calcul utilitaire.
        </p>
        <p>
          L&apos;architecture de nos outils privilégie le traitement direct au sein de votre navigateur (WebAssembly, Canvas,
          Web Workers). Pour les traitements avancés requérant des moteurs haute fidélité, les opérations sont déléguées à
          nos environnements de calcul éphémères et sécurisés sans stockage persistant.
        </p>
        <p>
          Le Service est fourni à titre gratuit pour tous les utilisateurs.
        </p>
      </>
    ),
  },
  {
    id: 'files-and-data',
    title: '3. Vos fichiers et données',
    content: (
      <>
        <p>
          La souveraineté et la confidentialité de vos données sont au cœur de nos principes d&apos;ingénierie :
        </p>
        <ul>
          <li>
            <strong>Traitement local prioritaire :</strong> Pour les outils compatibles, aucun octet de votre fichier ne quitte votre machine.
          </li>
          <li>
            <strong>Espaces éphémères isolés :</strong> Pour les opérations assistées par serveur, les fichiers sont traités dans des environnements strictement cloisonnés et purgés automatiquement dès la fin de l&apos;opération ou après un délai de garde de 15 minutes.
          </li>
          <li>
            <strong>Zéro rétention ni revente :</strong> Aucun fichier utilisateur n&apos;est conservé, analysé à des fins commerciales ou partagé avec des tiers.
          </li>
          <li>
            <strong>Propriété totale :</strong> Vous conservez 100% de vos droits d&apos;auteur et de propriété intellectuelle sur l&apos;ensemble des contenus que vous chargez.
          </li>
        </ul>
        <p>
          Vous êtes seul responsable de vous assurer que vous disposez des autorisations légales nécessaires pour traiter les documents que vous soumettez.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: '4. Utilisation acceptable',
    content: (
      <>
        <p>Vous vous engagez à utiliser EverydayTools Hub de manière éthique et respectueuse :</p>
        <ul>
          <li>Ne pas soumettre de contenus illicites, haineux ou portant atteinte aux droits de tiers.</li>
          <li>Ne pas tenter de perturber, surcharger ou dégrader les infrastructures du service (attaques DoS/DDoS).</li>
          <li>Ne pas exploiter de robots d&apos;extraction massive à une fréquence de requêtes abusive nuisant aux autres usagers.</li>
          <li>Ne pas chercher à sonder ou compromettre l&apos;intégrité technique de nos systèmes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: '5. Propriété intellectuelle',
    content: (
      <>
        <p>
          Le design, l&apos;ergonomie, le code source propre à la plateforme, la marque et l&apos;identité visuelle d&apos;EverydayTools Hub
          sont protégés par le droit de la propriété intellectuelle.
        </p>
        <p>
          Les composants open-source intégrés à la plateforme demeurent soumis à leurs licences respectives (MIT, Apache 2.0, etc.).
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer',
    title: '6. Exclusion de garanties',
    content: (
      <>
        <p>
          Le Service est mis à disposition « en l&apos;état » et « selon disponibilité », sans garantie d&apos;aucune sorte,
          expresse ou implicite. Bien que nous appliquions des standards rigoureux de qualité, nous ne garantissons pas
          l&apos;absence totale d&apos;anomalies ou l&apos;ininterruption continue du service.
        </p>
        <p>
          Il relève de votre responsabilité de conserver une copie de sauvegarde de vos documents originaux avant toute opération de compression ou de transformation.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-liability',
    title: '7. Limitation de responsabilité',
    content: (
      <>
        <p>
          Dans la mesure maximale permise par la législation applicable, EverydayTools Hub ne pourra être tenu responsable
          des dommages directs, indirects ou fortuits (y compris la perte de données ou le manque à gagner) résultant de l&apos;utilisation
          ou de l&apos;impossibilité d&apos;utiliser nos utilitaires.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: '8. Contact & Questions juridiques',
    content: (
      <>
        <p>
          Pour toute question, demande de clarification ou notification relative aux présentes Conditions d&apos;utilisation,
          vous pouvez contacter notre équipe juridique à l&apos;adresse suivante :
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.legal}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.legal}
          </a>
        </p>
      </>
    ),
  },
];

export const TermsFrench: React.FC = () => {
  const sections = getTermsFrenchSections();
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
