"use client";

import Image from "next/image";
import Link from "next/link";
import type { DetailSquadPlayer } from "@/types/team";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

const POSITION_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];
const POSITION_LABELS: Record<string, "goalkeepers" | "defenders" | "midfielders" | "attackers"> = {
  Goalkeeper: "goalkeepers",
  Defender: "defenders",
  Midfielder: "midfielders",
  Attacker: "attackers",
};

interface TeamSquadListProps {
  squad: DetailSquadPlayer[];
}

export default function TeamSquadList({ squad }: TeamSquadListProps) {
  const lp = useLocalizedPath();
  const t = useTranslations();

  if (!squad?.length) {
    return <p className="py-8 text-center text-gray-400">{t.detail.team.noSquad}</p>;
  }

  const grouped = POSITION_ORDER.reduce<Record<string, DetailSquadPlayer[]>>((acc, pos) => {
    acc[pos] = squad.filter((p) => p.position === pos);
    return acc;
  }, {});

  const ungrouped = squad.filter(
    (p) => !POSITION_ORDER.includes(p.position)
  );

  return (
    <div className="space-y-5">
      {POSITION_ORDER.map((pos) => {
        const players = grouped[pos];
        if (!players?.length) return null;
        const labelKey = POSITION_LABELS[pos];
        return (
          <div key={pos}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t.detail.team[labelKey]}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <Link
                  key={p.id}
                  href={lp(`joueurs/${p.id}`)}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 hover:bg-gray-50"
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {p.photo ? (
                      <Image src={p.photo} alt={p.name} fill sizes="32px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs">👤</span>
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium">{p.name}</span>
                  {p.number != null && (
                    <span className="font-mono text-xs text-gray-400">#{p.number}</span>
                  )}
                  {p.age > 0 && <span className="text-xs text-gray-400">{p.age}a</span>}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
      {ungrouped.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.detail.team.squad}
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ungrouped.map((p) => (
              <Link
                key={p.id}
                href={lp(`joueurs/${p.id}`)}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 hover:bg-gray-50"
              >
                <span className="flex-1 text-sm font-medium">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
