import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getAllArticles } from "@/lib/articles";
import { getMatchesFiltered } from "@/lib/football/services";
import Badge from "@/components/ui/Badge";
import RelativeTime from "@/components/ui/RelativeTime";
import TeamCrest from "@/components/ui/TeamCrest";

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
}

export default async function WorldCupPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const [news, matches] = await Promise.all([
    getAllArticles({ category: "world-cup", locale }),
    getMatchesFiltered({ tab: "upcoming" }),
  ]);

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
            <h2 className="font-display text-lg uppercase text-gray-800">{t.worldCup.hostCities}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HOST_CITIES.map((city) => (
                <li key={city}>
                  <Badge variant="muted">{city}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl uppercase tracking-wide">{t.worldCup.fixtures}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.slice(0, 6).map((m) => (
              <Link
                key={m.id}
                href={localizedPath(locale, `matchs/${m.id}`)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md"
              >
                <TeamCrest name={m.homeTeam} logo={m.homeLogo} size={28} />
                <span className="text-sm font-semibold">
                  {m.homeTeam} vs {m.awayTeam}
                </span>
                <TeamCrest name={m.awayTeam} logo={m.awayLogo} size={28} />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl uppercase tracking-wide">{t.worldCup.news}</h2>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {news.slice(0, 8).map((a) => (
              <li key={a.id}>
                <Link
                  href={localizedPath(locale, `actualites/${a.slug}`)}
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <RelativeTime date={a.publishedAt ?? a.date} className="text-xs text-gray-500" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
