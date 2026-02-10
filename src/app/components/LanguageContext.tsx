"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Locale, translations, type Translations } from "../i18n/translations";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "zh" || saved === "en") {
      setLocale(saved);
    }
  }, []);

  const toggleLocale = () => {
    const next = locale === "zh" ? "en" : "zh";
    setLocale(next);
    localStorage.setItem("locale", next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
  };

  return (
    <LanguageContext value={{ locale, t: translations[locale], toggleLocale }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
