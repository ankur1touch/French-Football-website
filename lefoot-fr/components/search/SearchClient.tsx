"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSearch, resetSearch } from "@/store/features/searchSlice";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";
import SearchBar from "@/components/layout/SearchBar";
import Skeleton from "@/components/ui/Skeleton";

export default function SearchClient() {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const dispatch = useAppDispatch();
  const { results, status } = useAppSelector((s) => s.search);

  useEffect(() => {
    if (!query) {
      dispatch(resetSearch());
      return;
    }
    dispatch(fetchSearch(query));
  }, [query, dispatch]);

  const loading = status === "loading" || status === "idle";
  const total = results
    ? results.news.length +
      results.teams.length +
      results.players.length +
      results.matches.length
    : 0;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide text-primary">
        {t.search.title}
      </h1>
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
          {results!.news.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.news} ({results!.news.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results!.news.map((article) => (
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

          {results!.teams.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.teams} ({results!.teams.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results!.teams.map((team) => (
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

          {results!.players.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.players} ({results!.players.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results!.players.map((player) => (
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

          {results!.matches.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                {t.search.sections.matches} ({results!.matches.length})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                {results!.matches.map((match) => (
                  <li key={match.id}>
                    <Link
                      href={lp(`matchs/${match.id}`)}
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
