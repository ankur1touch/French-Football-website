import CmsArticleList from "@/components/cms/CmsArticleList";
import { OnzeActuEndpoint } from "@/lib/onzeActuApi";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

const CONVOCATIONS = [
  { name: "Kylian Mbappé", club: "PSG", position: "Attaquant" },
  { name: "Antoine Griezmann", club: "Atlético Madrid", position: "Attaquant" },
  { name: "Aurélien Tchouaméni", club: "Real Madrid", position: "Milieu" },
  { name: "William Saliba", club: "Arsenal", position: "Défenseur" },
  { name: "Mike Maignan", club: "AC Milan", position: "Gardien" },
  { name: "Ousmane Dembélé", club: "PSG", position: "Attaquant" },
  { name: "N'Golo Kanté", club: "Al-Ittihad", position: "Milieu" },
  { name: "Jules Koundé", club: "Barcelone", position: "Défenseur" },
];

export default async function EquipeDeFrancePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Convocations récentes</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONVOCATIONS.map((player) => (
            <div
              key={player.name}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-500">{player.club}</p>
              </div>
              <span className="text-xs font-medium text-blue-600">{player.position}</span>
            </div>
          ))}
        </div>
      </div>

      <CmsArticleList
        endpoint={OnzeActuEndpoint.EquipeDeFrance}
        title="Équipe de France"
        page={currentPage}
        limit={20}
        basePath={`/${locale}/equipe-de-france`}
      />
    </div>
  );
}
