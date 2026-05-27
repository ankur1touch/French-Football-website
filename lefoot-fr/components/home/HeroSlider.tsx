"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import RelativeTime from "@/components/ui/RelativeTime";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import type { Article, NewsCategory } from "@/types/news";

interface HeroSliderProps {
  articles: Article[];
  loading?: boolean;
}

export default function HeroSlider({ articles, loading }: HeroSliderProps) {
  const [slide, setSlide] = useState(0);
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();

  const slides = articles.slice(0, 3);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function categoryLabel(cat: string) {
    const key = cat as NewsCategory | "Tous";
    return t.news.categories[key] ?? cat;
  }

  if (loading) {
    return <Skeleton className="aspect-[16/9] w-full rounded-2xl lg:h-96" />;
  }

  if (!slides.length) return null;

  const current = slides[slide];

  return (
    <section className="relative overflow-hidden rounded-2xl hero-gradient">
      <Link href={lp(`actualites/${current.slug}`)} className="group block">
        <div className="relative aspect-[16/9] lg:h-96">
          <SafeImage
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover opacity-60 transition-transform group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge variant="featured" className="mb-3">
              {categoryLabel(current.category)}
            </Badge>
            <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-white md:text-5xl">
              {current.title}
            </h1>
            <p className="mt-2 text-sm text-gray-200">
              {t.common.by} {current.author} ·{" "}
              <RelativeTime date={current.publishedAt ?? current.date} /> · {current.readTime}{" "}
              {t.common.minRead}
            </p>
          </div>
        </div>
      </Link>

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === slide ? "bg-gold" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
