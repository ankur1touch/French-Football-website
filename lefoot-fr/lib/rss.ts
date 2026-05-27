import Parser from "rss-parser";
import type { NewsCategory, NewsCategorySlug } from "@/types/news";

type MediaNode = { $?: { url?: string; width?: string } };
type RssParserItem = Record<string, unknown>;

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
      "enclosure",
    ],
  },
});

export interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  categories?: string[];
  image?: string;
}

export interface AggregatedRSSItem extends RSSItem {
  sourceId: string;
  sourceName: string;
  category: NewsCategory;
  categorySlug: NewsCategorySlug;
  image?: string;
}

interface RSSSourceConfig {
  id: string;
  name: string;
  url: string;
  categorySlug: NewsCategorySlug;
  category: NewsCategory;
}

const RSS_SOURCES: RSSSourceConfig[] = [
  {
    id: "goal-fr",
    name: "Goal FR",
    url: process.env.NEXT_PUBLIC_RSS_GOAL_FR ?? "https://www.goal.com/feeds/fr/news",
    categorySlug: "international",
    category: "International",
  },
  {
    id: "bbc-football",
    name: "BBC Sport",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    categorySlug: "ligue-1",
    category: "International",
  },
  {
    id: "guardian-football",
    name: "The Guardian",
    url: "https://www.theguardian.com/football/rss",
    categorySlug: "ligue-1",
    category: "International",
  },
  {
    id: "espn-soccer",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/soccer/news",
    categorySlug: "champions",
    category: "Champions League",
  },
  {
    id: "90min",
    name: "90min",
    url: "https://www.90min.com/posts.rss",
    categorySlug: "international",
    category: "International",
  },
  {
    id: "sky-pl",
    name: "Sky Sports PL",
    url: "https://www.skysports.com/rss/12040",
    categorySlug: "ligue-1",
    category: "Ligue 1",
  },
];

const NON_FOOTBALL_KEYWORDS = [
  "cricket",
  "rugby",
  "tennis",
  "f1",
  "formula 1",
  "boxing",
  "golf",
  "nba",
  "nfl",
  "mlb",
  "cycling",
  "olympics",
];

const FOOTBALL_KEYWORDS = [
  "football",
  "foot",
  "soccer",
  "ligue",
  "premier league",
  "champions",
  "coupe du monde",
  "world cup",
  "mbappé",
  "mbappe",
  "psg",
  "marseille",
  "transfer",
  "transfert",
  "goal",
  "but ",
  "match",
  "fixture",
];

function mediaUrl(node: unknown): string | undefined {
  if (!node) return undefined;
  if (Array.isArray(node)) {
    for (const entry of node) {
      const url = mediaUrl(entry);
      if (url) return url;
    }
    return undefined;
  }
  if (typeof node === "object" && node !== null && "$" in node) {
    return (node as MediaNode).$?.url;
  }
  return undefined;
}

function extractImageFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function upgradeImageUrl(url: string): string {
  if (url.includes("ichef.bbci.co.uk")) {
    return url.replace(/\/standard\/\d+\//, "/standard/976/");
  }
  if (url.includes("i.guim.co.uk")) {
    try {
      const parsed = new URL(url);
      if (parsed.searchParams.has("width")) {
        parsed.searchParams.set("width", "800");
        return parsed.toString();
      }
    } catch {
      return url;
    }
  }
  return url;
}

function extractRssItemImage(item: RssParserItem): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  const candidates = [
    mediaUrl(item.mediaThumbnail),
    mediaUrl(item.mediaContent),
    enclosure?.url,
    extractImageFromHtml(item.contentEncoded as string | undefined),
  ].filter((url): url is string => typeof url === "string" && url.startsWith("http"));

  const url = candidates[0];
  return url ? upgradeImageUrl(url) : undefined;
}

async function fetchOgImage(url: string, timeoutMs = 2500): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LeFootFR/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return undefined;

    const html = await res.text();
    return (
      html.match(/property="og:image" content="([^"]+)"/i)?.[1] ??
      html.match(/content="([^"]+)" property="og:image"/i)?.[1] ??
      html.match(/name="twitter:image" content="([^"]+)"/i)?.[1]
    );
  } catch {
    return undefined;
  }
}

async function enrichItemsWithImages(items: AggregatedRSSItem[]): Promise<AggregatedRSSItem[]> {
  return Promise.all(
    items.map(async (item) => {
      if (item.image || !item.link) return item;
      const og = await fetchOgImage(item.link);
      return og ? { ...item, image: og } : item;
    })
  );
}

function normalizeCategories(categories: unknown): string[] {
  if (!Array.isArray(categories)) return [];
  return categories.map((c) => {
    if (typeof c === "string") return c;
    if (c && typeof c === "object" && "_" in c) return String((c as { _: string })._);
    return String(c);
  });
}

function isFootballRelated(item: RSSItem): boolean {
  const categoryText = normalizeCategories(item.categories).join(" ");
  const text = `${item.title ?? ""} ${item.contentSnippet ?? ""} ${categoryText}`.toLowerCase();
  if (NON_FOOTBALL_KEYWORDS.some((kw) => text.includes(kw))) return false;
  return FOOTBALL_KEYWORDS.some((kw) => text.includes(kw));
}

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      categories: normalizeCategories(item.categories),
      image: extractRssItemImage(item as RssParserItem),
    }));
  } catch {
    return [];
  }
}

async function fetchSourceWithTimeout(
  source: RSSSourceConfig,
  timeoutMs = 4000
): Promise<AggregatedRSSItem[]> {
  const items = await Promise.race([
    fetchRSSFeed(source.url),
    new Promise<RSSItem[]>((resolve) => setTimeout(() => resolve([]), timeoutMs)),
  ]);

  return enrichItemsWithImages(
    items
      .filter((item) => {
        try {
          return isFootballRelated(item);
        } catch {
          return true;
        }
      })
      .slice(0, 8)
      .map((item) => ({
        ...item,
        sourceId: source.id,
        sourceName: source.name,
        category: source.category,
        categorySlug: source.categorySlug,
      }))
  );
}

export async function fetchAggregatedRSS(): Promise<AggregatedRSSItem[]> {
  try {
    const results = await Promise.all(RSS_SOURCES.map((s) => fetchSourceWithTimeout(s)));
    const flat = results.flat();

    const seen = new Set<string>();
    return flat.filter((item) => {
      const key = (item.title ?? "").toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}
