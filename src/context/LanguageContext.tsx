"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { dictionaries } from "@/i18n/messages";

export type Locale = "pt-BR" | "en" | "es";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Dictionary for the current locale; keys are typed against the pt-BR shape. */
  t: (typeof dictionaries)[Locale];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "anonyzap:locale";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useLocalStorage<Locale>(STORAGE_KEY, "pt-BR");

  // First visit with no saved preference: auto-detect Spanish browsers.
  // Everyone else (including pt and en browsers) stays on pt-BR, the primary audience.
  useEffect(() => {
    try {
      if (
        !localStorage.getItem(STORAGE_KEY) &&
        navigator.language.toLowerCase().startsWith("es")
      ) {
        setLocale("es");
      }
    } catch {
      // keep default
    }
  }, [setLocale]);

  // Keep the document language in sync (accessibility + translation tools).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextType>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}
