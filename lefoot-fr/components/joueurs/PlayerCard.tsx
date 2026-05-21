"use client";

import Image from "next/image";
import Link from "next/link";
import type { Player } from "@/types/player";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const lp = useLocalizedPath();

  return (
    <Link
      href={lp(`joueurs/${player.id}`)}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5] bg-primary">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover opacity-90 transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{player.name}</h3>
        <p className="text-sm text-gray-500">{player.position} · {player.club}</p>
        <p className="text-xs text-gray-400">{player.nationality} · {player.age} ans</p>
      </div>
    </Link>
  );
}
