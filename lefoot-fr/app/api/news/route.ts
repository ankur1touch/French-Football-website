import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { fetchRSSFeed } from "@/lib/rss";
import type { Article } from "@/types/news";

export const revalidate = 300;

function readLocalJSON<T>(filename: string): T {
  const filePath = join(process.cwd(), "data", filename);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export async function POST() {
  const mockNews = readLocalJSON<Article[]>("news.json");

  const rssUrl = process.env.NEXT_PUBLIC_RSS_GOAL_FR;
  if (rssUrl) {
    const rssItems = await Promise.race([
      fetchRSSFeed(rssUrl),
      new Promise<Awaited<ReturnType<typeof fetchRSSFeed>>>((resolve) =>
        setTimeout(() => resolve([]), 3000)
      ),
    ]);
    const rssArticles: Article[] = rssItems.slice(0, 5).map((item, i) => ({
      id: `rss-${i}`,
      slug: `rss-${i}`,
      title: item.title ?? "Sans titre",
      category: "International" as const,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
      excerpt: item.contentSnippet ?? "",
      body: item.contentSnippet ?? "",
      date: item.pubDate ?? new Date().toISOString(),
      author: "RSS",
      readTime: 3,
    }));
    return NextResponse.json([...mockNews, ...rssArticles]);
  }

  return NextResponse.json(mockNews);
}
