"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTournaments } from "@/store/features/tournamentsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import TournamentCard from "./TournamentCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function TournamentsClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { tournaments, status, error } = useAppSelector((state) => state.tournaments);
  const [category, setCategory] = useState("Toutes");

  const categoryTabs = [
    { id: "Toutes", label: t.common.all },
    { id: "Domestique", label: t.nav.news === "News" ? "Domestic" : "Domestique" },
    { id: "Continental", label: "Continental" },
    { id: "International", label: "International" },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTournaments());
    }
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    if (category === "Toutes") return tournaments;
    return tournaments.filter((item) => item.category === category);
  }, [tournaments, category]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchTournaments())}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">{t.competitions.title}</h1>
      <Tabs
        tabs={categoryTabs}
        activeTab={category}
        onChange={setCategory}
        className="mb-6"
      />
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">{t.competitions.noCompetitions}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <TournamentCard key={item.id} tournament={item} />
          ))}
        </div>
      )}
    </div>
  );
}
