import React from "react";
import { Link } from "wouter";
import { LegalSection } from "./LegalPageLayout";
import { SITE_CONFIG } from "@/config/site.config";
import { SlidersHorizontal } from "lucide-react";

export function getCookiesFrenchSections(): LegalSection[] {
  return [
    {
      id: "what-is-a-cookie",
      title: "1. Qu'est-ce qu'un cookie ou traceur local ?",
      content: (
        <>
          <p>
            Un <strong>cookie</strong> est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone)
            lors de la consultation d&apos;un site web. Il permet à son émetteur d&apos;identifier le terminal lors de visites ultérieures.
          </p>
          <p>
            Les technologies modernes de stockage local du navigateur, telles que le <code>localStorage</code> et le{" "}
            <code>sessionStorage</code>, permettent également de conserver des informations techniques directement sur votre machine
            sans transmission automatique d&apos;en-têtes HTTP à chaque requête.
          </p>
          <p>
            Conformément aux lignes directrices de la <strong>CNIL</strong> et aux dispositions du Règlement Général sur la Protection
            des Données (RGPD), <strong>EverydayTools Hub</strong> privilégie une approche minimaliste par conception (<em>Privacy by Design</em>) :
            aucun profil publicitaire intrusif n&apos;est créé et nos outils restent utilisables sans aucun compte utilisateur.
          </p>
        </>
      ),
    },
    {
      id: "trackers-inventory",
      title: "2. Inventaire transparent des traceurs utilisés",
      content: (
        <div className="space-y-4">
          <p>
            Le tableau ci-dessous détaille l&apos;ensemble des clés de stockage local et cookies techniques strictement nécessaires
            au fonctionnement et à l&apos;ergonomie d&apos;EverydayTools Hub :
          </p>

          <div className="w-full overflow-x-auto rounded-xl border border-border/70 bg-surface/30">
            <table className="w-full text-left text-sm font-ui border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-surface-raised/50 text-foreground font-medium font-display text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Clé de stockage</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Finalité technique</th>
                  <th className="py-3 px-4">Durée</th>
                  <th className="py-3 px-4">Statut CNIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-muted-foreground text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:theme</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Mémorisation du thème d&apos;affichage (clair, sombre ou système).</td>
                  <td className="py-3 px-4">Persistant</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempté de consentement</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:locale</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Mémorisation de la langue d&apos;interface sélectionnée (FR ou EN).</td>
                  <td className="py-3 px-4">Persistant</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempté de consentement</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et_consent</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Mémorisation de vos choix relatifs au consentement traceurs et analytics.</td>
                  <td className="py-3 px-4">13 mois max (CNIL)</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempté de consentement</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:recents</td>
                  <td className="py-3 px-4">localStorage</td>
                  <td className="py-3 px-4">Accès rapide aux derniers outils consultés (100% local, non transmis).</td>
                  <td className="py-3 px-4">Persistant</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempté de consentement</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-medium text-foreground">et:job:*</td>
                  <td className="py-3 px-4">sessionStorage</td>
                  <td className="py-3 px-4">Gestion de l&apos;état éphémère de conversion en cours dans l&apos;onglet actif.</td>
                  <td className="py-3 px-4">Session active</td>
                  <td className="py-3 px-4 text-foreground font-medium">Exempté de consentement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "audience-and-third-parties",
      title: "3. Traceurs tiers et mesures d'audience",
      content: (
        <>
          <p>
            <strong>Zéro cookie publicitaire tiers obligatoire :</strong> EverydayTools Hub n&apos;installe aucun tracker de ciblage
            commercial à votre insu. Aucun croisement de données n&apos;est réalisé avec des réseaux sociaux ou des courtiers en données (<em>data brokers</em>).
          </p>
          <p>
            <strong>Recommandations CNIL :</strong> Les mesures de performance et d&apos;audience éventuellement déployées
            sont configurées pour respecter scrupuleusement les critères d&apos;exemption de la CNIL (anonymisation complète des adresses IP,
            absence de recoupement de navigation inter-sites, et production exclusive de statistiques globales agrégées).
          </p>
          <p>
            Si des annonces publicitaires contextuelles optionnelles sont proposées pour financer l&apos;hébergement des serveurs,
            leur activation requiert votre consentement préalable et explicite via notre bandeau de préférences.
          </p>
        </>
      ),
    },
    {
      id: "manage-preferences",
      title: "4. Gestion et personnalisation de vos préférences",
      content: (
        <div className="space-y-4">
          <p>
            Vous conservez à tout moment la maîtrise absolue de vos choix. Vous pouvez accepter, refuser ou modifier vos préférences
            de traceurs en un clic à l&apos;aide du déclencheur interactif ci-dessous :
          </p>
          <div className="pt-2">
            <button
              type="button"
              data-testid="open-cookie-preferences-btn"
              onClick={() => window.dispatchEvent(new Event("et:show-consent"))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-surface hover:bg-surface-raised text-foreground font-ui text-sm font-medium transition-colors shadow-sm active:scale-[0.98]"
            >
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span>Personnaliser mes préférences de cookies</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ce réglage est également accessible en permanence depuis le lien « Préférences de cookies » situé dans le pied de page de chaque écran.
          </p>
        </div>
      ),
    },
    {
      id: "browser-configuration",
      title: "5. Comment configurer ou supprimer les traceurs depuis votre navigateur",
      content: (
        <>
          <p>
            Vous pouvez à tout moment configurer votre navigateur pour bloquer l&apos;enregistrement des cookies ou effacer les données
            de stockage local déjà enregistrées :
          </p>
          <ul className="space-y-1.5 pl-6 list-disc text-muted-foreground">
            <li>
              <strong>Google Chrome :</strong> Menu Paramètres &gt; Confidentialité et sécurité &gt; Cookies et données de sites.
            </li>
            <li>
              <strong>Mozilla Firefox :</strong> Menu Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites.
            </li>
            <li>
              <strong>Apple Safari :</strong> Menu Réglages &gt; Safari &gt; Confidentialité &gt; Bloquer tous les cookies.
            </li>
            <li>
              <strong>Microsoft Edge :</strong> Menu Paramètres &gt; Cookies et autorisations de site.
            </li>
          </ul>
          <p>
            <em>Remarque :</em> La désactivation totale du stockage local peut réinitialiser vos préférences de confort visuel
            (tel que le mode sombre ou le choix de langue) lors de votre prochaine visite.
          </p>
        </>
      ),
    },
    {
      id: "contact-dpo",
      title: "6. Contact et délégué à la protection des données",
      content: (
        <p>
          Pour toute question relative à l&apos;application de cette politique ou à l&apos;exercice de vos droits d&apos;accès,
          de rectification et d&apos;opposition, vous pouvez consulter notre{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium"
          >
            Politique de confidentialité
          </Link>{" "}
          ou adresser un message électronique à notre référent RGPD à l&apos;adresse :{" "}
          <a
            href={`mailto:${SITE_CONFIG.emails.privacy}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
          >
            {SITE_CONFIG.emails.privacy}
          </a>.
        </p>
      ),
    },
  ];
}
