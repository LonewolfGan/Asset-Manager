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
  h3: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    margin: '16px 0 6px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  p: {
    margin: '0 0 12px',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  ul: {
    margin: '0 0 12px',
    paddingLeft: 20,
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  a: {
    color: 'var(--text-primary)',
    textDecoration: 'underline',
  } as React.CSSProperties,
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

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
              ? 'Comment EverydayTools Hub gère vos données. Tout le traitement des fichiers se fait dans votre navigateur — aucun transfert sur serveur.'
              : 'How EverydayTools Hub handles your data. All file processing runs in your browser — nothing is uploaded.'
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/privacy" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/privacy" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? 'Politique de confidentialité' : 'Privacy Policy'}</h1>
        <p style={S.date}>{isFr ? 'Dernière mise à jour : 26 mai 2025' : 'Last updated: May 26, 2025'}</p>

        {isFr ? (
          <>
            <section style={S.section}>
              <h2 style={S.h2}>En résumé</h2>
              <p style={S.p}>
                EverydayTools Hub est une suite d'outils utilitaires exécutée dans votre navigateur. Chaque fichier que vous déposez — PDF, images, documents — est traité intégralement au sein de votre navigateur grâce à JavaScript. Rien n'est jamais envoyé sur nos serveurs. Nous ne demandons aucune création de compte, nous ne collectons pas vos fichiers ni leurs contenus, et nous ne vendons aucune donnée.
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
                Nous utilisons <a style={S.a} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>, une plateforme de statistiques open-source respectueuse de la vie privée et hébergée dans l'Union européenne. Plausible n'utilise pas de cookies, ne recueille aucune donnée personnelle et est exempté des exigences de consentement RGPD, PECR et CCPA. Il comptabilise les pages vues et les événements (ex. quel outil a été utilisé) à partir de données strictement agrégées et anonymes.
              </p>
              <p style={S.p}>
                Consultez la <a style={S.a} href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité de Plausible</a> pour plus de détails.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Publicité</h2>
              <p style={S.p}>
                Les publicités permettent de maintenir tous nos outils gratuits. Avec votre accord, nous affichons des annonces diffusées par{' '}
                <a style={S.a} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>.
                AdSense peut utiliser des cookies et des identifiants d'appareil pour proposer des annonces personnalisées fondées sur votre historique de navigation sur le Web.
              </p>
              <p style={S.p}>
                Si vous sélectionnez « Essentiels uniquement » dans le bandeau de consentement, aucun cookie publicitaire n'est déposé et seules des annonces non personnalisées peuvent être affichées. Vous pouvez modifier cette préférence à tout moment via le lien « Gérer les cookies » situé dans le pied de page.
              </p>
              <p style={S.p}>
                Vous pouvez également gérer la personnalisation des annonces Google directement sur{' '}
                <a style={S.a} href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Services tiers</h2>
              <ul style={S.ul}>
                <li>
                  <strong>Taux de change de devises</strong> — récupérés depuis{' '}
                  <a style={S.a} href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">open.er-api.com</a>.
                  Seule votre adresse IP est transmise de manière incidente dans le cadre de la requête HTTP ; aucune autre donnée n'est envoyée.
                </li>
                <li>
                  <strong>Détourage d'image par IA</strong> — le modèle d'IA (~40 Mo) est téléchargé depuis un CDN opéré par <a style={S.a} href="https://img.ly" target="_blank" rel="noopener noreferrer">img.ly</a> et s'exécute entièrement dans votre navigateur via WebAssembly. Vos images ne sont pas téléversées.
                </li>
                <li>
                  <strong>Google Fonts</strong> — les polices d'affichage et d'interface sont chargées depuis les serveurs de Google. Cela expose votre adresse IP à Google lors de la requête de chargement des polices.
                </li>
              </ul>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Vos droits (RGPD / CCPA)</h2>
              <p style={S.p}>
                Comme nous ne collectons aucune donnée personnelle sur nos serveurs, la plupart des droits des personnes concernées (accès, effacement, portabilité, rectification) sont automatiquement satisfaits — il n'y a rien à nous demander de fournir ou de supprimer. Toute donnée stockée localement dans votre navigateur reste sous votre contrôle total.
              </p>
              <p style={S.p}>
                Les résidents de l'UE et du Royaume-Uni peuvent retirer leur consentement aux annonces personnalisées à tout moment via le lien « Gérer les cookies ». Les résidents de Californie peuvent refuser la « vente » ou le « partage » de données personnelles — ne vendant aucune donnée, ce droit est automatiquement garanti.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Protection des mineurs</h2>
              <p style={S.p}>
                Ce service ne s'adresse pas aux enfants de moins de 13 ans (ou moins de 16 ans dans l'UE/Royaume-Uni). Nous ne traitons pas sciemment de données relatives à des mineurs. Si vous pensez qu'un mineur nous a transmis des données, merci de nous contacter.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Modifications de cette politique</h2>
              <p style={S.p}>
                Nous mettrons à jour la date en haut de cette page en cas de changement substantiel de nos pratiques relatives aux données. L'utilisation continue du service après modification vaut acceptation de la politique révisée.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Contact</h2>
              <p style={S.p}>
                Une question ou une remarque ? Écrivez-nous à{' '}
                <a style={S.a} href="mailto:privacy@everydaytoolshub.com">privacy@everydaytoolshub.com</a>.
              </p>
            </section>
          </>
        ) : (
          <>
            <section style={S.section}>
              <h2 style={S.h2}>The short version</h2>
              <p style={S.p}>
                EverydayTools Hub is a browser-based utility suite. Every file you upload — PDFs, images, documents
                — is processed entirely inside your own browser using JavaScript. Nothing is ever sent to our servers.
                We do not have accounts, we do not collect your files or their contents, and we do not sell data.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>What we store in your browser</h2>
              <p style={S.p}>
                The following is saved only to your browser's localStorage and is never transmitted to us:
              </p>
              <ul style={S.ul}>
                <li>Your language preference (English or French)</li>
                <li>Your theme preference (dark or light)</li>
                <li>Currency exchange rates — cached for one hour to reduce external API calls</li>
                <li>Your cookie consent choice — stored for one year</li>
              </ul>
              <p style={S.p}>
                You can clear this data at any time by clearing your browser's site data or local storage.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Analytics</h2>
              <p style={S.p}>
                We use <a style={S.a} href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>,
                a privacy-first, open-source analytics platform hosted in the EU. Plausible does not use cookies,
                does not collect personal data, and is exempt from GDPR, PECR, and CCPA consent requirements.
                It counts page views and custom events (e.g., which tool was used) using aggregated, non-identifiable
                data only.
              </p>
              <p style={S.p}>
                See <a style={S.a} href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer">Plausible's privacy policy</a> for full details.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Advertising</h2>
              <p style={S.p}>
                Ads keep all tools free. With your consent, we display ads served by{' '}
                <a style={S.a} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>.
                AdSense may use cookies and device identifiers to show personalised ads based on your browsing history
                across the web.
              </p>
              <p style={S.p}>
                If you click "Essential only" on the consent banner, no advertising cookies are set and only
                non-personalised ads (if any) may be shown. You can change this preference at any time via
                "Manage cookies" in the footer.
              </p>
              <p style={S.p}>
                You can also manage Google's ad personalisation directly at{' '}
                <a style={S.a} href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Third-party services</h2>
              <ul style={S.ul}>
                <li>
                  <strong>Currency exchange rates</strong> — fetched from{' '}
                  <a style={S.a} href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">open.er-api.com</a>.
                  Only your IP address is incidentally exposed as part of the HTTP request; no other data is sent.
                </li>
                <li>
                  <strong>AI background removal</strong> — the AI model (~40 MB) is downloaded from a CDN operated
                  by <a style={S.a} href="https://img.ly" target="_blank" rel="noopener noreferrer">img.ly</a> and
                  runs entirely in your browser using WebAssembly. Your images are not uploaded.
                </li>
                <li>
                  <strong>Google Fonts</strong> — display and UI fonts are loaded from Google's servers. This exposes
                  your IP address to Google as part of the font request.
                </li>
              </ul>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Your rights (GDPR / CCPA)</h2>
              <p style={S.p}>
                Because we do not collect personal data on our servers, most data subject rights (access, erasure,
                portability, rectification) are automatically satisfied — there is nothing for us to provide or delete.
                Any data stored locally in your browser is entirely under your control.
              </p>
              <p style={S.p}>
                EU and UK residents may withdraw consent for personalised advertising at any time using the
                "Manage cookies" link in the footer. California residents may opt out of the "sale" or "sharing"
                of personal data — as we do not sell data, this right is automatically satisfied.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Children</h2>
              <p style={S.p}>
                This service is not directed at children under 13 (or under 16 in the EU/UK). We do not knowingly
                process data from children. If you believe a child has provided personal data, please contact us.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Changes to this policy</h2>
              <p style={S.p}>
                We will update the date at the top of this page when our data practices change materially. Continued
                use of the service after changes constitutes acceptance of the revised policy.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>Contact</h2>
              <p style={S.p}>
                Questions or concerns? Email us at{' '}
                <a style={S.a} href="mailto:privacy@everydaytoolshub.com">privacy@everydaytoolshub.com</a>.
              </p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
