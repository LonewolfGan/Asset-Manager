import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import NotFound from "@/pages/not-found";
import { LocaleProvider } from "@/contexts/locale-context";
import { HelmetProvider } from "react-helmet-async";
import {
  SLUG_MAP_EN_TO_INTERNAL,
  SLUG_MAP_FR_TO_INTERNAL,
} from "@/config/tools-seo-data";

const Home = lazy(() => import("@/pages/index"));

// PDF Tools
const PdfToWord = lazy(() => import("@/pages/pdf-to-word"));
const PdfToText = lazy(() => import("@/pages/pdf-to-text"));
const PdfToHtml = lazy(() => import("@/pages/pdf-to-html"));
const PdfToEpub = lazy(() => import("@/pages/pdf-to-epub"));
const PdfCompress = lazy(() => import("@/pages/pdf-compress"));
const PdfMerge = lazy(() => import("@/pages/pdf-merge"));
const PdfSplit = lazy(() => import("@/pages/pdf-split"));
const PdfRotate = lazy(() => import("@/pages/pdf-rotate"));
const PdfUnlock = lazy(() => import("@/pages/pdf-unlock"));
const PdfProtect = lazy(() => import("@/pages/pdf-protect"));
const PdfPageNumbers = lazy(() => import("@/pages/pdf-page-numbers"));
const PdfWatermark = lazy(() => import("@/pages/pdf-watermark"));
const PdfToImage = lazy(() => import("@/pages/pdf-to-image"));
const PdfToExcel = lazy(() => import("@/pages/pdf-to-excel"));
const ReorderPdf = lazy(() => import("@/pages/reorder-pdf"));
const Ocr = lazy(() => import("@/pages/ocr"));

// Word & Docs
const WordToText = lazy(() => import("@/pages/word-to-text"));
const WordToHtml = lazy(() => import("@/pages/word-to-html"));
const WordToEpub = lazy(() => import("@/pages/word-to-epub"));
const WordToPdf = lazy(() => import("@/pages/word-to-pdf"));
const WordToMarkdown = lazy(() => import("@/pages/word-to-markdown"));
const HtmlToMarkdown = lazy(() => import("@/pages/html-to-markdown"));
const MarkdownToPdf = lazy(() => import("@/pages/markdown-to-pdf"));
const MarkdownToDocx = lazy(() => import("@/pages/markdown-to-docx"));
const HtmlToPdf = lazy(() => import("@/pages/html-to-pdf"));
const TxtToPdf = lazy(() => import("@/pages/txt-to-pdf"));
const TxtToDocx = lazy(() => import("@/pages/txt-to-docx"));

// Excel & Spreadsheets
const ExcelToPdf = lazy(() => import("@/pages/excel-to-pdf"));
const ExcelToCsv = lazy(() => import("@/pages/excel-to-csv"));
const CsvToExcel = lazy(() => import("@/pages/csv-to-excel"));
const CsvToJson = lazy(() => import("@/pages/csv-to-json"));
const CsvViewer = lazy(() => import("@/pages/csv-viewer"));

// PowerPoint
const PptxToPdf = lazy(() => import("@/pages/pptx-to-pdf"));
const PptxToImages = lazy(() => import("@/pages/pptx-to-images"));
const PdfToPptx = lazy(() => import("@/pages/pdf-to-pptx"));

// Image Tools
const ImageConverter = lazy(() => import("@/pages/image-converter"));
const HeicToJpg = lazy(() => import("@/pages/heic-to-jpg"));
const HeicToPng = lazy(() => import("@/pages/heic-to-png"));
const HeicToWebp = lazy(() => import("@/pages/heic-to-webp"));
const HeicToPdf = lazy(() => import("@/pages/heic-to-pdf"));
const ImageCompress = lazy(() => import("@/pages/image-compress"));
const ImageResize = lazy(() => import("@/pages/image-resize"));
const ImageCrop = lazy(() => import("@/pages/image-crop"));
const ImageToPdf = lazy(() => import("@/pages/image-to-pdf"));
const BackgroundRemover = lazy(() => import("@/pages/background-remover"));
const FlipRotateImage = lazy(() => import("@/pages/flip-rotate-image"));
const WatermarkImage = lazy(() => import("@/pages/watermark-image"));
const FaviconGenerator = lazy(() => import("@/pages/favicon-generator"));

