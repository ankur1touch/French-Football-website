import type { Metadata } from "next";
import TeamDetailClient from "@/components/equipes/TeamDetailClient";
import { listTeamIds } from "@/lib/football/server-data";
import type { Locale } from "@/lib/i18n/config";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const ids = await listTeamIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  return {
    title: locale === "en" ? `Team #${id} | LeFootFR` : `Équipe #${id} | LeFootFR`,
    description:
      locale === "en"
        ? "Squad, fixtures and standings for this team."
        : "Effectif, matchs et classement de l'équipe.",
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <TeamDetailClient teamId={id} />;
}
