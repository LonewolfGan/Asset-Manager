export type Locale = "EN" | "FR";

export type Translations = {
  nav: {
    groups: Record<string, string>;
    links: Record<string, string>;
    searchPlaceholder: string;
    breadcrumb: {
      home: string; pdf: string; word: string; image: string;
      privacy: string; calculators: string; tools: string;
      textCode: string; excelSpreadsheets: string; documents: string;
    };
  };
  home: {
    title: string;
    subtitle: string;
    allTools: string;
    allToolsSubtitle: (n: number) => string;
    categories: Record<string, string>;
    toolCategory: Record<string, string>;
    sectionLabels: Record<string, string>;
    sectionDescriptions: Record<string, string>;
    toolCount: (n: number) => string;
    resultCount: (n: number) => string;
    resultsFor: string;
    noResults: (q: string) => string;
    clearSearch: string;
    recentlyUsed: string;
    pinned: string;
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
    security: string;
    columns: { pdf: string; images: string; utilities: string };
  };
  cookie: {
    message: string;
    neverUploaded: string;
    privacyPolicy: string;
    essentialOnly: string;
    acceptAll: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
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
    unitNames: Record<string, string>;
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
  ocr: {
    modelNote: string;
    extractBtn: string;
    extractedText: string;
  };
  wordCounter: {
    words: string;
    chars: string;
    noSpaces: string;
    sentences: string;
    paragraphs: string;
    readingTime: string;
    clear: string;
    copyText: string;
    pasteHere: string;
  };
  common: {
    download: string;
    downloadAll: (n: number) => string;
    copy: string;
    copied: string;
    reset: string;
    remove: string;
    clear: string;
    processing: string;
    converting: string;
    quality: string;
    original: string;
    converted: string;
    extractText: string;
    extractedText: string;
    dropFileHere: string;
    dropFilesHere: (label: string) => string;
    uploadFile: string;
    pasteText: string;
    outputAppearsHere: string;
    convertToPdf: string;
    downloadPdf: string;
    downloadCsv: string;
    downloadTxt: string;
    convertFiles: (n: number, ext: string) => string;
    pdfReady: (kb: string) => string;
    sheet: string;
    exportSheet: string;
    convertBtn: string;
    preview: (n: number) => string;
    orPasteDirectly: string;
    errorGeneric: string;
    view: string;
    copyText: string;
    format: string;
    minify: string;
    encode: string;
    decode: string;
    generate: string;
  };
  jsonFormatter: {
    inputLabel: string;
    formattedOutput: string;
    minifiedOutput: string;
    indent: string;
    stats: (chars: number, bytes: number) => string;
    invalidJson: string;
  };
  htmlFormatter: {
    inputLabel: string;
    outputLabel: string;
    bytes: (n: number) => string;
  };
  urlEncoder: {
    rawUrlText: string;
    encodedUrl: string;
    encodedOutput: string;
    decodedOutput: string;
    quickExamples: string;
    invalidInput: string;
    examples: { space: string; ampersand: string; equals: string; hash: string };
  };
  base64Encoder: {
    uploadFile: string;
    plainTextInput: string;
    base64Input: string;
    base64Output: string;
    decodedText: string;
    encodePlaceholder: string;
    decodePlaceholder: string;
    chars: (n: number) => string;
    invalidInput: string;
  };
  loremIpsum: {
    types: { paragraphs: string; sentences: string; words: string; lists: string };
    count: string;
    classicStart: string;
  };
};

const EN: Translations = {
  nav: {
    searchPlaceholder: "Search tools...",
    breadcrumb: {
      home: "Home", pdf: "PDF Tools", word: "Word Tools", image: "Image Tools",
      privacy: "Privacy Tools", calculators: "Calculators", tools: "Tools",
      textCode: "Text & Code", excelSpreadsheets: "Excel & Spreadsheets", documents: "Documents",
    },
    groups: {
      pdf: "PDF Tools",
      documents: "Documents",
      images: "Images",
      textCode: "Text & Code",
      tools: "Tools",
    },
    links: {
      // PDF
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
      "pdf-compress": "Compress PDF",
      "pdf-to-image": "PDF to Image",
      "pdf-to-excel": "PDF to Excel",
      "reorder-pdf": "Reorder Pages",
      "ocr": "OCR — Image to Text",
      // Documents
      "word-to-pdf": "Word to PDF",
      "word-to-text": "Word to Text",
      "word-to-html": "Word to HTML",
      "word-to-epub": "Word to EPUB",
      "word-to-markdown": "Word to Markdown",
      "html-to-markdown": "HTML to Markdown",
      "markdown-to-pdf": "Markdown to PDF",
      "markdown-to-docx": "Markdown to Word",
      "html-to-pdf": "HTML to PDF",
      "txt-to-pdf": "Text to PDF",
      "txt-to-docx": "Text to Word",
      "excel-to-pdf": "Excel to PDF",
      "excel-to-csv": "Excel to CSV",
      "csv-to-excel": "CSV to Excel",
      "csv-to-json": "CSV ↔ JSON",
      "csv-viewer": "CSV Viewer",
      "pptx-to-pdf": "PowerPoint to PDF",
      "pptx-to-images": "PowerPoint to Images",
      "pdf-to-pptx": "PDF to PowerPoint",
      // Images
      "image-converter": "Image Converter",
      "image-compress": "Compress Image",
      "image-resize": "Resize Image",
      "image-crop": "Crop Image",
      "image-to-pdf": "Image to PDF",
      "background-remover": "Background Remover",
      "flip-rotate-image": "Flip & Rotate",
      "watermark-image": "Add Watermark",
      "favicon-generator": "Favicon Generator",
      "heic-to-jpg": "HEIC to JPG",
      "heic-to-png": "HEIC to PNG",
      "heic-to-webp": "HEIC to WebP",
      "heic-to-pdf": "HEIC to PDF",
      "png-to-webp": "PNG to WebP",
      "jpg-to-webp": "JPG to WebP",
      "gif-to-webp": "GIF to WebP",
      "bmp-to-webp": "BMP to WebP",
      "tiff-to-webp": "TIFF to WebP",
      "webp-to-png": "WebP to PNG",
      "webp-to-jpg": "WebP to JPG",
      "webp-to-pdf": "WebP to PDF",
      "webp-to-avif": "WebP to AVIF",
      "jpg-to-avif": "JPG to AVIF",
      "png-to-avif": "PNG to AVIF",
      "avif-to-jpg": "AVIF to JPG",
      "avif-to-png": "AVIF to PNG",
      "jpg-to-png": "JPG to PNG",
      "png-to-jpg": "PNG to JPG",
      "png-to-svg": "PNG to SVG",
      "svg-to-png": "SVG to PNG",
      "gif-to-png": "GIF to PNG",
      "bmp-to-jpg": "BMP to JPG",
      "tiff-to-jpg": "TIFF to JPG",
      "tiff-to-png": "TIFF to PNG",
      "jpg-to-pdf": "JPG to PDF",
      "png-to-pdf": "PNG to PDF",
      // Text & Code
      "json-formatter": "JSON Formatter",
      "html-formatter": "HTML Formatter",
      "base64": "Base64 Encode / Decode",
      "url-encoder": "URL Encode / Decode",
      "word-counter": "Word Counter",
      "lorem-ipsum": "Lorem Ipsum",
      // Privacy & Tools
      "metadata-cleaner": "Metadata Cleaner",
      "ai-text-scrubber": "AI Text Scrubber",
      "checksum": "File Checksum",
      "password-generator": "Password Generator",
      "currency-converter": "Currency Converter",
      "unit-converter": "Unit Converter",
      "percentage-calc": "Percentage Calculator",
      "qr-code-generator": "QR Code Generator",
      "tip-calculator": "Tip Calculator",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Browser-based document, image, and utility tools. No uploads. No accounts.",
    allTools: "All Tools",
    allToolsSubtitle: (_n: number) => `Free tools for documents, images, and everyday tasks. No account. No uploads.`,
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
    recentlyUsed: "Recently used",
    pinned: "Pinned",
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
    "background-remover": { title: "Background Remover", description: "Remove backgrounds from photos instantly. Free, no account required." },
    "metadata-cleaner": { title: "Metadata Cleaner", description: "Strip EXIF, XMP, and document metadata from files" },
    "ai-text-scrubber": { title: "AI Text Scrubber", description: "Remove invisible characters and AI-detection patterns from text" },
    "password-generator": { title: "Password Generator", description: "Generate cryptographically secure passwords with entropy display" },
    "percentage-calc": { title: "Percentage Calculator", description: "Calculate percentages, discounts, tips, and markup instantly" },
    "unit-converter": { title: "Unit Converter", description: "Convert between 200+ units across 13 measurement categories" },
    "currency-converter": { title: "Currency Converter", description: "Convert between 170 currencies with live rates" },
    "qr-code-generator": { title: "QR Code Generator", description: "Generate QR codes from URLs, text, Wi-Fi credentials, or contact cards — entirely in your browser" },
    "tip-calculator": { title: "Tip Calculator", description: "Calculate tip and split the bill across any number of people" },
    "document-converter": { title: "Document Converter", description: "Convert PDFs, DOCX, and TXT files directly in your browser. All processing is local." },
    // New PDF tools
    "pdf-to-excel": { title: "PDF to Excel", description: "Extract tables from a PDF into an Excel spreadsheet" },
    "reorder-pdf": { title: "Reorder PDF Pages", description: "Drag and drop to reorder, remove, and rearrange PDF pages" },
    "ocr": { title: "OCR — Image to Text", description: "Extract text from scanned images using Tesseract.js" },
    // New Word tools
    "word-to-pdf": { title: "Word to PDF", description: "Convert DOCX and DOC files to PDF in your browser" },
    "word-to-markdown": { title: "Word to Markdown", description: "Convert DOCX files to clean Markdown" },
    "html-to-markdown": { title: "HTML to Markdown", description: "Convert HTML content to clean Markdown format" },
    // Excel & Spreadsheets
    "excel-to-pdf": { title: "Excel to PDF", description: "Convert Excel spreadsheets to PDF entirely in your browser" },
    "excel-to-csv": { title: "Excel to CSV", description: "Convert Excel sheets to CSV format" },
    "csv-to-excel": { title: "CSV to Excel", description: "Convert CSV files to Excel (.xlsx) in your browser" },
    "csv-to-json": { title: "CSV ↔ JSON", description: "Convert between CSV and JSON formats instantly" },
    "csv-viewer": { title: "CSV Viewer", description: "View and sort CSV files as a table — no upload required" },
    // PowerPoint
    "pptx-to-pdf": { title: "PowerPoint to PDF", description: "Convert PowerPoint presentations to PDF in your browser" },
    "pptx-to-images": { title: "PowerPoint to Images", description: "Export each slide as a PNG image and download as ZIP" },
    "pdf-to-pptx": { title: "PDF to PowerPoint", description: "Convert each PDF page into a PowerPoint slide" },
    // New image tools
    "heic-to-png": { title: "HEIC to PNG", description: "Convert HEIC/HEIF photos to PNG format" },
    "heic-to-webp": { title: "HEIC to WebP", description: "Convert HEIC/HEIF photos to WebP format" },
    "heic-to-pdf": { title: "HEIC to PDF", description: "Convert HEIC/HEIF photos to PDF" },
    "flip-rotate-image": { title: "Flip & Rotate Image", description: "Flip horizontally, vertically, or rotate by any angle" },
    "watermark-image": { title: "Add Watermark", description: "Add text watermark to images with custom position and opacity" },
    "favicon-generator": { title: "Favicon Generator", description: "Generate favicons in all sizes from any image, download as ZIP" },
    // Image conversion pages
    "png-to-webp": { title: "PNG to WebP", description: "Convert PNG images to WebP format for smaller file sizes" },
    "jpg-to-webp": { title: "JPG to WebP", description: "Convert JPEG images to WebP format for smaller file sizes" },
    "gif-to-webp": { title: "GIF to WebP", description: "Convert GIF images to WebP format" },
    "bmp-to-webp": { title: "BMP to WebP", description: "Convert BMP images to WebP format" },
    "tiff-to-webp": { title: "TIFF to WebP", description: "Convert TIFF images to WebP format" },
    "webp-to-png": { title: "WebP to PNG", description: "Convert WebP images to PNG format" },
    "webp-to-jpg": { title: "WebP to JPG", description: "Convert WebP images to JPEG format" },
    "webp-to-pdf": { title: "WebP to PDF", description: "Convert WebP images to PDF" },
    "webp-to-avif": { title: "WebP to AVIF", description: "Convert WebP images to AVIF format" },
    "jpg-to-avif": { title: "JPG to AVIF", description: "Convert JPEG images to AVIF format" },
    "png-to-avif": { title: "PNG to AVIF", description: "Convert PNG images to AVIF format" },
    "avif-to-jpg": { title: "AVIF to JPG", description: "Convert AVIF images to JPEG format" },
    "avif-to-png": { title: "AVIF to PNG", description: "Convert AVIF images to PNG format" },
    "jpg-to-png": { title: "JPG to PNG", description: "Convert JPEG images to lossless PNG" },
    "png-to-jpg": { title: "PNG to JPG", description: "Convert PNG images to JPEG format" },
    "png-to-svg": { title: "PNG to SVG", description: "Embed a PNG image inside an SVG container" },
    "svg-to-png": { title: "SVG to PNG", description: "Rasterize SVG graphics to PNG format" },
    "gif-to-png": { title: "GIF to PNG", description: "Convert GIF images to PNG (first frame)" },
    "bmp-to-jpg": { title: "BMP to JPG", description: "Convert BMP images to JPEG format" },
    "tiff-to-jpg": { title: "TIFF to JPG", description: "Convert TIFF images to JPEG format" },
    "tiff-to-png": { title: "TIFF to PNG", description: "Convert TIFF images to PNG format" },
    "jpg-to-pdf": { title: "JPG to PDF", description: "Convert JPEG images to PDF format" },
    "png-to-pdf": { title: "PNG to PDF", description: "Convert PNG images to PDF format" },
    // Privacy
    "checksum": { title: "File Checksum", description: "Verify file integrity with SHA-1, SHA-256, SHA-384, SHA-512" },
    // Text & Code
    "json-formatter": { title: "JSON Formatter", description: "Format, validate, and minify JSON in your browser" },
    "html-formatter": { title: "HTML Formatter", description: "Format or minify HTML code with a single click" },
    "base64": { title: "Base64 Encoder / Decoder", description: "Encode or decode text and files to/from Base64" },
    "url-encoder": { title: "URL Encoder / Decoder", description: "Encode and decode URL components in real time" },
    "word-counter": { title: "Word & Character Counter", description: "Count words, characters, sentences, and reading time" },
    "lorem-ipsum": { title: "Lorem Ipsum Generator", description: "Generate placeholder text for any design or prototype" },
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
    security: "Security",
    columns: { pdf: "PDF Tools", images: "Image Tools", utilities: "Utilities" },
  },
  cookie: {
    message: "We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are",
    neverUploaded: "never uploaded",
    privacyPolicy: "Privacy policy",
    essentialOnly: "Essential only",
    acceptAll: "Accept all",
  },
  notFound: {
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    backHome: "Back to all tools",
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
    unitNames: {
      "meter": "Meter", "kilometer": "Kilometer", "centimeter": "Centimeter", "millimeter": "Millimeter",
      "mile": "Mile", "yard": "Yard", "foot": "Foot", "inch": "Inch",
      "nautical-mile": "Nautical Mile", "light-year": "Light Year",
      "kilogram": "Kilogram", "gram": "Gram", "milligram": "Milligram",
      "pound": "Pound", "ounce": "Ounce", "stone": "Stone",
      "ton-metric": "Ton (Metric)", "ton-imperial": "Ton (Imperial)", "ton-us": "Ton (US)",
      "celsius": "Celsius", "fahrenheit": "Fahrenheit", "kelvin": "Kelvin",
      "liter": "Liter", "milliliter": "Milliliter",
      "gallon-us": "Gallon (US)", "gallon-uk": "Gallon (UK)",
      "quart": "Quart", "pint": "Pint", "cup": "Cup",
      "fluid-ounce": "Fluid Ounce", "tablespoon": "Tablespoon", "teaspoon": "Teaspoon",
      "cubic-meter": "Cubic Meter", "cubic-centimeter": "Cubic Centimeter",
      "square-meter": "Square Meter", "square-kilometer": "Square Kilometer",
      "square-centimeter": "Square Centimeter", "square-millimeter": "Square Millimeter",
      "square-mile": "Square Mile", "square-yard": "Square Yard",
      "square-foot": "Square Foot", "square-inch": "Square Inch",
      "hectare": "Hectare", "acre": "Acre",
      "meter-second": "Meter / Second", "kilometer-hour": "Kilometer / Hour",
      "mile-hour": "Mile / Hour", "knot": "Knot", "foot-second": "Foot / Second",
      "pascal": "Pascal", "kilopascal": "Kilopascal", "megapascal": "Megapascal",
      "bar": "Bar", "millibar": "Millibar", "psi": "PSI",
      "atm": "Atmosphere", "torr": "Torr", "mmhg": "Millimeter of Mercury",
      "joule": "Joule", "kilojoule": "Kilojoule", "megajoule": "Megajoule",
      "calorie": "Calorie", "kilocalorie": "Kilocalorie",
      "watt-hour": "Watt Hour", "kilowatt-hour": "Kilowatt Hour",
      "electron-volt": "Electron Volt", "btu": "BTU",
      "watt": "Watt", "kilowatt": "Kilowatt", "megawatt": "Megawatt",
      "horsepower-metric": "Horsepower (Metric)", "horsepower-imperial": "Horsepower (Imperial)",
      "btu-hour": "BTU / Hour",
      "byte": "Byte", "bit": "Bit", "kilobyte": "Kilobyte",
      "megabyte": "Megabyte", "gigabyte": "Gigabyte", "terabyte": "Terabyte",
      "kibibyte": "Kibibyte", "mebibyte": "Mebibyte",
      "gibibyte": "Gibibyte", "tebibyte": "Tebibyte",
      "second": "Second", "millisecond": "Millisecond", "microsecond": "Microsecond",
      "minute": "Minute", "hour": "Hour", "day": "Day",
      "week": "Week", "month": "Month", "year": "Year",
      "degree": "Degree", "radian": "Radian", "gradian": "Gradian",
      "arcminute": "Arcminute", "arcsecond": "Arcsecond",
      "hertz": "Hertz", "kilohertz": "Kilohertz", "megahertz": "Megahertz",
      "gigahertz": "Gigahertz", "rpm": "RPM",
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
  ocr: {
    modelNote: "First use downloads ~15 MB OCR model — this is a one-time browser cache.",
    extractBtn: "Extract Text",
    extractedText: "Extracted Text",
  },
  wordCounter: {
    words: "Words",
    chars: "Characters",
    noSpaces: "No spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    readingTime: "Reading time",
    clear: "Clear",
    copyText: "Copy text",
    pasteHere: "Paste or type your text here…",
  },
  common: {
    download: "Download",
    downloadAll: (n) => `Download all ${n} files as ZIP`,
    copy: "Copy",
    copied: "Copied!",
    reset: "Reset",
    remove: "Remove",
    clear: "Clear",
    processing: "Processing…",
    converting: "Converting…",
    quality: "Quality",
    original: "Original",
    converted: "Converted",
    extractText: "Extract Text",
    extractedText: "Extracted Text",
    dropFileHere: "Drop file here, or click to browse",
    dropFilesHere: (label) => `Drop ${label} files here or click to browse`,
    uploadFile: "Upload File",
    pasteText: "Paste text here…",
    outputAppearsHere: "Output appears here…",
    convertToPdf: "Convert to PDF",
    downloadPdf: "Download PDF",
    downloadCsv: "Download CSV",
    downloadTxt: "Download .txt",
    convertFiles: (n, ext) => `Convert ${n} file${n > 1 ? 's' : ''} to ${ext}`,
    pdfReady: (kb) => `PDF ready — ${kb} KB`,
    sheet: "Sheet:",
    exportSheet: "Export sheet:",
    convertBtn: "Convert",
    preview: (n) => `Preview (${n} rows)`,
    orPasteDirectly: "Or paste directly:",
    errorGeneric: "Something went wrong. Please try again.",
    view: "View",
    copyText: "Copy text",
    format: "Format",
    minify: "Minify",
    encode: "Encode",
    decode: "Decode",
    generate: "Generate",
  },
  jsonFormatter: {
    inputLabel: "Input JSON",
    formattedOutput: "Formatted Output",
    minifiedOutput: "Minified Output",
    indent: "Indent:",
    stats: (chars, bytes) => `${chars} chars · ${bytes} bytes`,
    invalidJson: "Invalid JSON",
  },
  htmlFormatter: {
    inputLabel: "Input HTML",
    outputLabel: "Output",
    bytes: (n) => `${n} bytes`,
  },
  urlEncoder: {
    rawUrlText: "Raw URL / text",
    encodedUrl: "Encoded URL",
    encodedOutput: "Encoded output",
    decodedOutput: "Decoded output",
    quickExamples: "Quick examples",
    invalidInput: "Invalid input",
    examples: { space: "Space", ampersand: "Ampersand", equals: "Equals", hash: "Hash" },
  },
  base64Encoder: {
    uploadFile: "Upload file → Base64",
    plainTextInput: "Plain text input",
    base64Input: "Base64 input",
    base64Output: "Base64 output",
    decodedText: "Decoded text",
    encodePlaceholder: "Type or paste text to encode…",
    decodePlaceholder: "Paste Base64 to decode…",
    chars: (n) => `${n} chars`,
    invalidInput: "Invalid input",
  },
  loremIpsum: {
    types: { paragraphs: "Paragraphs", sentences: "Sentences", words: "Words", lists: "Lists" },
    count: "Count:",
    classicStart: "Start with classic Lorem ipsum",
  },
};

const FR: Translations = {
  nav: {
    searchPlaceholder: "Rechercher des outils...",
    breadcrumb: {
      home: "Accueil", pdf: "Outils PDF", word: "Outils Word", image: "Outils Image",
      privacy: "Outils Confidentialité", calculators: "Calculateurs", tools: "Outils",
      textCode: "Texte & Code", excelSpreadsheets: "Excel & Tableurs", documents: "Documents",
    },
    groups: {
      pdf: "Outils PDF",
      documents: "Documents",
      images: "Images",
      textCode: "Texte & Code",
      tools: "Outils",
    },
    links: {
      // PDF
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
      "pdf-compress": "Compresser le PDF",
      "pdf-to-image": "PDF en Image",
      "pdf-to-excel": "PDF en Excel",
      "reorder-pdf": "Réorganiser les Pages",
      "ocr": "OCR — Image en Texte",
      // Documents
      "word-to-pdf": "Word en PDF",
      "word-to-text": "Word en Texte",
      "word-to-html": "Word en HTML",
      "word-to-epub": "Word en EPUB",
      "word-to-markdown": "Word en Markdown",
      "html-to-markdown": "HTML en Markdown",
      "markdown-to-pdf": "Markdown en PDF",
      "markdown-to-docx": "Markdown en Word",
      "html-to-pdf": "HTML en PDF",
      "txt-to-pdf": "Texte en PDF",
      "txt-to-docx": "Texte en Word",
      "excel-to-pdf": "Excel en PDF",
      "excel-to-csv": "Excel en CSV",
      "csv-to-excel": "CSV en Excel",
      "csv-to-json": "CSV ↔ JSON",
      "csv-viewer": "Visionneuse CSV",
      "pptx-to-pdf": "PowerPoint en PDF",
      "pptx-to-images": "PowerPoint en Images",
      "pdf-to-pptx": "PDF en PowerPoint",
      // Images
      "image-converter": "Convertisseur d'Image",
      "image-compress": "Compresser l'Image",
      "image-resize": "Redimensionner l'Image",
      "image-crop": "Rogner l'Image",
      "image-to-pdf": "Image en PDF",
      "background-remover": "Suppression du Fond",
      "flip-rotate-image": "Retourner & Pivoter",
      "watermark-image": "Ajouter un Filigrane",
      "favicon-generator": "Générateur de Favicon",
      "heic-to-jpg": "HEIC en JPG",
      "heic-to-png": "HEIC en PNG",
      "heic-to-webp": "HEIC en WebP",
      "heic-to-pdf": "HEIC en PDF",
      "png-to-webp": "PNG en WebP",
      "jpg-to-webp": "JPG en WebP",
      "gif-to-webp": "GIF en WebP",
      "bmp-to-webp": "BMP en WebP",
      "tiff-to-webp": "TIFF en WebP",
      "webp-to-png": "WebP en PNG",
      "webp-to-jpg": "WebP en JPG",
      "webp-to-pdf": "WebP en PDF",
      "webp-to-avif": "WebP en AVIF",
      "jpg-to-avif": "JPG en AVIF",
      "png-to-avif": "PNG en AVIF",
      "avif-to-jpg": "AVIF en JPG",
      "avif-to-png": "AVIF en PNG",
      "jpg-to-png": "JPG en PNG",
      "png-to-jpg": "PNG en JPG",
      "png-to-svg": "PNG en SVG",
      "svg-to-png": "SVG en PNG",
      "gif-to-png": "GIF en PNG",
      "bmp-to-jpg": "BMP en JPG",
      "tiff-to-jpg": "TIFF en JPG",
      "tiff-to-png": "TIFF en PNG",
      "jpg-to-pdf": "JPG en PDF",
      "png-to-pdf": "PNG en PDF",
      // Texte & Code
      "json-formatter": "Formateur JSON",
      "html-formatter": "Formateur HTML",
      "base64": "Base64 Encoder / Décoder",
      "url-encoder": "URL Encoder / Décoder",
      "word-counter": "Compteur de Mots",
      "lorem-ipsum": "Lorem Ipsum",
      // Confidentialité & Outils
      "metadata-cleaner": "Nettoyeur de Métadonnées",
      "ai-text-scrubber": "Nettoyeur de Texte IA",
      "checksum": "Somme de Contrôle",
      "password-generator": "Générateur de Mot de Passe",
      "currency-converter": "Convertisseur de Devises",
      "unit-converter": "Convertisseur d'Unités",
      "percentage-calc": "Calculateur de Pourcentage",
      "qr-code-generator": "Générateur de QR Code",
      "tip-calculator": "Calculateur de Pourboire",
    },
  },
  home: {
    title: "EverydayTools",
    subtitle: "Outils en ligne pour documents, images et utilitaires. Sans téléchargement. Sans compte.",
    allTools: "Tous les outils",
    allToolsSubtitle: (_n: number) => `Outils gratuits pour les documents, images et tâches du quotidien. Sans compte. Sans téléchargement.`,
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
    recentlyUsed: "Récemment utilisés",
    pinned: "Épinglés",
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
    "background-remover": { title: "Suppression du Fond", description: "Supprimez l'arrière-plan de vos photos instantanément. Gratuit, sans compte." },
    "metadata-cleaner": { title: "Nettoyeur de Métadonnées", description: "Supprimer les métadonnées EXIF, XMP et de document des fichiers" },
    "ai-text-scrubber": { title: "Nettoyeur de Texte IA", description: "Supprimer les caractères invisibles et les motifs de détection IA du texte" },
    "password-generator": { title: "Générateur de Mot de Passe", description: "Générer des mots de passe sécurisés avec affichage de l'entropie" },
    "percentage-calc": { title: "Calculateur de Pourcentage", description: "Calculer des pourcentages, remises, pourboires et marges instantanément" },
    "unit-converter": { title: "Convertisseur d'Unités", description: "Convertir entre plus de 200 unités dans 13 catégories de mesure" },
    "currency-converter": { title: "Convertisseur de Devises", description: "Convertir entre 170 devises avec des taux en temps réel" },
    "qr-code-generator": { title: "Générateur de QR Code", description: "Générez des QR codes depuis des URLs, du texte, des identifiants Wi-Fi ou des cartes de contact — entièrement dans votre navigateur" },
    "tip-calculator": { title: "Calculateur de Pourboire", description: "Calculer le pourboire et diviser l'addition entre plusieurs personnes" },
    "document-converter": { title: "Convertisseur de Documents", description: "Convertir des fichiers PDF, DOCX et TXT directement dans votre navigateur. Tout le traitement est local." },
    // New PDF tools
    "pdf-to-excel": { title: "PDF en Excel", description: "Extraire les tableaux d'un PDF vers Excel" },
    "reorder-pdf": { title: "Réorganiser les Pages PDF", description: "Glisser-déposer pour réorganiser les pages d'un PDF" },
    "ocr": { title: "OCR — Image en Texte", description: "Extraire le texte des images numérisées avec Tesseract.js" },
    // New Word tools
    "word-to-pdf": { title: "Word en PDF", description: "Convertir des fichiers DOCX en PDF dans votre navigateur" },
    "word-to-markdown": { title: "Word en Markdown", description: "Convertir des fichiers DOCX en Markdown propre" },
    "html-to-markdown": { title: "HTML en Markdown", description: "Convertir du contenu HTML en format Markdown" },
    // Excel & Spreadsheets
    "excel-to-pdf": { title: "Excel en PDF", description: "Convertir des feuilles de calcul Excel en PDF" },
    "excel-to-csv": { title: "Excel en CSV", description: "Convertir des feuilles Excel au format CSV" },
    "csv-to-excel": { title: "CSV en Excel", description: "Convertir des fichiers CSV en Excel (.xlsx)" },
    "csv-to-json": { title: "CSV ↔ JSON", description: "Convertir entre les formats CSV et JSON" },
    "csv-viewer": { title: "Visionneuse CSV", description: "Afficher et trier des fichiers CSV sous forme de tableau" },
    // PowerPoint
    "pptx-to-pdf": { title: "PowerPoint en PDF", description: "Convertir des présentations PowerPoint en PDF" },
    "pptx-to-images": { title: "PowerPoint en Images", description: "Exporter chaque diapositive en image PNG" },
    "pdf-to-pptx": { title: "PDF en PowerPoint", description: "Convertir chaque page PDF en diapositive PowerPoint" },
    // New image tools
    "heic-to-png": { title: "HEIC en PNG", description: "Convertir les photos HEIC/HEIF en format PNG" },
    "heic-to-webp": { title: "HEIC en WebP", description: "Convertir les photos HEIC/HEIF en format WebP" },
    "heic-to-pdf": { title: "HEIC en PDF", description: "Convertir les photos HEIC/HEIF en PDF" },
    "flip-rotate-image": { title: "Retourner & Pivoter", description: "Retourner horizontalement, verticalement ou pivoter d'un angle" },
    "watermark-image": { title: "Ajouter un Filigrane", description: "Ajouter un filigrane texte aux images" },
    "favicon-generator": { title: "Générateur de Favicon", description: "Générer des favicons dans toutes les tailles depuis une image" },
    // Image conversion
    "png-to-webp": { title: "PNG en WebP", description: "Convertir des images PNG en format WebP" },
    "jpg-to-webp": { title: "JPG en WebP", description: "Convertir des images JPEG en format WebP" },
    "gif-to-webp": { title: "GIF en WebP", description: "Convertir des images GIF en format WebP" },
    "bmp-to-webp": { title: "BMP en WebP", description: "Convertir des images BMP en format WebP" },
    "tiff-to-webp": { title: "TIFF en WebP", description: "Convertir des images TIFF en format WebP" },
    "webp-to-png": { title: "WebP en PNG", description: "Convertir des images WebP en format PNG" },
    "webp-to-jpg": { title: "WebP en JPG", description: "Convertir des images WebP en format JPEG" },
    "webp-to-pdf": { title: "WebP en PDF", description: "Convertir des images WebP en PDF" },
    "webp-to-avif": { title: "WebP en AVIF", description: "Convertir des images WebP en format AVIF" },
    "jpg-to-avif": { title: "JPG en AVIF", description: "Convertir des images JPEG en format AVIF" },
    "png-to-avif": { title: "PNG en AVIF", description: "Convertir des images PNG en format AVIF" },
    "avif-to-jpg": { title: "AVIF en JPG", description: "Convertir des images AVIF en format JPEG" },
    "avif-to-png": { title: "AVIF en PNG", description: "Convertir des images AVIF en format PNG" },
    "jpg-to-png": { title: "JPG en PNG", description: "Convertir des images JPEG en PNG sans perte" },
    "png-to-jpg": { title: "PNG en JPG", description: "Convertir des images PNG en format JPEG" },
    "png-to-svg": { title: "PNG en SVG", description: "Intégrer une image PNG dans un conteneur SVG" },
    "svg-to-png": { title: "SVG en PNG", description: "Rastériser des graphiques SVG en format PNG" },
    "gif-to-png": { title: "GIF en PNG", description: "Convertir des images GIF en PNG (première image)" },
    "bmp-to-jpg": { title: "BMP en JPG", description: "Convertir des images BMP en format JPEG" },
    "tiff-to-jpg": { title: "TIFF en JPG", description: "Convertir des images TIFF en format JPEG" },
    "tiff-to-png": { title: "TIFF en PNG", description: "Convertir des images TIFF en format PNG" },
    "jpg-to-pdf": { title: "JPG en PDF", description: "Convertir des images JPEG en format PDF" },
    "png-to-pdf": { title: "PNG en PDF", description: "Convertir des images PNG en format PDF" },
    // Privacy
    "checksum": { title: "Somme de Contrôle", description: "Vérifier l'intégrité des fichiers avec SHA-1, SHA-256, SHA-384, SHA-512" },
    // Text & Code
    "json-formatter": { title: "Formateur JSON", description: "Formater, valider et minifier du JSON dans votre navigateur" },
    "html-formatter": { title: "Formateur HTML", description: "Formater ou minifier du code HTML en un clic" },
    "base64": { title: "Base64 Encoder / Décoder", description: "Encoder ou décoder du texte et des fichiers en Base64" },
    "url-encoder": { title: "URL Encoder / Décoder", description: "Encoder et décoder des composants d'URL en temps réel" },
    "word-counter": { title: "Compteur de Mots", description: "Compter les mots, caractères, phrases et le temps de lecture" },
    "lorem-ipsum": { title: "Générateur Lorem Ipsum", description: "Générer du texte de remplissage pour tout design ou prototype" },
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
    security: "Sécurité",
    columns: { pdf: "Outils PDF", images: "Outils Image", utilities: "Utilitaires" },
  },
  cookie: {
    message: "Nous utilisons des analyses respectueuses de la vie privée (sans cookies, sans données personnelles) et, avec votre consentement, des publicités qui aident à maintenir tous les outils gratuits. Vos fichiers ne sont",
    neverUploaded: "jamais téléchargés",
    privacyPolicy: "Politique de confidentialité",
    essentialOnly: "Essentiel seulement",
    acceptAll: "Tout accepter",
  },
  notFound: {
    title: "Page introuvable",
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    backHome: "Retour aux outils",
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
    unitNames: {
      "meter": "Mètre", "kilometer": "Kilomètre", "centimeter": "Centimètre", "millimeter": "Millimètre",
      "mile": "Mile", "yard": "Yard", "foot": "Pied", "inch": "Pouce",
      "nautical-mile": "Mille nautique", "light-year": "Année-lumière",
      "kilogram": "Kilogramme", "gram": "Gramme", "milligram": "Milligramme",
      "pound": "Livre", "ounce": "Once", "stone": "Stone",
      "ton-metric": "Tonne (métrique)", "ton-imperial": "Tonne (impériale)", "ton-us": "Tonne (US)",
      "celsius": "Celsius", "fahrenheit": "Fahrenheit", "kelvin": "Kelvin",
      "liter": "Litre", "milliliter": "Millilitre",
      "gallon-us": "Gallon (US)", "gallon-uk": "Gallon (UK)",
      "quart": "Quart", "pint": "Pinte", "cup": "Tasse",
      "fluid-ounce": "Once liquide", "tablespoon": "Cuillère à soupe", "teaspoon": "Cuillère à café",
      "cubic-meter": "Mètre cube", "cubic-centimeter": "Centimètre cube",
      "square-meter": "Mètre carré", "square-kilometer": "Kilomètre carré",
      "square-centimeter": "Centimètre carré", "square-millimeter": "Millimètre carré",
      "square-mile": "Mile carré", "square-yard": "Yard carré",
      "square-foot": "Pied carré", "square-inch": "Pouce carré",
      "hectare": "Hectare", "acre": "Acre",
      "meter-second": "Mètre / Seconde", "kilometer-hour": "Kilomètre / Heure",
      "mile-hour": "Mile / Heure", "knot": "Nœud", "foot-second": "Pied / Seconde",
      "pascal": "Pascal", "kilopascal": "Kilopascal", "megapascal": "Mégapascal",
      "bar": "Bar", "millibar": "Millibar", "psi": "PSI",
      "atm": "Atmosphère", "torr": "Torr", "mmhg": "Millimètre de mercure",
      "joule": "Joule", "kilojoule": "Kilojoule", "megajoule": "Mégajoule",
      "calorie": "Calorie", "kilocalorie": "Kilocalorie",
      "watt-hour": "Wattheure", "kilowatt-hour": "Kilowattheure",
      "electron-volt": "Électronvolt", "btu": "BTU",
      "watt": "Watt", "kilowatt": "Kilowatt", "megawatt": "Mégawatt",
      "horsepower-metric": "Cheval-vapeur (métrique)", "horsepower-imperial": "Cheval-vapeur (impérial)",
      "btu-hour": "BTU / Heure",
      "byte": "Octet", "bit": "Bit", "kilobyte": "Kilooctet",
      "megabyte": "Mégaoctet", "gigabyte": "Gigaoctet", "terabyte": "Téraoctet",
      "kibibyte": "Kibioctet", "mebibyte": "Mébioctet",
      "gibibyte": "Gibioctet", "tebibyte": "Tébioctet",
      "second": "Seconde", "millisecond": "Milliseconde", "microsecond": "Microseconde",
      "minute": "Minute", "hour": "Heure", "day": "Jour",
      "week": "Semaine", "month": "Mois", "year": "Année",
      "degree": "Degré", "radian": "Radian", "gradian": "Grade",
      "arcminute": "Minute d'arc", "arcsecond": "Seconde d'arc",
      "hertz": "Hertz", "kilohertz": "Kilohertz", "megahertz": "Mégahertz",
      "gigahertz": "Gigahertz", "rpm": "tr/min",
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
  ocr: {
    modelNote: "La première utilisation télécharge ~15 Mo de modèle OCR — mis en cache une seule fois dans le navigateur.",
    extractBtn: "Extraire le texte",
    extractedText: "Texte extrait",
  },
  wordCounter: {
    words: "Mots",
    chars: "Caractères",
    noSpaces: "Sans espaces",
    sentences: "Phrases",
    paragraphs: "Paragraphes",
    readingTime: "Temps de lecture",
    clear: "Effacer",
    copyText: "Copier le texte",
    pasteHere: "Collez ou tapez votre texte ici…",
  },
  common: {
    download: "Télécharger",
    downloadAll: (n) => `Télécharger les ${n} fichiers en ZIP`,
    copy: "Copier",
    copied: "Copié !",
    reset: "Réinitialiser",
    remove: "Supprimer",
    clear: "Effacer",
    processing: "Traitement…",
    converting: "Conversion…",
    quality: "Qualité",
    original: "Original",
    converted: "Converti",
    extractText: "Extraire le texte",
    extractedText: "Texte extrait",
    dropFileHere: "Déposez le fichier ici, ou cliquez pour parcourir",
    dropFilesHere: (label) => `Déposez les fichiers ${label} ici ou cliquez pour parcourir`,
    uploadFile: "Parcourir",
    pasteText: "Collez votre texte ici…",
    outputAppearsHere: "La sortie apparaît ici…",
    convertToPdf: "Convertir en PDF",
    downloadPdf: "Télécharger le PDF",
    downloadCsv: "Télécharger le CSV",
    downloadTxt: "Télécharger .txt",
    convertFiles: (n, ext) => `Convertir ${n} fichier${n > 1 ? 's' : ''} en ${ext}`,
    pdfReady: (kb) => `PDF prêt — ${kb} Ko`,
    sheet: "Feuille :",
    exportSheet: "Exporter la feuille :",
    convertBtn: "Convertir",
    preview: (n) => `Aperçu (${n} lignes)`,
    orPasteDirectly: "Ou collez directement :",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    view: "Afficher",
    copyText: "Copier le texte",
    format: "Formater",
    minify: "Minifier",
    encode: "Encoder",
    decode: "Décoder",
    generate: "Générer",
  },
  jsonFormatter: {
    inputLabel: "JSON d'entrée",
    formattedOutput: "Résultat formaté",
    minifiedOutput: "Résultat minifié",
    indent: "Indentation :",
    stats: (chars, bytes) => `${chars} caractères · ${bytes} octets`,
    invalidJson: "JSON invalide",
  },
  htmlFormatter: {
    inputLabel: "HTML d'entrée",
    outputLabel: "Résultat",
    bytes: (n) => `${n} octets`,
  },
  urlEncoder: {
    rawUrlText: "URL brute / texte",
    encodedUrl: "URL encodée",
    encodedOutput: "Résultat encodé",
    decodedOutput: "Résultat décodé",
    quickExamples: "Exemples rapides",
    invalidInput: "Entrée invalide",
    examples: { space: "Espace", ampersand: "Esperluette", equals: "Égal", hash: "Dièse" },
  },
  base64Encoder: {
    uploadFile: "Envoyer un fichier → Base64",
    plainTextInput: "Texte brut",
    base64Input: "Entrée Base64",
    base64Output: "Résultat Base64",
    decodedText: "Texte décodé",
    encodePlaceholder: "Tapez ou collez le texte à encoder…",
    decodePlaceholder: "Collez le Base64 à décoder…",
    chars: (n) => `${n} caractères`,
    invalidInput: "Entrée invalide",
  },
  loremIpsum: {
    types: { paragraphs: "Paragraphes", sentences: "Phrases", words: "Mots", lists: "Listes" },
    count: "Nombre :",
    classicStart: "Commencer avec le Lorem ipsum classique",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { EN, FR };
