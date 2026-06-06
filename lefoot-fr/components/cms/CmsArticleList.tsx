import Link from "next/link";
import { fetchOnzeActuArticlesByEndpoint } from "@/lib/onzeActuApi";
import type { OnzeActuEndpoint } from "@/lib/onzeActuApi";
import OnzeActuArticleCard from "@/components/cms/OnzeActuArticleCard";

interface CmsArticleListProps {
  endpoint: OnzeActuEndpoint;
  title: string;
  page?: number;
  limit?: number;
  basePath: string;
  locale?: string;
}

export default async function CmsArticleList({
  endpoint,
  title,
  page = 1,
  limit = 20,
  basePath,
  locale = "fr",
}: CmsArticleListProps) {
  const { data: articles, meta } = await fetchOnzeActuArticlesByEndpoint(
    endpoint,
    { page, limit }
  );

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl uppercase tracking-wide text-gray-900">
        {title}
      </h1>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center">
          <span className="text-4xl">⚽</span>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Aucun article disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <OnzeActuArticleCard key={article._id} article={article} locale={locale} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`${basePath}?page=${page - 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Précédent
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Page {meta.currentPage} / {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <Link
              href={`${basePath}?page=${page + 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Suivant →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
