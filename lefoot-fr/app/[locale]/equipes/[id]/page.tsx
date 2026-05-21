import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTeamWithFallback, listTeamIds } from "@/lib/football/server-data";
import type { FormResult } from "@/types/ranking";
import { cn } from "@/lib/cn";
import { localizedPath, type Locale } from "@/lib/i18n/config";

const formColors: Record<FormResult, string> = {
  W: "bg-form-win",
  D: "bg-form-draw",
  L: "bg-form-loss",
};

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const ids = await listTeamIds();
  return ids.map((id) => ({ id }));
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const team = await fetchTeamWithFallback(id);

  if (!team) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href={localizedPath(locale, "equipes")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        {locale === "en" ? "← Back to teams" : "← Retour aux équipes"}
      </Link>

      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100">
          <Image src={team.image} alt={team.name} fill sizes="96px" className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
          <p className="text-gray-500">{team.confederation} · Entraîneur : {team.coach}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-500">Forme :</span>
            {team.form.map((result, i) => (
              <span key={i} className={cn("h-3 w-3 rounded-full", formColors[result])} />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Matchs", value: team.stats.played },
          { label: "Victoires", value: team.stats.won },
          { label: "Buts pour", value: team.stats.goalsFor },
          { label: "Buts contre", value: team.stats.goalsAgainst },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold">Effectif</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500">
                <th className="pb-2">Joueur</th>
                <th className="pb-2">Poste</th>
                <th className="pb-2">Club</th>
                <th className="pb-2 text-center">Âge</th>
              </tr>
            </thead>
            <tbody>
              {team.squad.map((player) => (
                <tr key={player.id} className="border-b border-gray-50">
                  <td className="py-2 font-medium">{player.name}</td>
                  <td className="py-2 text-gray-600">{player.position}</td>
                  <td className="py-2 text-gray-600">{player.club}</td>
                  <td className="py-2 text-center text-gray-500">{player.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
