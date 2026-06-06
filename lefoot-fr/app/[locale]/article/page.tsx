import CmsArticleList from "@/components/cms/CmsArticleList";
import { OnzeActuEndpoint } from "@/lib/onzeActuApi";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticleIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <CmsArticleList
        endpoint={OnzeActuEndpoint.HomePage}
        title="Toutes les actualités"
        page={currentPage}
        limit={20}
        basePath={`/${locale}/article`}
        locale={locale}
      />
    </div>
  );
}
