"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/features/newsSlice";
import { fetchTeams } from "@/store/features/teamsSlice";
import { fetchPlayers } from "@/store/features/playersSlice";
import { fetchMatches } from "@/store/features/matchesSlice";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";
import SearchBar from "@/components/layout/SearchBar";
import Skeleton from "@/components/ui/Skeleton";

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function SearchClient() {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const dispatch = useAppDispatch();

  const news = useAppSelector((s) => s.news);
  const teams = useAppSelector((s) => s.teams);
  const players = useAppSelector((s) => s.players);
  const matches = useAppSelector((s) => s.matches);

  useEffect(() => {
    if (news.status === "idle") dispatch(fetchNews());
    if (teams.status === "idle") dispatch(fetchTeams());
    if (players.status === "idle") dispatch(fetchPlayers());
    if (matches.status === "idle") dispatch(fetchMatches());
  }, [dispatch, news.status, teams.status, players.status, matches.status]);

  const loading =
    news.status === "loading" ||
    teams.status === "loading" ||
    players.status === "loading" ||
    matches.status === "loading" ||
    news.status === "idle" ||
    teams.status === "idle" ||
    players.status === "idle" ||
    matches.status === "idle";

  const results = useMemo(() => {
    if (!query) {
      return { news: [], teams: [], players: [], matches: [] };
    }
    return {
      news: news.articles.filter(
        (a) =>
          matchesQuery(a.title, query) ||
          matchesQuery(a.excerpt, query) ||
          matchesQuery(a.category, query)
      ),
      teams: teams.teams.filter((team) => matchesQuery(team.name, query)),
      players: players.players.filter(
        (p) =>
          matchesQuery(p.name, query) ||
          matchesQuery(p.club, query) ||
          matchesQuery(p.nationality, query)
      ),
      matches: matches.matches.filter(
        (m) =>
          matchesQuery(m.homeTeam, query) ||
          matchesQuery(m.awayTeam, query) ||
          matchesQuery(m.competition, query)
      ),
    };
  }, [query, news.articles, teams.teams, players.players, matches.matches]);

  const total =
    results.news.length +
    results.teams.length +
    results.players.length +
    results.matches.length;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-primary">{t.search.title}</h1>
      <p className="mb-6 text-gray-500">{t.search.hint}</p>

      <div className="mb-8 max-w-xl">
        <SearchBar
          inputClassName="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {!query ? null : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : total === 0 ? (
        <p className="py-12 text-center text-gray-500">{t.search.noResults}</p>
      ) : (
        <div className="space-y-10">
          {results.news.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.news} ({results.news.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results.news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={lp(`actualites/${article.slug}`)}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">{article.title}</p>
                      <p className="text-sm text-gray-500">{article.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.teams.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.teams} ({results.teams.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results.teams.map((team) => (
                  <li key={team.id}>
                    <Link
                      href={lp(`equipes/${team.id}`)}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">{team.name}</p>
                      <p className="text-sm text-gray-500">{team.confederation}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.players.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.players} ({results.players.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results.players.map((player) => (
                  <li key={player.id}>
                    <Link
                      href={lp(`joueurs/${player.id}`)}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">{player.name}</p>
                      <p className="text-sm text-gray-500">
                        {player.position} · {player.club}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.matches.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.matches} ({results.matches.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results.matches.map((match) => (
                  <li key={match.id}>
                    <Link
                      href={lp("matchs")}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-sm text-gray-500">{match.competition}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
