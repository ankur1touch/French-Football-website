import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchTournamentWithFallback,
  listTournamentIds,
} from "@/lib/football/server-data";
import StandingsTable from "@/components/competitions/StandingsTable";
import TopScorersTable from "@/components/competitions/TopScorersTable";
import { format } from "date-fns";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { enUS, fr as frLocale } from "date-fns/locale";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const ids = await listTournamentIds();
  return ids.map((id) => ({ id }));
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const tournament = await fetchTournamentWithFallback(id);
  const dict = getDictionary(locale);
  const dateLocale = locale === "en" ? enUS : frLocale;

  if (!tournament) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href={localizedPath(locale, "competitions")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        {locale === "en" ? "← Back to competitions" : "← Retour aux compétitions"}
      </Link>

      <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-lg">
        <Image
          src={tournament.image}
          alt={tournament.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <span className="text-xs font-medium uppercase text-gold">{tournament.category}</span>
          <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
          <p className="mt-1 text-sm text-gray-200">
            {format(new Date(tournament.startDate), "d MMM yyyy", { locale: dateLocale })} —{" "}
            {format(new Date(tournament.endDate), "d MMM yyyy", { locale: dateLocale })} · {tournament.host}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{dict.competitions.groupStandings}</h2>
          {tournament.groups?.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tournament.groups.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-2 text-sm font-semibold text-primary">{group.name}</h3>
                  <StandingsTable standings={group.standings} />
                </div>
              ))}
            </div>
          ) : (
            <StandingsTable standings={tournament.standings} />
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{dict.competitions.topScorers}</h2>
          <TopScorersTable scorers={tournament.topScorers} />
        </div>
      </div>
    </div>
  );
}
