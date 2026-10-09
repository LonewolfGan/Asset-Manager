import React, { lazy } from "react";

export const Home = lazy(() => import("@/pages/index"));

// PDF Tools
export const PdfToWord = lazy(() => import("@/pages/pdf-to-word"));
export const PdfToText = lazy(() => import("@/pages/pdf-to-text"));
export const PdfToHtml = lazy(() => import("@/pages/pdf-to-html"));
export const PdfToEpub = lazy(() => import("@/pages/pdf-to-epub"));
export const PdfCompress = lazy(() => import("@/pages/pdf-compress"));
export const PdfMerge = lazy(() => import("@/pages/pdf-merge"));
export const PdfSplit = lazy(() => import("@/pages/pdf-split"));
export const PdfRotate = lazy(() => import("@/pages/pdf-rotate"));
export const PdfUnlock = lazy(() => import("@/pages/pdf-unlock"));
export const PdfProtect = lazy(() => import("@/pages/pdf-protect"));
export const PdfPageNumbers = lazy(() => import("@/pages/pdf-page-numbers"));
export const PdfWatermark = lazy(() => import("@/pages/pdf-watermark"));
export const PdfToImage = lazy(() => import("@/pages/pdf-to-image"));
export const PdfToExcel = lazy(() => import("@/pages/pdf-to-excel"));
export const ReorderPdf = lazy(() => import("@/pages/reorder-pdf"));
export const Ocr = lazy(() => import("@/pages/ocr"));
export const PdfToMarkdown = lazy(() => import("@/pages/pdf-to-markdown"));
export const PdfToPdfa = lazy(() => import("@/pages/pdf-to-pdfa"));
export const PdfRepair = lazy(() => import("@/pages/pdf-repair"));
export const PdfOcr = lazy(() => import("@/pages/pdf-ocr"));
export const PdfMetadata = lazy(() => import("@/pages/pdf-metadata"));

// Word & Docs
export const WordToText = lazy(() => import("@/pages/word-to-text"));
export const WordToHtml = lazy(() => import("@/pages/word-to-html"));
export const WordToEpub = lazy(() => import("@/pages/word-to-epub"));
export const WordToPdf = lazy(() => import("@/pages/word-to-pdf"));
export const WordToMarkdown = lazy(() => import("@/pages/word-to-markdown"));
export const HtmlToMarkdown = lazy(() => import("@/pages/html-to-markdown"));
export const MarkdownToPdf = lazy(() => import("@/pages/markdown-to-pdf"));
export const MarkdownToDocx = lazy(() => import("@/pages/markdown-to-docx"));
export const HtmlToPdf = lazy(() => import("@/pages/html-to-pdf"));
export const OdtToPdf = lazy(() => import("@/pages/odt-to-pdf"));
export const RtfToPdf = lazy(() => import("@/pages/rtf-to-pdf"));
export const TxtToPdf = lazy(() => import("@/pages/txt-to-pdf"));
export const TxtToDocx = lazy(() => import("@/pages/txt-to-docx"));

// Excel & Spreadsheets
export const ExcelToPdf = lazy(() => import("@/pages/excel-to-pdf"));
export const ExcelToCsv = lazy(() => import("@/pages/excel-to-csv"));
export const CsvToExcel = lazy(() => import("@/pages/csv-to-excel"));
export const CsvToJson = lazy(() => import("@/pages/csv-to-json"));
export const CsvViewer = lazy(() => import("@/pages/csv-viewer"));
export const CsvEditor = lazy(() => import("@/pages/csv-editor"));

// PowerPoint
export const PptxToPdf = lazy(() => import("@/pages/pptx-to-pdf"));
export const PptxToImages = lazy(() => import("@/pages/pptx-to-images"));
export const PdfToPptx = lazy(() => import("@/pages/pdf-to-pptx"));

// Image Tools
export const HeicToJpg = lazy(() => import("@/pages/heic-to-jpg"));
export const HeicToPng = lazy(() => import("@/pages/heic-to-png"));
export const HeicToWebp = lazy(() => import("@/pages/heic-to-webp"));
export const HeicToPdf = lazy(() => import("@/pages/heic-to-pdf"));
export const ImageCompress = lazy(() => import("@/pages/image-compress"));
export const ImageResize = lazy(() => import("@/pages/image-resize"));
export const ImageCrop = lazy(() => import("@/pages/image-crop"));
export const ImageToPdf = lazy(() => import("@/pages/image-to-pdf"));
export const BackgroundRemover = lazy(() => import("@/pages/background-remover"));
export const FlipRotateImage = lazy(() => import("@/pages/flip-rotate-image"));
export const WatermarkImage = lazy(() => import("@/pages/watermark-image"));
export const FaviconGenerator = lazy(() => import("@/pages/favicon-generator"));
export const ImageUpscale = lazy(() => import("@/pages/image-upscale"));
export const ImageFilters = lazy(() => import("@/pages/image-filters"));

