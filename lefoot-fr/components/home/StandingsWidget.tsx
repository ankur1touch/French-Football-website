"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import type { FormResult } from "@/types/ranking";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

const formColors: Record<FormResult, string> = {
  W: "bg-form-win",
  D: "bg-form-draw",
  L: "bg-form-loss",
};

export default function StandingsWidget() {
  const { ligue1, groups, leagueName, status } = useAppSelector((state) => state.rankings);
  const t = useTranslations();
  const lp = useLocalizedPath();
  const rows = groups?.[0]?.rows ?? ligue1;
  const groupName = groups?.[0]?.name ?? "Group A";

  if (status === "loading" || status === "idle") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
        {leagueName ?? t.rankings.subtitle} · {groupName}
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
            <th className="pb-2 pr-2 w-6">#</th>
            <th className="pb-2">{t.common.team}</th>
            <th className="pb-2 text-center w-8">{t.common.pts}</th>
            <th className="pb-2 text-right">{t.common.form}</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((row) => (
            <tr key={row.team} className="border-b border-gray-50">
              <td className="py-2 pr-2 text-gray-500">{row.position}</td>
              <td className="py-2 font-medium text-gray-900">
                {row.teamId ? (
                  <Link href={lp(`equipes/${row.teamId}`)} className="hover:text-primary">
                    {row.team}
                  </Link>
                ) : (
                  row.team
                )}
              </td>
              <td className="py-2 text-center font-bold text-primary">{row.points}</td>
              <td className="py-2">
                <div className="flex justify-end gap-0.5">
                  {row.form.map((result, i) => (
                    <span
                      key={i}
                      className={cn("h-2 w-2 rounded-full", formColors[result])}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400">{t.rankings.subtitle}</p>
    </div>
  );
}
