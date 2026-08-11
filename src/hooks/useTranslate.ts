"use client";
import { useState, useCallback } from "react";

const cache: Record<string, Record<string, string>> = {}; // cache[lang][originalText] = translatedText

export function useTranslate() {
  const [loading, setLoading] = useState(false);

  const translateBatch = useCallback(async (texts: string[], target: string) => {
    if (!target || target === "en" || texts.length === 0) {
      return texts;
    }
    setLoading(true);
    try {
      // load from localStorage if exists
      if (!cache[target]) {
        const stored = typeof window !== "undefined" ? localStorage.getItem(`translations_${target}`) : null;
        cache[target] = stored ? JSON.parse(stored) : {};
      }

      const textsToTranslate = texts.filter(
        (text) => !(cache[target] && cache[target][text])
      );

      let translations: string[] = [];

      if (textsToTranslate.length > 0) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: textsToTranslate, target }),
        });
        const data = await res.json();
        translations = data.translations || [];

        // store in cache and localStorage
        textsToTranslate.forEach((text, i) => {
          if (translations[i]) {
            cache[target][text] = translations[i];
          }
        });
        if (typeof window !== "undefined") {
          localStorage.setItem(`translations_${target}`, JSON.stringify(cache[target]));
        }
      }

      // return translations from cache
      return texts.map((text) => cache[target]?.[text] || text);
    } catch (e) {
      console.error(e);
      return texts;
    } finally {
      setLoading(false);
    }
  }, []);

  return { translateBatch, loading };
}
