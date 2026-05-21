import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readLocalJSON } from "@/lib/data";
import type { Article } from "@/types/news";
import { formatRelativeFr } from "@/lib/utils/date";
import Badge from "@/components/ui/Badge";

import { localizedPath, type Locale } from "@/lib/i18n/config";

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const articles = readLocalJSON<Article[]>("news.json");
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const articles = readLocalJSON<Article[]>("news.json");
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  const backLabel = locale === "en" ? "← Back to news" : "← Retour aux actualités";

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={localizedPath(locale, "actualites")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        {backLabel}
      </Link>

      <Badge variant="featured" className="mb-4">
        {article.category}
      </Badge>

      <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
        {article.title}
      </h1>

      <p className="mt-4 text-sm text-gray-500">
        Par {article.author} · {formatRelativeFr(article.date)} · {article.readTime} min de lecture
      </p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-lg font-medium text-gray-700">{article.excerpt}</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p className="leading-relaxed text-gray-800">{article.body}</p>
      </div>
    </article>
  );
}
