import React, { Suspense, useEffect } from "react";
import { Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { LocaleProvider } from "@/contexts/locale-context";
import { useLocale } from "@/hooks/use-locale";
import { HelmetProvider } from "react-helmet-async";
import { tools as allTools } from "@/config/tools.config";
import { AppRoutes, PageLoader } from "./routes/AppRoutes";

const TOOL_SLUGS = new Set(allTools.map((t) => t.slug));
const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Synchronize locale when navigating to /fr/... or /en/...
    if ((location === "/fr" || location.startsWith("/fr/")) && locale !== "FR") {
      setLocale("FR");
    } else if ((location === "/en" || location.startsWith("/en/")) && locale !== "EN") {
      setLocale("EN");
    }

    const slug = location.slice(1);
    if (TOOL_SLUGS.has(slug)) {
      try {
        const prev: string[] = JSON.parse(localStorage.getItem('et:recent') ?? '[]');
        const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 5);
        localStorage.setItem('et:recent', JSON.stringify(next));
        window.dispatchEvent(new Event('et:recent'));
      } catch {}
    }
  }, [location, locale, setLocale]);
  return null;
}

function Router() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="status-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
      <TopNav />
      <main id="main-content" style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function App() {
  useEffect(() => {
    function updateRangeFill(input: HTMLInputElement) {
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const val = parseFloat(input.value);
      const pct = ((val - min) / (max - min)) * 100;
      input.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
    }
    function handleInput(e: Event) {
      const el = e.target as HTMLInputElement;
      if (el.type === 'range') updateRangeFill(el);
    }
    document.addEventListener('input', handleInput);
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(updateRangeFill);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener('input', handleInput);
      observer.disconnect();
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={150} skipDelayDuration={300}>
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
