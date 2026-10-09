import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, Translations, TRANSLATIONS } from "@/i18n/translations";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  isFr: boolean;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "et:locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "EN";

  // 1. URL prefix takes precedence if present
  const path = window.location.pathname;
  if (path === "/fr" || path.startsWith("/fr/")) return "FR";
  if (path === "/en" || path.startsWith("/en/")) return "EN";

  // 2. Persisted user preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "FR" || saved === "EN") return saved;
  } catch {}

  // 3. Browser locale auto-detection
  try {
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("fr")) {
      return "FR";
    }
  } catch {}

  return "EN";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale.toLowerCase();
    } catch {}
  }, []);

  // Sync document.documentElement.lang on mount and locale change
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale.toLowerCase();
    }
  }, [locale]);

  // Keep in sync with URL changes (e.g. forward/back buttons or manual navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if ((path === "/fr" || path.startsWith("/fr/")) && locale !== "FR") {
        setLocaleState("FR");
        try {
          localStorage.setItem(STORAGE_KEY, "FR");
          document.documentElement.lang = "fr";
        } catch {}
      } else if ((path === "/en" || path.startsWith("/en/")) && locale !== "EN") {
        setLocaleState("EN");
        try {
          localStorage.setItem(STORAGE_KEY, "EN");
          document.documentElement.lang = "en";
        } catch {}
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [locale]);

  const isFr = locale === "FR";

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: TRANSLATIONS[locale], isFr }}>
      {children}
    </LocaleContext.Provider>
  );
}