// Image Conversion
export const PngToWebp = lazy(() => import("@/pages/png-to-webp"));
export const JpgToWebp = lazy(() => import("@/pages/jpg-to-webp"));
export const GifToWebp = lazy(() => import("@/pages/gif-to-webp"));
export const BmpToWebp = lazy(() => import("@/pages/bmp-to-webp"));
export const TiffToWebp = lazy(() => import("@/pages/tiff-to-webp"));
export const WebpToPng = lazy(() => import("@/pages/webp-to-png"));
export const WebpToJpg = lazy(() => import("@/pages/webp-to-jpg"));
export const WebpToPdf = lazy(() => import("@/pages/webp-to-pdf"));
export const WebpToAvif = lazy(() => import("@/pages/webp-to-avif"));
export const JpgToAvif = lazy(() => import("@/pages/jpg-to-avif"));
export const PngToAvif = lazy(() => import("@/pages/png-to-avif"));
export const AvifToJpg = lazy(() => import("@/pages/avif-to-jpg"));
export const AvifToPng = lazy(() => import("@/pages/avif-to-png"));
export const JpgToPng = lazy(() => import("@/pages/jpg-to-png"));
export const PngToJpg = lazy(() => import("@/pages/png-to-jpg"));
export const PngToSvg = lazy(() => import("@/pages/png-to-svg"));
export const SvgToPng = lazy(() => import("@/pages/svg-to-png"));
export const GifToPng = lazy(() => import("@/pages/gif-to-png"));
export const BmpToJpg = lazy(() => import("@/pages/bmp-to-jpg"));
export const TiffToJpg = lazy(() => import("@/pages/tiff-to-jpg"));
export const TiffToPng = lazy(() => import("@/pages/tiff-to-png"));
export const JpgToPdf = lazy(() => import("@/pages/jpg-to-pdf"));
export const PngToPdf = lazy(() => import("@/pages/png-to-pdf"));

// Privacy
export const MetadataCleaner = lazy(() => import("@/pages/metadata-cleaner"));
export const AiTextScrubber = lazy(() => import("@/pages/ai-text-scrubber"));
export const Checksum = lazy(() => import("@/pages/checksum"));

// Text & Code
export const JsonFormatter = lazy(() => import("@/pages/json-formatter"));
export const HtmlFormatter = lazy(() => import("@/pages/html-formatter"));
export const Base64 = lazy(() => import("@/pages/base64"));
export const UrlEncoder = lazy(() => import("@/pages/url-encoder"));
export const WordCounter = lazy(() => import("@/pages/word-counter"));
export const LoremIpsum = lazy(() => import("@/pages/lorem-ipsum"));
export const JsonDiff = lazy(() => import("@/pages/json-diff"));
export const CssFormatter = lazy(() => import("@/pages/css-formatter"));
export const JsFormatter = lazy(() => import("@/pages/js-formatter"));
export const MarkdownPreview = lazy(() => import("@/pages/markdown-preview"));
export const DiffChecker = lazy(() => import("@/pages/diff-checker"));
export const RegexTester = lazy(() => import("@/pages/regex-tester"));
export const JwtDecoder = lazy(() => import("@/pages/jwt-decoder"));
export const BarcodeGenerator = lazy(() => import("@/pages/barcode-generator"));
export const HashGenerator = lazy(() => import("@/pages/hash-generator"));
export const UuidGenerator = lazy(() => import("@/pages/uuid-generator"));
export const ColorConverter = lazy(() => import("@/pages/color-converter"));
export const ColorPalette = lazy(() => import("@/pages/color-palette"));

// Calculators & Utilities
export const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
export const UnitConverter = lazy(() => import("@/pages/unit-converter"));
export const CurrencyConverter = lazy(() => import("@/pages/currency-converter"));
export const QrCodeGenerator = lazy(() => import("@/pages/qr-code-generator"));
export const SpeedTest = lazy(() => import("@/pages/speed-test"));

// Blog & Legal
export const BlogIndex = lazy(() => import("@/pages/blog-index"));
export const BlogPost = lazy(() => import("@/pages/blog-post"));
export const Privacy = lazy(() => import("@/pages/privacy"));
export const Terms = lazy(() => import("@/pages/terms"));
export const SecurityPage = lazy(() => import("@/pages/security"));

