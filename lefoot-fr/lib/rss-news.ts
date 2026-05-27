import { fetchAggregatedRSS, type AggregatedRSSItem } from "@/lib/rss";
import { FALLBACK_NEWS_IMAGE } from "@/lib/image-hosts";
import type { NewsItem } from "@/types/news";

export function rssToNewsItems(items: AggregatedRSSItem[]): NewsItem[] {
  return items.map((item, i) => ({
    id: `rss-${item.sourceId}-${i}`,
    slug: `rss-${item.sourceId}-${i}`,
    title: item.title ?? "Sans titre",
    category: item.category,
    image: item.image ?? FALLBACK_NEWS_IMAGE,
    excerpt: item.contentSnippet ?? "",
    body: item.contentSnippet ?? "",
    date: item.pubDate ?? new Date().toISOString(),
    publishedAt: item.pubDate ?? new Date().toISOString(),
    author: item.sourceName ?? "RSS",
    readTime: 3,
    language: "fr" as const,
    source: item.sourceName,
    sourceUrl: item.link,
    tags: [item.categorySlug],
  }));
}

export async function getRssArticles(): Promise<NewsItem[]> {
  const items = await fetchAggregatedRSS().catch(() => []);
  return rssToNewsItems(items);
}

export async function getRssArticleBySlug(slug: string): Promise<NewsItem | null> {
  if (!slug.startsWith("rss-")) return null;
  const articles = await getRssArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
