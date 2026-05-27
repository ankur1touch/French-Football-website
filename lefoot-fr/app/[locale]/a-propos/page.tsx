import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface StaticPageProps {
  params: Promise<{ locale: Locale }>;
}

function StaticPageContent({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fadeIn">
      <h1 className="font-display text-4xl uppercase tracking-wide text-primary">{title}</h1>
      <p className="mt-6 leading-relaxed text-gray-700">{body}</p>
    </div>
  );
}

export default async function AboutPage({ params }: StaticPageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return <StaticPageContent title={t.staticPages.aboutTitle} body={t.staticPages.aboutBody} />;
}
