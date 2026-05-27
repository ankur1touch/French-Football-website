import { z } from "zod";

export const cmsPublishSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1),
  summary: z.string().optional(),
  language: z.enum(["fr", "en"]).default("fr"),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  competition: z.string().optional(),
  isWorldCup2026: z.boolean().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export type CmsPublishPayload = z.infer<typeof cmsPublishSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function normalizeCmsPayload(raw: unknown): CmsPublishPayload {
  return cmsPublishSchema.parse(raw);
}

export function payloadToArticleFields(payload: CmsPublishPayload) {
  const slug = payload.slug?.trim() || slugify(payload.title);
  const excerpt = payload.description ?? payload.summary ?? payload.content.slice(0, 160);
  const publishedAt = payload.publishedAt ?? new Date().toISOString();
  const category =
    payload.tags?.includes("transferts") || payload.tags?.includes("transfers")
      ? "Transferts"
      : payload.isWorldCup2026
        ? "International"
        : payload.competition?.includes("Champions")
          ? "Champions League"
          : payload.competition?.includes("Ligue")
            ? "Ligue 1"
            : payload.competition?.includes("France")
              ? "Équipe de France"
              : payload.competition?.includes("Afrique")
                ? "Afrique"
                : "International";

  return {
    slug,
    title: payload.title,
    excerpt,
    body: payload.content,
    category,
    image: payload.imageUrl ?? "",
    author: payload.author ?? "LeFootFR",
    language: payload.language,
    tags: payload.tags ?? [],
    publishedAt,
    isWorldCup2026: payload.isWorldCup2026 ?? false,
    readTime: Math.max(1, Math.ceil(payload.content.split(/\s+/).length / 200)),
    meta: payload.meta ?? {},
  };
}
