import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getCountryById } from "@/lib/countries";
import { getAllArticles } from "@/lib/articles";
import { getMatchesFiltered } from "@/lib/football/services";
import TeamCrest from "@/components/ui/TeamCrest";
import RelativeTime from "@/components/ui/RelativeTime";

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "france" },
    { id: "senegal" },
    { id: "maroc" },
    { id: "cameroun" },
    { id: "cote-ivoire" },
    { id: "bresil" },
    { id: "argentine" },
    { id: "espagne" },
  ];
}

export default async function CountryHubPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = getDictionary(locale);
  const country = getCountryById(id, locale);

  if (!country) notFound();

  const [allNews, matches] = await Promise.all([
    getAllArticles({ locale }),
    getMatchesFiltered({ countryId: id }),
  ]);

  const news = allNews.filter(
    (a) =>
      a.tags?.includes(id) ||
      a.title.toLowerCase().includes(country.name.toLowerCase()) ||
      (id === "france" && a.category === "Équipe de France") ||
      (["senegal", "maroc", "cameroun", "cote-ivoire"].includes(id) && a.category === "Afrique")
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{country.flag}</span>
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-primary">
            {country.name}
          </h1>
          <p className="text-sm text-gray-500">{country.confederation}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg uppercase tracking-wide">{t.country.news}</h2>
        {news.length === 0 ? (
          <p className="text-sm text-gray-500">{t.news.noArticles}</p>
        ) : (
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
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg uppercase tracking-wide">{t.country.fixtures}</h2>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500">{t.matches.noMatches}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {matches.slice(0, 6).map((m) => (
              <Link
                key={m.id}
                href={localizedPath(locale, `matchs/${m.id}`)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md"
              >
                <TeamCrest name={m.homeTeam} logo={m.homeLogo} size={28} />
                <span className="flex-1 text-sm font-semibold">
                  {m.homeTeam} vs {m.awayTeam}
                </span>
                <TeamCrest name={m.awayTeam} logo={m.awayLogo} size={28} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
