"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { formatRelative } from "@/lib/utils/date";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import SafeImage from "@/components/ui/SafeImage";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import type { NewsCategory } from "@/types/news";

export default function NewsGrid() {
  const { articles, status } = useAppSelector((state) => state.news);
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();

  const gridArticles = articles.slice(4, 8);

  function categoryLabel(cat: string) {
    const key = cat as NewsCategory | "Tous";
    return t.news.categories[key] ?? cat;
  }

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
          {t.home.latestNews}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
        {t.home.latestNews}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {gridArticles.map((article) => (
          <Link
            key={article.id}
            href={lp(`actualites/${article.slug}`)}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] bg-gray-100">
              <SafeImage
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
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
              <p className="mt-2 text-xs text-gray-500">
                {formatRelative(article.date, locale)} · {article.readTime} {t.common.minRead}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