export const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  // PDF
  "pdf-to-word": PdfToWord,
  "pdf-to-text": PdfToText,
  "pdf-to-html": PdfToHtml,
  "pdf-to-epub": PdfToEpub,
  "pdf-compress": PdfCompress,
  "pdf-merge": PdfMerge,
  "pdf-split": PdfSplit,
  "pdf-rotate": PdfRotate,
  "pdf-unlock": PdfUnlock,
  "pdf-protect": PdfProtect,
  "pdf-page-numbers": PdfPageNumbers,
  "pdf-watermark": PdfWatermark,
  "pdf-to-image": PdfToImage,
  "pdf-to-excel": PdfToExcel,
  "reorder-pdf": ReorderPdf,
  "ocr": Ocr,
  "pdf-to-markdown": PdfToMarkdown,
  "pdf-to-pdfa": PdfToPdfa,
  // Word & Docs
  "word-to-text": WordToText,
  "word-to-html": WordToHtml,
  "word-to-epub": WordToEpub,
  "word-to-pdf": WordToPdf,
  "word-to-markdown": WordToMarkdown,
  "html-to-markdown": HtmlToMarkdown,
  "markdown-to-pdf": MarkdownToPdf,
  "markdown-to-docx": MarkdownToDocx,
  "html-to-pdf": HtmlToPdf,
  "odt-to-pdf": OdtToPdf,
  "rtf-to-pdf": RtfToPdf,
  "txt-to-pdf": TxtToPdf,
  "txt-to-docx": TxtToDocx,
  // Excel & Spreadsheets
  "excel-to-pdf": ExcelToPdf,
  "excel-to-csv": ExcelToCsv,
  "csv-to-excel": CsvToExcel,
  "csv-to-json": CsvToJson,
  "csv-viewer": CsvViewer,
  // PowerPoint
  "pptx-to-pdf": PptxToPdf,
  "pptx-to-images": PptxToImages,
  "pdf-to-pptx": PdfToPptx,
  // Image Tools
  "heic-to-jpg": HeicToJpg,
  "heic-to-png": HeicToPng,
  "heic-to-webp": HeicToWebp,
  "heic-to-pdf": HeicToPdf,
  "image-compress": ImageCompress,
  "image-resize": ImageResize,
  "image-crop": ImageCrop,
  "image-to-pdf": ImageToPdf,
  "background-remover": BackgroundRemover,
  "flip-rotate-image": FlipRotateImage,
  "watermark-image": WatermarkImage,
  "favicon-generator": FaviconGenerator,
  // Image Conversion
  "png-to-webp": PngToWebp,
  "jpg-to-webp": JpgToWebp,
  "gif-to-webp": GifToWebp,
  "bmp-to-webp": BmpToWebp,
  "tiff-to-webp": TiffToWebp,
  "webp-to-png": WebpToPng,
  "webp-to-jpg": WebpToJpg,
  "webp-to-pdf": WebpToPdf,
  "webp-to-avif": WebpToAvif,
  "jpg-to-avif": JpgToAvif,
  "png-to-avif": PngToAvif,
  "avif-to-jpg": AvifToJpg,
  "avif-to-png": AvifToPng,
  "jpg-to-png": JpgToPng,
  "png-to-jpg": PngToJpg,
  "png-to-svg": PngToSvg,
  "svg-to-png": SvgToPng,
  "gif-to-png": GifToPng,
  "bmp-to-jpg": BmpToJpg,
  "tiff-to-jpg": TiffToJpg,
  "tiff-to-png": TiffToPng,
  "jpg-to-pdf": JpgToPdf,
  "png-to-pdf": PngToPdf,
  // Privacy
  "metadata-cleaner": MetadataCleaner,
  "ai-text-scrubber": AiTextScrubber,
  "checksum": Checksum,
  // Text & Code
  "json-formatter": JsonFormatter,
  "html-formatter": HtmlFormatter,
  "base64": Base64,
  "url-encoder": UrlEncoder,
  "word-counter": WordCounter,
  "lorem-ipsum": LoremIpsum,
  // Calculators & Utilities
  "password-generator": PasswordGenerator,
  "unit-converter": UnitConverter,
  "currency-converter": CurrencyConverter,
  "qr-code-generator": QrCodeGenerator,
  // Additional Image Tools
  "image-upscale": ImageUpscale,
  "image-filters": ImageFilters,
  // Additional PDF Tools
  "pdf-repair": PdfRepair,
  "pdf-ocr": PdfOcr,
  "pdf-metadata": PdfMetadata,
  // Additional Data & Code Tools
  "json-diff": JsonDiff,
  "csv-editor": CsvEditor,
  "css-formatter": CssFormatter,
  "js-formatter": JsFormatter,
  "markdown-preview": MarkdownPreview,
  "diff-checker": DiffChecker,
  "regex-tester": RegexTester,
  "jwt-decoder": JwtDecoder,
  "barcode-generator": BarcodeGenerator,
  "hash-generator": HashGenerator,
  "uuid-generator": UuidGenerator,
  "color-converter": ColorConverter,
  "color-palette": ColorPalette,
  "speed-test": SpeedTest,
};
