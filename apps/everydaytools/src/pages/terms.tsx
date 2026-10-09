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
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
};

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
              ? "Conditions d'utilisation d'EverydayTools Hub — suite gratuite d'outils de conversion de fichiers et de productivité dans le navigateur."
              : "Terms of service for EverydayTools Hub — free browser-based file conversion and productivity tools."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://everydaytools.qzz.io/terms" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/terms" />
      </Helmet>
      <div className="container-wide" style={S.page}>
        <h1 style={S.h1}>{isFr ? "Conditions d'utilisation" : "Terms of Service"}</h1>
        <p style={S.date}>{isFr ? "Date d'effet : 26 mai 2025" : "Effective: May 26, 2025"}</p>

        {isFr ? (
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
                EverydayTools Hub propose une collection d'outils utilitaires gratuits fonctionnant directement dans le navigateur,
                comprenant la conversion de PDF, le traitement d'images, la manipulation de texte, la conversion d'unités et de devises.
                Tout le traitement des fichiers s'exécute intégralement dans votre navigateur en JavaScript côté client.
                Aucun fichier n'est téléversé sur nos serveurs.
              </p>
              <p style={S.p}>
                Le Service est fourni à titre gracieux et est soutenu par des revenus publicitaires.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>3. Vos fichiers et données</h2>
              <p style={S.p}>
                Les fichiers que vous traitez à l'aide du Service restent sur votre appareil en permanence. Nous n'avons aucun
                accès à vos fichiers, à leur contenu, ni aux documents que vous générez. Vous conservez l'entière propriété de
                tous les éléments traités.
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
        ) : (
          <>
            <section style={S.section}>
              <h2 style={S.h2}>1. Acceptance of terms</h2>
              <p style={S.p}>
                By using EverydayTools Hub ("the Service"), you agree to these Terms of Service. If you do not agree,
                please do not use the Service.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>2. Description of service</h2>
              <p style={S.p}>
                EverydayTools Hub provides a collection of free, browser-based utility tools including PDF conversion,
                image processing, text generation, unit conversion, and calculators. All file processing runs entirely
                in your browser using client-side JavaScript. No files are uploaded to our servers.
              </p>
              <p style={S.p}>
                The Service is provided free of charge and is supported by advertising revenue.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>3. Your files and data</h2>
              <p style={S.p}>
                Files you process using the Service remain on your device at all times. We have no access to your
                files, their contents, or any output you generate. You retain full ownership of any files you process.
              </p>
              <p style={S.p}>
                You are solely responsible for ensuring you have the right to process any files you upload to the
                browser-based tools, including compliance with applicable copyright and data protection laws.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>4. Acceptable use</h2>
              <p style={S.p}>You agree not to use the Service to:</p>
              <ul style={S.ul}>
                <li>Violate any applicable law or regulation</li>
                <li>Infringe the intellectual property rights of others</li>
                <li>Process files containing child sexual abuse material or other illegal content</li>
                <li>Attempt to reverse-engineer, scrape, or overload the Service</li>
                <li>Use automated bots or scripts to access the Service at a rate that impairs others' use</li>
              </ul>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>5. Age requirement</h2>
              <p style={S.p}>
                You must be at least 13 years old (or 16 years old in the EU/UK) to use the Service.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>6. Intellectual property</h2>
              <p style={S.p}>
                The Service, its source code, design, and branding are the property of EverydayTools Hub. You may
                not reproduce, distribute, or create derivative works without prior written permission, except as
                permitted by applicable open-source licences covering individual components.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>7. Disclaimer of warranties</h2>
              <p style={S.p}>
                The Service is provided "as is" and "as available" without warranty of any kind, express or implied,
                including but not limited to warranties of merchantability, fitness for a particular purpose, or
                non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that
                output files will be accurate or suitable for any specific purpose.
              </p>
              <p style={S.p}>
                Always keep a backup of your original files. Some conversions (e.g., PDF compression, PDF to image)
                may reduce quality or remove features such as selectable text.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>8. Limitation of liability</h2>
              <p style={S.p}>
                To the maximum extent permitted by law, EverydayTools Hub and its operators shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits,
                or goodwill, arising from your use of or inability to use the Service.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>9. Third-party services</h2>
              <p style={S.p}>
                The Service may load resources from third parties (Google Fonts, Google AdSense, analytics providers,
                AI model CDNs). Your use of those services is subject to their respective terms and privacy policies.
                We are not responsible for the practices of third-party services.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>10. Changes to these terms</h2>
              <p style={S.p}>
                We reserve the right to modify these Terms at any time. Changes will be reflected by an updated
                effective date at the top of this page. Continued use of the Service after changes constitutes
                acceptance of the revised Terms.
              </p>
            </section>

            <hr style={S.hr} />

            <section style={S.section}>
              <h2 style={S.h2}>11. Contact</h2>
              <p style={S.p}>
                Questions about these Terms? Email us at{' '}
                <a href="mailto:legal@everydaytoolshub.com" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                  legal@everydaytoolshub.com
                </a>.
              </p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
