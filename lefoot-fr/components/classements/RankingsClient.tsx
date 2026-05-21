"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRankings } from "@/store/features/rankingsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import StandingsTable from "@/components/competitions/StandingsTable";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function RankingsClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { ligue1, championsLeague, groups, leagueName, status, error } =
    useAppSelector((state) => state.rankings);
  const [activeGroup, setActiveGroup] = useState("0");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRankings());
    }
  }, [dispatch, status]);

  const groupTabs = useMemo(() => {
    if (groups?.length) {
      return groups.map((g, i) => ({ id: String(i), label: g.name }));
    }
    return [
      { id: "ligue1", label: leagueName || "Group A" },
      { id: "championsLeague", label: "Group B" },
    ];
  }, [groups, leagueName]);

  const standings = useMemo(() => {
    if (groups?.length) {
      return groups[Number(activeGroup)]?.rows ?? [];
    }
    return activeGroup === "ligue1" ? ligue1 : (championsLeague ?? []);
  }, [groups, activeGroup, ligue1, championsLeague]);

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <Skeleton className="mb-6 h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchRankings())}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-primary">{t.rankings.title}</h1>
      <p className="mb-6 text-gray-500">
        {leagueName ?? t.rankings.subtitle} · {t.rankings.subtitle}
      </p>
      <Tabs
        tabs={groupTabs}
        activeTab={activeGroup}
        onChange={setActiveGroup}
        className="mb-6 flex-wrap"
      />
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
