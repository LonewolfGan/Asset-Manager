import { 
  FileText, AlignLeft, Code2, BookOpen, Minimize2, Layers, Scissors, RotateCw, Unlock, Lock, Hash, Stamp,
  Type, FileCode, BookMarked, FileDown, FileInput, Globe, ScrollText, FilePlus,
  ImageIcon, Smartphone, ZoomOut, Maximize2, Crop, Image as ImageIcon2, FileImage, Wand2,
  ShieldOff, ScanText,
  KeyRound, Percent, ArrowLeftRight, DollarSign, QrCode, Receipt,
  Table2, FileSpreadsheet, Presentation, Braces, Binary, Link2, BookType, RotateCcw,
  Pen, Grid2x2, ShieldCheck, ArrowRightLeft, Image, Ratio,
} from "lucide-react";

export const tools = [
  // PDF Tools
  {slug: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF files to editable DOCX format', category: 'pdf', icon: FileText, formats: ['PDF','DOCX']},
  {slug: 'pdf-to-text', title: 'PDF to Text', description: 'Extract all text from a PDF file', category: 'pdf', icon: AlignLeft, formats: ['PDF','TXT']},
  {slug: 'pdf-to-html', title: 'PDF to HTML', description: 'Convert PDF content to HTML markup', category: 'pdf', icon: Code2, formats: ['PDF','HTML']},
  {slug: 'pdf-to-epub', title: 'PDF to EPUB', description: 'Convert PDF to EPUB e-book format', category: 'pdf', icon: BookOpen, formats: ['PDF','EPUB']},
  {slug: 'pdf-compress', title: 'Compress PDF', description: 'Reduce PDF file size without visible quality loss', category: 'pdf', icon: Minimize2, formats: ['PDF']},
  {slug: 'pdf-merge', title: 'Merge PDFs', description: 'Combine multiple PDF files into one', category: 'pdf', icon: Layers, formats: ['PDF']},
  {slug: 'pdf-split', title: 'Split PDF', description: 'Split a PDF into separate pages or page ranges', category: 'pdf', icon: Scissors, formats: ['PDF']},
  {slug: 'pdf-rotate', title: 'Rotate PDF', description: 'Rotate PDF pages 90, 180, or 270 degrees', category: 'pdf', icon: RotateCw, formats: ['PDF']},
  {slug: 'pdf-unlock', title: 'Unlock PDF', description: 'Remove owner password protection from a PDF', category: 'pdf', icon: Unlock, formats: ['PDF']},
  {slug: 'pdf-protect', title: 'Protect PDF', description: 'Add password protection to a PDF', category: 'pdf', icon: Lock, formats: ['PDF']},
  {slug: 'pdf-page-numbers', title: 'Add Page Numbers', description: 'Add page numbers to every page of your PDF', category: 'pdf', icon: Hash, formats: ['PDF']},
  {slug: 'pdf-watermark', title: 'Watermark PDF', description: 'Add a text watermark to every PDF page', category: 'pdf', icon: Stamp, formats: ['PDF']},
  {slug: 'pdf-to-image', title: 'PDF to Image', description: 'Export PDF pages as PNG or JPEG images', category: 'pdf', icon: FileImage, formats: ['PDF','PNG']},
  {slug: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract tables from a PDF into an Excel spreadsheet', category: 'pdf', icon: Table2, formats: ['PDF','XLSX']},
  {slug: 'reorder-pdf', title: 'Reorder PDF Pages', description: 'Drag and drop to reorder, remove, and rearrange PDF pages', category: 'pdf', icon: ArrowLeftRight, formats: ['PDF']},
  {slug: 'ocr', title: 'OCR — Image to Text', description: 'Extract text from scanned images using Tesseract.js', category: 'pdf', icon: ScanText, formats: ['IMG','TXT']},

  // Word & Docs
  {slug: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX and DOC files to PDF in your browser', category: 'word', icon: FileDown, formats: ['DOCX','PDF']},
  {slug: 'word-to-text', title: 'Word to Text', description: 'Extract plain text from DOCX files', category: 'word', icon: Type, formats: ['DOCX','TXT']},
  {slug: 'word-to-html', title: 'Word to HTML', description: 'Convert DOCX to clean HTML markup', category: 'word', icon: FileCode, formats: ['DOCX','HTML']},
  {slug: 'word-to-epub', title: 'Word to EPUB', description: 'Convert DOCX to EPUB e-book', category: 'word', icon: BookMarked, formats: ['DOCX','EPUB']},
  {slug: 'word-to-markdown', title: 'Word to Markdown', description: 'Convert DOCX files to clean Markdown', category: 'word', icon: FileText, formats: ['DOCX','MD']},
  {slug: 'html-to-markdown', title: 'HTML to Markdown', description: 'Convert HTML content to clean Markdown format', category: 'word', icon: Code2, formats: ['HTML','MD']},
  {slug: 'markdown-to-pdf', title: 'Markdown to PDF', description: 'Convert Markdown files to PDF', category: 'word', icon: FileDown, formats: ['MD','PDF']},
  {slug: 'markdown-to-docx', title: 'Markdown to Word', description: 'Convert Markdown to a Word document', category: 'word', icon: FileInput, formats: ['MD','DOCX']},
  {slug: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert an HTML page or snippet to PDF', category: 'word', icon: Globe, formats: ['HTML','PDF']},
  {slug: 'txt-to-pdf', title: 'Text to PDF', description: 'Convert plain text to a PDF document', category: 'word', icon: ScrollText, formats: ['TXT','PDF']},
  {slug: 'txt-to-docx', title: 'Text to Word', description: 'Convert plain text to a Word document', category: 'word', icon: FilePlus, formats: ['TXT','DOCX']},

  // Excel & Spreadsheets
  {slug: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF entirely in your browser', category: 'excel', icon: FileSpreadsheet, formats: ['XLSX','PDF']},
  {slug: 'excel-to-csv', title: 'Excel to CSV', description: 'Convert Excel sheets to CSV format', category: 'excel', icon: Table2, formats: ['XLSX','CSV']},
  {slug: 'csv-to-excel', title: 'CSV to Excel', description: 'Convert CSV files to Excel (.xlsx) in your browser', category: 'excel', icon: FileSpreadsheet, formats: ['CSV','XLSX']},
  {slug: 'csv-to-json', title: 'CSV ↔ JSON', description: 'Convert between CSV and JSON formats instantly', category: 'excel', icon: Braces, formats: ['CSV','JSON']},
  {slug: 'csv-viewer', title: 'CSV Viewer', description: 'View and sort CSV files as a table — no upload required', category: 'excel', icon: Table2, formats: ['CSV']},

  // PowerPoint
  {slug: 'pptx-to-pdf', title: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations to PDF in your browser', category: 'pptx', icon: Presentation, formats: ['PPTX','PDF']},
  {slug: 'pptx-to-images', title: 'PowerPoint to Images', description: 'Export each slide as a PNG image and download as ZIP', category: 'pptx', icon: FileImage, formats: ['PPTX','PNG']},
  {slug: 'pdf-to-pptx', title: 'PDF to PowerPoint', description: 'Convert each PDF page into a PowerPoint slide', category: 'pptx', icon: Presentation, formats: ['PDF','PPTX']},

  // Image Tools
  {slug: 'image-converter', title: 'Image Converter', description: 'Convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO', category: 'image', icon: ImageIcon, formats: ['PNG','JPG','WEBP','AVIF']},
  {slug: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Convert iPhone HEIC photos to JPEG — 100% in your browser', category: 'image', icon: Smartphone, formats: ['HEIC','JPG']},
  {slug: 'heic-to-png', title: 'HEIC to PNG', description: 'Convert HEIC/HEIF photos to PNG format', category: 'image', icon: Smartphone, formats: ['HEIC','PNG']},
  {slug: 'heic-to-webp', title: 'HEIC to WebP', description: 'Convert HEIC/HEIF photos to WebP format', category: 'image', icon: Smartphone, formats: ['HEIC','WEBP']},
  {slug: 'heic-to-pdf', title: 'HEIC to PDF', description: 'Convert HEIC/HEIF photos to PDF', category: 'image', icon: Smartphone, formats: ['HEIC','PDF']},
  {slug: 'image-compress', title: 'Compress Image', description: 'Reduce image file size with a quality slider', category: 'image', icon: ZoomOut, formats: ['JPG','PNG','WEBP']},
  {slug: 'image-resize', title: 'Resize Image', description: 'Resize images by pixel dimensions or percentage', category: 'image', icon: Maximize2, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-crop', title: 'Crop Image', description: 'Crop images with drag handles and aspect ratio presets', category: 'image', icon: Crop, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert one or more images to a single PDF', category: 'image', icon: ImageIcon2, formats: ['IMG','PDF']},
  {slug: 'background-remover', title: 'Background Remover', description: 'Remove image backgrounds using on-device AI', category: 'image', icon: Wand2, formats: ['PNG','JPG']},
  {slug: 'flip-rotate-image', title: 'Flip & Rotate Image', description: 'Flip horizontally, vertically, or rotate by any angle', category: 'image', icon: RotateCcw, formats: ['PNG','JPG','WEBP']},
  {slug: 'watermark-image', title: 'Add Watermark', description: 'Add text watermark to images with custom position and opacity', category: 'image', icon: Pen, formats: ['PNG','JPG','WEBP']},
  {slug: 'favicon-generator', title: 'Favicon Generator', description: 'Generate favicons in all sizes from any image, download as ZIP', category: 'image', icon: Grid2x2, formats: ['PNG','ICO']},

  // Image Conversion (format-specific pages)
  {slug: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to WebP format', category: 'image', icon: ArrowRightLeft, formats: ['PNG','WEBP']},
  {slug: 'jpg-to-webp', title: 'JPG to WebP', description: 'Convert JPEG images to WebP format', category: 'image', icon: ArrowRightLeft, formats: ['JPG','WEBP']},
  {slug: 'gif-to-webp', title: 'GIF to WebP', description: 'Convert GIF images to WebP format', category: 'image', icon: ArrowRightLeft, formats: ['GIF','WEBP']},
  {slug: 'bmp-to-webp', title: 'BMP to WebP', description: 'Convert BMP images to WebP format', category: 'image', icon: ArrowRightLeft, formats: ['BMP','WEBP']},
  {slug: 'tiff-to-webp', title: 'TIFF to WebP', description: 'Convert TIFF images to WebP format', category: 'image', icon: ArrowRightLeft, formats: ['TIFF','WEBP']},
  {slug: 'webp-to-png', title: 'WebP to PNG', description: 'Convert WebP images to PNG format', category: 'image', icon: ArrowRightLeft, formats: ['WEBP','PNG']},
  {slug: 'webp-to-jpg', title: 'WebP to JPG', description: 'Convert WebP images to JPEG format', category: 'image', icon: ArrowRightLeft, formats: ['WEBP','JPG']},
  {slug: 'webp-to-pdf', title: 'WebP to PDF', description: 'Convert WebP images to PDF', category: 'image', icon: ArrowRightLeft, formats: ['WEBP','PDF']},
  {slug: 'webp-to-avif', title: 'WebP to AVIF', description: 'Convert WebP images to AVIF format', category: 'image', icon: ArrowRightLeft, formats: ['WEBP','AVIF']},
  {slug: 'jpg-to-avif', title: 'JPG to AVIF', description: 'Convert JPEG images to AVIF format', category: 'image', icon: ArrowRightLeft, formats: ['JPG','AVIF']},
  {slug: 'png-to-avif', title: 'PNG to AVIF', description: 'Convert PNG images to AVIF format', category: 'image', icon: ArrowRightLeft, formats: ['PNG','AVIF']},
  {slug: 'avif-to-jpg', title: 'AVIF to JPG', description: 'Convert AVIF images to JPEG format', category: 'image', icon: ArrowRightLeft, formats: ['AVIF','JPG']},
  {slug: 'avif-to-png', title: 'AVIF to PNG', description: 'Convert AVIF images to PNG format', category: 'image', icon: ArrowRightLeft, formats: ['AVIF','PNG']},
  {slug: 'jpg-to-png', title: 'JPG to PNG', description: 'Convert JPEG images to PNG format', category: 'image', icon: ArrowRightLeft, formats: ['JPG','PNG']},
  {slug: 'png-to-jpg', title: 'PNG to JPG', description: 'Convert PNG images to JPEG format', category: 'image', icon: ArrowRightLeft, formats: ['PNG','JPG']},
  {slug: 'png-to-svg', title: 'PNG to SVG', description: 'Embed a PNG image inside an SVG container', category: 'image', icon: ArrowRightLeft, formats: ['PNG','SVG']},
  {slug: 'svg-to-png', title: 'SVG to PNG', description: 'Rasterize SVG graphics to PNG format', category: 'image', icon: ArrowRightLeft, formats: ['SVG','PNG']},
  {slug: 'gif-to-png', title: 'GIF to PNG', description: 'Convert GIF images to PNG (first frame)', category: 'image', icon: ArrowRightLeft, formats: ['GIF','PNG']},
  {slug: 'bmp-to-jpg', title: 'BMP to JPG', description: 'Convert BMP images to JPEG format', category: 'image', icon: ArrowRightLeft, formats: ['BMP','JPG']},
  {slug: 'tiff-to-jpg', title: 'TIFF to JPG', description: 'Convert TIFF images to JPEG format', category: 'image', icon: ArrowRightLeft, formats: ['TIFF','JPG']},
  {slug: 'tiff-to-png', title: 'TIFF to PNG', description: 'Convert TIFF images to PNG format', category: 'image', icon: ArrowRightLeft, formats: ['TIFF','PNG']},
  {slug: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPEG images to PDF format', category: 'image', icon: ArrowRightLeft, formats: ['JPG','PDF']},
  {slug: 'png-to-pdf', title: 'PNG to PDF', description: 'Convert PNG images to PDF format', category: 'image', icon: ArrowRightLeft, formats: ['PNG','PDF']},

  // Privacy Tools
  {slug: 'metadata-cleaner', title: 'Metadata Cleaner', description: 'Strip EXIF, XMP, and document metadata from files', category: 'privacy', icon: ShieldOff, formats: ['PDF','JPG','PNG']},
  {slug: 'ai-text-scrubber', title: 'AI Text Scrubber', description: 'Remove invisible characters and AI-detection patterns from text', category: 'privacy', icon: ScanText, formats: ['TXT']},
  {slug: 'checksum', title: 'File Checksum', description: 'Verify file integrity with SHA-1, SHA-256, SHA-384, SHA-512', category: 'privacy', icon: ShieldCheck, formats: []},

  // Text & Code
  {slug: 'json-formatter', title: 'JSON Formatter', description: 'Format, validate, and minify JSON in your browser', category: 'textCode', icon: Braces, formats: ['JSON']},
  {slug: 'html-formatter', title: 'HTML Formatter', description: 'Format or minify HTML code with a single click', category: 'textCode', icon: Code2, formats: ['HTML']},
  {slug: 'base64', title: 'Base64 Encoder / Decoder', description: 'Encode or decode text and files to/from Base64', category: 'textCode', icon: Binary, formats: []},
  {slug: 'url-encoder', title: 'URL Encoder / Decoder', description: 'Encode and decode URL components in real time', category: 'textCode', icon: Link2, formats: []},
  {slug: 'word-counter', title: 'Word & Character Counter', description: 'Count words, characters, sentences, and reading time', category: 'textCode', icon: BookType, formats: []},
  {slug: 'lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text for any design or prototype', category: 'textCode', icon: FileText, formats: []},

  // Calculators
  {slug: 'password-generator', title: 'Password Generator', description: 'Generate cryptographically secure passwords with entropy display', category: 'calculators', icon: KeyRound, formats: []},
  {slug: 'percentage-calc', title: 'Percentage Calculator', description: 'Calculate percentages, discounts, tips, and markup instantly', category: 'calculators', icon: Percent, formats: []},
  {slug: 'unit-converter', title: 'Unit Converter', description: 'Convert between 200+ units across 13 measurement categories', category: 'calculators', icon: ArrowLeftRight, formats: []},
  {slug: 'currency-converter', title: 'Currency Converter', description: 'Convert between 170 currencies with live rates', category: 'calculators', icon: DollarSign, formats: []},
  {slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Generate QR codes from URLs, text, Wi-Fi, or contact cards', category: 'calculators', icon: QrCode, formats: []},
  {slug: 'tip-calculator', title: 'Tip Calculator', description: 'Calculate tip and split the bill across any number of people', category: 'calculators', icon: Receipt, formats: []}
];
