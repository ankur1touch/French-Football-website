"use client";

import Link from "next/link";
import type { Article } from "@/types/news";
import { formatRelative } from "@/lib/utils/date";
import Badge from "@/components/ui/Badge";
import SafeImage from "@/components/ui/SafeImage";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import type { NewsCategory } from "@/types/news";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();

  function categoryLabel(cat: string) {
    const key = cat as NewsCategory | "Tous";
    return t.news.categories[key] ?? cat;
  }

  return (
    <Link
      href={lp(`actualites/${article.slug}`)}
      className="group relative mb-8 block overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[21/9] bg-gray-900">
        <SafeImage
          src={article.image}
          alt={article.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Badge variant="featured" className="mb-3">
            {categoryLabel(article.category)}
          </Badge>
          <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            {article.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-200 line-clamp-2">
            {article.excerpt}
          </p>
          <p className="mt-3 text-sm text-gray-300">
            {t.common.by} {article.author} · {formatRelative(article.date, locale)} ·{" "}
            {article.readTime} {t.common.minRead}
          </p>
        </div>
      </div>
    </Link>
  );
}
