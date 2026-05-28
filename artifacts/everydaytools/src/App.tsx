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

// Word & Docs
const WordToText = lazy(() => import("@/pages/word-to-text"));
const WordToHtml = lazy(() => import("@/pages/word-to-html"));
const WordToEpub = lazy(() => import("@/pages/word-to-epub"));
const MarkdownToPdf = lazy(() => import("@/pages/markdown-to-pdf"));
const MarkdownToDocx = lazy(() => import("@/pages/markdown-to-docx"));
const HtmlToPdf = lazy(() => import("@/pages/html-to-pdf"));
const TxtToPdf = lazy(() => import("@/pages/txt-to-pdf"));
const TxtToDocx = lazy(() => import("@/pages/txt-to-docx"));

// Image Tools
const ImageConverter = lazy(() => import("@/pages/image-converter"));
const HeicToJpg = lazy(() => import("@/pages/heic-to-jpg"));
const ImageCompress = lazy(() => import("@/pages/image-compress"));
const ImageResize = lazy(() => import("@/pages/image-resize"));
const ImageCrop = lazy(() => import("@/pages/image-crop"));
const ImageToPdf = lazy(() => import("@/pages/image-to-pdf"));
const PdfToImage = lazy(() => import("@/pages/pdf-to-image"));
const BackgroundRemover = lazy(() => import("@/pages/background-remover"));

// Privacy Tools
const MetadataCleaner = lazy(() => import("@/pages/metadata-cleaner"));
const AiTextScrubber = lazy(() => import("@/pages/ai-text-scrubber"));

// Calculators
const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
const PercentageCalc = lazy(() => import("@/pages/percentage-calc"));
const UnitConverter = lazy(() => import("@/pages/unit-converter"));
const CurrencyConverter = lazy(() => import("@/pages/currency-converter"));

// Generators
const QrCodeGenerator = lazy(() => import("@/pages/qr-code-generator"));
const TipCalculator = lazy(() => import("@/pages/tip-calculator"));

// Legal
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
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
  "word-to-text": WordToText,
  "word-to-html": WordToHtml,
  "word-to-epub": WordToEpub,
  "markdown-to-pdf": MarkdownToPdf,
  "markdown-to-docx": MarkdownToDocx,
  "html-to-pdf": HtmlToPdf,
  "txt-to-pdf": TxtToPdf,
  "txt-to-docx": TxtToDocx,
  "image-converter": ImageConverter,
  "heic-to-jpg": HeicToJpg,
  "image-compress": ImageCompress,
  "image-resize": ImageResize,
  "image-crop": ImageCrop,
  "image-to-pdf": ImageToPdf,
  "pdf-to-image": PdfToImage,
  "background-remover": BackgroundRemover,
  "metadata-cleaner": MetadataCleaner,
  "ai-text-scrubber": AiTextScrubber,
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
      <TopNav />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />

            {/* Locale-aware SEO routes — render the same tool component */}
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
            {/* Word & Docs */}
            <Route path="/word-to-text" component={WordToText} />
            <Route path="/word-to-html" component={WordToHtml} />
            <Route path="/word-to-epub" component={WordToEpub} />
            <Route path="/markdown-to-pdf" component={MarkdownToPdf} />
            <Route path="/markdown-to-docx" component={MarkdownToDocx} />
            <Route path="/html-to-pdf" component={HtmlToPdf} />
            <Route path="/txt-to-pdf" component={TxtToPdf} />
            <Route path="/txt-to-docx" component={TxtToDocx} />
            {/* Image Tools */}
            <Route path="/image-converter" component={ImageConverter} />
            <Route path="/heic-to-jpg" component={HeicToJpg} />
            <Route path="/image-compress" component={ImageCompress} />
            <Route path="/image-resize" component={ImageResize} />
            <Route path="/image-crop" component={ImageCrop} />
            <Route path="/image-to-pdf" component={ImageToPdf} />
            <Route path="/pdf-to-image" component={PdfToImage} />
            <Route path="/background-remover" component={BackgroundRemover} />
            {/* Privacy Tools */}
            <Route path="/metadata-cleaner" component={MetadataCleaner} />
            <Route path="/ai-text-scrubber" component={AiTextScrubber} />
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
