"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchNews } from "@/store/features/newsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NewsFilters, { type NewsFilterCategory } from "./NewsFilters";
import FeaturedArticle from "./FeaturedArticle";
import NewsCard from "./NewsCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from "@/components/providers/LocaleProvider";

export default function NewsListingClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const locale = useLocale();
  const { articles, status, error } = useAppSelector((state) => state.news);
  const [category, setCategory] = useState<NewsFilterCategory>("Tous");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNews(locale));
    }
  }, [dispatch, status, locale]);

  const filtered = useMemo(() => {
    if (category === "Tous") return articles;
    return articles.filter((a) => a.category === category);
  }, [articles, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-2xl" />
        <Skeleton className="aspect-[21/9] w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchNews(locale))}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">{t.news.title}</h1>
      <NewsFilters active={category} onChange={setCategory} />

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">{t.news.noArticles}</p>
      ) : (
        <>
          {featured && <FeaturedArticle article={featured} />}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
