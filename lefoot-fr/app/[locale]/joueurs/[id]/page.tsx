import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPlayerWithFallback, listPlayerIds } from "@/lib/football/server-data";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const ids = await listPlayerIds();
  return ids.map((id) => ({ id }));
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const player = await fetchPlayerWithFallback(id);

  if (!player) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={localizedPath(locale, "joueurs")}
        className="mb-6 inline-block text-sm text-primary-light hover:underline"
      >
        {locale === "en" ? "← Back to players" : "← Retour aux joueurs"}
      </Link>

      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-48 w-36 shrink-0 overflow-hidden rounded-lg bg-primary">
          <Image
            src={player.image}
            alt={player.name}
            fill
            sizes="144px"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
          <p className="mt-1 text-gray-500">
            {player.position} · {player.club} · {player.nationality}
          </p>
          <p className="text-sm text-gray-400">{player.age} ans</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Matchs", value: player.stats.appearances },
          { label: "Buts", value: player.stats.goals },
          { label: "Passes D.", value: player.stats.assists },
          { label: "Jaunes", value: player.stats.yellowCards },
          { label: "Rouges", value: player.stats.redCards },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <p className="text-xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-bold">Biographie</h2>
        <p className="leading-relaxed text-gray-700">{player.bio}</p>
      </div>
    </div>
  );
}
