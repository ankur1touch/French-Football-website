import { readLocalJSON } from "@/lib/data";
import type { NewsItem, NewsCategory } from "@/types/news";
import { filterByLocale, normalizeLocale } from "@/lib/news-locale";
import { listMdxArticles, getMdxArticleBySlug } from "@/lib/cms-store";
import { listMongoArticles, getMongoArticleBySlug } from "@/lib/mongo";
import { slugToCategory } from "@/types/news";
import { getRssArticleBySlug } from "@/lib/rss-news";

function dedupeArticles(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function filterByCategory(items: NewsItem[], category?: string): NewsItem[] {
  const mapped = slugToCategory(category);
  if (!mapped) return items;
  if (category === "world-cup") {
    return items.filter((a) => a.isWorldCup2026 || a.category === "International");
  }
  return items.filter((a) => a.category === mapped);
}

export async function getAllArticles(options?: {
  category?: string;
  locale?: string;
}): Promise<NewsItem[]> {
  const locale = normalizeLocale(options?.locale);

  const [mongo, mdx, mock] = await Promise.all([
    listMongoArticles(),
    listMdxArticles(),
    Promise.resolve(readLocalJSON<NewsItem[]>("news.json").map(normalizeMockArticle)),
  ]);

  let merged = dedupeArticles([...mongo, ...mdx, ...mock]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  merged = filterByLocale(merged, locale);
  merged = filterByCategory(merged, options?.category);

  return merged;
}

function normalizeMockArticle(a: NewsItem): NewsItem {
  return {
    ...a,
    language: a.language ?? "fr",
    publishedAt: a.publishedAt ?? a.date,
    source: a.source ?? "mock",
  };
}

export async function getArticleBySlug(slug: string): Promise<NewsItem | null> {
  if (slug.startsWith("rss-")) {
    const rss = await getRssArticleBySlug(slug);
    if (rss) return rss;
  }

  const mongo = await getMongoArticleBySlug(slug);
  if (mongo) return mongo;

  const mdx = await getMdxArticleBySlug(slug);
  if (mdx) return mdx;

  const mock = readLocalJSON<NewsItem[]>("news.json");
  const found = mock.find((a) => a.slug === slug);
  return found ? normalizeMockArticle(found) : null;
}

export function getRelatedArticles(
  articles: NewsItem[],
  current: NewsItem,
  limit = 3
): NewsItem[] {
  return articles
    .filter((a) => a.slug !== current.slug && a.category === current.category)
    .slice(0, limit);
}

export type { NewsCategory };
