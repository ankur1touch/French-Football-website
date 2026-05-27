import { NextResponse } from "next/server";
import { getCountryById } from "@/lib/countries";
import { getAllArticles } from "@/lib/articles";
import { getMatchesFiltered } from "@/lib/football/services";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const country = getCountryById(id);

  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  const [news, matches] = await Promise.all([
    getAllArticles({ locale: "fr" }),
    getMatchesFiltered({ countryId: id }),
  ]);

  const countryNews = news.filter(
    (a) =>
      a.tags?.includes(id) ||
      a.title.toLowerCase().includes(country.name.toLowerCase()) ||
      a.category === "Afrique" ||
      a.category === "Équipe de France"
  );

  return NextResponse.json({
    country,
    news: countryNews.slice(0, 10),
    matches: matches.slice(0, 10),
  });
}
