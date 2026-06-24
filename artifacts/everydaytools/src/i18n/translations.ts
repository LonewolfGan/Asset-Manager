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
      "ocr": "OCR: Image to Text",
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
    "pdf-to-word": { title: "PDF to Word", description: "Turns a PDF into a DOCX file you can edit in Word. Works well on text-based PDFs. Scanned or image-heavy files produce simpler output." },
    "pdf-to-text": { title: "PDF to Text", description: "Extracts every word from a PDF as plain text. Strips all formatting, which is useful when you need the content without the layout." },
    "pdf-to-html": { title: "PDF to HTML", description: "Converts a PDF into HTML markup. Results depend on how the original PDF was structured. Works best on straightforward text documents." },
    "pdf-to-epub": { title: "PDF to EPUB", description: "Converts a PDF to EPUB format for reading on Kindle, Apple Books, or similar apps. Text-heavy documents with simple layouts convert cleanest." },
    "pdf-compress": { title: "Compress PDF", description: "Reduces a PDF file size. Useful when a file is too large to email or upload somewhere." },
    "pdf-merge": { title: "Merge PDFs", description: "Combines multiple PDFs into one file. Drag them into the right order before merging if the page sequence matters." },
    "pdf-split": { title: "Split PDF", description: "Cuts a PDF into individual pages or custom page ranges. Good when you only need part of a long document." },
    "pdf-rotate": { title: "Rotate PDF", description: "Rotates PDF pages 90, 180, or 270 degrees. Fixes scanned documents that came out sideways." },
    "pdf-unlock": { title: "Unlock PDF", description: "Removes owner-level restrictions from a PDF, such as copy-paste blocks or print bans. Does not bypass the password required to open the file." },
    "pdf-protect": { title: "Protect PDF", description: "Adds a password to a PDF. Anyone who tries to open it will need to enter the password you set." },
    "pdf-page-numbers": { title: "Add Page Numbers", description: "Stamps page numbers onto every page of a PDF. Set the starting number, position, and font size." },
    "pdf-watermark": { title: "Watermark PDF", description: "Adds a text watermark across every page of a PDF. Control what it says, the opacity, and the rotation angle." },
    "word-to-text": { title: "Word to Text", description: "Extracts the plain text from a Word document. Strips all styles and formatting, leaving just the words." },
    "word-to-html": { title: "Word to HTML", description: "Converts a DOCX file to HTML. Useful for putting document content into a webpage or CMS." },
    "word-to-epub": { title: "Word to EPUB", description: "Converts a Word document to EPUB. Straightforward documents with clear headings and paragraphs convert cleanest." },
    "markdown-to-pdf": { title: "Markdown to PDF", description: "Renders a Markdown file as a PDF. Headings, lists, tables, and code blocks all come through correctly." },
    "markdown-to-docx": { title: "Markdown to Word", description: "Converts a Markdown file to a Word document. Good for when you write in Markdown but need to send a .docx." },
    "html-to-pdf": { title: "HTML to PDF", description: "Converts HTML to a PDF. Paste your markup, check the preview, and download." },
    "txt-to-pdf": { title: "Text to PDF", description: "Converts a plain text file to PDF with proper margins and line wrapping." },
    "txt-to-docx": { title: "Text to Word", description: "Converts a .txt file to a Word document. For when someone needs .docx and you only have plain text." },
    "image-converter": { title: "Image Converter", description: "Converts images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, ICO, and SVG. Handles batches of up to 20 files." },
    "heic-to-jpg": { title: "HEIC to JPG", description: "Converts iPhone HEIC photos to JPEG. HEIC is standard on Apple devices but most apps and websites still won't open it." },
    "image-compress": { title: "Compress Image", description: "Reduces image file size using a quality slider. The before and after sizes update as you adjust." },
    "image-resize": { title: "Resize Image", description: "Resizes images by pixel dimensions or percentage. Lock the aspect ratio or stretch it freely." },
    "image-crop": { title: "Crop Image", description: "Crops images with drag handles. Includes presets for 1:1, 16:9, 4:3, and other common ratios." },
    "image-to-pdf": { title: "Image to PDF", description: "Combines one or more images into a PDF. Add multiple images and reorder them before generating." },
    "pdf-to-image": { title: "PDF to Image", description: "Exports each PDF page as a PNG or JPEG. Useful for thumbnails, previews, or sharing individual pages." },
    "background-remover": { title: "Background Remover", description: "Removes image backgrounds using a server-side AI model. Upload your image and get a transparent PNG in seconds." },
    "metadata-cleaner": { title: "Metadata Cleaner", description: "Strips EXIF, XMP, and document metadata from photos and PDFs. Removes GPS coordinates, device info, and author names before sharing." },
    "ai-text-scrubber": { title: "AI Text Scrubber", description: "Removes invisible Unicode characters and patterns that AI detection tools flag. Paste your text, clean it, copy the result." },
    "password-generator": { title: "Password Generator", description: "Generates cryptographically random passwords using the browser's built-in randomness. Shows entropy in bits so you can see how strong each one is." },
    "percentage-calc": { title: "Percentage Calculator", description: "Handles three percentage problems: what is X% of Y, X is what percent of Y, and percentage change between two numbers." },
    "unit-converter": { title: "Unit Converter", description: "Converts between 200 units across 13 categories including length, weight, temperature, area, volume, and speed. Results update as you type." },
    "currency-converter": { title: "Currency Converter", description: "Live exchange rates for 170 currencies, updated every hour. Falls back to cached rates if the API is unavailable." },
    "qr-code-generator": { title: "QR Code Generator", description: "Creates QR codes from URLs, plain text, Wi-Fi credentials, or contact cards. Download as PNG or SVG." },
    "tip-calculator": { title: "Tip Calculator", description: "Calculates the tip and splits the total across any number of people. Adjust the percentage and guest count to see per-person amounts." },
    "document-converter": { title: "Document Converter", description: "Converts PDFs, Word documents, and text files between formats. Processing runs in the browser." },
    "pdf-to-excel": { title: "PDF to Excel", description: "Extracts tables from a PDF and puts them into an Excel spreadsheet. Works well on structured data. Scanned PDFs produce messier results." },
    "reorder-pdf": { title: "Reorder PDF Pages", description: "Drag PDF pages into a new order and remove any you do not want, then download the result." },
    "ocr": { title: "OCR: Image to Text", description: "Reads text from images and scanned documents using Tesseract.js. The recognition runs in the browser with no server involved." },
    "word-to-pdf": { title: "Word to PDF", description: "Converts a DOCX to PDF. Useful for sharing documents that need to look the same on any device." },
    "word-to-markdown": { title: "Word to Markdown", description: "Converts a Word document to Markdown. Headings, bold, italic, and lists translate well. Complex formatting gets simplified." },
    "html-to-markdown": { title: "HTML to Markdown", description: "Converts HTML into Markdown. Strips the tags and produces readable plain-text Markdown." },
    "excel-to-pdf": { title: "Excel to PDF", description: "Converts an Excel spreadsheet to PDF in the browser. Each sheet becomes a page in the output." },
    "excel-to-csv": { title: "Excel to CSV", description: "Exports Excel sheets as CSV files. Each sheet becomes one CSV file." },
    "csv-to-excel": { title: "CSV to Excel", description: "Converts a CSV file to an Excel workbook. Column types are auto-detected where the data is clear." },
    "csv-to-json": { title: "CSV \u2194 JSON", description: "Converts between CSV and JSON. Paste one format and get the other. Column headers become JSON keys." },
    "csv-viewer": { title: "CSV Viewer", description: "Opens a CSV and displays it as a sortable table in the browser." },
    "pptx-to-pdf": { title: "PowerPoint to PDF", description: "Converts a PowerPoint file to PDF. Each slide becomes a page in the output." },
    "pptx-to-images": { title: "PowerPoint to Images", description: "Exports each slide in a PowerPoint as a PNG image. All slides download together as a ZIP." },
    "pdf-to-pptx": { title: "PDF to PowerPoint", description: "Converts each PDF page into a PowerPoint slide as an embedded image." },
    "heic-to-png": { title: "HEIC to PNG", description: "Converts HEIC photos to PNG. PNG is lossless and opens in every image viewer." },
    "heic-to-webp": { title: "HEIC to WebP", description: "Converts HEIC photos to WebP. WebP files are smaller than JPEG at similar quality." },
    "heic-to-pdf": { title: "HEIC to PDF", description: "Packages HEIC photos into a PDF document." },
    "flip-rotate-image": { title: "Flip & Rotate Image", description: "Flips images horizontally or vertically, or rotates by any angle. Good for fixing phone photos that came out sideways." },
    "watermark-image": { title: "Add Watermark", description: "Adds a text watermark to an image. Set the position, font size, opacity, and color." },
    "favicon-generator": { title: "Favicon Generator", description: "Generates a full set of favicon sizes from any image. Downloads as a ZIP with PNG files and an .ico file." },
    "png-to-webp": { title: "PNG to WebP", description: "Converts PNG to WebP. WebP is smaller than PNG for most images at high quality settings." },
    "jpg-to-webp": { title: "JPG to WebP", description: "Converts JPEG to WebP. WebP usually compresses better than JPEG at the same visual quality." },
    "gif-to-webp": { title: "GIF to WebP", description: "Converts GIF to WebP. WebP supports animation and is typically smaller than an equivalent GIF." },
    "bmp-to-webp": { title: "BMP to WebP", description: "Converts BMP to WebP. BMP files are uncompressed and large. WebP is much more practical for sharing." },
    "tiff-to-webp": { title: "TIFF to WebP", description: "Converts TIFF to WebP. Useful for shrinking scanned documents or images from photography workflows." },
    "webp-to-png": { title: "WebP to PNG", description: "Converts WebP to PNG. Useful when you need a format that older tools still recognize." },
    "webp-to-jpg": { title: "WebP to JPG", description: "Converts WebP to JPEG. JPEG opens in any photo app or browser." },
    "webp-to-pdf": { title: "WebP to PDF", description: "Embeds a WebP image in a PDF document." },
    "webp-to-avif": { title: "WebP to AVIF", description: "Converts WebP to AVIF. AVIF compresses further than WebP at similar visual quality." },
    "jpg-to-avif": { title: "JPG to AVIF", description: "Converts JPEG to AVIF. AVIF typically produces smaller files than JPEG at the same quality." },
    "png-to-avif": { title: "PNG to AVIF", description: "Converts PNG to AVIF. Worth trying on large images since AVIF handles both lossy and lossless compression well." },
    "avif-to-jpg": { title: "AVIF to JPG", description: "Converts AVIF to JPEG. JPEG works in any browser or photo app." },
    "avif-to-png": { title: "AVIF to PNG", description: "Converts AVIF to PNG. PNG is lossless and opens in every modern image viewer." },
    "jpg-to-png": { title: "JPG to PNG", description: "Converts JPEG to PNG. PNG is lossless and supports transparency, which JPEG does not." },
    "png-to-jpg": { title: "PNG to JPG", description: "Converts PNG to JPEG. JPEG produces smaller files for photos, though some detail is discarded in compression." },
    "png-to-svg": { title: "PNG to SVG", description: "Wraps a PNG image inside an SVG container. The image stays raster. This is for SVG embedding workflows, not vectorizing." },
    "svg-to-png": { title: "SVG to PNG", description: "Rasterizes an SVG to PNG. Set the output dimensions and the vector gets drawn at that resolution." },
    "gif-to-png": { title: "GIF to PNG", description: "Extracts the first frame of a GIF as a PNG still. Useful when you need a static image from an animated file." },
    "bmp-to-jpg": { title: "BMP to JPG", description: "Converts BMP to JPEG. BMP files are uncompressed and very large. JPEG handles photos at a fraction of the size." },
    "tiff-to-jpg": { title: "TIFF to JPG", description: "Converts TIFF to JPEG. TIFF is common in photography and scanning but JPEG is more practical for sharing." },
    "tiff-to-png": { title: "TIFF to PNG", description: "Converts TIFF to PNG. PNG keeps lossless quality and opens in any modern image viewer." },
    "jpg-to-pdf": { title: "JPG to PDF", description: "Packages a JPEG into a PDF. Common for sharing photos through systems that only accept PDFs." },
    "png-to-pdf": { title: "PNG to PDF", description: "Packages a PNG into a PDF. Common for exporting screenshots or diagrams in a fixed-layout format." },
    "checksum": { title: "File Checksum", description: "Calculates SHA-256, SHA-1, SHA-384, or SHA-512 checksums for any file. Compare the result against a published hash to confirm a download was not corrupted." },
    "json-formatter": { title: "JSON Formatter", description: "Formats and validates JSON. Also minifies it. Paste messy JSON and get clean indented output, or the reverse." },
    "html-formatter": { title: "HTML Formatter", description: "Formats messy HTML into readable indented code. Also minifies it when you need to strip whitespace." },
    "base64": { title: "Base64 Encoder / Decoder", description: "Encodes text or files to Base64, or decodes Base64 back to readable text. Common in email attachments, data URIs, and API authentication." },
    "url-encoder": { title: "URL Encoder / Decoder", description: "Encodes and decodes URL components in real time. Useful for query strings that contain special characters." },
    "word-counter": { title: "Word & Character Counter", description: "Counts words, characters, sentences, and paragraphs as you type. Gives a reading time estimate based on average reading pace." },
    "lorem-ipsum": { title: "Lorem Ipsum Generator", description: "Generates placeholder text for designs and prototypes. Set how many paragraphs, sentences, or words you want." },
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
    offlineSnapshot: (date) => `Offline snapshot, rates as of ${date}`,
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
    note: "Note: Background removal is processed server-side using AI. Your image is sent to the server, processed, and returned. It is not stored.",
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
    compressingLabel: "Compressing PDF, rendering pages...",
    statsOriginal: "Original",
    statsCompressed: "Compressed",
    statsReduction: "Reduction",
    downloadBtn: (filename) => `Download ${filename}`,
    note: "Note: Compression results depend on the original PDF content. PDFs that are already optimized or contain mostly vector content may see minimal size reduction. This tool re-renders pages as JPEG images, so text will not be selectable in the output.",
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
    smallest: "1 (smallest)",
    original100: "100 (original)",
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
    dropHint: "Drop images here or click to select. Up to 20 files, 20 MB each.",
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
    modelNote: "First use downloads ~15 MB OCR model. This is cached in the browser after the first download.",
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
    pdfReady: (kb) => `PDF ready, ${kb} KB`,
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
      "ocr": "OCR: Image en Texte",
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
    "pdf-to-word": { title: "PDF en Word", description: "Transformez vos PDF en documents Word modifiables. Idéal pour réutiliser vos anciens rapports." },
    "pdf-to-text": { title: "PDF en Texte", description: "Extrayez chaque mot de n'importe quel PDF et obtenez un texte clair et copiable en un instant." },
    "pdf-to-html": { title: "PDF en HTML", description: "Convertissez votre PDF en une vraie page web avec un balisage HTML propre et sémantique." },
    "pdf-to-epub": { title: "PDF en EPUB", description: "Convertissez vos PDF en e-books EPUB pour les lire sur votre liseuse, téléphone ou tablette." },
    "pdf-compress": { title: "Compresser le PDF", description: "Réduisez la taille de vos PDF sans perte de qualité visible. Pratique pour les envois par email ou les portails avec limite de taille." },
    "pdf-merge": { title: "Fusionner les PDF", description: "Combinez plusieurs PDF en un seul document. Aussi simple que de glisser des fichiers dans un dossier." },
    "pdf-split": { title: "Diviser le PDF", description: "Découpez un gros PDF en plusieurs parties. Extrayez uniquement les pages dont vous avez besoin." },
    "pdf-rotate": { title: "Faire pivoter le PDF", description: "Corrigez les scans de travers ou pivotez les pages dans le bon sens en un clic." },
    "pdf-unlock": { title: "Déverrouiller le PDF", description: "Supprimez les restrictions de mot de passe de votre PDF pour enfin pouvoir l'utiliser." },
    "pdf-protect": { title: "Protéger le PDF", description: "Verrouillez votre PDF avec un mot de passe pour protéger son contenu des regards indiscrets." },
    "pdf-page-numbers": { title: "Numéroter les Pages", description: "Ajoutez des numéros de page à chaque page de votre PDF. Simple, propre et personnalisable." },
    "pdf-watermark": { title: "Filigrane PDF", description: "Tamponnez votre PDF avec un filigrane personnalisé. Marquez-le comme brouillon ou revendiquez la propriété avant de partager." },
    "word-to-text": { title: "Word en Texte", description: "Supprimez toute la mise en forme d'un DOCX et obtenez du texte brut. Rien que les mots, sans mise en forme cachée." },
    "word-to-html": { title: "Word en HTML", description: "Transformez vos documents Word en code HTML propre et prêt pour la production." },
    "word-to-epub": { title: "Word en EPUB", description: "Convertissez vos documents Word en e-books EPUB pour les lire sur n'importe quel appareil." },
    "markdown-to-pdf": { title: "Markdown en PDF", description: "Convertissez vos fichiers Markdown en beaux documents PDF avec une mise en forme soignée." },
    "markdown-to-docx": { title: "Markdown en Word", description: "Convertissez du Markdown en un vrai document Word. Le formatage est préservé, les titres et listes restent intacts." },
    "html-to-pdf": { title: "HTML en PDF", description: "Transformez n'importe quelle page HTML ou extrait de code en PDF téléchargeable en quelques secondes." },
    "txt-to-pdf": { title: "Texte en PDF", description: "Convertissez du texte brut en un document PDF propre avec de vraies marges. Idéal pour partager des notes." },
    "txt-to-docx": { title: "Texte en Word", description: "Convertissez vos fichiers texte en documents Word que vous pouvez ouvrir, modifier et formater." },
    "image-converter": { title: "Convertisseur d'Image", description: "Convertissez n'importe quelle image en PNG, JPEG, WebP, AVIF et plus. Traitement par lot jusqu'à 20 fichiers, tout dans votre navigateur." },
    "heic-to-jpg": { title: "HEIC en JPG", description: "Ouvrez les photos HEIC de votre iPhone sur n'importe quel appareil en les convertissant en JPEG standard." },
    "image-compress": { title: "Compresser l'Image", description: "Compressez vos images sans sacrifier la qualité. Prêtes pour le web en quelques secondes, sans perte visible." },
    "image-resize": { title: "Redimensionner l'Image", description: "Redimensionnez les images aux dimensions exactes ou en pourcentage. Verrouillez le ratio pour éviter la déformation." },
    "image-crop": { title: "Rogner l'Image", description: "Rognez vos images avec des poignées et des ratios prédéfinis comme 1:1 ou 16:9. Cadrage précis à chaque fois." },
    "image-to-pdf": { title: "Image en PDF", description: "Combinez plusieurs images en un seul PDF. Idéal pour regrouper des photos ou des scans en une pièce jointe." },
    "pdf-to-image": { title: "PDF en Image", description: "Exportez les pages PDF en images PNG ou JPEG de haute qualité en quelques clics à peine." },
    "background-remover": { title: "Suppression du Fond", description: "Supprimez l'arrière-plan de vos images grâce à un modèle IA côté serveur. Importez votre image et obtenez un PNG transparent en quelques secondes." },
    "metadata-cleaner": { title: "Nettoyeur de Métadonnées", description: "Supprimez les métadonnées EXIF cachées de vos fichiers: localisation GPS, modèle d'appareil, auteur et date de création." },
    "ai-text-scrubber": { title: "Nettoyeur de Texte IA", description: "Supprimez les caractères invisibles et les motifs que les détecteurs d'IA repèrent. Résultat propre et naturel." },
    "password-generator": { title: "Générateur de Mot de Passe", description: "Générez des mots de passe sécurisés via le générateur aléatoire cryptographique de votre navigateur. L'entropie s'affiche en temps réel." },
    "percentage-calc": { title: "Calculateur de Pourcentage", description: "Calcule les trois types de pourcentage qui posent toujours problème: X% de Y, quelle proportion, et la variation entre deux valeurs." },
    "unit-converter": { title: "Convertisseur d'Unités", description: "Convertissez entre des centaines d'unités dans 13 catégories: longueur, poids, température, vitesse, données et plus." },
    "currency-converter": { title: "Convertisseur de Devises", description: "Convertissez entre les devises du monde entier avec des taux en direct mis à jour toutes les heures." },
    "qr-code-generator": { title: "Générateur de QR Code", description: "Générez des QR codes pour URLs, textes, Wi-Fi ou cartes de contact en un clic." },
    "tip-calculator": { title: "Calculateur de Pourboire", description: "Calculez le pourboire et répartissez l'addition entre plusieurs personnes. Entrez le montant, choisissez le pourcentage, indiquez le nombre de personnes." },
    "document-converter": { title: "Convertisseur de Documents", description: "Convertissez PDF, DOCX et TXT directement dans votre navigateur. Tout le traitement reste sur votre machine." },
    "pdf-to-excel": { title: "PDF en Excel", description: "Extrayez les tableaux de vos PDF et transformez-les en véritables feuilles de calcul Excel." },
    "reorder-pdf": { title: "Réorganiser les Pages PDF", description: "Réorganisez et supprimez des pages PDF par glisser-déposer, puis téléchargez le résultat." },
    "ocr": { title: "OCR: Image en Texte", description: "Transformez vos images scannées en vrai texte sélectionnable via l'IA locale. Vos fichiers ne quittent jamais votre appareil." },
    "word-to-pdf": { title: "Word en PDF", description: "Convertissez vos documents Word en PDF avec une mise en forme parfaitement préservée." },
    "word-to-markdown": { title: "Word en Markdown", description: "Transformez vos documents Word en Markdown propre. Un vrai gain de temps pour développeurs et rédacteurs." },
    "html-to-markdown": { title: "HTML en Markdown", description: "Convertissez n'importe quel HTML en Markdown clair et lisible, sans la soupe de balises." },
    "excel-to-pdf": { title: "Excel en PDF", description: "Convertissez vos feuilles de calcul en PDF en conservant chaque tableau, graphique et mise en page." },
    "excel-to-csv": { title: "Excel en CSV", description: "Convertissez vos feuilles Excel au format CSV universel, compatible avec tous les outils et bases de données." },
    "csv-to-excel": { title: "CSV en Excel", description: "Transformez vos données CSV en un vrai fichier Excel avec colonnes et mise en forme." },
    "csv-to-json": { title: "CSV ↔ JSON", description: "Passez du CSV au JSON et vice-versa sans perdre une seule donnée." },
    "csv-viewer": { title: "Visionneuse CSV", description: "Affichez et triez vos fichiers CSV dans un tableau clair, sans rien télécharger nulle part." },
    "pptx-to-pdf": { title: "PowerPoint en PDF", description: "Convertissez vos diapositives PowerPoint en documents PDF que tout le monde peut ouvrir." },
    "pptx-to-images": { title: "PowerPoint en Images", description: "Exportez chaque diapositive en image PNG et téléchargez le tout dans un fichier ZIP." },
    "pdf-to-pptx": { title: "PDF en PowerPoint", description: "Transformez des pages PDF en diapositives PowerPoint modifiables. Réutilisez du contenu existant sans repartir de zéro." },
    "heic-to-png": { title: "HEIC en PNG", description: "Convertissez vos photos HEIC en PNG pour une compatibilité maximale partout." },
    "heic-to-webp": { title: "HEIC en WebP", description: "Convertissez vos photos HEIC en WebP légères. Idéal pour le web moderne." },
    "heic-to-pdf": { title: "HEIC en PDF", description: "Convertissez une ou plusieurs photos HEIC en un seul document PDF." },
    "flip-rotate-image": { title: "Retourner & Pivoter", description: "Retournez horizontalement, verticalement ou pivotez à n'importe quel angle." },
    "watermark-image": { title: "Ajouter un Filigrane", description: "Ajoutez des filigranes textes personnalisés pour protéger vos photos ou les marquer à votre nom." },
    "favicon-generator": { title: "Générateur de Favicon", description: "Générez des favicons dans toutes les tailles nécessaires, puis téléchargez le tout en ZIP." },
    "png-to-webp": { title: "PNG en WebP", description: "Convertissez vos PNG en WebP pour des fichiers plus légers à qualité égale." },
    "jpg-to-webp": { title: "JPG en WebP", description: "Convertissez vos JPEG en WebP pour un chargement plus rapide sans perte de qualité." },
    "gif-to-webp": { title: "GIF en WebP", description: "Convertissez vos GIF en WebP pour une taille réduite et une compatibilité avec les navigateurs modernes." },
    "bmp-to-webp": { title: "BMP en WebP", description: "Convertissez vos fichiers BMP en WebP pour un usage pratique sur le web." },
    "tiff-to-webp": { title: "TIFF en WebP", description: "Convertissez vos TIFF en WebP. Idéal pour les photographes qui passent au web." },
    "webp-to-png": { title: "WebP en PNG", description: "Convertissez vos WebP en PNG pour un format que tout le monde peut ouvrir." },
    "webp-to-jpg": { title: "WebP en JPG", description: "Convertissez vos images WebP en JPEG pour une compatibilité maximale avec tous les appareils." },
    "webp-to-pdf": { title: "WebP en PDF", description: "Convertissez vos images WebP en documents PDF." },
    "webp-to-avif": { title: "WebP en AVIF", description: "Convertissez vos WebP au format AVIF nouvelle génération pour une compression encore meilleure." },
    "jpg-to-avif": { title: "JPG en AVIF", description: "Convertissez vos JPEG en AVIF pour une qualité supérieure avec des fichiers plus légers." },
    "png-to-avif": { title: "PNG en AVIF", description: "Convertissez vos PNG en AVIF, le format de compression d'images de nouvelle génération." },
    "avif-to-jpg": { title: "AVIF en JPG", description: "Convertissez vos AVIF en JPEG pour une compatibilité optimale." },
    "avif-to-png": { title: "AVIF en PNG", description: "Reconvertissez vos images AVIF au format PNG." },
    "jpg-to-png": { title: "JPG en PNG", description: "Convertissez vos JPEG en PNG pour une qualité sans perte avec support de la transparence." },
    "png-to-jpg": { title: "PNG en JPG", description: "Convertissez vos PNG en JPEG pour des fichiers plus légers à partager par email." },
    "png-to-svg": { title: "PNG en SVG", description: "Intégrez votre image PNG dans un conteneur SVG. Utile quand une plateforme exige du SVG." },
    "svg-to-png": { title: "SVG en PNG", description: "Rastérisez vos graphiques SVG en images PNG nettes à la taille en pixels de votre choix." },
    "gif-to-png": { title: "GIF en PNG", description: "Extrayez la première image d'un GIF en une image PNG nette." },
    "bmp-to-jpg": { title: "BMP en JPG", description: "Convertissez vos vieux fichiers BMP en JPEG pour récupérer de l'espace et faciliter le partage." },
    "tiff-to-jpg": { title: "TIFF en JPG", description: "Convertissez vos TIFF en JPEG. Idéal pour partager des photos haute résolution en ligne ou par email." },
    "tiff-to-png": { title: "TIFF en PNG", description: "Convertissez vos images TIFF en PNG pour une meilleure compatibilité web." },
    "jpg-to-pdf": { title: "JPG en PDF", description: "Convertissez vos images JPEG en PDF. Combinez plusieurs photos en un seul document." },
    "png-to-pdf": { title: "PNG en PDF", description: "Convertissez vos images PNG en PDF avec une qualité parfaite." },
    "checksum": { title: "Somme de Contrôle", description: "Générez et vérifiez les sommes de contrôle SHA-1, SHA-256 ou SHA-512 de vos fichiers. Confirmez qu'un téléchargement n'a pas été modifié." },
    "json-formatter": { title: "Formateur JSON", description: "Formatez, validez et minifiez du JSON dans votre navigateur. Instantanément, sans serveur." },
    "html-formatter": { title: "Formateur HTML", description: "Formatez ou minifiez du code HTML en un clic. Garde votre balisage lisible et bien structuré." },
    "base64": { title: "Base64 Encoder / Décoder", description: "Encodez ou décodez du texte et des fichiers en Base64 en temps réel. Pratique pour les data URIs et les payloads d'API." },
    "url-encoder": { title: "URL Encoder / Décoder", description: "Encodez et décodez les composants d'URL à la volée. Fini les chaînes de requête mal formées." },
    "word-counter": { title: "Compteur de Mots", description: "Comptez les mots, caractères, phrases et estimez le temps de lecture. Idéal pour vérifier les limites de mots." },
    "lorem-ipsum": { title: "Générateur Lorem Ipsum", description: "Générez du texte de remplissage pour vos maquettes et prototypes dans la quantité désirée." },
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
    offlineSnapshot: (date) => `Données hors ligne, taux au ${date}`,
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
    note: "Remarque : La suppression d'arrière-plan est traitée côté serveur par IA. Votre image est envoyée au serveur, traitée et renvoyée. Elle n'est pas stockée.",
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
    compressingLabel: "Compression du PDF, rendu des pages...",
    statsOriginal: "Original",
    statsCompressed: "Compressé",
    statsReduction: "Réduction",
    downloadBtn: (filename) => `Télécharger ${filename}`,
    note: "Remarque : Les résultats de compression dépendent du contenu PDF original. Les PDF déjà optimisés ou contenant principalement du contenu vectoriel peuvent voir une réduction minimale. Cet outil restitue les pages en images JPEG, donc le texte ne sera pas sélectionnable dans le résultat.",
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
    smallest: "1 (plus petit)",
    original100: "100 (original)",
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
    dropHint: "Déposez des images ici ou cliquez pour sélectionner. 20 fichiers max, 20 Mo chacun.",
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
    modelNote: "La première utilisation télécharge ~15 Mo de modèle OCR. Ce fichier est mis en cache dans le navigateur après le premier téléchargement.",
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
    pdfReady: (kb) => `PDF prêt, ${kb} Ko`,
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
