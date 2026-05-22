"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMatchDetail,
  resetMatchDetail,
} from "@/store/features/matchDetailSlice";
import MatchScoreHeader from "./MatchScoreHeader";
import MatchEventTimeline from "./MatchEventTimeline";
import MatchLineups from "./MatchLineups";
import MatchStatsSection from "./MatchStatsSection";
import MatchH2H from "./MatchH2H";
import Tabs from "@/components/ui/Tabs";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

type Tab = "events" | "lineups" | "stats" | "h2h";

interface MatchDetailClientProps {
  matchId: string;
}

export default function MatchDetailClient({ matchId }: MatchDetailClientProps) {
  const dispatch = useAppDispatch();
  const lp = useLocalizedPath();
  const t = useTranslations();
  const { detail, status, error } = useAppSelector((s) => s.matchDetail);
  const [tab, setTab] = useState<Tab>("events");

  useEffect(() => {
    dispatch(resetMatchDetail());
    dispatch(fetchMatchDetail(matchId));
  }, [matchId, dispatch]);

  const tabs = [
    { id: "events", label: t.detail.match.events },
    { id: "lineups", label: t.detail.match.lineups },
    { id: "stats", label: t.detail.match.stats },
    { id: "h2h", label: t.detail.match.h2h },
  ];

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (status === "failed" || !detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-gray-500">{error ?? t.detail.match.notFound}</p>
        <Link href={lp("matchs")} className="mt-4 inline-block text-sm text-primary-light hover:underline">
          {t.common.back}
        </Link>
        <Button className="ml-4 mt-4" onClick={() => dispatch(fetchMatchDetail(matchId))}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href={lp("matchs")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        ← {t.nav.matches}
      </Link>

      <MatchScoreHeader match={detail} />

      <div className="mt-6 mb-4">
        <Tabs tabs={tabs} activeTab={tab} onChange={(id) => setTab(id as Tab)} />
      </div>

      {tab === "events" && (
        <MatchEventTimeline events={detail.events} homeTeam={detail.teams.home} />
      )}
      {tab === "lineups" && <MatchLineups lineups={detail.lineups} />}
      {tab === "stats" && <MatchStatsSection stats={detail.stats} />}
      {tab === "h2h" && <MatchH2H h2h={detail.h2h} />}
    </div>
  );
}
