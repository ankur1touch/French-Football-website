import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getAllArticles } from "@/lib/articles";
import { listTeamIds, listPlayerIds } from "@/lib/football/server-data";
import { getCountries } from "@/lib/countries";

const STATIC_PATHS = [
  "",
  "actualites",
  "matchs",
  "joueurs",
  "equipes",
  "classements",
  "transferts",
  "recherche",
  "coupe-du-monde",
  "competitions",
  "equipe-de-france",
  "a-propos",
  "contact",
  "confidentialite",
  "publicite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onzeactu.com";
  const articles = await getAllArticles();
  const [teamIds, playerIds] = await Promise.all([listTeamIds(), listPlayerIds()]);
  const countries = getCountries();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path ? `/${path}` : ""}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "hourly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/${locale}/actualites/${article.slug}`,
        lastModified: new Date(article.publishedAt ?? article.date),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const id of teamIds.slice(0, 50)) {
      entries.push({
        url: `${siteUrl}/${locale}/equipes/${id}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const id of playerIds.slice(0, 50)) {
      entries.push({
        url: `${siteUrl}/${locale}/joueurs/${id}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const country of countries) {
      entries.push({
        url: `${siteUrl}/${locale}/pays/${country.id}`,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
