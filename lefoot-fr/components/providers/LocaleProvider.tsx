"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPath,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  lp: (path?: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  const value = useMemo(
    () => ({
      locale,
      t: getDictionary(locale),
      lp: (path = "") => localizedPath(locale, path),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx.locale;
}

export function useTranslations() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslations must be used within LocaleProvider");
  }
  return ctx.t;
}

export function useLocalizedPath() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocalizedPath must be used within LocaleProvider");
  }
  return ctx.lp;
}
