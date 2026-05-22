"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTeamDetail,
  resetTeamDetail,
} from "@/store/features/teamDetailSlice";
import TeamHeaderCard from "./TeamHeaderCard";
import TeamLeaguePosition from "./TeamLeaguePosition";
import TeamSquadList from "./TeamSquadList";
import TeamFixturesList from "./TeamFixturesList";
import Tabs from "@/components/ui/Tabs";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

type Tab = "squad" | "fixtures" | "results";

interface TeamDetailClientProps {
  teamId: string;
}

export default function TeamDetailClient({ teamId }: TeamDetailClientProps) {
  const dispatch = useAppDispatch();
  const lp = useLocalizedPath();
  const t = useTranslations();
  const { team, squad, fixtures, results, standings, status, error } =
    useAppSelector((s) => s.teamDetail);
  const [tab, setTab] = useState<Tab>("squad");

  useEffect(() => {
    dispatch(resetTeamDetail());
    dispatch(fetchTeamDetail(teamId));
  }, [teamId, dispatch]);

  const tabs = [
    { id: "squad", label: t.detail.team.squad },
    { id: "fixtures", label: t.detail.team.upcoming },
    { id: "results", label: t.detail.team.results },
  ];

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (status === "failed" || !team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-gray-500">{error ?? t.detail.team.notFound}</p>
        <Link href={lp("equipes")} className="mt-4 inline-block text-sm text-primary-light hover:underline">
          {t.detail.team.backToTeams}
        </Link>
        <Button className="ml-4 mt-4" onClick={() => dispatch(fetchTeamDetail(teamId))}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-8">
      <Link
        href={lp("equipes")}
        className="inline-block text-sm text-primary-light hover:underline"
      >
        {t.detail.team.backToTeams}
      </Link>

      <TeamHeaderCard team={team} />
      <TeamLeaguePosition standings={standings} teamId={team.id} />

      <Tabs tabs={tabs} activeTab={tab} onChange={(id) => setTab(id as Tab)} />

      {tab === "squad" && <TeamSquadList squad={squad} />}
      {tab === "fixtures" && <TeamFixturesList matches={fixtures} />}
      {tab === "results" && <TeamFixturesList matches={results} />}
    </div>
  );
}
