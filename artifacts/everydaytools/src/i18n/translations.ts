export type Locale = "EN" | "FR";

export type Translations = {
  nav: {
    groups: { documents: string; images: string; tools: string };
    links: Record<string, string>;
    searchPlaceholder: string;
    breadcrumb: {
      home: string; pdf: string; word: string; image: string;
      privacy: string; calculators: string; tools: string;
    };
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
  tipCalc: {
    tabTip: string; tabPercent: string;
    billAmount: string; tipPct: string; numPeople: string;
    bill: string; tip: (pct: number) => string; total: string;
    tipPerPerson: string; totalPerPerson: string;
    pctOf: string; whatIs: string; isWhatPctOf: string;
    pctChange: string; pctChangeFrom: string; pctChangeTo: string;
  };
  pctCalc: {
    tabs: { of: string; isWhat: string; change: string; discount: string; tip: string; markup: string };
    labels: {
      whatIsPct: string; ofY: string; xIsWhat: string; changeFrom: string; changeTo: string;
      discountPct: string; origPrice: string; tipPct: string; billAmount: string;
      splitBetween: string; marginPct: string; cost: string;
    };
    result: string; increase: string; decrease: string;
    finalPrice: string; saved: string; tipLabel: string;
    perPerson: string; sellingPrice: string; markupLabel: string;
  };
  unitConverter: {
    from: string; to: string; pin: string; pinned: string;
    pinnedConversions: string; swapAriaLabel: string;
    categoryNames: Record<string, string>;
  };
  currencyConverter: {
    from: string; to: string; quickConversions: string; recentHistory: string;
    noRecent: string;
    liveRatesUpdated: (min: number) => string;
    liveRatesJust: string;
    offlineSnapshot: (date: string) => string;
  };
  passwordGenerator: {
    length: (n: number) => string;
    uppercase: string; lowercase: string; numbers: string; symbols: string; pronounceable: string;
    count: string; regenerate: string; copy: string;
    bulkGeneration: string; history: string; clearHistory: string;
    strength: { weak: string; fair: string; strong: string; veryStrong: string; exceptional: string };
  };
  formatSelector: { search: string; noResults: string };
  aiTextScrubber: {
    tabInvisible: string;
    tabStylistic: string;
    placeholder: string;
    scan: string;
    removeBtn: string;
    scrubPhrases: string;
    foundCount: (n: number) => string;
    cleanedOutput: string;
    copy: string;
    downloadTxt: string;
    disclaimer: string;
  };
  backgroundRemover: {
    note: string;
    removeBtn: string;
    loadingModel: string;
    processingImage: string;
    original: string;
    result: string;
  };
  metadataCleaner: {
    tabImages: string;
    tabPdfs: string;
    tabDocs: string;
    analyzeBtn: string;
    foundMetadata: string;
    cleanBtn: string;
    cleaningLabel: string;
    disclaimer: string;
  };
  pdfCompress: {
    compressionLevel: string;
    compressBtn: string;
    compressingLabel: string;
    statsOriginal: string;
    statsCompressed: string;
    statsReduction: string;
    downloadBtn: (filename: string) => string;
    note: string;
  };
  pdfMerge: {
    mergeBtn: (n: number) => string;
    mergingLabel: string;
    errorMin2: string;
  };
  imageCompress: {
    qualitySlider: string;
    targetSize: string;
    quality: string;
    smallest: string;
    original100: string;
    targetSizeLabel: string;
    kbPerFile: string;
    resize: string;
    noResize: string;
    scalePercent: string;
    maxWH: string;
    pxKeepsAspect: string;
    stripExif: string;
    compressBtn: (n: number) => string;
    compressing: string;
    originalLabel: string;
    compressedLabel: string;
    processing: string;
    downloadBtn: string;
    removeBtn: string;
    dropHint: string;
    downloadAll: (n: number) => string;
  };
  documentConverter: {
    inputFile: string;
    selectDesc: string;
    dragDrop: string;
    clickBrowse: string;
    convertBtn: string;
    processingBtn: string;
    converting: string;
    conversionFailed: string;
    output: string;
    outputDesc: string;
    downloadTxt: string;
    pdfSuccess: string;
    ready: string;
  };
  imageConverter: {
    settings: string;
    outputFormat: string;
    quality: string;
    convertAll: string;
    converting: string;
    downloadAll: string;
    download: string;
    addImages: string;
    dragDrop: string;
    processing: string;
    clearAll: string;
  };
};

const EN: Translations = {
  nav: {
    searchPlaceholder: "Search tools...",
    breadcrumb: {
      home: "Home", pdf: "PDF Tools", word: "Word Tools", image: "Image Tools",
      privacy: "Privacy Tools", calculators: "Calculators", tools: "Tools",
    },
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
    "tip-calculator": { title: "Tip Calculator", description: "Calculate tip and split the bill across any number of people" },
    "document-converter": { title: "Document Converter", description: "Convert PDFs, DOCX, and TXT files directly in your browser. All processing is local." },
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
  tipCalc: {
    tabTip: "Tip Calculator", tabPercent: "Percentages",
    billAmount: "Bill Amount", tipPct: "Tip Percentage", numPeople: "Number of People",
    bill: "Bill", tip: (pct) => `Tip (${pct}%)`, total: "Total",
    tipPerPerson: "Tip / person", totalPerPerson: "Total / person",
    pctOf: "What is X% of Y?", whatIs: "What is", isWhatPctOf: "is what % of",
    pctChange: "% change from X to Y", pctChangeFrom: "% change from", pctChangeTo: "to",
  },
  pctCalc: {
    tabs: { of: "X % of Y", isWhat: "X is what % of Y", change: "Percentage Change", discount: "Discount", tip: "Tip & Split", markup: "Markup / Margin" },
    labels: {
      whatIsPct: "What is (X)%", ofY: "of (Y)", xIsWhat: "(X) is what percent", changeFrom: "Change from (X)", changeTo: "to (Y)",
      discountPct: "Discount % (X)", origPrice: "Original Price (Y)", tipPct: "Tip % (X)", billAmount: "Bill Amount (Y)",
      splitBetween: "Split between (People)", marginPct: "Margin % (X)", cost: "Cost (Y)",
    },
    result: "Result", increase: "Increase", decrease: "Decrease",
    finalPrice: "Final", saved: "Saved", tipLabel: "Tip",
    perPerson: "Per Person", sellingPrice: "Selling Price", markupLabel: "Markup",
  },
  unitConverter: {
    from: "From", to: "To", pin: "Pin", pinned: "Pinned",
    pinnedConversions: "Pinned Conversions", swapAriaLabel: "Swap units",
    categoryNames: {
      length: "Length", weight: "Weight", temperature: "Temperature", volume: "Volume",
      area: "Area", speed: "Speed", pressure: "Pressure", energy: "Energy",
      power: "Power", data: "Data", time: "Time", angle: "Angle", frequency: "Frequency",
    },
  },
  currencyConverter: {
    from: "From", to: "To",
    quickConversions: "Quick Conversions", recentHistory: "Recent History",
    noRecent: "No recent conversions.",
    liveRatesUpdated: (min) => `Live rates, updated ${min} min ago`,
    liveRatesJust: "Live rates, just updated",
    offlineSnapshot: (date) => `Offline snapshot — rates as of ${date}`,
  },
  passwordGenerator: {
    length: (n) => `Length: ${n}`,
    uppercase: "Uppercase (A-Z)", lowercase: "Lowercase (a-z)",
    numbers: "Numbers (0-9)", symbols: "Symbols (!@#$)", pronounceable: "Pronounceable mode",
    count: "Generate Count", regenerate: "Regenerate", copy: "Copy",
    bulkGeneration: "Bulk Generation", history: "History", clearHistory: "Clear History",
    strength: { weak: "Weak", fair: "Fair", strong: "Strong", veryStrong: "Very Strong", exceptional: "Exceptional" },
  },
  formatSelector: { search: "Search...", noResults: "No results found" },
  aiTextScrubber: {
    tabInvisible: "Invisible Character Remover",
    tabStylistic: "Stylistic Scrubber",
    placeholder: "Paste text here...",
    scan: "Scan",
    removeBtn: "Remove",
    scrubPhrases: "Scrub Phrases",
    foundCount: (n) => `${n} invisible character${n === 1 ? "" : "s"} found.`,
    cleanedOutput: "Cleaned Output",
    copy: "Copy",
    downloadTxt: "Download .txt",
    disclaimer: "Disclaimer: This does not guarantee bypass of all AI detection methods, including cryptographic watermarking techniques.",
  },
  backgroundRemover: {
    note: "Note: Background removal is processed server-side using AI. Your image is sent to the server, processed, and returned — it is not stored.",
    removeBtn: "Remove Background",
    loadingModel: "Loading AI model...",
    processingImage: "Processing image...",
    original: "Original",
    result: "Result",
  },
  metadataCleaner: {
    tabImages: "Images",
    tabPdfs: "PDFs",
    tabDocs: "Documents (DOCX)",
    analyzeBtn: "Analyze Metadata",
    foundMetadata: "Found Metadata",
    cleanBtn: "Clean & Download",
    cleaningLabel: "Cleaning...",
    disclaimer: "Disclaimer: This tool removes common metadata fields (EXIF, XMP, document properties). It does not guarantee removal of cryptographic fingerprints, steganographic data, or AI model watermarks embedded in pixel values.",
  },
  pdfCompress: {
    compressionLevel: "Compression Level",
    compressBtn: "Compress PDF",
    compressingLabel: "Compressing PDF — rendering pages...",
    statsOriginal: "Original",
    statsCompressed: "Compressed",
    statsReduction: "Reduction",
    downloadBtn: (filename) => `Download ${filename}`,
    note: "Note: Compression results depend on the original PDF content. PDFs that are already optimized or contain mostly vector content may see minimal size reduction. This tool re-renders pages as JPEG images — text will not be selectable in the output.",
  },
  pdfMerge: {
    mergeBtn: (n) => `Merge ${n} PDFs`,
    mergingLabel: "Merging PDFs...",
    errorMin2: "Please select at least 2 PDFs to merge.",
  },
  imageCompress: {
    qualitySlider: "Quality slider",
    targetSize: "Target file size",
    quality: "Quality",
    smallest: "1 — smallest",
    original100: "100 — original",
    targetSizeLabel: "Target size",
    kbPerFile: "KB per file",
    resize: "Resize",
    noResize: "No resize",
    scalePercent: "Scale %",
    maxWH: "Max W/H",
    pxKeepsAspect: "px, keeps aspect ratio",
    stripExif: "Strip EXIF metadata (GPS, camera info, timestamps)",
    compressBtn: (n) => `Compress ${n} image${n === 1 ? "" : "s"}`,
    compressing: "Compressing...",
    originalLabel: "Original",
    compressedLabel: "Compressed",
    processing: "Processing...",
    downloadBtn: "Download",
    removeBtn: "Remove",
    dropHint: "Drop images here or click to select — up to 20 files, 20 MB each",
    downloadAll: (n) => `Download All (${n})`,
  },
  documentConverter: {
    inputFile: "Input File",
    selectDesc: "Select a PDF, DOCX, or TXT file.",
    dragDrop: "Drag & drop your file here",
    clickBrowse: "or click to browse",
    convertBtn: "Convert Document",
    processingBtn: "Processing...",
    converting: "Converting...",
    conversionFailed: "Conversion Failed",
    output: "Output",
    outputDesc: "Extracted text or downloaded file.",
    downloadTxt: "Download as TXT",
    pdfSuccess: "PDF converted and downloaded successfully.",
    ready: "Ready to convert.",
  },
  imageConverter: {
    settings: "Settings",
    outputFormat: "Output Format",
    quality: "Quality",
    convertAll: "Convert All",
    converting: "Converting...",
    downloadAll: "Download All (ZIP)",
    download: "Download",
    addImages: "Add Images",
    dragDrop: "Drag & drop or click to browse (max 20)",
    processing: "Processing...",
    clearAll: "Clear All",
  },
};

const FR: Translations = {
  nav: {
    searchPlaceholder: "Rechercher des outils...",
    breadcrumb: {
      home: "Accueil", pdf: "Outils PDF", word: "Outils Word", image: "Outils Image",
      privacy: "Outils Confidentialité", calculators: "Calculateurs", tools: "Outils",
    },
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
    "tip-calculator": { title: "Calculateur de Pourboire", description: "Calculer le pourboire et diviser l'addition entre plusieurs personnes" },
    "document-converter": { title: "Convertisseur de Documents", description: "Convertir des fichiers PDF, DOCX et TXT directement dans votre navigateur. Tout le traitement est local." },
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
  tipCalc: {
    tabTip: "Calculateur de Pourboire", tabPercent: "Pourcentages",
    billAmount: "Montant de l'addition", tipPct: "Pourcentage de pourboire", numPeople: "Nombre de personnes",
    bill: "Addition", tip: (pct) => `Pourboire (${pct}%)`, total: "Total",
    tipPerPerson: "Pourboire / personne", totalPerPerson: "Total / personne",
    pctOf: "Quel est X% de Y ?", whatIs: "Quel est", isWhatPctOf: "est quel % de",
    pctChange: "% de variation de X à Y", pctChangeFrom: "% de variation de", pctChangeTo: "à",
  },
  pctCalc: {
    tabs: { of: "X % de Y", isWhat: "X est quel % de Y", change: "Variation en %", discount: "Remise", tip: "Pourboire & Partage", markup: "Marge / Majoration" },
    labels: {
      whatIsPct: "Quel est (X)%", ofY: "de (Y)", xIsWhat: "(X) est quel pourcentage", changeFrom: "Variation de (X)", changeTo: "à (Y)",
      discountPct: "Remise % (X)", origPrice: "Prix d'origine (Y)", tipPct: "Pourboire % (X)", billAmount: "Montant de l'addition (Y)",
      splitBetween: "Partager entre (personnes)", marginPct: "Marge % (X)", cost: "Coût (Y)",
    },
    result: "Résultat", increase: "Augmentation", decrease: "Diminution",
    finalPrice: "Final", saved: "Économisé", tipLabel: "Pourboire",
    perPerson: "Par personne", sellingPrice: "Prix de vente", markupLabel: "Marge",
  },
  unitConverter: {
    from: "De", to: "Vers", pin: "Épingler", pinned: "Épinglé",
    pinnedConversions: "Conversions épinglées", swapAriaLabel: "Inverser les unités",
    categoryNames: {
      length: "Longueur", weight: "Masse", temperature: "Température", volume: "Volume",
      area: "Superficie", speed: "Vitesse", pressure: "Pression", energy: "Énergie",
      power: "Puissance", data: "Données", time: "Temps", angle: "Angle", frequency: "Fréquence",
    },
  },
  currencyConverter: {
    from: "De", to: "Vers",
    quickConversions: "Conversions rapides", recentHistory: "Historique récent",
    noRecent: "Aucune conversion récente.",
    liveRatesUpdated: (min) => `Taux en direct, mis à jour il y a ${min} min`,
    liveRatesJust: "Taux en direct, vient d'être mis à jour",
    offlineSnapshot: (date) => `Données hors ligne — taux au ${date}`,
  },
  passwordGenerator: {
    length: (n) => `Longueur : ${n}`,
    uppercase: "Majuscules (A-Z)", lowercase: "Minuscules (a-z)",
    numbers: "Chiffres (0-9)", symbols: "Symboles (!@#$)", pronounceable: "Mode prononçable",
    count: "Nombre à générer", regenerate: "Régénérer", copy: "Copier",
    bulkGeneration: "Génération en masse", history: "Historique", clearHistory: "Effacer l'historique",
    strength: { weak: "Faible", fair: "Correct", strong: "Fort", veryStrong: "Très fort", exceptional: "Exceptionnel" },
  },
  formatSelector: { search: "Rechercher...", noResults: "Aucun résultat" },
  aiTextScrubber: {
    tabInvisible: "Suppression de caractères invisibles",
    tabStylistic: "Nettoyage stylistique",
    placeholder: "Collez votre texte ici...",
    scan: "Analyser",
    removeBtn: "Supprimer",
    scrubPhrases: "Nettoyer les phrases",
    foundCount: (n) => `${n} caractère${n === 1 ? "" : "s"} invisible${n === 1 ? "" : "s"} trouvé${n === 1 ? "" : "s"}.`,
    cleanedOutput: "Résultat nettoyé",
    copy: "Copier",
    downloadTxt: "Télécharger .txt",
    disclaimer: "Avertissement : Ceci ne garantit pas le contournement de toutes les méthodes de détection d'IA, y compris les techniques de filigrane cryptographique.",
  },
  backgroundRemover: {
    note: "Remarque : La suppression d'arrière-plan est traitée côté serveur par IA. Votre image est envoyée au serveur, traitée et renvoyée — elle n'est pas stockée.",
    removeBtn: "Supprimer l'arrière-plan",
    loadingModel: "Chargement du modèle IA...",
    processingImage: "Traitement de l'image...",
    original: "Original",
    result: "Résultat",
  },
  metadataCleaner: {
    tabImages: "Images",
    tabPdfs: "PDFs",
    tabDocs: "Documents (DOCX)",
    analyzeBtn: "Analyser les métadonnées",
    foundMetadata: "Métadonnées trouvées",
    cleanBtn: "Nettoyer et télécharger",
    cleaningLabel: "Nettoyage...",
    disclaimer: "Avertissement : Cet outil supprime les champs de métadonnées courants (EXIF, XMP, propriétés du document). Il ne garantit pas la suppression des empreintes cryptographiques, des données stéganographiques ou des filigranes de modèle IA intégrés dans les valeurs de pixels.",
  },
  pdfCompress: {
    compressionLevel: "Niveau de compression",
    compressBtn: "Compresser le PDF",
    compressingLabel: "Compression du PDF — rendu des pages...",
    statsOriginal: "Original",
    statsCompressed: "Compressé",
    statsReduction: "Réduction",
    downloadBtn: (filename) => `Télécharger ${filename}`,
    note: "Remarque : Les résultats de compression dépendent du contenu PDF original. Les PDF déjà optimisés ou contenant principalement du contenu vectoriel peuvent voir une réduction minimale. Cet outil restitue les pages en images JPEG — le texte ne sera pas sélectionnable dans le résultat.",
  },
  pdfMerge: {
    mergeBtn: (n) => `Fusionner ${n} PDFs`,
    mergingLabel: "Fusion des PDFs...",
    errorMin2: "Veuillez sélectionner au moins 2 PDFs à fusionner.",
  },
  imageCompress: {
    qualitySlider: "Curseur de qualité",
    targetSize: "Taille cible",
    quality: "Qualité",
    smallest: "1 — plus petit",
    original100: "100 — original",
    targetSizeLabel: "Taille cible",
    kbPerFile: "Ko par fichier",
    resize: "Redimensionner",
    noResize: "Sans redimensionnement",
    scalePercent: "Échelle %",
    maxWH: "Max L/H",
    pxKeepsAspect: "px, conserve le ratio",
    stripExif: "Supprimer les métadonnées EXIF (GPS, info appareil, horodatages)",
    compressBtn: (n) => `Compresser ${n} image${n === 1 ? "" : "s"}`,
    compressing: "Compression...",
    originalLabel: "Original",
    compressedLabel: "Compressé",
    processing: "Traitement...",
    downloadBtn: "Télécharger",
    removeBtn: "Supprimer",
    dropHint: "Déposez des images ici ou cliquez pour sélectionner — 20 fichiers max, 20 Mo chacun",
    downloadAll: (n) => `Tout télécharger (${n})`,
  },
  documentConverter: {
    inputFile: "Fichier d'entrée",
    selectDesc: "Sélectionnez un fichier PDF, DOCX ou TXT.",
    dragDrop: "Déposez votre fichier ici",
    clickBrowse: "ou cliquez pour parcourir",
    convertBtn: "Convertir le document",
    processingBtn: "Traitement...",
    converting: "Conversion...",
    conversionFailed: "Conversion échouée",
    output: "Résultat",
    outputDesc: "Texte extrait ou fichier téléchargé.",
    downloadTxt: "Télécharger en TXT",
    pdfSuccess: "PDF converti et téléchargé avec succès.",
    ready: "Prêt à convertir.",
  },
  imageConverter: {
    settings: "Paramètres",
    outputFormat: "Format de sortie",
    quality: "Qualité",
    convertAll: "Tout convertir",
    converting: "Conversion...",
    downloadAll: "Tout télécharger (ZIP)",
    download: "Télécharger",
    addImages: "Ajouter des images",
    dragDrop: "Glissez-déposez ou cliquez pour parcourir (max 20)",
    processing: "Traitement...",
    clearAll: "Tout effacer",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { EN, FR };
