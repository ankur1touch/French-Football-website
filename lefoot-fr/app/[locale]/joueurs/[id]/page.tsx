import type { Metadata } from "next";
import PlayerDetailClient from "@/components/joueurs/PlayerDetailClient";
import { listPlayerIds } from "@/lib/football/server-data";
import type { Locale } from "@/lib/i18n/config";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const ids = await listPlayerIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  return {
    title: locale === "en" ? `Player #${id} | OnzeActu` : `Joueur #${id} | OnzeActu`,
    description:
      locale === "en"
        ? "Player profile, season stats and recent matches."
        : "Profil, statistiques et derniers matchs du joueur.",
  };
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PlayerDetailClient playerId={id} />;
}
