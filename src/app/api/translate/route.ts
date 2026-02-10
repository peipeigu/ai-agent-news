import { NextRequest, NextResponse } from "next/server";

interface TranslateRequest {
  texts: string[];
  targetLang: "zh-CN" | "en";
}

async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Translation failed: ${res.status}`);
  }

  const data = await res.json();
  // Google Translate response: [[["translated","original",...],...],...]
  const segments: string[] = data[0].map(
    (segment: [string, ...unknown[]]) => segment[0]
  );
  return segments.join("");
}

// Simple in-memory cache to avoid repeated translations
const cache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang }: TranslateRequest = await request.json();

    if (!texts?.length || !targetLang) {
      return NextResponse.json(
        { error: "Missing texts or targetLang" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      texts.map(async (text) => {
        const cacheKey = `${targetLang}:${text}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const translated = await translateText(text, targetLang);
        cache.set(cacheKey, translated);
        return translated;
      })
    );

    return NextResponse.json({ translations: results });
  } catch {
    return NextResponse.json(
      { error: "Translation service unavailable" },
      { status: 502 }
    );
  }
}
