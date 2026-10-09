import {
  // PDF Tools
  FileText, AlignLeft, Code2, BookOpen, Minimize2, Layers, Scissors, RotateCw,
  Unlock, Lock, Hash, Stamp, FileImage, Table2, GripVertical, ScanText,
  // Word & Docs
  FileDown, Type, FileCode, BookMarked, Pilcrow, FileSymlink, FileOutput, FileInput,
  Globe, ScrollText, FilePlus,
  // Excel & Spreadsheets
  FileSpreadsheet, AlignJustify, LayoutGrid, ArrowLeftRight, Eye,
  // PowerPoint
  Presentation, Images, Monitor,
  // Image Tools
  Palette, Smartphone, Camera, Phone, ImageDown, Maximize2, Crop,
  Image, Wand2, RotateCcw, Grid2x2,
  // Image Format Converters
  ImagePlus, Aperture, Film, PenTool, Scan, CircleDot, Download, FilePlus2,
  Zap, TrendingDown, ArrowDownToLine, ArrowUpRight, Badge, Paintbrush, Ratio,
  Triangle, Hexagon, Frame, Grid3x3, SlidersHorizontal, Sliders, FileCheck, FileCheck2,
  // Privacy
  ShieldOff, Eraser, ShieldCheck,
  // Text & Code
  Braces, Terminal, Binary, Link2, BookType, TextQuote,
  // Calculators
  KeyRound, Ruler, DollarSign, QrCode,
} from "lucide-react";

