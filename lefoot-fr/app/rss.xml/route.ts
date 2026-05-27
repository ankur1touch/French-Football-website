import { getAllArticles } from "@/lib/articles";

export async function GET() {
  const articles = await getAllArticles();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lefootfr.com";

  const items = articles
    .slice(0, 30)
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/fr/actualites/${a.slug}</link>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${new Date(a.publishedAt ?? a.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/fr/actualites/${a.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LeFootFR — Actualités Football</title>
    <link>${siteUrl}</link>
    <description>Portail football français et africain</description>
    <language>fr</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
