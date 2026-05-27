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

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
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
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-gray-100">
        <SafeImage
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <Badge variant="category" className="mb-2">
          {categoryLabel(article.category)}
        </Badge>
        <h3 className="font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
        <p className="mt-2 text-xs text-gray-400">
          {formatRelative(article.date, locale)} · {article.readTime} {t.common.minRead}
        </p>
      </div>
    </Link>
  );
}
