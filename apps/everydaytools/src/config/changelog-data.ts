export interface ChangelogRelease {
  id: string;
  version: string;
  dateFr: string;
  dateEn: string;
  isoDate: string;
  badge: {
    labelFr: string;
    labelEn: string;
    variant?: "default" | "accent" | "success";
  };
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  changesFr: string[];
  changesEn: string[];
  tools?: { name: string; slug: string }[];
  metrics?: { labelFr: string; labelEn: string; value: string }[];
}

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    id: "v2-4-0",
    version: "v2.4.0",
    dateFr: "12 novembre 2026",
    dateEn: "November 12, 2026",
    isoDate: "2026-11-12",
    badge: {
      labelFr: "Design & Conformité",
      labelEn: "Design & Compliance",
      variant: "accent",
    },
    titleFr: "Refonte Haute Fidélité, Mentions Légales LCEN & Transparence Cookies",
    titleEn: "High-Fidelity Resend Architecture, LCEN Legal Notice & Cookie Transparency",
    summaryFr:
      "Modernisation intégrale des interfaces éditoriales selon les standards Resend et Awwwards, déploiement des mentions statutaires obligatoires (Art. 6-III-1 LCEN) et transparence totale sur le stockage local client-side.",
    summaryEn:
      "Comprehensive editorial redesign following Resend and Awwwards standards, launch of statutory French LCEN disclosures, and complete transparency on client-side storage keys.",
    changesFr: [
      "Architecture de lecture Resend-tier : conteneur centré fluide, typographie suisse, élimination des barres latérales et zéro fil d'ariane.",
      "Page Mentions Légales (/mentions-legales) : identification de l'éditeur, du directeur de publication et de l'hébergeur Oracle Cloud France SAS.",
      "Politique des Cookies & Traceurs (/cookies) : inventaire transparent du localStorage (thème, langue, consentement) et contrôle haptique immédiat.",
      "Page Erreur 403 / Accès restreint (/403) : intégration de l'illustration brandée de sécurité et conseils de réinitialisation rate-limit.",
      "Composants officiels MagicCard & InteractiveHoverButton intégrés depuis les registres de classe mondiale.",
    ],
    changesEn: [
      "Resend-tier reading architecture: centered fluid reading container, Swiss typography, elimination of sidebars and breadcrumbs.",
      "Legal Notice page (/legal-notice): full disclosure of publisher, editorial director, and hosting infrastructure (Oracle Cloud France SAS).",
      "Cookie & Tracker Policy (/cookies): transparent inventory of localStorage keys (theme, locale, consent) with instant haptic toggle.",
      "Error 403 Access Denied page (/403): branded security guard illustration with clear rate-limit recovery instructions.",
      "Official MagicCard & InteractiveHoverButton components sourced from world-class component registries.",
    ],
    tools: [
      { name: "Mentions Légales", slug: "mentions-legales" },
      { name: "Cookies", slug: "cookies" },
      { name: "Accès Refusé (403)", slug: "403" },
    ],
    metrics: [
      { labelFr: "Temps de chargement", labelEn: "Load Time", value: "< 120ms" },
      { labelFr: "Score Accessibilité", labelEn: "A11y Score", value: "100/100" },
    ],
  },
  {
    id: "v2-3-0",
    version: "v2.3.0",
    dateFr: "28 octobre 2026",
    dateEn: "October 28, 2026",
    isoDate: "2026-10-28",
    badge: {
      labelFr: "Moteurs PDF Natifs",
      labelEn: "Native PDF Engines",
      variant: "default",
    },
    titleFr: "Sprint 3 : Chiffrement AES-256 QPDF & Numérotation Vectorielle",
    titleEn: "Sprint 3: QPDF AES-256 Cryptography & Vector Page Numbering",
    summaryFr:
      "Introduction de 4 nouveaux utilitaires PDF professionnels basés sur les binaires système QPDF et Ghostscript pour la sécurisation et la composition documentaire.",
    summaryEn:
      "Introduction of 4 new professional PDF utilities powered by system QPDF and Ghostscript binaries for document security and pagination.",
    changesFr: [
      "Protection PDF (pdf-protect) : chiffrement matériel haute sécurité AES-256 avec mot de passe utilisateur et propriétaire.",
      "Déverrouillage PDF (pdf-unlock) : levée instantanée des restrictions d'impression et de copie pour les documents autorisés.",
      "Filigrane Vectoriel (pdf-watermark) : incrustation de mentions personnalisées (confidentiel, brouillon) avec rotation optique à 45°.",
      "Numérotation de Pages (pdf-page-numbers) : pagination automatique avec choix de l'alignement, format (X / Y) et marge.",
    ],
    changesEn: [
      "PDF Protect (pdf-protect): high-security AES-256 hardware encryption with user and owner passwords.",
      "PDF Unlock (pdf-unlock): instant restriction removal for printing and copying on authorized documents.",
      "PDF Watermark (pdf-watermark): custom vector watermark overlay with calibrated 45-degree optical rotation.",
      "PDF Page Numbers (pdf-page-numbers): automated pagination with custom alignment, format (X of Y), and margins.",
    ],
    tools: [
      { name: "Protéger PDF", slug: "pdf-protect" },
      { name: "Déverrouiller PDF", slug: "pdf-unlock" },
      { name: "Filigrane PDF", slug: "pdf-watermark" },
      { name: "Numéroter PDF", slug: "pdf-page-numbers" },
    ],
    metrics: [
      { labelFr: "Chiffrement", labelEn: "Encryption", value: "AES-256 bit" },
      { labelFr: "Vitesse moyenne", labelEn: "Avg Speed", value: "380ms" },
    ],
  },
  {
    id: "v2-2-0",
    version: "v2.2.0",
    dateFr: "24 octobre 2026",
    dateEn: "October 24, 2026",
    isoDate: "2026-10-24",
    badge: {
      labelFr: "Performance Ghostscript",
      labelEn: "Ghostscript Speed",
      variant: "success",
    },
    titleFr: "Sprint 2 : Compression Ghostscript & Bacs à Sable Éphémères",
    titleEn: "Sprint 2: Ghostscript Compression & Ephemeral Workspace Eviction",
    summaryFr:
      "Refonte des cœurs de traitement PDF volumineux avec Ghostscript 10 et mise en place de la purge automatique des répertoires temporaires sous 15 minutes.",
    summaryEn:
      "Overhaul of heavy PDF processing cores using native Ghostscript 10 and automated eviction of temporary workspace directories within 15 minutes.",
    changesFr: [
      "Compression PDF (pdf-compress) : réduction jusqu'à 85% de la taille des fichiers avec rééchantillonnage vectoriel sans perte de netteté.",
      "Fusion PDF (pdf-merge) : réordonnancement par glisser-déposer et assemblage instantané de dizaines de documents.",
      "Découpage PDF (pdf-split) : extraction par plages ou éclatement en fichiers unitaires.",
      "Rotation PDF (pdf-rotate) : réorientation à 90°, 180° ou 270° avec mise à jour immédiate du flux vectoriel.",
      "Isolation de sécurité : chaque tâche s'exécute dans un sous-répertoire éphémère /tmp/everydaytools/<uuid> supprimé après traitement.",
    ],
    changesEn: [
      "PDF Compress (pdf-compress): up to 85% file size reduction with vector-preserving image resamplers.",
      "PDF Merge (pdf-merge): drag-and-drop reordering and instantaneous merging of dozens of files.",
      "PDF Split (pdf-split): range extraction or bursting into single-page documents.",
      "PDF Rotate (pdf-rotate): lossless 90-degree, 180-degree, or 270-degree reorientation.",
      "Security isolation: each task executes in an ephemeral /tmp/everydaytools/<uuid> directory wiped within 15 minutes.",
    ],
    tools: [
      { name: "Compresser PDF", slug: "pdf-compress" },
      { name: "Fusionner PDF", slug: "pdf-merge" },
      { name: "Diviser PDF", slug: "pdf-split" },
      { name: "Pivoter PDF", slug: "pdf-rotate" },
    ],
    metrics: [
      { labelFr: "Ratio compression max", labelEn: "Max Compression", value: "-85%" },
      { labelFr: "Purge automatique", labelEn: "Auto Purge", value: "15 min" },
    ],
  },
  {
    id: "v2-1-0",
    version: "v2.1.0",
    dateFr: "20 octobre 2026",
    dateEn: "October 20, 2026",
    isoDate: "2026-10-20",
    badge: {
      labelFr: "Documents Headless",
      labelEn: "Headless Documents",
      variant: "default",
    },
    titleFr: "Sprint 1 : Conversion Documents & Archivage Pérenne PDF/A",
    titleEn: "Sprint 1: Document Conversion & Archival Standards (PDF/A)",
    summaryFr:
      "Intégration du moteur LibreOffice headless pour les conversions croisées bureautiques et conformité d'archivage normée ISO 19005.",
    summaryEn:
      "Integration of headless LibreOffice engine for cross-format document conversion and ISO 19005 compliant PDF/A archiving.",
    changesFr: [
      "PDF vers ePub (pdf-to-epub) : restructuration sémantique pour liseuses numériques.",
      "PDF vers Images (pdf-to-image) : rendu rasterisé haute fidélité en PNG et JPG.",
      "PDF vers PDF/A (pdf-to-pdfa) : conversion certifiée pour l'archivage légal à long terme.",
      "Métadonnées PDF (pdf-metadata) : lecture et purge des informations sensibles intégrées (auteur, outil, dates).",
    ],
    changesEn: [
      "PDF to ePub (pdf-to-epub): semantic restructuring optimized for e-readers.",
      "PDF to Image (pdf-to-image): high-fidelity rasterized rendering to PNG and JPG.",
      "PDF to PDF/A (pdf-to-pdfa): certified conversion for long-term legal archival (ISO 19005).",
      "PDF Metadata (pdf-metadata): inspection and stripping of sensitive embedded metadata tags.",
    ],
    tools: [
      { name: "PDF en ePub", slug: "pdf-to-epub" },
      { name: "PDF en Image", slug: "pdf-to-image" },
      { name: "PDF en PDF/A", slug: "pdf-to-pdfa" },
    ],
  },
  {
    id: "v2-0-0",
    version: "v2.0.0",
    dateFr: "15 septembre 2026",
    dateEn: "September 15, 2026",
    isoDate: "2026-09-15",
    badge: {
      labelFr: "IA Locale & Vision",
      labelEn: "Local AI & Vision",
      variant: "accent",
    },
    titleFr: "Détourage IA ONNX Local & Nettoyeur EXIF Client-Side",
    titleEn: "Local ONNX Background Removal & Client-Side EXIF Scrubbing",
    summaryFr:
      "Lancement du démon Python rembg avec runtime ONNX local pour un détourage d'images instantané sans aucun envoi vers des API tierces.",
    summaryEn:
      "Launch of the rembg Python daemon powered by a local ONNX runtime for instant image background removal with zero external cloud leakage.",
    changesFr: [
      "Suppression du Fond IA (background-remover) : découpage précis des portraits et objets en moins de 800ms.",
      "Nettoyeur de Métadonnées (metadata-cleaner) : suppression des coordonnées GPS et tags EXIF directement dans le navigateur.",
      "Aperture de compression réciproque : interface réactive d'estimation de poids avant/après en temps réel.",
    ],
    changesEn: [
      "AI Background Remover (background-remover): precise subject and object clipping in under 800ms.",
      "Metadata Cleaner (metadata-cleaner): GPS coordinates and EXIF tag stripping directly inside the browser.",
      "Reciprocal compression aperture: live size estimation and before/after comparison interface.",
    ],
    tools: [
      { name: "Suppression du Fond", slug: "background-remover" },
      { name: "Nettoyeur de Métadonnées", slug: "metadata-cleaner" },
    ],
    metrics: [
      { labelFr: "Inférence IA", labelEn: "AI Inference", value: "< 800ms" },
      { labelFr: "Fuite de données", labelEn: "Cloud Leakage", value: "0%" },
    ],
  },
];
