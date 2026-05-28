import { 
  FileText, AlignLeft, Code2, BookOpen, Minimize2, Layers, Scissors, RotateCw, Unlock, Lock, Hash, Stamp,
  Type, FileCode, BookMarked, FileDown, FileInput, Globe, ScrollText, FilePlus,
  ImageIcon, Smartphone, ZoomOut, Maximize2, Crop, Image as ImageIcon2, FileImage, Wand2,
  ShieldOff, ScanText,
  KeyRound, Percent, ArrowLeftRight, DollarSign, QrCode, Receipt
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

  // Word & Docs
  {slug: 'word-to-text', title: 'Word to Text', description: 'Extract plain text from DOCX files', category: 'word', icon: Type, formats: ['DOCX','TXT']},
  {slug: 'word-to-html', title: 'Word to HTML', description: 'Convert DOCX to clean HTML markup', category: 'word', icon: FileCode, formats: ['DOCX','HTML']},
  {slug: 'word-to-epub', title: 'Word to EPUB', description: 'Convert DOCX to EPUB e-book', category: 'word', icon: BookMarked, formats: ['DOCX','EPUB']},
  {slug: 'markdown-to-pdf', title: 'Markdown to PDF', description: 'Convert Markdown files to PDF', category: 'word', icon: FileDown, formats: ['MD','PDF']},
  {slug: 'markdown-to-docx', title: 'Markdown to Word', description: 'Convert Markdown to a Word document', category: 'word', icon: FileInput, formats: ['MD','DOCX']},
  {slug: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert an HTML page or snippet to PDF', category: 'word', icon: Globe, formats: ['HTML','PDF']},
  {slug: 'txt-to-pdf', title: 'Text to PDF', description: 'Convert plain text to a PDF document', category: 'word', icon: ScrollText, formats: ['TXT','PDF']},
  {slug: 'txt-to-docx', title: 'Text to Word', description: 'Convert plain text to a Word document', category: 'word', icon: FilePlus, formats: ['TXT','DOCX']},

  // Image Tools
  {slug: 'image-converter', title: 'Image Converter', description: 'Convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO', category: 'image', icon: ImageIcon, formats: ['PNG','JPG','WEBP','AVIF']},
  {slug: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Convert iPhone HEIC photos to JPEG or PNG', category: 'image', icon: Smartphone, formats: ['HEIC','JPG']},
  {slug: 'image-compress', title: 'Compress Image', description: 'Reduce image file size with a quality slider', category: 'image', icon: ZoomOut, formats: ['JPG','PNG','WEBP']},
  {slug: 'image-resize', title: 'Resize Image', description: 'Resize images by pixel dimensions or percentage', category: 'image', icon: Maximize2, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-crop', title: 'Crop Image', description: 'Crop images with drag handles and aspect ratio presets', category: 'image', icon: Crop, formats: ['PNG','JPG','WEBP']},
  {slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert one or more images to a single PDF', category: 'image', icon: ImageIcon2, formats: ['IMG','PDF']},
  {slug: 'pdf-to-image', title: 'PDF to Image', description: 'Export PDF pages as PNG or JPEG images', category: 'image', icon: FileImage, formats: ['PDF','PNG']},
  {slug: 'background-remover', title: 'Background Remover', description: 'Remove image backgrounds using on-device AI', category: 'image', icon: Wand2, formats: ['PNG','JPG']},

  // Privacy Tools
  {slug: 'metadata-cleaner', title: 'Metadata Cleaner', description: 'Strip EXIF, XMP, and document metadata from files', category: 'privacy', icon: ShieldOff, formats: ['PDF','JPG','PNG']},
  {slug: 'ai-text-scrubber', title: 'AI Text Scrubber', description: 'Remove invisible characters and AI-detection patterns from text', category: 'privacy', icon: ScanText, formats: ['TXT']},

  // Calculators
  {slug: 'password-generator', title: 'Password Generator', description: 'Generate cryptographically secure passwords with entropy display', category: 'calculators', icon: KeyRound, formats: []},
  {slug: 'percentage-calc', title: 'Percentage Calculator', description: 'Calculate percentages, discounts, tips, and markup instantly', category: 'calculators', icon: Percent, formats: []},
  {slug: 'unit-converter', title: 'Unit Converter', description: 'Convert between 200+ units across 13 measurement categories', category: 'calculators', icon: ArrowLeftRight, formats: []},
  {slug: 'currency-converter', title: 'Currency Converter', description: 'Convert between 170 currencies with live rates', category: 'calculators', icon: DollarSign, formats: []},
  {slug: 'qr-code-generator', title: 'QR Code Generator', description: 'Generate QR codes from URLs, text, Wi-Fi credentials, or contact cards', category: 'calculators', icon: QrCode, formats: []},
  {slug: 'tip-calculator', title: 'Tip Calculator', description: 'Calculate tip and split the bill across any number of people', category: 'calculators', icon: Receipt, formats: []}
];
