"use client";

import Image from "next/image";
import Link from "next/link";
import type { H2HMatch } from "@/types/matchDetail";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

interface PlayerRecentFixturesProps {
  fixtures: H2HMatch[];
  title: string;
}

export default function PlayerRecentFixtures({ fixtures, title }: PlayerRecentFixturesProps) {
  const lp = useLocalizedPath();

  if (!fixtures?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">{title}</h2>
      <div className="space-y-2">
        {fixtures.slice(0, 5).map((m) => (
          <Link
            key={m.fixtureId}
            href={lp(`matchs/${m.fixtureId}`)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <span className="w-20 text-xs text-gray-400">{m.date.slice(0, 10)}</span>
            {m.homeTeam.logo ? (
              <Image
                src={m.homeTeam.logo}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              />
            ) : null}
            <span className="flex-1 text-xs">
              {m.homeTeam.name} {m.homeScore ?? "–"} – {m.awayScore ?? "–"}{" "}
              {m.awayTeam.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
