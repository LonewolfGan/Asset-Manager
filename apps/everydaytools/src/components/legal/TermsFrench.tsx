import type React from 'react';
import { S } from './legal-styles';

export const TermsFrench: React.FC = () => {
  return (
    <>
      <section style={S.section}>
        <h2 style={S.h2}>1. Acceptation des conditions</h2>
        <p style={S.p}>
          En utilisant EverydayTools Hub (« le Service »), vous acceptez d'être lié par les présentes Conditions
          d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>2. Description du service</h2>
        <p style={S.p}>
          EverydayTools Hub propose une collection d'outils utilitaires gratuits comprenant la conversion de documents,
          le traitement d'images, la manipulation de texte, ainsi que des calculateurs de productivité.
          Les outils légers s'exécutent directement dans votre navigateur. Pour les conversions avancées nécessitant
          des calculs haute fidélité (documents bureautiques, PDF complexes, IA), le traitement est effectué de manière
          éphémère et sécurisée sur nos serveurs dédiés sans conservation permanente.
        </p>
        <p style={S.p}>
          Le Service est fourni à titre gracieux et est soutenu par des revenus publicitaires.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>3. Vos fichiers et données</h2>
        <p style={S.p}>
          La confidentialité de vos fichiers est une priorité absolue. Les outils côté client traitent vos données
          exclusivement dans la mémoire de votre navigateur. Pour les traitements assistés par serveur, vos fichiers
          sont traités dans des espaces isolés et éphémères, puis automatiquement purgés immédiatement après traitement.
          Aucun fichier n'est conservé, analysé ou partagé avec des tiers. Vous conservez l'entière propriété de tous vos éléments traités.
        </p>
        <p style={S.p}>
          Vous êtes seul responsable de vous assurer que vous disposez des droits nécessaires pour traiter les fichiers que
          vous chargez dans les outils, conformément aux lois applicables relatives au droit d'auteur et à la protection des données.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>4. Utilisation acceptable</h2>
        <p style={S.p}>Vous vous engagez à ne pas utiliser le Service pour :</p>
        <ul style={S.ul}>
          <li>Enfreindre toute loi ou réglementation en vigueur</li>
          <li>Porter atteinte aux droits de propriété intellectuelle de tiers</li>
          <li>Traiter des fichiers contenant du matériel illicite ou répréhensible</li>
          <li>Tenter de décompiler, rétro-concevoir ou surcharger le Service</li>
          <li>Employer des robots automatisés à un rythme nuisant à la disponibilité pour autrui</li>
        </ul>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>5. Conditions d'âge</h2>
        <p style={S.p}>
          Vous devez être âgé d'au moins 13 ans (ou 16 ans dans l'UE et au Royaume-Uni) pour utiliser le Service.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>6. Propriété intellectuelle</h2>
        <p style={S.p}>
          Le Service, son code source, son identité graphique et ses éléments de marque sont la propriété exclusive
          d'EverydayTools Hub. Vous ne pouvez pas copier, distribuer ou créer des œuvres dérivées sans autorisation écrite
          préalable, sous réserve des licences open-source régissant certaines dépendances.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>7. Exclusion de garanties</h2>
        <p style={S.p}>
          Le Service est fourni « en l'état » et « selon disponibilité », sans aucune garantie expresse ou tacite.
          Nous ne garantissons pas que le Service sera ininterrompu, exempt d'erreurs, ni que les documents produits
          répondront à une exigence spécifique d'exactitude.
        </p>
        <p style={S.p}>
          Conservez toujours une sauvegarde de vos fichiers sources originaux. Certaines opérations (telles que la compression
          ou la conversion matricielle) peuvent altérer la qualité visuelle.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>8. Limitation de responsabilité</h2>
        <p style={S.p}>
          Dans les limites autorisées par la législation applicable, EverydayTools Hub ne pourra être tenu responsable de
          dommages indirects, consécutifs ou accessoires (y compris la perte de données ou de gains) résultant de l'utilisation
          ou de l'impossibilité d'utiliser le Service.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>9. Services tiers</h2>
        <p style={S.p}>
          Le Service est susceptible de solliciter des ressources tierces (Google Fonts, Google AdSense, outils statistiques, CDN).
          L'utilisation de ces ressources relève de leurs conditions et politiques de confidentialité respectives.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>10. Modifications des conditions</h2>
        <p style={S.p}>
          Nous nous réservons le droit de mettre à jour les présentes Conditions à tout moment. Toute modification prend effet
          dès la révision de la date indiquée en haut de page. La poursuite de l'utilisation du Service vaut acceptation des conditions révisées.
        </p>
      </section>

      <hr style={S.hr} />

      <section style={S.section}>
        <h2 style={S.h2}>11. Contact</h2>
        <p style={S.p}>
          Pour toute question relative à ces Conditions :{' '}
          <a href="mailto:legal@everydaytoolshub.com" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
            legal@everydaytoolshub.com
          </a>.
        </p>
      </section>
    </>
  );
};
