import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import TopNav from "@/components/TopNav";
import NotFound from "@/pages/not-found";

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

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
      Loading…
    </div>
  );
}

function Router() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-ui)' }}>
      <TopNav />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
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
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
