"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTeams } from "@/store/features/teamsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import TeamCard from "./TeamCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function TeamsClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { teams, status, error } = useAppSelector((state) => state.teams);
  const [confederation, setConfederation] = useState("Toutes");
  const [search, setSearch] = useState("");

  const confederationTabs = [
    { id: "Toutes", label: t.common.all },
    { id: "UEFA", label: "UEFA" },
    { id: "CAF", label: "CAF" },
    { id: "CONMEBOL", label: "CONMEBOL" },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTeams());
    }
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    return teams.filter((team) => {
      const confMatch = confederation === "Toutes" || team.confederation === confederation;
      const searchMatch = team.name.toLowerCase().includes(search.toLowerCase());
      return confMatch && searchMatch;
    });
  }, [teams, confederation, search]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchTeams())}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">{t.teams.title}</h1>
      <Tabs
        tabs={confederationTabs}
        activeTab={confederation}
        onChange={setConfederation}
        className="mb-4"
      />
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="teams-search"
          name="teams-search"
          type="search"
          placeholder={t.teams.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">{t.teams.noTeams}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
