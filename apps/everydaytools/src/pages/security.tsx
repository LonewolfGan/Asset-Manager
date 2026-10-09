import { Helmet } from 'react-helmet-async';
import { useLocale } from '@/hooks/use-locale';

const S = {
  page: {
    paddingTop: 48,
    paddingBottom: 80,
    fontFamily: 'var(--font-ui)',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 400,
    margin: '0 0 8px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  date: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-tertiary)',
    margin: '0 0 48px',
  } as React.CSSProperties,
  section: {
    marginBottom: 40,
  } as React.CSSProperties,
  h2: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    margin: '0 0 12px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  p: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 12px',
  } as React.CSSProperties,
  ul: {
    paddingLeft: 20,
    margin: '0 0 12px',
  } as React.CSSProperties,
  li: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: 6,
  } as React.CSSProperties,
  email: {
    color: 'var(--accent)',
    textDecoration: 'none',
  } as React.CSSProperties,
  callout: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    marginBottom: 16,
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 1.65,
  } as React.CSSProperties,
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

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
              ? 'Nos pratiques de sécurité, politique de divulgation responsable et signalement de vulnérabilités.'
              : 'Our security practices, responsible disclosure policy, and how to report a vulnerability.'
          }
        />
        <link rel="canonical" href="https://everydaytools.qzz.io/security" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/security" />
      </Helmet>

      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? 'Sécurité' : 'Security'}</h1>
        <p style={S.date}>{isFr ? 'Mis à jour en mai 2026' : 'Updated May 2026'}</p>

        {isFr ? (
          <>
            <section style={S.section}>
              <h2 style={S.h2}>Signaler une vulnérabilité</h2>
              <p style={S.p}>
                Si vous découvrez une vulnérabilité de sécurité dans EverydayTools, merci de la signaler de manière responsable
                en écrivant à{' '}
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
              <p style={S.p}>
                Nous accuserons réception de votre rapport sous 48 heures et vous tiendrons informé tout au long du
                processus de résolution. Nous ne proposons pas actuellement de programme de primes aux bogues (bug bounty),
                mais nous apprécions profondément toute divulgation éthique et responsable.
              </p>
              <div style={S.callout}>
                Un contact de sécurité lisible par machine est également disponible sur{' '}
                <a href="/.well-known/security.txt" style={S.email}>
                  /.well-known/security.txt
                </a>{' '}
                conformément à la{' '}
                <a
                  href="https://securitytxt.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={S.email}
                >
                  RFC 9116
                </a>.
              </div>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>Nos pratiques de sécurité</h2>
              <ul style={S.ul}>
                <li style={S.li}>
                  <strong>Tout le traitement de fichiers s'exécute côté client uniquement.</strong> Vos fichiers sont
                  traités intégralement dans votre navigateur à l'aide de WebAssembly et des API Web standards. Aucune donnée
                  de fichier n'est transmise sur nos serveurs.
                </li>
                <li style={S.li}>
                  <strong>Politique de sécurité de contenu (CSP).</strong> Des en-têtes CSP stricts sont appliqués à chaque
                  réponse HTTP pour bloquer l'injection de scripts, les ressources externes non autorisées et les attaques de détournement de clics.
                </li>
                <li style={S.li}>
                  <strong>HSTS.</strong> Strict-Transport-Security avec une durée de deux ans et préchargement (preload) pour imposer
                  le protocole HTTPS chiffré sur l'ensemble des requêtes.
                </li>
                <li style={S.li}>
                  <strong>Aucun cookie de traçage.</strong> Nous utilisons Plausible Analytics — sans cookies, sans collecte de données
                  personnelles, hébergé dans l'Union européenne. Aucun bandeau intrusif n'est requis.
                </li>
                <li style={S.li}>
                  <strong>Aucune conservation de données.</strong> Nous ne gérons aucun compte utilisateur, aucune base de données centrale,
                  et ne conservons aucun contenu de document. Le localStorage sert exclusivement aux préférences d'affichage (thème, langue)
                  et à la mise en cache horaire des taux de change.
                </li>
                <li style={S.li}>
                  <strong>Assainissement systématique des entrées.</strong> Tout code HTML affiché dans le navigateur à partir de fichiers
                  utilisateurs est préalablement assaini via DOMPurify.
                </li>
                <li style={S.li}>
                  <strong>Surveillance continue des dépendances.</strong> Les dépendances sont auditées régulièrement face aux vulnérabilités
                  CVE référencées. Les failles critiques ou élevées sont corrigées avant tout déploiement en production.
                </li>
              </ul>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>En-têtes de sécurité</h2>
              <p style={S.p}>
                Vous pouvez vérifier notre configuration d'en-têtes de manière indépendante :
              </p>
              <ul style={S.ul}>
                <li style={S.li}>
                  <a
                    href="https://securityheaders.com/?q=everydaytools.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.email}
                  >
                    securityheaders.com
                  </a>
                </li>
                <li style={S.li}>
                  <a
                    href="https://observatory.mozilla.org/analyze/everydaytools.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.email}
                  >
                    Mozilla Observatory
                  </a>
                </li>
              </ul>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>Périmètre (Scope)</h2>
              <p style={S.p}>Sont considérés comme éligibles aux rapports de sécurité :</p>
              <ul style={S.ul}>
                <li style={S.li}>L'application web everydaytools.app</li>
                <li style={S.li}>La logique de traitement côté client (XSS, fuites mémoire de données, failles logiques)</li>
                <li style={S.li}>La configuration erronée des en-têtes de sécurité HTTP</li>
              </ul>
              <p style={S.p}>Sont exclus du périmètre :</p>
              <ul style={S.ul}>
                <li style={S.li}>Les attaques par déni de service (DDoS) contre l'infrastructure d'hébergement</li>
                <li style={S.li}>L'ingénierie sociale visant l'équipe d'EverydayTools</li>
                <li style={S.li}>Les vulnérabilités propres aux prestataires tiers (Plausible, Vercel)</li>
              </ul>
            </section>
          </>
        ) : (
          <>
            <section style={S.section}>
              <h2 style={S.h2}>Reporting a vulnerability</h2>
              <p style={S.p}>
                If you discover a security vulnerability in EverydayTools, please report it responsibly
                by emailing{' '}
                <a href="mailto:security@everydaytools.app" style={S.email}>
                  security@everydaytools.app
                </a>.
              </p>
              <p style={S.p}>Please include:</p>
              <ul style={S.ul}>
                <li style={S.li}>A description of the vulnerability</li>
                <li style={S.li}>Steps to reproduce the issue</li>
                <li style={S.li}>The potential impact</li>
                <li style={S.li}>Any suggested remediation (optional)</li>
              </ul>
              <p style={S.p}>
                We will acknowledge your report within 48 hours and keep you informed throughout the
                resolution process. We do not currently offer a bug bounty program, but we deeply
                appreciate responsible disclosure.
              </p>
              <div style={S.callout}>
                A machine-readable security contact is also available at{' '}
                <a href="/.well-known/security.txt" style={S.email}>
                  /.well-known/security.txt
                </a>{' '}
                per{' '}
                <a
                  href="https://securitytxt.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={S.email}
                >
                  RFC 9116
                </a>.
              </div>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>Our security practices</h2>
              <ul style={S.ul}>
                <li style={S.li}>
                  <strong>All file processing is client-side only.</strong> Your files are processed
                  entirely in your browser using WebAssembly and Web APIs. No file data is ever
                  transmitted to our servers.
                </li>
                <li style={S.li}>
                  <strong>Content Security Policy.</strong> Strict CSP headers are enforced on every
                  response, blocking inline script injection, unauthorized third-party resources, and
                  framing attacks.
                </li>
                <li style={S.li}>
                  <strong>HSTS.</strong> Strict-Transport-Security with a two-year max-age and
                  preload is set to enforce HTTPS on all connections.
                </li>
                <li style={S.li}>
                  <strong>No tracking cookies.</strong> We use Plausible Analytics — cookieless, no
                  personal data collected, EU-hosted. No consent banner is required.
                </li>
                <li style={S.li}>
                  <strong>No data retention.</strong> We have no user accounts, no database, and store
                  no file content. localStorage is used only for UI preferences (theme, locale) and
                  currency rate caching with a 1-hour TTL.
                </li>
                <li style={S.li}>
                  <strong>Input sanitization.</strong> All HTML rendered in the browser from user
                  files is sanitized with DOMPurify before display.
                </li>
                <li style={S.li}>
                  <strong>Dependency scanning.</strong> Dependencies are audited regularly for known
                  CVEs. Critical and high-severity vulnerabilities are remediated before deployment.
                </li>
              </ul>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>Security headers</h2>
              <p style={S.p}>
                You can verify our security header configuration independently:
              </p>
              <ul style={S.ul}>
                <li style={S.li}>
                  <a
                    href="https://securityheaders.com/?q=everydaytools.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.email}
                  >
                    securityheaders.com
                  </a>
                </li>
                <li style={S.li}>
                  <a
                    href="https://observatory.mozilla.org/analyze/everydaytools.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.email}
                  >
                    Mozilla Observatory
                  </a>
                </li>
              </ul>
            </section>

            <hr style={S.divider} />

            <section style={S.section}>
              <h2 style={S.h2}>Scope</h2>
              <p style={S.p}>The following are considered in scope for vulnerability reports:</p>
              <ul style={S.ul}>
                <li style={S.li}>The everydaytools.app web application</li>
                <li style={S.li}>Client-side processing logic (XSS, data leakage, logic errors)</li>
                <li style={S.li}>Security header misconfiguration</li>
              </ul>
              <p style={S.p}>Out of scope:</p>
              <ul style={S.ul}>
                <li style={S.li}>Denial-of-service attacks against our hosting infrastructure</li>
                <li style={S.li}>Social engineering of EverydayTools personnel</li>
                <li style={S.li}>Vulnerabilities in third-party services (Plausible, Vercel)</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </>
  );
}
