"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import pt from "./pt.json";
import en from "./en.json";

export type Locale = "pt" | "en";

const messages: Record<Locale, Record<string, Record<string, string>>> = { pt, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "pt",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with "pt" so server and client render the same HTML.
  // After mount, read localStorage and switch if needed.
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("poketrainer-locale") as Locale | null;
      if (saved === "pt" || saved === "en") {
        queueMicrotask(() => setLocaleState(saved));
      }
    } catch {
      // localStorage unavailable (private mode, quota exceeded, etc.)
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("poketrainer-locale", newLocale);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const [section, ...rest] = key.split(".");
    const field = rest.join(".");
    let value = messages[locale]?.[section]?.[field] || key;

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replaceAll(`{${k}}`, String(v));
      }
    }

    return value;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
