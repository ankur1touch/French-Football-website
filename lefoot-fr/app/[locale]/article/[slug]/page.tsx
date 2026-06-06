import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { fetchOnzeActuArticleBySlug, getArticleImage } from "@/lib/onzeActuApi";
import Badge from "@/components/ui/Badge";
import RelativeTime from "@/components/ui/RelativeTime";
import CmsArticleBody from "@/components/cms/CmsArticleBody";

export const revalidate = 300;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchOnzeActuArticleBySlug(slug);
  if (!article) return {};
  const image = getArticleImage(article);

  return {
    title: article.title,
    description: article.summary || article.description,
    openGraph: {
      title: article.title,
      description: article.summary || article.description,
      images: image ? [{ url: image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || article.description,
      images: image ? [image] : [],
    },
  };
}

export default async function CmsArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = await fetchOnzeActuArticleBySlug(slug);

  if (!article) notFound();

  const image = getArticleImage(article);
  const categories = article.category ?? [];
  const tags = article.tags ?? [];
  const backHref = `/${locale}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 animate-fadeIn">
      <Link
        href={backHref}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        ← Retour à l'accueil
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <Badge key={cat} variant="featured">
            {cat}
          </Badge>
        ))}
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-gray-900 md:text-4xl">
        {article.title}
      </h1>

      <p className="mt-3 text-sm text-gray-500">
        <RelativeTime date={article.createdAt} />
      </p>

      <div className="relative mt-6 aspect-video overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
          unoptimized={!image.startsWith("https://images.unsplash")}
        />
      </div>

      {article.summary && (
        <p className="mt-6 text-lg font-medium leading-relaxed text-gray-700">
          {article.summary}
        </p>
      )}

      <CmsArticleBody content={article.content || article.description} />
    </article>
  );
}
