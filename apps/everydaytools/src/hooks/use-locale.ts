import { useContext } from "react";
import { LocaleContext, LocaleContextValue } from "@/contexts/locale-context";

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
