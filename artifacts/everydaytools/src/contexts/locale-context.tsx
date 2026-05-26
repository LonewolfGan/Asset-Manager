import { createContext, useState, ReactNode } from "react";
import { Locale, Translations, TRANSLATIONS } from "@/i18n/translations";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("EN");
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: TRANSLATIONS[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}
