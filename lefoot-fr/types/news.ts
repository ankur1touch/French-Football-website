export type NewsCategory =
  | "Ligue 1"
  | "Champions League"
  | "Transferts"
  | "Équipe de France"
  | "Afrique"
  | "International"
  | "Analyse";

export type NewsCategorySlug =
  | "ligue-1"
  | "champions"
  | "world-cup"
  | "transferts"
  | "equipe-de-france"
  | "afrique"
  | "analyse"
  | "international";

export type ArticleLanguage = "fr" | "en";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  image: string;
  excerpt: string;
  body: string;
  date: string;
  author: string;
  readTime: number;
  language?: ArticleLanguage;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  publishedAt?: string;
  isWorldCup2026?: boolean;
}

export interface NewsItem extends Article {
  language: ArticleLanguage;
  publishedAt: string;
}

export const CATEGORY_SLUG_MAP: Record<NewsCategorySlug, NewsCategory | "all"> = {
  "ligue-1": "Ligue 1",
  champions: "Champions League",
  "world-cup": "International",
  transferts: "Transferts",
  "equipe-de-france": "Équipe de France",
  afrique: "Afrique",
  analyse: "Analyse",
  international: "International",
};

export function slugToCategory(slug?: string): NewsCategory | null {
  if (!slug || slug === "all") return null;
  const mapped = CATEGORY_SLUG_MAP[slug as NewsCategorySlug];
  return mapped === "all" || !mapped ? null : mapped;
}
