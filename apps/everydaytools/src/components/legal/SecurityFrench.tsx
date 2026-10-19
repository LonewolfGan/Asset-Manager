import type React from 'react';
import { S } from './security-styles';

export const SecurityFrench: React.FC = () => {
  return (
    <>
      <section style={S.section}>
        <h2 style={S.h2}>Signaler une vulnérabilité</h2>
        <p style={S.p}>
          Nous prenons la sécurité d'EverydayTools Hub très au sérieux. Si vous découvrez une vulnérabilité de sécurité,
          merci de nous la signaler de manière responsable par e-mail à{' '}
          <a href="mailto:security@everydaytools.app" style={S.email}>
            security@everydaytools.app
          </a>.
        </p>
        <p style={S.p}>Veuillez inclure :</p>
        <ul style={S.ul}>
          <li style={S.li}>Une description détaillée de la vulnérabilité</li>
          <li style={S.li}>Les étapes pour reproduire le comportement</li>
          <li style={S.li}>L'impact potentiel sur la sécurité ou la confidentialité</li>
          <li style={S.li}>Toute suggestion de remédiation technique (optionnel)</li>
        </ul>
        <div style={S.callout}>
          Contact de sécurité lisible par machine disponible sur{' '}
          <a href="/.well-known/security.txt" style={S.email}>
            /.well-known/security.txt
          </a>{' '}
          (RFC 9116).
        </div>
      </section>

      <hr style={S.divider} />

      <section style={S.section}>
        <h2 style={S.h2}>Nos pratiques de sécurité</h2>
        <ul style={S.ul}>
          <li style={S.li}>
            <strong>Architecture Hybride Sécurisée (Oracle VM).</strong> Les outils légers s'exécutent en mémoire dans votre navigateur.
            Pour les conversions complexes nécessitant des calculs haute fidélité, le traitement est confié à notre serveur API sur VM Oracle dédiée (Port 3001)
            sous utilisateur non privilégié (UID 10001), avec purge automatique et définitive des espaces temporaires sous 15 minutes.
          </li>
          <li style={S.li}>
            <strong>Politique de sécurité de contenu (CSP).</strong> Des en-têtes CSP stricts sont appliqués à chaque
            réponse HTTP pour bloquer l'injection de scripts et les ressources externes non autorisées.
          </li>
          <li style={S.li}>
            <strong>HSTS.</strong> Strict-Transport-Security avec préchargement (preload) pour imposer HTTPS chiffré sur l'ensemble des flux.
          </li>
          <li style={S.li}>
            <strong>Aucune conservation permanente de fichiers.</strong> Aucun document n'est archivé, indexé ou revendu.
            Les espaces de conversion (/tmp/everydaytools) sont isolés par UUID et purgés systématiquement.
          </li>
          <li style={S.li}>
            <strong>Assainissement systématique des entrées.</strong> Tout code HTML affiché dans le navigateur à partir de fichiers
            utilisateurs est préalablement assaini via DOMPurify.
          </li>
        </ul>
      </section>

      <hr style={S.divider} />

      <section style={S.section}>
        <h2 style={S.h2}>Périmètre (Scope)</h2>
        <p style={S.p}>Sont éligibles aux signalements éthiques :</p>
        <ul style={S.ul}>
          <li style={S.li}>L'application web everydaytools.app</li>
          <li style={S.li}>L'API backend et les passerelles de traitement éphémère</li>
          <li style={S.li}>La configuration des en-têtes HTTP de sécurité</li>
        </ul>
      </section>
    </>
  );
};
