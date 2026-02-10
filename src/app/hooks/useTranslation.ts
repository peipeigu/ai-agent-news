"use client";

import { useState, useEffect, useRef } from "react";
import { type Locale } from "../i18n/translations";

// Client-side cache persists across re-renders
const clientCache = new Map<string, string[]>();

function getCacheKey(texts: string[], targetLang: string): string {
  return `${targetLang}:${texts.join("\n")}`;
}

export function useTranslatedTexts(
  texts: string[],
  locale: Locale
): { translated: string[]; loading: boolean } {
  const [translated, setTranslated] = useState<string[]>(texts);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // English mode: show original (HN articles are mostly English)
    if (locale === "en") {
      setTranslated(texts);
      setLoading(false);
      return;
    }

    // Chinese mode: translate to Chinese
    const cacheKey = getCacheKey(texts, "zh-CN");
    const cached = clientCache.get(cacheKey);
    if (cached) {
      setTranslated(cached);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: "zh-CN" }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.translations) {
          clientCache.set(cacheKey, data.translations);
          setTranslated(data.translations);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // Fallback to original text on error
          setTranslated(texts);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [texts, locale]);

  return { translated, loading };
}
