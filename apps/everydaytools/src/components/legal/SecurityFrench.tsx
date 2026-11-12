import React from 'react';
import type { LegalSection } from './LegalPageLayout';
import { SITE_CONFIG } from '@/config/site.config';

export const getSecurityFrenchSections = (): LegalSection[] => [
  {
    id: 'responsible-disclosure',
    title: '1. Signalement responsable de vulnérabilités',
    content: (
      <>
        <p>
          La protection des utilisateurs et de leurs flux de données est notre priorité absolue. Si vous identifiez une faiblesse,
          une anomalie ou une vulnérabilité potentielle sur notre plateforme, nous vous invitons à nous en informer selon les règles
          de la divulgation coordonnée et responsable :
        </p>
        <p>
          <a
            href={`mailto:${SITE_CONFIG.emails.security}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium font-mono"
          >
            {SITE_CONFIG.emails.security}
          </a>
        </p>
        <p>Pour faciliter le traitement de votre signalement, veillez à inclure :</p>
        <ul>
          <li>Une description concise et précise de la vulnérabilité observée.</li>
          <li>Les étapes reproductibles (Proof of Concept sans charge destructrice).</li>
          <li>L&apos;impact potentiel sur la confidentialité ou l&apos;intégrité du service.</li>
        </ul>
        <div className="p-3 sm:p-4 rounded-xl border border-border/70 bg-surface/50 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Un contact de sécurité lisible par machine est disponible conformément au standard RFC 9116 sur{' '}
          <a
            href="/.well-known/security.txt"
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono"
          >
            /.well-known/security.txt
          </a>.
        </div>
      </>
    ),
  },
  {
    id: 'defense-in-depth',
    title: '2. Principes d&apos;architecture de défense en profondeur',
    content: (
      <>
        <p>
          EverydayTools Hub applique le principe du moindre privilège et de l&apos;isolation stricte à chaque étape du cycle de traitement :
        </p>
        <ul>
          <li>
            <strong>Exécution locale sans réseau :</strong> Les outils de manipulation courante s&apos;exécutent en mémoire dans la sandbox de votre navigateur. Aucune donnée ne traverse Internet.
          </li>
          <li>
            <strong>Environnements de calcul cloisonnés (Oracle Cloud) :</strong> Les conversions documentaires complexes sont prises en charge par des instances isolées et sans privilèges administratifs sur notre infrastructure Oracle Cloud, interdisant tout accès latéral au système hôte.
          </li>
          <li>
            <strong>Assainissement préventif (Sanitization) :</strong> L&apos;ensemble des rendus dynamiques de code et documents HTML est strictement filtré via DOMPurify pour neutraliser toute injection XSS.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'isolation-eviction',
    title: '3. Isolation et destruction des données de conversion',
    content: (
      <>
        <p>
          Nous ne disposons d&apos;aucun système d&apos;archivage permanent de documents.
        </p>
        <p>
          Chaque traitement serveur génère une session volatile dédiée, hermétique aux autres requêtes concurrentes.
          Dès que la transformation est terminée et que le document converti vous est transmis, l&apos;espace de travail est immédiatement purgé.
          Un mécanisme d&apos;éviction automatisé détruit irrémédiablement tout résidu temporaire après un délai maximal de 15 minutes.
        </p>
      </>
    ),
  },
  {
    id: 'network-hardening',
    title: '4. En-têtes et durcissement réseau',
    content: (
      <>
        <p>
          Toutes les communications bénéficient d&apos;un chiffrement de pointe TLS 1.3 avec redirection forcée HTTPS (HSTS avec preload).
        </p>
        <p>
          Nos en-têtes HTTP intègrent des politiques strictes de sécurité :
        </p>
        <ul>
          <li><strong>Content-Security-Policy (CSP) :</strong> Restriction stricte des sources de scripts pour empêcher les attaques par injection de contenu.</li>
          <li><strong>X-Content-Type-Options :</strong> Prévention du reniflage de type MIME (nosniff).</li>
          <li><strong>Referrer-Policy :</strong> Protection stricte des métadonnées de navigation (strict-origin-when-cross-origin).</li>
          <li><strong>Permissions-Policy :</strong> Désactivation des capteurs matériels inutiles (caméra, microphone, géolocalisation).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'scope',
    title: '5. Périmètre éligible (Scope)',
    content: (
      <>
        <p>Les éléments suivants sont éligibles aux audits éthiques et aux signalements de sécurité :</p>
        <ul>
          <li>Le domaine web de production : <code>{SITE_CONFIG.domain}</code>.</li>
          <li>Les points de terminaison de l&apos;API de traitement des documents.</li>
          <li>La configuration des en-têtes HTTP et du protocole TLS.</li>
        </ul>
        <p>
          Sont formellement exclus du périmètre : les attaques par déni de service (DDoS), l&apos;ingénierie sociale (phishing) et les scanners automatisés massifs non coordonnés.
        </p>
      </>
    ),
  },
];

export const SecurityFrench: React.FC = () => {
  const sections = getSecurityFrenchSections();
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
