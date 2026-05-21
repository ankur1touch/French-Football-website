"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { formatRelative } from "@/lib/utils/date";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import type { NewsCategory } from "@/types/news";

export default function HeroSection() {
  const { articles, status } = useAppSelector((state) => state.news);
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();

  function categoryLabel(cat: string) {
    const key = cat as NewsCategory | "Tous";
    return t.news.categories[key] ?? cat;
  }

  if (status === "loading" || status === "idle") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2 lg:h-96" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </section>
    );
  }

  const hero = articles[0];
  const sideArticles = articles.slice(1, 4);

  if (!hero) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href={lp(`actualites/${hero.slug}`)}
          className="group relative overflow-hidden rounded-lg lg:col-span-2"
        >
          <div className="relative aspect-[16/9] lg:aspect-auto lg:h-96">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant="featured" className="mb-3">
                {categoryLabel(hero.category)}
              </Badge>
              <h1 className="text-xl font-bold leading-tight text-white md:text-2xl lg:text-3xl">
                {hero.title}
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                {t.common.by} {hero.author} · {formatRelative(hero.date, locale)} ·{" "}
                {hero.readTime} {t.common.minRead}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={lp(`actualites/${article.slug}`)}
              className="flex flex-col gap-1 p-4 transition-colors hover:bg-gray-50"
            >
              <Badge variant="category">{categoryLabel(article.category)}</Badge>
              <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
                {article.title}
              </h3>
              <span className="text-xs text-gray-500">
                {formatRelative(article.date, locale)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
