"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/features/newsSlice";
import { fetchMatches } from "@/store/features/matchesSlice";
import { fetchRankings } from "@/store/features/rankingsSlice";
import { fetchTransfers } from "@/store/features/transfersSlice";
import { fetchLiveScores } from "@/store/features/livescoresSlice";
import { fetchPlayers } from "@/store/features/playersSlice";

export default function HomeBootstrap() {
  const dispatch = useAppDispatch();
  const newsStatus = useAppSelector((s) => s.news.status);
  const matchesStatus = useAppSelector((s) => s.matches.status);
  const rankingsStatus = useAppSelector((s) => s.rankings.status);
  const transfersStatus = useAppSelector((s) => s.transfers.status);
  const livescoresStatus = useAppSelector((s) => s.livescores.status);
  const playersStatus = useAppSelector((s) => s.players.status);

  useEffect(() => {
    if (newsStatus === "idle") dispatch(fetchNews());
    if (matchesStatus === "idle") dispatch(fetchMatches());
    if (rankingsStatus === "idle") dispatch(fetchRankings());
    if (transfersStatus === "idle") dispatch(fetchTransfers());
    if (livescoresStatus === "idle") dispatch(fetchLiveScores());
    if (playersStatus === "idle") dispatch(fetchPlayers());
  }, [
    dispatch,
    newsStatus,
    matchesStatus,
    rankingsStatus,
    transfersStatus,
    livescoresStatus,
    playersStatus,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchLiveScores());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
