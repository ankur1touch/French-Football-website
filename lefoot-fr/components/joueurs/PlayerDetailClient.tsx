"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPlayerDetail,
  resetPlayerDetail,
} from "@/store/features/playerDetailSlice";
import PlayerProfileCard from "./PlayerProfileCard";
import PlayerSeasonStats from "./PlayerSeasonStats";
import PlayerRecentFixtures from "./PlayerRecentFixtures";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import {
  useLocalizedPath,
  useLocale,
  useTranslations,
} from "@/components/providers/LocaleProvider";

interface PlayerDetailClientProps {
  playerId: string;
}

export default function PlayerDetailClient({ playerId }: PlayerDetailClientProps) {
  const dispatch = useAppDispatch();
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();
  const { player, statistics, fixtures, bio, status, error } = useAppSelector(
    (s) => s.playerDetail
  );

  useEffect(() => {
    dispatch(resetPlayerDetail());
    dispatch(fetchPlayerDetail(playerId));
  }, [playerId, dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (status === "failed" || !player) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-gray-500">{error ?? t.detail.player.notFound}</p>
        <Link href={lp("joueurs")} className="mt-4 inline-block text-sm text-primary-light hover:underline">
          {t.detail.player.backToPlayers}
        </Link>
        <Button className="ml-4 mt-4" onClick={() => dispatch(fetchPlayerDetail(playerId))}>
          {t.common.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link
        href={lp("joueurs")}
        className="inline-block text-sm text-primary-light hover:underline"
      >
        {t.detail.player.backToPlayers}
      </Link>

      <PlayerProfileCard
        player={player}
        statistics={statistics}
        injuredLabel={t.detail.player.injured}
        heightLabel={t.detail.player.height}
        weightLabel={t.detail.player.weight}
        yearsOldLabel={t.detail.player.yearsOld}
      />
      <PlayerSeasonStats
        statistics={statistics}
        title={t.detail.player.seasonStats}
        locale={locale}
      />
      <PlayerRecentFixtures fixtures={fixtures} title={t.detail.player.recentFixtures} />

      {bio && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-bold">{t.detail.player.bio}</h2>
          <p className="leading-relaxed text-gray-700">{bio}</p>
        </div>
      )}
    </div>
  );
}
