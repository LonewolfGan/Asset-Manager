export type Locale = "EN" | "FR";

export type Translations = {
  nav: {
    groups: { documents: string; images: string; tools: string };
    links: Record<string, string>;
    searchPlaceholder: string;
  };
  home: {
    title: string;
    subtitle: string;
    allTools: string;
    allToolsSubtitle: (count: number) => string;
    categories: Record<string, string>;
    toolCategory: Record<string, string>;
    sectionLabels: Record<string, string>;
    sectionDescriptions: Record<string, string>;
    toolCount: (n: number) => string;
    resultCount: (n: number) => string;
    resultsFor: string;
    noResults: (q: string) => string;
    clearSearch: string;
  };
  tools: Record<string, { title: string; description: string }>;
  ui: {
    dropzone: string;
    dropzoneHint: (accept: string, maxMb: number) => string;
    lightMode: string;
    darkMode: string;
    loading: string;
  };
  footer: {
    tagline: string;
    rights: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePreferences: string;
    columns: { pdf: string; images: string; utilities: string };
  };
  cookie: {
    message: string;
    neverUploaded: string;
    privacyPolicy: string;
    essentialOnly: string;
    acceptAll: string;
  };
};

const EN: Translations = {
  nav: {
    searchPlaceholder: "Search tools...",
    groups: {
      documents: "Convert Documents",
      images: "Convert Images",
      tools: "Tools",
    },
    links: {
      "pdf-to-word": "PDF to Word",
      "pdf-to-text": "PDF to Text",
      "pdf-to-html": "PDF to HTML",
      "pdf-to-epub": "PDF to EPUB",
      "pdf-merge": "Merge PDFs",
      "pdf-split": "Split PDF",
      "pdf-rotate": "Rotate PDF",
      "pdf-unlock": "Unlock PDF",
      "pdf-protect": "Protect PDF",
      "pdf-page-numbers": "Add Page Numbers",
      "pdf-watermark": "Watermark PDF",
      "word-to-text": "Word to Text",
      "word-to-html": "Word to HTML",
      "word-to-epub": "Word to EPUB",
      "markdown-to-pdf": "Markdown to PDF",
      "markdown-to-docx": "Markdown to Word",
      "html-to-pdf": "HTML to PDF",
      "txt-to-pdf": "Text to PDF",
      "txt-to-docx": "Text to Word",
      "image-converter": "Image Converter",
      "heic-to-jpg": "HEIC to JPG",
      "image-resize": "Resize Image",
      "image-crop": "Crop Image",
      "image-to-pdf": "Image to PDF",
      "pdf-to-image": "PDF to Image",
      "background-remover": "Background Remover",
      "pdf-compress": "PDF Compressor",
      "image-compress": "Image Compressor",
      "metadata-cleaner": "Metadata Cleaner",
      "ai-text-scrubber": "AI Text Scrubber",
      "password-generator": "Password Generator",
      "currency-converter": "Currency Converter",
      "unit-converter": "Unit Converter",
      "percentage-calc": "Percentage Calculator",
      "qr-code-generator": "QR Code Generator",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Browser-based document, image, and utility tools. No uploads. No accounts.",
    allTools: "All Tools",
    allToolsSubtitle: (count) => `${count} browser-based utilities — nothing uploaded, everything private.`,
    categories: {
      pdf: "PDF Tools",
      word: "Word & Docs",
      image: "Image Tools",
      privacy: "Privacy",
      calculators: "Calculators",
    },
    toolCategory: {
      pdf: "PDF",
      word: "Document",
      image: "Image",
      privacy: "Privacy",
      calculators: "Utility",
    },
    sectionLabels: {
      Documents: "Documents",
      Images: "Images",
      Privacy: "Privacy",
      Calculators: "Calculators",
    },
    sectionDescriptions: {
      Documents: "PDF and Word file tools",
      Images: "Convert, compress, and process images",
      Privacy: "Strip metadata and AI watermarks",
      Calculators: "Conversions, generators, and calculators",
    },
    toolCount: (n) => `${n} ${n === 1 ? "tool" : "tools"}`,
    resultCount: (n) => `${n} ${n === 1 ? "result" : "results"}`,
    resultsFor: "for",
    noResults: (q) => `No tools match "${q}"`,
    clearSearch: "Clear search",
  },
  tools: {
    "pdf-to-word": { title: "PDF to Word", description: "Convert PDF files to editable DOCX format" },
    "pdf-to-text": { title: "PDF to Text", description: "Extract all text from a PDF file" },
    "pdf-to-html": { title: "PDF to HTML", description: "Convert PDF content to HTML markup" },
    "pdf-to-epub": { title: "PDF to EPUB", description: "Convert PDF to EPUB e-book format" },
    "pdf-compress": { title: "Compress PDF", description: "Reduce PDF file size without visible quality loss" },
    "pdf-merge": { title: "Merge PDFs", description: "Combine multiple PDF files into one" },
    "pdf-split": { title: "Split PDF", description: "Split a PDF into separate pages or page ranges" },
    "pdf-rotate": { title: "Rotate PDF", description: "Rotate PDF pages 90, 180, or 270 degrees" },
    "pdf-unlock": { title: "Unlock PDF", description: "Remove owner password protection from a PDF" },
    "pdf-protect": { title: "Protect PDF", description: "Add password protection to a PDF" },
    "pdf-page-numbers": { title: "Add Page Numbers", description: "Add page numbers to every page of your PDF" },
    "pdf-watermark": { title: "Watermark PDF", description: "Add a text watermark to every PDF page" },
    "word-to-text": { title: "Word to Text", description: "Extract plain text from DOCX files" },
    "word-to-html": { title: "Word to HTML", description: "Convert DOCX to clean HTML markup" },
    "word-to-epub": { title: "Word to EPUB", description: "Convert DOCX to EPUB e-book" },
    "markdown-to-pdf": { title: "Markdown to PDF", description: "Convert Markdown files to PDF" },
    "markdown-to-docx": { title: "Markdown to Word", description: "Convert Markdown to a Word document" },
    "html-to-pdf": { title: "HTML to PDF", description: "Convert an HTML page or snippet to PDF" },
    "txt-to-pdf": { title: "Text to PDF", description: "Convert plain text to a PDF document" },
    "txt-to-docx": { title: "Text to Word", description: "Convert plain text to a Word document" },
    "image-converter": { title: "Image Converter", description: "Convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO" },
    "heic-to-jpg": { title: "HEIC to JPG", description: "Convert iPhone HEIC photos to JPEG or PNG" },
    "image-compress": { title: "Compress Image", description: "Reduce image file size with a quality slider" },
    "image-resize": { title: "Resize Image", description: "Resize images by pixel dimensions or percentage" },
    "image-crop": { title: "Crop Image", description: "Crop images with drag handles and aspect ratio presets" },
    "image-to-pdf": { title: "Image to PDF", description: "Convert one or more images to a single PDF" },
    "pdf-to-image": { title: "PDF to Image", description: "Export PDF pages as PNG or JPEG images" },
    "background-remover": { title: "Background Remover", description: "Remove image backgrounds using on-device AI" },
    "metadata-cleaner": { title: "Metadata Cleaner", description: "Strip EXIF, XMP, and document metadata from files" },
    "ai-text-scrubber": { title: "AI Text Scrubber", description: "Remove invisible characters and AI-detection patterns from text" },
    "password-generator": { title: "Password Generator", description: "Generate cryptographically secure passwords with entropy display" },
    "percentage-calc": { title: "Percentage Calculator", description: "Calculate percentages, discounts, tips, and markup instantly" },
    "unit-converter": { title: "Unit Converter", description: "Convert between 200+ units across 13 measurement categories" },
    "currency-converter": { title: "Currency Converter", description: "Convert between 170 currencies with live rates" },
    "qr-code-generator": { title: "QR Code Generator", description: "Generate QR codes from URLs, text, Wi-Fi credentials, or contact cards — entirely in your browser" },
  },
  ui: {
    dropzone: "Drop file here or click to browse",
    dropzoneHint: (accept, maxMb) => `${accept} · max ${maxMb} MB`,
    lightMode: "Light mode",
    darkMode: "Dark mode",
    loading: "Loading…",
  },
  footer: {
    tagline: "A collection of browser-based tools for everyday file tasks. Fast, private, and free.",
    rights: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePreferences: "Cookie Preferences",
    columns: { pdf: "PDF Tools", images: "Image Tools", utilities: "Utilities" },
  },
  cookie: {
    message: "We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are",
    neverUploaded: "never uploaded",
    privacyPolicy: "Privacy policy",
    essentialOnly: "Essential only",
    acceptAll: "Accept all",
  },
};

const FR: Translations = {
  nav: {
    searchPlaceholder: "Rechercher des outils...",
    groups: {
      documents: "Convertir les Documents",
      images: "Convertir les Images",
      tools: "Outils",
    },
    links: {
      "pdf-to-word": "PDF en Word",
      "pdf-to-text": "PDF en Texte",
      "pdf-to-html": "PDF en HTML",
      "pdf-to-epub": "PDF en EPUB",
      "pdf-merge": "Fusionner les PDF",
      "pdf-split": "Diviser le PDF",
      "pdf-rotate": "Faire pivoter le PDF",
      "pdf-unlock": "Déverrouiller le PDF",
      "pdf-protect": "Protéger le PDF",
      "pdf-page-numbers": "Numéroter les Pages",
      "pdf-watermark": "Filigrane PDF",
      "word-to-text": "Word en Texte",
      "word-to-html": "Word en HTML",
      "word-to-epub": "Word en EPUB",
      "markdown-to-pdf": "Markdown en PDF",
      "markdown-to-docx": "Markdown en Word",
      "html-to-pdf": "HTML en PDF",
      "txt-to-pdf": "Texte en PDF",
      "txt-to-docx": "Texte en Word",
      "image-converter": "Convertisseur d'Image",
      "heic-to-jpg": "HEIC en JPG",
      "image-resize": "Redimensionner l'Image",
      "image-crop": "Rogner l'Image",
      "image-to-pdf": "Image en PDF",
      "pdf-to-image": "PDF en Image",
      "background-remover": "Suppression du Fond",
      "pdf-compress": "Compresseur PDF",
      "image-compress": "Compresseur d'Image",
      "metadata-cleaner": "Nettoyeur de Métadonnées",
      "ai-text-scrubber": "Nettoyeur de Texte IA",
      "password-generator": "Générateur de Mot de Passe",
      "currency-converter": "Convertisseur de Devises",
      "unit-converter": "Convertisseur d'Unités",
      "percentage-calc": "Calculateur de Pourcentage",
      "qr-code-generator": "Générateur de QR Code",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Outils en ligne pour documents, images et utilitaires. Sans téléchargement. Sans compte.",
    allTools: "Tous les outils",
    allToolsSubtitle: (count) => `${count} utilitaires dans le navigateur — aucun téléchargement, tout est privé.`,
    categories: {
      pdf: "Outils PDF",
      word: "Word et Documents",
      image: "Outils Image",
      privacy: "Confidentialité",
      calculators: "Calculatrices",
    },
    toolCategory: {
      pdf: "PDF",
      word: "Document",
      image: "Image",
      privacy: "Confidentialité",
      calculators: "Utilitaire",
    },
    sectionLabels: {
      Documents: "Documents",
      Images: "Images",
      Privacy: "Confidentialité",
      Calculators: "Calculatrices",
    },
    sectionDescriptions: {
      Documents: "Outils PDF et Word",
      Images: "Convertir, compresser et traiter les images",
      Privacy: "Supprimer métadonnées et filigranes IA",
      Calculators: "Conversions, générateurs et calculatrices",
    },
    toolCount: (n) => `${n} ${n === 1 ? "outil" : "outils"}`,
    resultCount: (n) => `${n} ${n === 1 ? "résultat" : "résultats"}`,
    resultsFor: "pour",
    noResults: (q) => `Aucun outil ne correspond à « ${q} »`,
    clearSearch: "Effacer la recherche",
  },
  tools: {
    "pdf-to-word": { title: "PDF en Word", description: "Convertir des fichiers PDF en format DOCX modifiable" },
    "pdf-to-text": { title: "PDF en Texte", description: "Extraire tout le texte d'un fichier PDF" },
    "pdf-to-html": { title: "PDF en HTML", description: "Convertir le contenu PDF en balisage HTML" },
    "pdf-to-epub": { title: "PDF en EPUB", description: "Convertir un PDF au format e-book EPUB" },
    "pdf-compress": { title: "Compresser le PDF", description: "Réduire la taille d'un PDF sans perte de qualité visible" },
    "pdf-merge": { title: "Fusionner les PDF", description: "Combiner plusieurs fichiers PDF en un seul" },
    "pdf-split": { title: "Diviser le PDF", description: "Diviser un PDF en pages séparées ou en plages de pages" },
    "pdf-rotate": { title: "Faire pivoter le PDF", description: "Faire pivoter les pages PDF de 90, 180 ou 270 degrés" },
    "pdf-unlock": { title: "Déverrouiller le PDF", description: "Supprimer la protection par mot de passe d'un PDF" },
    "pdf-protect": { title: "Protéger le PDF", description: "Ajouter une protection par mot de passe à un PDF" },
    "pdf-page-numbers": { title: "Numéroter les Pages", description: "Ajouter des numéros de page à chaque page de votre PDF" },
    "pdf-watermark": { title: "Filigrane PDF", description: "Ajouter un filigrane texte à chaque page PDF" },
    "word-to-text": { title: "Word en Texte", description: "Extraire le texte brut des fichiers DOCX" },
    "word-to-html": { title: "Word en HTML", description: "Convertir DOCX en balisage HTML propre" },
    "word-to-epub": { title: "Word en EPUB", description: "Convertir DOCX en e-book EPUB" },
    "markdown-to-pdf": { title: "Markdown en PDF", description: "Convertir des fichiers Markdown en PDF" },
    "markdown-to-docx": { title: "Markdown en Word", description: "Convertir Markdown en document Word" },
    "html-to-pdf": { title: "HTML en PDF", description: "Convertir une page HTML ou un extrait en PDF" },
    "txt-to-pdf": { title: "Texte en PDF", description: "Convertir du texte brut en document PDF" },
    "txt-to-docx": { title: "Texte en Word", description: "Convertir du texte brut en document Word" },
    "image-converter": { title: "Convertisseur d'Image", description: "Convertir entre PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO" },
    "heic-to-jpg": { title: "HEIC en JPG", description: "Convertir les photos HEIC iPhone en JPEG ou PNG" },
    "image-compress": { title: "Compresser l'Image", description: "Réduire la taille des fichiers image avec un curseur de qualité" },
    "image-resize": { title: "Redimensionner l'Image", description: "Redimensionner les images en pixels ou en pourcentage" },
    "image-crop": { title: "Rogner l'Image", description: "Rogner les images avec des poignées et des préréglages de ratio" },
    "image-to-pdf": { title: "Image en PDF", description: "Convertir une ou plusieurs images en un seul PDF" },
    "pdf-to-image": { title: "PDF en Image", description: "Exporter les pages PDF en images PNG ou JPEG" },
    "background-remover": { title: "Suppression du Fond", description: "Supprimer l'arrière-plan des images avec l'IA embarquée" },
    "metadata-cleaner": { title: "Nettoyeur de Métadonnées", description: "Supprimer les métadonnées EXIF, XMP et de document des fichiers" },
    "ai-text-scrubber": { title: "Nettoyeur de Texte IA", description: "Supprimer les caractères invisibles et les motifs de détection IA du texte" },
    "password-generator": { title: "Générateur de Mot de Passe", description: "Générer des mots de passe sécurisés avec affichage de l'entropie" },
    "percentage-calc": { title: "Calculateur de Pourcentage", description: "Calculer des pourcentages, remises, pourboires et marges instantanément" },
    "unit-converter": { title: "Convertisseur d'Unités", description: "Convertir entre plus de 200 unités dans 13 catégories de mesure" },
    "currency-converter": { title: "Convertisseur de Devises", description: "Convertir entre 170 devises avec des taux en temps réel" },
    "qr-code-generator": { title: "Générateur de QR Code", description: "Générez des QR codes depuis des URLs, du texte, des identifiants Wi-Fi ou des cartes de contact — entièrement dans votre navigateur" },
  },
  ui: {
    dropzone: "Déposez le fichier ici ou cliquez pour parcourir",
    dropzoneHint: (accept, maxMb) => `${accept} · max ${maxMb} Mo`,
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    loading: "Chargement…",
  },
  footer: {
    tagline: "Une collection d'outils en ligne pour les tâches courantes. Rapide, privé et gratuit.",
    rights: "Tous droits réservés.",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    cookiePreferences: "Préférences de cookies",
    columns: { pdf: "Outils PDF", images: "Outils Image", utilities: "Utilitaires" },
  },
  cookie: {
    message: "Nous utilisons des analyses respectueuses de la vie privée (sans cookies, sans données personnelles) et, avec votre consentement, des publicités qui aident à maintenir tous les outils gratuits. Vos fichiers ne sont",
    neverUploaded: "jamais téléchargés",
    privacyPolicy: "Politique de confidentialité",
    essentialOnly: "Essentiel seulement",
    acceptAll: "Tout accepter",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { EN, FR };
