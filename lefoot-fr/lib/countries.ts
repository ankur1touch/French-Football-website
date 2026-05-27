import type { Locale } from "@/lib/i18n/config";
import { NATIONAL_TEAM_META } from "@/lib/football/config";

export interface CountryHub {
  id: string;
  name: string;
  nameEn: string;
  teamId: number;
  confederation: string;
  flag: string;
}

const COUNTRY_NAMES: Record<string, { fr: string; en: string; flag: string }> = {
  france: { fr: "France", en: "France", flag: "🇫🇷" },
  senegal: { fr: "Sénégal", en: "Senegal", flag: "🇸🇳" },
  "cote-ivoire": { fr: "Côte d'Ivoire", en: "Ivory Coast", flag: "🇨🇮" },
  cameroun: { fr: "Cameroun", en: "Cameroon", flag: "🇨🇲" },
  espagne: { fr: "Espagne", en: "Spain", flag: "🇪🇸" },
  bresil: { fr: "Brésil", en: "Brazil", flag: "🇧🇷" },
  argentine: { fr: "Argentine", en: "Argentina", flag: "🇦🇷" },
  maroc: { fr: "Maroc", en: "Morocco", flag: "🇲🇦" },
};

export function getCountries(locale: Locale = "fr"): CountryHub[] {
  return Object.entries(NATIONAL_TEAM_META).map(([teamId, meta]) => {
    const names = COUNTRY_NAMES[meta.slug] ?? { fr: meta.slug, en: meta.slug, flag: "🏳️" };
    return {
      id: meta.slug,
      name: locale === "en" ? names.en : names.fr,
      nameEn: names.en,
      teamId: Number(teamId),
      confederation: meta.confederation,
      flag: names.flag,
    };
  });
}

export function getCountryById(id: string, locale: Locale = "fr"): CountryHub | null {
  return getCountries(locale).find((c) => c.id === id) ?? null;
}

export function countryIdToTeamId(countryId?: string): number | null {
  if (!countryId) return null;
  const country = getCountryById(countryId);
  return country?.teamId ?? null;
}
