import React from "react";
import { Link } from "wouter";
import { LegalPageLayout, LegalSection } from "./LegalPageLayout";
import { SITE_CONFIG } from "@/config/site.config";

export function getLegalNoticeFrenchSections(): LegalSection[] {
  return [
    {
      id: "publisher",
      title: "1. Éditeur de la plateforme",
      content: (
        <>
          <p>
            Le site <strong>EverydayTools Hub</strong> (accessible à l&apos;adresse{" "}
            <a
              href={SITE_CONFIG.url}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.domain}
            </a>
            ) est édité par le collectif technique indépendant EverydayTools Hub, dédié au développement
            d&apos;utilitaires numériques libres, gratuits et respectueux de la vie privée.
          </p>
          <p>
            Courriel de contact légal :{" "}
            <a
              href={`mailto:${SITE_CONFIG.emails.legal}`}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.emails.legal}
            </a>
          </p>
        </>
      ),
    },
    {
      id: "publication-director",
      title: "2. Directeur de la publication",
      content: (
        <p>
          Le directeur de la publication et responsable éditorial de la plateforme est l&apos;équipe de coordination
          EverydayTools Hub, joignable directement par voie électronique à l&apos;adresse :{" "}
          <a
            href={`mailto:${SITE_CONFIG.emails.contact}`}
            className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
          >
            {SITE_CONFIG.emails.contact}
          </a>.
        </p>
      ),
    },
    {
      id: "hosting",
      title: "3. Hébergeur de la plateforme (Obligation LCEN Art. 6-III-1)",
      content: (
        <>
          <p>
            Conformément aux dispositions de l&apos;article 6, III, 1 de la loi n° 2004-575 du 21 juin 2004 pour la
            confiance dans l&apos;économie numérique (LCEN), l&apos;infrastructure d&apos;hébergement et de calcul est assurée par :
          </p>
          <div className="p-4 rounded-xl border border-border/70 bg-surface/50 text-sm text-foreground/90 space-y-1 font-mono">
            <p className="font-semibold text-foreground">Oracle Cloud Infrastructure (Oracle France SAS)</p>
            <p>15 boulevard Charles de Gaulle</p>
            <p>92700 Colombes, France</p>
            <p className="text-muted-foreground text-xs pt-1">
              Téléphone : +33 1 57 60 20 20 — Site web :{" "}
              <a
                href="https://www.oracle.com/cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                oracle.com/cloud
              </a>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Les serveurs dédiés au traitement exécutent les conversions au sein de l&apos;Union Européenne avec isolation
            éphémère complète des espaces de travail.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "4. Propriété intellectuelle et logiciels tiers",
      content: (
        <>
          <p>
            L&apos;ensemble de la structure du site, les composants interactifs, les textes et les interfaces graphiques
            sont la propriété d&apos;EverydayTools Hub ou sont exploités sous licences libres (MIT, Apache 2.0).
          </p>
          <p>
            Les moteurs de conversion intégrés reposent sur des standards ouverts et des bibliothèques reconnues
            du monde libre (LibreOffice, Ghostscript, qpdf, potrace, rembg ONNX, Tesseract OCR). Les marques et dénominations
            de tiers (telles que PDF, Word, Excel, PowerPoint) sont citées uniquement à titre d&apos;information technique.
          </p>
        </>
      ),
    },
    {
      id: "data-protection",
      title: "5. Protection des données personnelles et cookies",
      content: (
        <>
          <p>
            EverydayTools applique une politique stricte de confidentialité par conception (Privacy by Design) :
            aucun fichier téléversé pour traitement n&apos;est conservé de manière persistante. Les répertoires de travail
            temporaires sont purgés automatiquement et définitivement après chaque opération (délai maximum de 15 minutes).
          </p>
          <p>
            Pour toute demande relative à vos données ou pour faire valoir vos droits conformément au Règlement Général
            sur la Protection des Données (RGPD), consultez notre{" "}
            <Link
              href="/fr/privacy"
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-medium"
            >
              Politique de Confidentialité
            </Link>{" "}
            ou contactez :{" "}
            <a
              href={`mailto:${SITE_CONFIG.emails.privacy}`}
              className="text-foreground underline underline-offset-4 decoration-border/80 hover:decoration-foreground transition-colors font-mono font-medium"
            >
              {SITE_CONFIG.emails.privacy}
            </a>.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "6. Limitation de responsabilité",
      content: (
        <p>
          Les outils de conversion et d&apos;édition sont fournis à titre gratuit et « en l&apos;état », sans garantie expresse
          ou implicite quant à leur adéquation à un usage professionnel particulier. L&apos;utilisateur est invité à conserver
          une copie de sauvegarde de ses documents originaux avant toute opération.
        </p>
      ),
    },
  ];
}

export const LegalNoticeFrench: React.FC = () => {
  const sections = getLegalNoticeFrenchSections();

  return (
    <LegalPageLayout
      title="Mentions légales"
      effectiveDate="7 novembre 2026"
      summaryTitle="En résumé (Obligations LCEN)"
      summaryPoints={[
        "Éditeur : EverydayTools Hub — Collectif dédié aux outils numériques libres et gratuits.",
        "Hébergeur de l'infrastructure : Oracle Cloud Infrastructure (Oracle France SAS, 92700 Colombes).",
        "Zéro conservation : suppression automatique de tous les fichiers traités sous 15 minutes maximum.",
        "Conformité RGPD intégrale : aucune vente de données, zéro pistage publicitaire tiers.",
      ]}
      sections={sections}
      contactTitle="Une question d'ordre légal ou administratif ?"
      contactText="Notre référent juridique et conformité répond à vos notifications et demandes officielles."
      contactEmail={SITE_CONFIG.emails.legal}
      lang="fr"
    />
  );
};