// Image Conversion (format-specific)
const PngToWebp = lazy(() => import("@/pages/png-to-webp"));
const JpgToWebp = lazy(() => import("@/pages/jpg-to-webp"));
const GifToWebp = lazy(() => import("@/pages/gif-to-webp"));
const BmpToWebp = lazy(() => import("@/pages/bmp-to-webp"));
const TiffToWebp = lazy(() => import("@/pages/tiff-to-webp"));
const WebpToPng = lazy(() => import("@/pages/webp-to-png"));
const WebpToJpg = lazy(() => import("@/pages/webp-to-jpg"));
const WebpToPdf = lazy(() => import("@/pages/webp-to-pdf"));
const WebpToAvif = lazy(() => import("@/pages/webp-to-avif"));
const JpgToAvif = lazy(() => import("@/pages/jpg-to-avif"));
const PngToAvif = lazy(() => import("@/pages/png-to-avif"));
const AvifToJpg = lazy(() => import("@/pages/avif-to-jpg"));
const AvifToPng = lazy(() => import("@/pages/avif-to-png"));
const JpgToPng = lazy(() => import("@/pages/jpg-to-png"));
const PngToJpg = lazy(() => import("@/pages/png-to-jpg"));
const PngToSvg = lazy(() => import("@/pages/png-to-svg"));
const SvgToPng = lazy(() => import("@/pages/svg-to-png"));
const GifToPng = lazy(() => import("@/pages/gif-to-png"));
const BmpToJpg = lazy(() => import("@/pages/bmp-to-jpg"));
const TiffToJpg = lazy(() => import("@/pages/tiff-to-jpg"));
const TiffToPng = lazy(() => import("@/pages/tiff-to-png"));
const JpgToPdf = lazy(() => import("@/pages/jpg-to-pdf"));
const PngToPdf = lazy(() => import("@/pages/png-to-pdf"));

// Privacy Tools
const MetadataCleaner = lazy(() => import("@/pages/metadata-cleaner"));
const AiTextScrubber = lazy(() => import("@/pages/ai-text-scrubber"));
const Checksum = lazy(() => import("@/pages/checksum"));

// Text & Code
const JsonFormatter = lazy(() => import("@/pages/json-formatter"));
const HtmlFormatter = lazy(() => import("@/pages/html-formatter"));
const Base64 = lazy(() => import("@/pages/base64"));
const UrlEncoder = lazy(() => import("@/pages/url-encoder"));
const WordCounter = lazy(() => import("@/pages/word-counter"));
const LoremIpsum = lazy(() => import("@/pages/lorem-ipsum"));

// Calculators & Generators
const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
const PercentageCalc = lazy(() => import("@/pages/percentage-calc"));
const UnitConverter = lazy(() => import("@/pages/unit-converter"));
const CurrencyConverter = lazy(() => import("@/pages/currency-converter"));
const QrCodeGenerator = lazy(() => import("@/pages/qr-code-generator"));
const TipCalculator = lazy(() => import("@/pages/tip-calculator"));

// Legal
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const SecurityPage = lazy(() => import("@/pages/security"));

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
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
  "image-converter": ImageConverter,
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
  // Calculators
  "password-generator": PasswordGenerator,
  "percentage-calc": PercentageCalc,
  "unit-converter": UnitConverter,
  "currency-converter": CurrencyConverter,
  "qr-code-generator": QrCodeGenerator,
  "tip-calculator": TipCalculator,
};

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
      Loading…
    </div>
  );
}

function LocaleToolRoute({ params }: { params: { slug: string } }) {
  const slug = params?.slug ?? "";
  const internalSlug =
    SLUG_MAP_EN_TO_INTERNAL[slug] ?? SLUG_MAP_FR_TO_INTERNAL[slug];
  const Comp = internalSlug ? TOOL_COMPONENTS[internalSlug] : null;
  if (!Comp) return <NotFound />;
  return <Comp />;
}

