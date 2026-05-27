import { mkdir, writeFile, readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import type { NewsItem } from "@/types/news";
import { payloadToArticleFields, type CmsPublishPayload } from "./cms-payload";

const CONTENT_DIR = join(process.cwd(), "content", "articles");

function mapFrontmatterToNewsItem(
  slug: string,
  data: Record<string, unknown>,
  content: string
): NewsItem {
  return {
    id: `mdx-${slug}`,
    slug,
    title: String(data.title ?? slug),
    category: (data.category as NewsItem["category"]) ?? "International",
    image: String(data.image ?? data.imageUrl ?? ""),
    excerpt: String(data.excerpt ?? data.description ?? content.slice(0, 160)),
    body: content,
    date: String(data.date ?? data.publishedAt ?? new Date().toISOString()),
    publishedAt: String(data.publishedAt ?? data.date ?? new Date().toISOString()),
    author: String(data.author ?? "LeFootFR"),
    readTime: Number(data.readTime ?? Math.max(1, Math.ceil(content.split(/\s+/).length / 200))),
    language: (data.language as NewsItem["language"]) ?? "fr",
    tags: (data.tags as string[]) ?? [],
    source: "cms",
    isWorldCup2026: Boolean(data.isWorldCup2026),
  };
}

export async function writeMdxArticle(payload: CmsPublishPayload): Promise<NewsItem> {
  const fields = payloadToArticleFields(payload);
  await mkdir(CONTENT_DIR, { recursive: true });

  const filename = `${fields.slug}.mdx`;
  const frontmatter = {
    title: fields.title,
    slug: fields.slug,
    category: fields.category,
    image: fields.image,
    excerpt: fields.excerpt,
    author: fields.author,
    language: fields.language,
    tags: fields.tags,
    publishedAt: fields.publishedAt,
    isWorldCup2026: fields.isWorldCup2026,
    readTime: fields.readTime,
  };

  const fileContent = matter.stringify(fields.body, frontmatter);
  await writeFile(join(CONTENT_DIR, filename), fileContent, "utf-8");

  return mapFrontmatterToNewsItem(fields.slug, frontmatter, fields.body);
}

export async function listMdxArticles(): Promise<NewsItem[]> {
  try {
    const files = await readdir(CONTENT_DIR);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const articles = await Promise.all(
      mdxFiles.map(async (file) => {
        const raw = await readFile(join(CONTENT_DIR, file), "utf-8");
        const { data, content } = matter(raw);
        const slug = String(data.slug ?? file.replace(/\.mdx?$/, ""));
        return mapFrontmatterToNewsItem(slug, data as Record<string, unknown>, content);
      })
    );

    return articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function getMdxArticleBySlug(slug: string): Promise<NewsItem | null> {
  const articles = await listMdxArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function countMdxArticles(): Promise<number> {
  const articles = await listMdxArticles();
  return articles.length;
}
