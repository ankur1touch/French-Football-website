"use client";

import { useEffect, useMemo } from "react";
import { fetchNews } from "@/store/features/newsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NewsCard from "@/components/news/NewsCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

const convocations = [
  { name: "Kylian Mbappé", club: "PSG", position: "Attaquant" },
  { name: "Antoine Griezmann", club: "Atlético Madrid", position: "Attaquant" },
  { name: "Aurélien Tchouaméni", club: "Real Madrid", position: "Milieu" },
  { name: "William Saliba", club: "Arsenal", position: "Défenseur" },
  { name: "Mike Maignan", club: "AC Milan", position: "Gardien" },
  { name: "Ousmane Dembélé", club: "PSG", position: "Attaquant" },
  { name: "N'Golo Kanté", club: "Al-Ittihad", position: "Milieu" },
  { name: "Jules Koundé", club: "Barcelone", position: "Défenseur" },
];

import { useLocale } from "@/components/providers/LocaleProvider";

export default function EquipeDeFranceClient() {
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const { articles, status, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNews(locale));
    }
  }, [dispatch, status, locale]);

  const fraNews = useMemo(
    () => articles.filter((a) => a.category === "Équipe de France"),
    [articles]
  );

  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchNews(locale))}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-primary">Équipe de France</h1>
      <p className="mb-8 text-gray-600">
        Actualités et convocations des Bleus
      </p>

      <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Convocations Euro 2026
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {convocations.map((player) => (
            <div
              key={player.name}
              className="flex items-center justify-between rounded-lg bg-surface px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-500">{player.club}</p>
              </div>
              <span className="text-xs font-medium text-primary-light">
                {player.position}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-gray-900">Actualités</h2>
      {fraNews.length === 0 ? (
        <p className="text-gray-500">Aucune actualité disponible.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fraNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
