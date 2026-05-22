"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMatches } from "@/store/features/matchesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import MatchCard from "./MatchCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import type { MatchStatus } from "@/types/match";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function MatchesClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { matches, status, error } = useAppSelector((state) => state.matches);
  const [activeStatus, setActiveStatus] = useState<MatchStatus>("upcoming");
  const [competition, setCompetition] = useState("__all__");

  const statusTabs = [
    { id: "live", label: t.matches.tabs.live },
    { id: "upcoming", label: t.matches.tabs.upcoming },
    { id: "finished", label: t.matches.tabs.finished },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMatches());
    }
  }, [dispatch, status]);

  const competitions = useMemo(() => {
    const set = new Set(matches.map((m) => m.competition));
    return ["__all__", ...Array.from(set)];
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const statusMatch = m.status === activeStatus;
      const compMatch = competition === "__all__" || m.competition === competition;
      return statusMatch && compMatch;
    });
  }, [matches, activeStatus, competition]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchMatches())}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">{t.matches.title}</h1>

      <Tabs
        tabs={statusTabs}
        activeTab={activeStatus}
        onChange={(id) => setActiveStatus(id as MatchStatus)}
        className="mb-4"
      />

      <select
        value={competition}
        onChange={(e) => setCompetition(e.target.value)}
        className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {competitions.map((c) => (
          <option key={c} value={c}>
            {c === "__all__" ? t.matches.allCompetitions : c}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          {activeStatus === "finished" ? t.matches.noFinished : t.matches.noMatches}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
