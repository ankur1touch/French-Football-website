import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Badge from "@/components/ui/Badge";
import RelativeTime from "@/components/ui/RelativeTime";
import type { OnzeActuArticle } from "@/lib/onzeActuApi";
import { getArticleImage } from "@/lib/onzeActuApi";

interface OnzeActuArticleCardProps {
  article: OnzeActuArticle;
  variant?: "default" | "horizontal" | "compact";
  locale?: string;
}

export default function OnzeActuArticleCard({
  article,
  variant = "default",
  locale = "fr",
}: OnzeActuArticleCardProps) {
  const image = getArticleImage(article);
  const categoryLabel = article.category?.[0] ?? "";
  const href = `/${locale}/article/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className="group flex gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-gray-100">
          <SafeImage
            src={image}
            alt={article.title}
            fill
            sizes="112px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-3 group-hover:text-primary">
            {article.title}
          </h3>
          <RelativeTime
            date={article.createdAt}
            className="mt-1 text-xs text-gray-400"
          />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group block border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50 px-2 rounded"
      >
        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary">
          {article.title}
        </p>
        <RelativeTime
          date={article.createdAt}
          className="mt-0.5 text-xs text-gray-400"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-gray-100">
        <SafeImage
          src={image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        {categoryLabel && (
          <Badge variant="category" className="mb-2">
            {categoryLabel}
          </Badge>
        )}
        <h3 className="font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-primary">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {article.summary}
          </p>
        )}
        <RelativeTime
          date={article.createdAt}
          className="mt-2 block text-xs text-gray-400"
        />
      </div>
    </Link>
  );
}
