import { NextResponse } from "next/server";
import { verifyCmsToken, cmsAuthRequired } from "@/lib/cms-auth";
import { normalizeCmsPayload, payloadToArticleFields } from "@/lib/cms-payload";
import { writeMdxArticle } from "@/lib/cms-store";
import { insertMongoArticle, countMongoArticles } from "@/lib/mongo";
import { countMdxArticles } from "@/lib/cms-store";
import type { NewsItem } from "@/types/news";

export async function GET(req: Request) {
  if (cmsAuthRequired() && !verifyCmsToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [mdxCount, mongoCount] = await Promise.all([countMdxArticles(), countMongoArticles()]);
  const storage = process.env.MONGODB_URI ? "mongodb" : "mdx";

  return NextResponse.json({
    status: "ok",
    storage,
    counts: { mdx: mdxCount, mongo: mongoCount, total: mdxCount + mongoCount },
  });
}

export async function POST(req: Request) {
  if (cmsAuthRequired() && !verifyCmsToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await req.json();
    const langHeader = req.headers.get("x-language");
    if (langHeader === "fr" || langHeader === "en") {
      raw.language = langHeader;
    }

    const payload = normalizeCmsPayload(raw);
    const fields = payloadToArticleFields(payload);

    const article: NewsItem = {
      id: `cms-${fields.slug}`,
      slug: fields.slug,
      title: fields.title,
      category: fields.category as NewsItem["category"],
      image: fields.image,
      excerpt: fields.excerpt,
      body: fields.body,
      date: fields.publishedAt,
      publishedAt: fields.publishedAt,
      author: fields.author,
      readTime: fields.readTime,
      language: fields.language,
      tags: fields.tags,
      source: "cms",
      isWorldCup2026: fields.isWorldCup2026,
    };

    let storage: "mongodb" | "mdx" = "mdx";
    if (process.env.MONGODB_URI) {
      await insertMongoArticle(article);
      storage = "mongodb";
    } else {
      await writeMdxArticle(payload);
    }

    return NextResponse.json(
      { id: article.id, slug: article.slug, status: "ok", success: true, storage },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
