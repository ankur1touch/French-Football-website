import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";
import { fetchAggregatedRSS } from "@/lib/rss";
import { rssToNewsItems } from "@/lib/rss-news";

export const revalidate = 300;

export async function POST(req: Request) {
  let category: string | undefined;
  let locale: string | undefined;

  try {
    const body = await req.json();
    category = body.category;
    locale = body.locale;
  } catch {
    /* empty body ok */
  }

  const [cmsArticles, rssItems] = await Promise.all([
    getAllArticles({ category, locale }),
    fetchAggregatedRSS().catch(() => []),
  ]);

  const rssArticles = rssToNewsItems(rssItems);
  const merged = [...cmsArticles, ...rssArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json(merged, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
