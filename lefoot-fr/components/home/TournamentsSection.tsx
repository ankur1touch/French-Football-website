"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import Badge from "@/components/ui/Badge";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

export default function TournamentsSection() {
  const { tournaments, status } = useAppSelector((s) => s.tournaments);
  const t = useTranslations();
  const lp = useLocalizedPath();

  if (status !== "succeeded" || !tournaments.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-lg uppercase tracking-wider text-gray-800">
        {t.home.tournaments}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tournaments.slice(0, 4).map((tr) => (
          <Link
            key={tr.id}
            href={lp(`competitions/${tr.id}`)}
            className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <Badge variant="tournament" className="mb-2">
              {tr.category}
            </Badge>
            <h3 className="font-semibold text-gray-900">{tr.name}</h3>
            <p className="text-xs text-gray-500">{tr.host}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
