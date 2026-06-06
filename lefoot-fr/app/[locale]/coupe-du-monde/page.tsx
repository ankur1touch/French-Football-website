import CmsArticleList from "@/components/cms/CmsArticleList";
import { OnzeActuEndpoint } from "@/lib/onzeActuApi";
import Badge from "@/components/ui/Badge";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const revalidate = 60;

const HOST_CITIES = [
  "New York",
  "Los Angeles",
  "Mexico City",
  "Toronto",
  "Dallas",
  "Miami",
  "Atlanta",
  "Seattle",
];

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function WorldCupPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const t = getDictionary(locale);

  return (
    <div className="animate-fadeIn">
      <section className="hero-gradient px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <Badge variant="wc" className="mb-4">
            CDM 2026
          </Badge>
          <h1 className="font-display text-5xl uppercase tracking-wider md:text-6xl">
            {t.worldCup.title}
          </h1>
          <p className="mt-4 text-lg text-white/80">{t.worldCup.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <span className="text-4xl">🏆</span>
            <h2 className="mt-2 font-display text-lg uppercase">{t.worldCup.trophy}</h2>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <span className="text-4xl">🍁</span>
            <h2 className="mt-2 font-display text-lg uppercase">{t.worldCup.mascot}</h2>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-lg uppercase text-gray-800">
              {t.worldCup.hostCities}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HOST_CITIES.map((city) => (
                <li key={city}>
                  <Badge variant="muted">{city}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CmsArticleList
          endpoint={OnzeActuEndpoint.CoupeDuMonde}
          title={t.worldCup.news}
          page={currentPage}
          limit={20}
          basePath={`/${locale}/coupe-du-monde`}
        />
      </div>
    </div>
  );
}
