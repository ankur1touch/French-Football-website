"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPlayers } from "@/store/features/playersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tabs from "@/components/ui/Tabs";
import PlayerCard from "./PlayerCard";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useTranslations } from "@/components/providers/LocaleProvider";

const positionIds = ["Tous", "Attaquant", "Milieu", "Défenseur", "Gardien"] as const;

export default function PlayersClient() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { players, status, error } = useAppSelector((state) => state.players);
  const [position, setPosition] = useState("Tous");
  const [search, setSearch] = useState("");

  const positionTabs = positionIds.map((id) => ({
    id,
    label: t.players.positions[id] ?? id,
  }));

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPlayers());
    }
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const posMatch = position === "Tous" || p.position === position;
      const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
      return posMatch && searchMatch;
    });
  }, [players, position, search]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">{error ?? t.common.loadError}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchPlayers())}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-primary">{t.players.title}</h1>
      <Tabs
        tabs={positionTabs}
        activeTab={position}
        onChange={setPosition}
        className="mb-4"
      />
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="players-search"
          name="players-search"
          type="search"
          placeholder={t.players.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">{t.players.noPlayers}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