export const tools = [
  // PDF Tools
  {slug: 'pdf-to-word', title: 'PDF to Word', description: 'Converts your PDF into an editable DOCX file. Good for filling out forms or editing documents someone sent you without the source file.', category: 'pdf', icon: FileText, formats: ['PDF','DOCX']},
  {slug: 'pdf-to-text', title: 'PDF to Text', description: 'Pulls all the text out of a PDF into a plain .txt file. Strips all formatting — useful when you just need the words without the layout.', category: 'pdf', icon: AlignLeft, formats: ['PDF','TXT']},
  {slug: 'pdf-to-html', title: 'PDF to HTML', description: 'Converts PDF content into HTML markup you can paste into a webpage or CMS. Results vary depending on how the original PDF was structured.', category: 'pdf', icon: Code2, formats: ['PDF','HTML']},
  {slug: 'pdf-to-epub', title: 'PDF to EPUB', description: 'Turns a PDF into an EPUB file readable on Kindle, Apple Books, or any e-reader. Works best on text-heavy documents without complex layouts.', category: 'pdf', icon: BookOpen, formats: ['PDF','EPUB']},
  {slug: 'pdf-compress', title: 'Compress PDF', description: 'Reduces PDF file size without visibly degrading the content. Good for trimming files that are too large to email or upload.', category: 'pdf', icon: Minimize2, formats: ['PDF']},
  {slug: 'pdf-merge', title: 'Merge PDFs', description: 'Combines multiple PDF files into one document. Drag to reorder them before merging if the sequence matters.', category: 'pdf', icon: Layers, formats: ['PDF']},
  {slug: 'pdf-split', title: 'Split PDF', description: 'Breaks a PDF into individual pages or custom page ranges. Useful when you only need one section from a long document.', category: 'pdf', icon: Scissors, formats: ['PDF']},
  {slug: 'pdf-rotate', title: 'Rotate PDF', description: 'Rotates PDF pages 90, 180, or 270 degrees. Fixes scanned documents that came out sideways.', category: 'pdf', icon: RotateCw, formats: ['PDF']},
  {slug: 'pdf-unlock', title: 'Unlock PDF', description: 'Removes owner-level restrictions from a PDF — things like copy-paste blocks or print bans. Does not bypass passwords required to open the file.', category: 'pdf', icon: Unlock, formats: ['PDF']},
  {slug: 'pdf-protect', title: 'Protect PDF', description: 'Locks a PDF with a password of your choosing. Anyone who tries to open it will need to enter the password you set.', category: 'pdf', icon: Lock, formats: ['PDF']},
  {slug: 'pdf-page-numbers', title: 'Add Page Numbers', description: 'Adds page numbers to every page of a PDF. You can set the starting number, position, and font size.', category: 'pdf', icon: Hash, formats: ['PDF']},
  {slug: 'pdf-watermark', title: 'Watermark PDF', description: 'Stamps a text watermark across every page of a PDF. You control the text, size, opacity, and rotation angle.', category: 'pdf', icon: Stamp, formats: ['PDF']},
  {slug: 'pdf-to-image', title: 'PDF to Image', description: 'Exports each page of a PDF as a PNG or JPEG image. Useful for thumbnails, previews, or sharing individual pages without sending the whole file.', category: 'pdf', icon: FileImage, formats: ['PDF','PNG']},
  {slug: 'pdf-to-excel', title: 'PDF to Excel', description: 'Tries to pull tables out of a PDF and put them into an Excel spreadsheet. Works well on structured data; messier on scanned or oddly formatted PDFs.', category: 'pdf', icon: Table2, formats: ['PDF','XLSX']},
  {slug: 'reorder-pdf', title: 'Reorder PDF Pages', description: 'Lets you drag PDF pages into a new order and remove any you do not want. Download the rearranged result when done.', category: 'pdf', icon: GripVertical, formats: ['PDF']},
  {slug: 'ocr', title: 'OCR — Image to Text', description: 'Reads text out of images and scanned documents using Tesseract.js. The recognition model runs entirely in your browser — no server involved.', category: 'pdf', icon: ScanText, formats: ['IMG','TXT']},

  // Word & Docs
  {slug: 'word-to-pdf', title: 'Word to PDF', description: 'Converts DOCX files to PDF in your browser. Useful for sharing documents that should look the same regardless of what software the recipient uses.', category: 'word', icon: FileDown, formats: ['DOCX','PDF']},
  {slug: 'word-to-text', title: 'Word to Text', description: 'Pulls the plain text out of a DOCX file. Strips all formatting, styles, and layout — just the words.', category: 'word', icon: Type, formats: ['DOCX','TXT']},
  {slug: 'word-to-html', title: 'Word to HTML', description: 'Converts a DOCX file to HTML markup. Helpful when you are putting document content into a webpage or blog post.', category: 'word', icon: FileCode, formats: ['DOCX','HTML']},
  {slug: 'word-to-epub', title: 'Word to EPUB', description: 'Turns a DOCX document into an EPUB e-book. Best results with straightforward documents that use headings and paragraphs.', category: 'word', icon: BookMarked, formats: ['DOCX','EPUB']},
  {slug: 'word-to-markdown', title: 'Word to Markdown', description: 'Converts DOCX files to Markdown. Translates headings, bold, italic, lists, and tables where the structure allows.', category: 'word', icon: Pilcrow, formats: ['DOCX','MD']},
  {slug: 'html-to-markdown', title: 'HTML to Markdown', description: 'Converts HTML into clean Markdown text. Strips tags and turns the structure into readable Markdown syntax.', category: 'word', icon: FileSymlink, formats: ['HTML','MD']},
  {slug: 'markdown-to-pdf', title: 'Markdown to PDF', description: 'Renders a Markdown file as a PDF document. Supports headings, lists, tables, and code blocks.', category: 'word', icon: FileOutput, formats: ['MD','PDF']},
  {slug: 'markdown-to-docx', title: 'Markdown to Word', description: 'Converts a Markdown file to a Word document. Useful when you write in Markdown but need to send a .docx file.', category: 'word', icon: FileInput, formats: ['MD','DOCX']},
  {slug: 'html-to-pdf', title: 'HTML to PDF', description: 'Converts an HTML page or snippet to a PDF. Paste your HTML, see the preview, and download the result.', category: 'word', icon: Globe, formats: ['HTML','PDF']},
  {slug: 'txt-to-pdf', title: 'Text to PDF', description: 'Converts plain text to a properly formatted PDF. Wraps long lines and sets sensible margins automatically.', category: 'word', icon: ScrollText, formats: ['TXT','PDF']},
  {slug: 'txt-to-docx', title: 'Text to Word', description: 'Turns a plain .txt file into a Word document. Useful when someone needs a .docx but the content is already in a text file.', category: 'word', icon: FilePlus, formats: ['TXT','DOCX']},

  // Excel & Spreadsheets
  {slug: 'excel-to-pdf', title: 'Excel to PDF', description: 'Converts Excel spreadsheets to PDF entirely in your browser. Each sheet becomes a page in the output file.', category: 'excel', icon: FileSpreadsheet, formats: ['XLSX','PDF']},
  {slug: 'excel-to-csv', title: 'Excel to CSV', description: 'Exports Excel sheets as comma-separated CSV files. One sheet becomes one CSV file.', category: 'excel', icon: AlignJustify, formats: ['XLSX','CSV']},
  {slug: 'csv-to-excel', title: 'CSV to Excel', description: 'Converts a CSV file into an Excel .xlsx workbook. Column types are detected automatically where possible.', category: 'excel', icon: LayoutGrid, formats: ['CSV','XLSX']},
  {slug: 'csv-to-json', title: 'CSV ↔ JSON', description: 'Switches between CSV and JSON formats. Paste either one and get the other — headers become keys.', category: 'excel', icon: ArrowLeftRight, formats: ['CSV','JSON']},
  {slug: 'csv-viewer', title: 'CSV Viewer', description: 'Loads a CSV and displays it as a sortable table. Nothing gets uploaded — the file stays in your browser the whole time.', category: 'excel', icon: Eye, formats: ['CSV']},

  // PowerPoint
  {slug: 'pptx-to-pdf', title: 'PowerPoint to PDF', description: 'Converts PowerPoint files to PDF in your browser. Each slide becomes a page in the resulting document.', category: 'pptx', icon: Presentation, formats: ['PPTX','PDF']},
  {slug: 'pptx-to-images', title: 'PowerPoint to Images', description: 'Exports each slide in a PowerPoint as a PNG image. Downloads as a ZIP file with all slides included.', category: 'pptx', icon: Images, formats: ['PPTX','PNG']},
  {slug: 'pdf-to-pptx', title: 'PDF to PowerPoint', description: 'Converts each page of a PDF into a PowerPoint slide. Each page is placed as an image on its own slide.', category: 'pptx', icon: Monitor, formats: ['PDF','PPTX']},

  // Image Tools
  {slug: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Converts iPhone HEIC photos to JPEG. HEIC is common on Apple devices but most other apps and websites still do not open it.', category: 'image', icon: Smartphone, formats: ['HEIC','JPG']},
  {slug: 'heic-to-png', title: 'HEIC to PNG', description: 'Converts HEIC photos to PNG format. PNG gives lossless quality and works in basically every image viewer.', category: 'image', icon: Camera, formats: ['HEIC','PNG']},
  {slug: 'heic-to-webp', title: 'HEIC to WebP', description: 'Converts HEIC photos to WebP. WebP gives smaller file sizes than JPEG with similar visual quality.', category: 'image', icon: Phone, formats: ['HEIC','WEBP']},
  {slug: 'heic-to-pdf', title: 'HEIC to PDF', description: 'Packages HEIC photos into a PDF document. Useful for sharing iPhone photos with people who need a PDF specifically.', category: 'image', icon: ImageDown, formats: ['HEIC','PDF']},
  {slug: 'image-compress', title: 'Compress Image', description: 'Reduces image file size using a quality slider. Shows you the before and after file size as you adjust.', category: 'image', icon: Minimize2, formats: ['JPG','PNG','WEBP']},
  {slug: 'image-resize', title: 'Resize Image', description: 'Resizes images by pixel dimensions or by percentage. You can lock the aspect ratio or stretch it freely.', category: 'image', icon: Maximize2, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-crop', title: 'Crop Image', description: 'Crops images using drag handles. Includes common aspect ratio presets like 1:1, 16:9, and 4:3.', category: 'image', icon: Crop, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-to-pdf', title: 'Image to PDF', description: 'Combines one or more images into a single PDF. Add multiple images and reorder them before generating.', category: 'image', icon: Image, formats: ['IMG','PDF']},
  {slug: 'background-remover', title: 'Background Remover', description: 'Removes image backgrounds using an AI model that runs on your device. The model downloads once and processes everything locally — nothing is sent to a server.', category: 'image', icon: Wand2, formats: ['PNG','JPG']},
  {slug: 'flip-rotate-image', title: 'Flip & Rotate Image', description: 'Flips images horizontally or vertically, or rotates them by any angle. Useful for fixing phone photos that came out sideways.', category: 'image', icon: RotateCw, formats: ['PNG','JPG','WEBP']},
  {slug: 'watermark-image', title: 'Add Watermark', description: 'Adds a text watermark to an image. You control the position, font size, opacity, and color.', category: 'image', icon: Stamp, formats: ['PNG','JPG','WEBP']},
  {slug: 'favicon-generator', title: 'Favicon Generator', description: 'Generates a full set of favicon files from any image. Downloads as a ZIP with PNG sizes and an .ico file ready to use.', category: 'image', icon: Grid2x2, formats: ['PNG','ICO']},

  // Image Conversion (format-specific pages)
  {slug: 'png-to-webp', title: 'PNG to WebP', description: 'Converts PNG images to WebP. WebP is smaller than PNG for most images while still looking lossless at high quality settings.', category: 'image', icon: ImagePlus, formats: ['PNG','WEBP']},
  {slug: 'jpg-to-webp', title: 'JPG to WebP', description: 'Converts JPEG images to WebP. WebP usually compresses better than JPEG at the same visual quality.', category: 'image', icon: Aperture, formats: ['JPG','WEBP']},
  {slug: 'gif-to-webp', title: 'GIF to WebP', description: 'Converts GIF images to WebP. WebP supports animation and is typically smaller than an equivalent GIF.', category: 'image', icon: Film, formats: ['GIF','WEBP']},
  {slug: 'bmp-to-webp', title: 'BMP to WebP', description: 'Converts BMP images to WebP. BMP files are large and uncompressed — WebP is much more practical for sharing.', category: 'image', icon: PenTool, formats: ['BMP','WEBP']},
  {slug: 'tiff-to-webp', title: 'TIFF to WebP', description: 'Converts TIFF images to WebP. Good for shrinking scanned documents or images from photography workflows.', category: 'image', icon: Scan, formats: ['TIFF','WEBP']},
  {slug: 'webp-to-png', title: 'WebP to PNG', description: 'Converts WebP images to PNG. Useful when you need a format that older tools or browsers still recognize.', category: 'image', icon: CircleDot, formats: ['WEBP','PNG']},
  {slug: 'webp-to-jpg', title: 'WebP to JPG', description: 'Converts WebP to JPEG. JPEG opens in any photo app or browser without exception.', category: 'image', icon: Download, formats: ['WEBP','JPG']},
  {slug: 'webp-to-pdf', title: 'WebP to PDF', description: 'Embeds a WebP image in a PDF document. Useful for sharing images as a fixed-layout file.', category: 'image', icon: FilePlus2, formats: ['WEBP','PDF']},
  {slug: 'webp-to-avif', title: 'WebP to AVIF', description: 'Converts WebP to AVIF. AVIF can compress further than WebP with similar visual quality.', category: 'image', icon: Zap, formats: ['WEBP','AVIF']},
  {slug: 'jpg-to-avif', title: 'JPG to AVIF', description: 'Converts JPEG to AVIF. AVIF typically produces smaller files than JPEG at the same visual quality.', category: 'image', icon: TrendingDown, formats: ['JPG','AVIF']},
  {slug: 'png-to-avif', title: 'PNG to AVIF', description: 'Converts PNG to AVIF. AVIF handles both lossy and lossless compression — worth trying on large images.', category: 'image', icon: ArrowDownToLine, formats: ['PNG','AVIF']},
  {slug: 'avif-to-jpg', title: 'AVIF to JPG', description: 'Converts AVIF images to JPEG. JPEG works in any browser or photo app, unlike AVIF.', category: 'image', icon: ArrowUpRight, formats: ['AVIF','JPG']},
  {slug: 'avif-to-png', title: 'AVIF to PNG', description: 'Converts AVIF to PNG. PNG is lossless and opens in every modern image viewer.', category: 'image', icon: Badge, formats: ['AVIF','PNG']},
  {slug: 'jpg-to-png', title: 'JPG to PNG', description: 'Converts JPEG to PNG. PNG is lossless and supports transparency — JPEG handles neither.', category: 'image', icon: Paintbrush, formats: ['JPG','PNG']},
  {slug: 'png-to-jpg', title: 'PNG to JPG', description: 'Converts PNG to JPEG. JPEG produces smaller files for photos, though it discards some detail in the process.', category: 'image', icon: Ratio, formats: ['PNG','JPG']},
  {slug: 'png-to-svg', title: 'PNG to SVG', description: 'Wraps a PNG image inside an SVG container. The image stays raster — this is for embedding in SVG workflows, not for vectorizing.', category: 'image', icon: Triangle, formats: ['PNG','SVG']},
  {slug: 'svg-to-png', title: 'SVG to PNG', description: 'Rasterizes an SVG to PNG. Set the output dimensions and the vector is drawn at that pixel resolution.', category: 'image', icon: Hexagon, formats: ['SVG','PNG']},
  {slug: 'gif-to-png', title: 'GIF to PNG', description: 'Extracts the first frame of a GIF as a PNG image. Useful when you need a still from an animated file.', category: 'image', icon: Frame, formats: ['GIF','PNG']},
  {slug: 'bmp-to-jpg', title: 'BMP to JPG', description: 'Converts BMP to JPEG. BMP files are uncompressed and large — JPEG handles photos at a fraction of the size.', category: 'image', icon: Grid3x3, formats: ['BMP','JPG']},
  {slug: 'tiff-to-jpg', title: 'TIFF to JPG', description: 'Converts TIFF to JPEG. TIFF is common in photography and scanning, but JPEG is more practical for sharing.', category: 'image', icon: SlidersHorizontal, formats: ['TIFF','JPG']},
  {slug: 'tiff-to-png', title: 'TIFF to PNG', description: 'Converts TIFF to PNG. PNG keeps lossless quality and opens in any modern image viewer.', category: 'image', icon: Sliders, formats: ['TIFF','PNG']},
  {slug: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Packages a JPEG image into a PDF file. Common for sharing photos through systems that only accept PDFs.', category: 'image', icon: FileCheck, formats: ['JPG','PDF']},
  {slug: 'png-to-pdf', title: 'PNG to PDF', description: 'Packages a PNG image into a PDF file. Common for exporting screenshots or diagrams in a fixed-layout format.', category: 'image', icon: FileCheck2, formats: ['PNG','PDF']},

  // Privacy Tools
  {slug: 'metadata-cleaner', title: 'Metadata Cleaner', description: 'Strips EXIF, XMP, and document metadata from photos and PDFs before you share them. Removes GPS coordinates, device details, or author names embedded in files.', category: 'privacy', icon: ShieldOff, formats: ['PDF','JPG','PNG']},
  {slug: 'ai-text-scrubber', title: 'AI Text Scrubber', description: 'Removes invisible Unicode characters and patterns that some AI detection tools flag. Paste your text, clean it, and copy the result.', category: 'privacy', icon: Eraser, formats: ['TXT']},
  {slug: 'checksum', title: 'File Checksum', description: 'Calculates SHA-256, SHA-1, SHA-384, or SHA-512 checksums for any file. Compare the result against a published hash to confirm a download was not corrupted.', category: 'privacy', icon: ShieldCheck, formats: []},

  // Text & Code
  {slug: 'json-formatter', title: 'JSON Formatter', description: 'Formats and validates JSON in your browser. Also minifies it — paste pretty-printed JSON and get a compact single-line version, or the reverse.', category: 'textCode', icon: Braces, formats: ['JSON']},
  {slug: 'html-formatter', title: 'HTML Formatter', description: 'Formats messy HTML into readable, indented code. Also minifies it when you need to strip whitespace before shipping.', category: 'textCode', icon: Terminal, formats: ['HTML']},
  {slug: 'base64', title: 'Base64 Encoder / Decoder', description: 'Encodes text or files to Base64, or decodes Base64 back to readable text. Common in email attachments, data URIs, and API authentication headers.', category: 'textCode', icon: Binary, formats: []},
  {slug: 'url-encoder', title: 'URL Encoder / Decoder', description: 'Encodes and decodes URL components in real time. Useful for dealing with query strings that contain special characters.', category: 'textCode', icon: Link2, formats: []},
  {slug: 'word-counter', title: 'Word & Character Counter', description: 'Counts words, characters, sentences, and paragraphs as you type. Also gives a reading time estimate based on average reading pace.', category: 'textCode', icon: BookType, formats: []},
  {slug: 'lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generates placeholder text for designs or prototypes. Set how many paragraphs, sentences, or words you need.', category: 'textCode', icon: TextQuote, formats: []},

  // Calculators & Utilities
  {slug: 'password-generator', title: 'Password Generator', description: 'Generates cryptographically random passwords using your browser\'s built-in secure randomness. Shows entropy in bits so you can see how strong each password actually is.', category: 'calculators', icon: KeyRound, formats: []},
  {slug: 'unit-converter', title: 'Unit Converter', description: 'Converts between 200+ units across 13 categories — length, weight, temperature, area, volume, speed, and more. Results update as you type.', category: 'calculators', icon: Ruler, formats: []},
  {slug: 'currency-converter', title: 'Currency Converter', description: 'Live exchange rates for 170 currencies, refreshed hourly. Falls back to cached rates if you are offline or the API is slow.', category: 'calculators', icon: DollarSign, formats: []},
  {slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Creates QR codes from URLs, plain text, Wi-Fi credentials, or contact cards. Download as PNG or SVG.', category: 'calculators', icon: QrCode, formats: []},
  // New Image Tools
  {slug: 'image-upscale', title: 'Image Upscaler', description: 'Enlarges images by 2x or 4x with sharp detail preservation and unsharp masking.', category: 'image', icon: Maximize2, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-filters', title: 'Image Filters & Effects', description: 'Applies grayscale, sepia, invert, blur, brightness, contrast, and hue effects in real time.', category: 'image', icon: Sliders, formats: ['PNG','JPG','WEBP']},

  // New PDF Tools
  {slug: 'pdf-to-pdfa', title: 'PDF to PDF/A', description: 'Converts PDF documents into ISO-standardized PDF/A-2b format for guaranteed long-term preservation.', category: 'pdf', icon: FileCheck, formats: ['PDF']},
  {slug: 'pdf-repair', title: 'Repair PDF', description: 'Recovers and repairs corrupted, broken, or unreadable PDF documents.', category: 'pdf', icon: Minimize2, formats: ['PDF']},
  {slug: 'pdf-ocr', title: 'PDF OCR', description: 'Extracts editable text from scanned PDF documents and document images.', category: 'pdf', icon: ScanText, formats: ['PDF','TXT']},
  {slug: 'pdf-metadata', title: 'Edit PDF Metadata', description: 'Views and updates PDF Title, Author, Subject, Keywords, Creator, and Producer properties.', category: 'pdf', icon: FileText, formats: ['PDF']},
  {slug: 'pdf-to-markdown', title: 'PDF to Markdown', description: 'Converts PDF documents into clean, structured Markdown syntax.', category: 'pdf', icon: Code2, formats: ['PDF','MD']},

  // New Document Tools
  {slug: 'odt-to-pdf', title: 'ODT to PDF', description: 'Converts OpenDocument ODT files to PDF with full layout fidelity.', category: 'word', icon: FileDown, formats: ['ODT','PDF']},
  {slug: 'rtf-to-pdf', title: 'RTF to PDF', description: 'Converts Rich Text Format RTF documents to PDF.', category: 'word', icon: FileDown, formats: ['RTF','PDF']},

  // New Data & Code Tools
  {slug: 'json-diff', title: 'JSON Diff', description: 'Compares two JSON payloads side-by-side to highlight additions, deletions, and modifications.', category: 'textCode', icon: Braces, formats: ['JSON']},
  {slug: 'csv-editor', title: 'CSV Editor', description: 'Online interactive spreadsheet grid to edit, manage columns, and export CSV/Excel files.', category: 'excel', icon: Table2, formats: ['CSV','XLSX']},
  {slug: 'css-formatter', title: 'CSS Formatter & Minifier', description: 'Minifies stylesheets for fast loading or beautifies compressed CSS into readable blocks.', category: 'textCode', icon: Terminal, formats: ['CSS']},
  {slug: 'js-formatter', title: 'JS / TS Beautifier', description: 'Cleans and formats JavaScript and TypeScript code with standard indentation.', category: 'textCode', icon: Terminal, formats: ['JS','TS']},
  {slug: 'markdown-preview', title: 'Markdown Live Editor', description: 'Live split-screen Markdown editor with real-time HTML preview and export.', category: 'textCode', icon: BookType, formats: ['MD','HTML']},
  {slug: 'diff-checker', title: 'Text Diff Checker', description: 'Compares two text snippets to highlight additions, deletions, and modifications.', category: 'textCode', icon: TextQuote, formats: ['TXT']},
  {slug: 'regex-tester', title: 'Regex Tester', description: 'Tests regular expressions with real-time matching, groups extraction, and string replacement.', category: 'textCode', icon: Terminal, formats: []},
  {slug: 'jwt-decoder', title: 'JWT Token Decoder', description: 'Decodes JSON Web Tokens (header, payload, claims) and checks expiration securely.', category: 'textCode', icon: Binary, formats: []},
  {slug: 'barcode-generator', title: 'Barcode Generator', description: 'Generates CODE128, EAN-13, UPC-A, and CODE39 barcodes as vector SVG or PNG.', category: 'textCode', icon: QrCode, formats: ['SVG','PNG']},
  {slug: 'hash-generator', title: 'Hash Generator', description: 'Computes SHA-256, SHA-512, SHA-384, and SHA-1 hashes simultaneously using SubtleCrypto.', category: 'textCode', icon: Hash, formats: []},
  {slug: 'uuid-generator', title: 'UUID Generator', description: 'Generates cryptographic RFC 4122 v4 UUIDs in bulk with custom options.', category: 'textCode', icon: Hash, formats: []},
  {slug: 'color-converter', title: 'Color Converter', description: 'Converts colors between HEX, RGB, HSL, and CMYK color spaces with live preview.', category: 'textCode', icon: Palette, formats: []},
  {slug: 'color-palette', title: 'Color Palette Generator', description: 'Generates balanced color harmonies and exports CSS/HEX color codes.', category: 'textCode', icon: Palette, formats: []},

  // Network & Telemetry
  {slug: 'speed-test', title: 'Internet Speed Test', description: 'Measures internet download speeds and response ping latency in real time.', category: 'calculators', icon: Zap, formats: []},
];

