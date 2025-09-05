import { getTranslations as fetchTranslations } from "@/actions/translation.actions";

let cachedTranslations: Record<string, string> = {};
let cacheTime: number = 0;

const CACHE_TTL = 1000 * 60 * 60 * 2;

export async function getCachedTranslations(keys?: string[]) {
  const now = Date.now();

  if (now - cacheTime > CACHE_TTL) {
    const translations = await fetchTranslations(keys);
    cachedTranslations = { ...cachedTranslations, ...translations };
    cacheTime = now;
  } else if (keys) {
    const missingKeys = keys.filter((key) => !cachedTranslations[key]);
    if (missingKeys.length > 0) {
      const newTranslations = await fetchTranslations(missingKeys);
      cachedTranslations = { ...cachedTranslations, ...newTranslations };
      cacheTime = now;
    }

    const filtered: Record<string, string> = {};
    keys.forEach((key) => {
      filtered[key] = cachedTranslations[key];
    });
    return filtered;
  }

  return cachedTranslations;
}
