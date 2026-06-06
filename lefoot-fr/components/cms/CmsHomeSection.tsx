import Link from "next/link";
import Image from "next/image";
import { fetchOnzeActuHome } from "@/lib/onzeActuApi";
import { getArticleImage } from "@/lib/onzeActuApi";
import OnzeActuArticleCard from "@/components/cms/OnzeActuArticleCard";
import type { OnzeActuArticle } from "@/lib/onzeActuApi";

function HeroBanner({ article, locale }: { article: OnzeActuArticle; locale: string }) {
  const image = getArticleImage(article);
  const category = article.category?.[0] ?? "";

  return (
    <Link
      href={`/${locale}/article/${article.slug}`}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-video lg:h-96">
        <Image
          src={image}
          alt={article.title}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover opacity-70 transition-transform group-hover:scale-105"
          priority
          unoptimized={!image.startsWith("https://images.unsplash")}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {category && (
            <span className="mb-3 inline-block rounded-md bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              {category}
            </span>
          )}
          <h2 className="font-display text-2xl uppercase leading-tight tracking-wide text-white md:text-4xl line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="mt-2 text-sm text-gray-200 line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function CmsHomeSection({ locale = "fr" }: { locale?: string }) {
  const { data: articles } = await fetchOnzeActuHome({ limit: 9 });

  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Dernières actualités
        </h2>
        <Link
          href={`/${locale}/article`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir tout →
        </Link>
      </div>

      <HeroBanner article={hero} locale={locale} />

      {rest.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.slice(0, 8).map((article) => (
            <OnzeActuArticleCard key={article._id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
