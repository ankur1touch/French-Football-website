import type { ArticleLanguage } from "@/types/news";

export function filterByLocale<T extends { language?: ArticleLanguage }>(
  items: T[],
  locale?: ArticleLanguage
): T[] {
  if (!locale) return items;
  return items.filter((item) => !item.language || item.language === locale);
}

export function normalizeLocale(locale?: string): ArticleLanguage {
  return locale === "en" ? "en" : "fr";
}
