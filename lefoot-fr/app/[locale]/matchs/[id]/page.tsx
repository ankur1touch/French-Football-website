import type { Metadata } from "next";
import MatchDetailClient from "@/components/matches/MatchDetailClient";
import type { Locale } from "@/lib/i18n/config";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  return {
    title:
      locale === "en"
        ? `Match #${id} | OnzeActu`
        : `Match #${id} | OnzeActu`,
    description:
      locale === "en"
        ? "Live stats, lineups and events for this match."
        : "Statistiques, compositions et événements du match.",
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <MatchDetailClient matchId={id} />;
}
