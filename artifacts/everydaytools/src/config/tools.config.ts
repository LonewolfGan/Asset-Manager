import { 
  FileText, AlignLeft, Code2, BookOpen, Minimize2, Layers, Scissors, RotateCw, Unlock, Lock, Hash, Stamp,
  Type, FileCode, BookMarked, FileDown, FileInput, Globe, ScrollText, FilePlus,
  ImageIcon, Smartphone, ZoomOut, Maximize2, Crop, Image as ImageIcon2, FileImage, Wand2,
  ShieldOff, ScanText,
  KeyRound, Percent, ArrowLeftRight, DollarSign
} from "lucide-react";

export const tools = [
  // PDF Tools
  {slug: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF files to editable DOCX format', category: 'pdf', icon: FileText},
  {slug: 'pdf-to-text', title: 'PDF to Text', description: 'Extract all text from a PDF file', category: 'pdf', icon: AlignLeft},
  {slug: 'pdf-to-html', title: 'PDF to HTML', description: 'Convert PDF content to HTML markup', category: 'pdf', icon: Code2},
  {slug: 'pdf-to-epub', title: 'PDF to EPUB', description: 'Convert PDF to EPUB e-book format', category: 'pdf', icon: BookOpen},
  {slug: 'pdf-compress', title: 'Compress PDF', description: 'Reduce PDF file size without visible quality loss', category: 'pdf', icon: Minimize2},
  {slug: 'pdf-merge', title: 'Merge PDFs', description: 'Combine multiple PDF files into one', category: 'pdf', icon: Layers},
  {slug: 'pdf-split', title: 'Split PDF', description: 'Split a PDF into separate pages or page ranges', category: 'pdf', icon: Scissors},
  {slug: 'pdf-rotate', title: 'Rotate PDF', description: 'Rotate PDF pages 90, 180, or 270 degrees', category: 'pdf', icon: RotateCw},
  {slug: 'pdf-unlock', title: 'Unlock PDF', description: 'Remove owner password protection from a PDF', category: 'pdf', icon: Unlock},
  {slug: 'pdf-protect', title: 'Protect PDF', description: 'Add password protection to a PDF', category: 'pdf', icon: Lock},
  {slug: 'pdf-page-numbers', title: 'Add Page Numbers', description: 'Add page numbers to every page of your PDF', category: 'pdf', icon: Hash},
  {slug: 'pdf-watermark', title: 'Watermark PDF', description: 'Add a text watermark to every PDF page', category: 'pdf', icon: Stamp},

  // Word & Docs
  {slug: 'word-to-text', title: 'Word to Text', description: 'Extract plain text from DOCX files', category: 'word', icon: Type},
  {slug: 'word-to-html', title: 'Word to HTML', description: 'Convert DOCX to clean HTML markup', category: 'word', icon: FileCode},
  {slug: 'word-to-epub', title: 'Word to EPUB', description: 'Convert DOCX to EPUB e-book', category: 'word', icon: BookMarked},
  {slug: 'markdown-to-pdf', title: 'Markdown to PDF', description: 'Convert Markdown files to PDF', category: 'word', icon: FileDown},
  {slug: 'markdown-to-docx', title: 'Markdown to Word', description: 'Convert Markdown to a Word document', category: 'word', icon: FileInput},
  {slug: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert an HTML page or snippet to PDF', category: 'word', icon: Globe},
  {slug: 'txt-to-pdf', title: 'Text to PDF', description: 'Convert plain text to a PDF document', category: 'word', icon: ScrollText},
  {slug: 'txt-to-docx', title: 'Text to Word', description: 'Convert plain text to a Word document', category: 'word', icon: FilePlus},

  // Image Tools
  {slug: 'image-converter', title: 'Image Converter', description: 'Convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, TIFF, ICO', category: 'image', icon: ImageIcon},
  {slug: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Convert iPhone HEIC photos to JPEG or PNG', category: 'image', icon: Smartphone},
  {slug: 'image-compress', title: 'Compress Image', description: 'Reduce image file size with a quality slider', category: 'image', icon: ZoomOut},
  {slug: 'image-resize', title: 'Resize Image', description: 'Resize images by pixel dimensions or percentage', category: 'image', icon: Maximize2},
  {slug: 'image-crop', title: 'Crop Image', description: 'Crop images with drag handles and aspect ratio presets', category: 'image', icon: Crop},
  {slug: 'image-to-pdf', title: 'Image to PDF', description: 'Convert one or more images to a single PDF', category: 'image', icon: ImageIcon2},
  {slug: 'pdf-to-image', title: 'PDF to Image', description: 'Export PDF pages as PNG or JPEG images', category: 'image', icon: FileImage},
  {slug: 'background-remover', title: 'Background Remover', description: 'Remove image backgrounds using on-device AI', category: 'image', icon: Wand2},

  // Privacy Tools
  {slug: 'metadata-cleaner', title: 'Metadata Cleaner', description: 'Strip EXIF, XMP, and document metadata from files', category: 'privacy', icon: ShieldOff},
  {slug: 'ai-text-scrubber', title: 'AI Text Scrubber', description: 'Remove invisible characters and AI-detection patterns from text', category: 'privacy', icon: ScanText},

  // Calculators
  {slug: 'password-generator', title: 'Password Generator', description: 'Generate cryptographically secure passwords with entropy display', category: 'calculators', icon: KeyRound},
  {slug: 'percentage-calc', title: 'Percentage Calculator', description: 'Calculate percentages, discounts, tips, and markup instantly', category: 'calculators', icon: Percent},
  {slug: 'unit-converter', title: 'Unit Converter', description: 'Convert between 200+ units across 13 measurement categories', category: 'calculators', icon: ArrowLeftRight},
  {slug: 'currency-converter', title: 'Currency Converter', description: 'Convert between 170 currencies with live rates', category: 'calculators', icon: DollarSign}
];