function Router() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="status-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
      <TopNav />
      <main id="main-content" style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />

            {/* Locale-aware SEO routes */}
            <Route path="/en/:slug" component={LocaleToolRoute} />
            <Route path="/fr/:slug" component={LocaleToolRoute} />

            {/* PDF Tools */}
            <Route path="/pdf-to-word" component={PdfToWord} />
            <Route path="/pdf-to-text" component={PdfToText} />
            <Route path="/pdf-to-html" component={PdfToHtml} />
            <Route path="/pdf-to-epub" component={PdfToEpub} />
            <Route path="/pdf-compress" component={PdfCompress} />
            <Route path="/pdf-merge" component={PdfMerge} />
            <Route path="/pdf-split" component={PdfSplit} />
            <Route path="/pdf-rotate" component={PdfRotate} />
            <Route path="/pdf-unlock" component={PdfUnlock} />
            <Route path="/pdf-protect" component={PdfProtect} />
            <Route path="/pdf-page-numbers" component={PdfPageNumbers} />
            <Route path="/pdf-watermark" component={PdfWatermark} />
            <Route path="/pdf-to-image" component={PdfToImage} />
            <Route path="/pdf-to-excel" component={PdfToExcel} />
            <Route path="/reorder-pdf" component={ReorderPdf} />
            <Route path="/ocr" component={Ocr} />
            {/* Word & Docs */}
            <Route path="/word-to-text" component={WordToText} />
            <Route path="/word-to-html" component={WordToHtml} />
            <Route path="/word-to-epub" component={WordToEpub} />
            <Route path="/word-to-pdf" component={WordToPdf} />
            <Route path="/word-to-markdown" component={WordToMarkdown} />
            <Route path="/html-to-markdown" component={HtmlToMarkdown} />
            <Route path="/markdown-to-pdf" component={MarkdownToPdf} />
            <Route path="/markdown-to-docx" component={MarkdownToDocx} />
            <Route path="/html-to-pdf" component={HtmlToPdf} />
            <Route path="/txt-to-pdf" component={TxtToPdf} />
            <Route path="/txt-to-docx" component={TxtToDocx} />
            {/* Excel & Spreadsheets */}
            <Route path="/excel-to-pdf" component={ExcelToPdf} />
            <Route path="/excel-to-csv" component={ExcelToCsv} />
            <Route path="/csv-to-excel" component={CsvToExcel} />
            <Route path="/csv-to-json" component={CsvToJson} />
            <Route path="/csv-viewer" component={CsvViewer} />
            {/* PowerPoint */}
            <Route path="/pptx-to-pdf" component={PptxToPdf} />
            <Route path="/pptx-to-images" component={PptxToImages} />
            <Route path="/pdf-to-pptx" component={PdfToPptx} />
            {/* Image Tools */}
            <Route path="/image-converter" component={ImageConverter} />
            <Route path="/heic-to-jpg" component={HeicToJpg} />
            <Route path="/heic-to-png" component={HeicToPng} />
            <Route path="/heic-to-webp" component={HeicToWebp} />
            <Route path="/heic-to-pdf" component={HeicToPdf} />
            <Route path="/image-compress" component={ImageCompress} />
            <Route path="/image-resize" component={ImageResize} />
            <Route path="/image-crop" component={ImageCrop} />
            <Route path="/image-to-pdf" component={ImageToPdf} />
            <Route path="/background-remover" component={BackgroundRemover} />
            <Route path="/flip-rotate-image" component={FlipRotateImage} />
            <Route path="/watermark-image" component={WatermarkImage} />
            <Route path="/favicon-generator" component={FaviconGenerator} />
            {/* Image Conversion */}
            <Route path="/png-to-webp" component={PngToWebp} />
            <Route path="/jpg-to-webp" component={JpgToWebp} />
            <Route path="/gif-to-webp" component={GifToWebp} />
            <Route path="/bmp-to-webp" component={BmpToWebp} />
            <Route path="/tiff-to-webp" component={TiffToWebp} />
            <Route path="/webp-to-png" component={WebpToPng} />
            <Route path="/webp-to-jpg" component={WebpToJpg} />
            <Route path="/webp-to-pdf" component={WebpToPdf} />
            <Route path="/webp-to-avif" component={WebpToAvif} />
            <Route path="/jpg-to-avif" component={JpgToAvif} />
            <Route path="/png-to-avif" component={PngToAvif} />
            <Route path="/avif-to-jpg" component={AvifToJpg} />
            <Route path="/avif-to-png" component={AvifToPng} />
            <Route path="/jpg-to-png" component={JpgToPng} />
            <Route path="/png-to-jpg" component={PngToJpg} />
            <Route path="/png-to-svg" component={PngToSvg} />
            <Route path="/svg-to-png" component={SvgToPng} />
            <Route path="/gif-to-png" component={GifToPng} />
            <Route path="/bmp-to-jpg" component={BmpToJpg} />
            <Route path="/tiff-to-jpg" component={TiffToJpg} />
            <Route path="/tiff-to-png" component={TiffToPng} />
            <Route path="/jpg-to-pdf" component={JpgToPdf} />
            <Route path="/png-to-pdf" component={PngToPdf} />
            {/* Privacy */}
            <Route path="/metadata-cleaner" component={MetadataCleaner} />
            <Route path="/ai-text-scrubber" component={AiTextScrubber} />
            <Route path="/checksum" component={Checksum} />
            {/* Text & Code */}
            <Route path="/json-formatter" component={JsonFormatter} />
            <Route path="/html-formatter" component={HtmlFormatter} />
            <Route path="/base64" component={Base64} />
            <Route path="/url-encoder" component={UrlEncoder} />
            <Route path="/word-counter" component={WordCounter} />
            <Route path="/lorem-ipsum" component={LoremIpsum} />
            {/* Calculators */}
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/percentage-calc" component={PercentageCalc} />
            <Route path="/unit-converter" component={UnitConverter} />
            <Route path="/currency-converter" component={CurrencyConverter} />
            <Route path="/qr-code-generator" component={QrCodeGenerator} />
            <Route path="/tip-calculator" component={TipCalculator} />
            {/* Legal */}
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/security" component={SecurityPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LocaleProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </LocaleProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
