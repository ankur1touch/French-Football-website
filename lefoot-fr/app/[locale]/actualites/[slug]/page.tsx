import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles, getRelatedArticles } from "@/lib/articles";
import SafeImage from "@/components/ui/SafeImage";
import Badge from "@/components/ui/Badge";
import Tag from "@/components/ui/Tag";
import ArticleBody from "@/components/news/ArticleBody";
import RelativeTime from "@/components/ui/RelativeTime";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const allArticles = await getAllArticles({ locale });
  const related = getRelatedArticles(allArticles, article);

  const backLabel =
    locale === "en" ? "← Back to news" : "← Retour aux actualités";

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 animate-fadeIn">
      <Link
        href={localizedPath(locale, "actualites")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        {backLabel}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="featured">{article.category}</Badge>
        {article.isWorldCup2026 && <Badge variant="wc">CDM 2026</Badge>}
        {article.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <h1 className="font-display text-4xl uppercase leading-tight tracking-wide text-gray-900 md:text-5xl">
        {article.title}
      </h1>

      <p className="mt-4 text-sm text-gray-500">
        {t.common.by} {article.author} · <RelativeTime date={article.publishedAt ?? article.date} /> ·{" "}
        {article.readTime} {t.common.minRead}
      </p>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
        <SafeImage
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-lg font-medium text-gray-700">{article.excerpt}</p>
      <ArticleBody content={article.body} />

      {article.sourceUrl && (
        <p className="mt-6">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            {locale === "en" ? "Read full article at source →" : "Lire l'article complet sur la source →"}
          </a>
        </p>
      )}

      {related.length > 0 && (
        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="font-display text-xl uppercase tracking-wide text-gray-900">
            {t.home.relatedArticles}
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={localizedPath(locale, `actualites/${r.slug}`)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
