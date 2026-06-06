"use client";

import Link from "next/link";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import OnzeActuLogo from "@/components/ui/OnzeActuLogo";

export default function Footer() {
  const t = useTranslations();
  const lp = useLocalizedPath();

  const columns = [
    {
      title: t.footer.colFootball,
      links: [
        { href: lp("matchs"), label: t.nav.matches },
        { href: lp("classements"), label: t.nav.groups },
        { href: lp("joueurs"), label: t.nav.scorers },
        { href: lp("transferts"), label: t.topbar.transfers },
      ],
    },
    {
      title: t.footer.colTournaments,
      links: [
        { href: lp("coupe-du-monde"), label: t.nav.worldCup },
        { href: lp("competitions"), label: t.footer.competitions },
        { href: lp("equipes"), label: t.nav.teams },
      ],
    },
    {
      title: t.footer.colNews,
      links: [
        { href: lp("actualites"), label: t.nav.news },
        { href: lp("transferts"), label: t.topbar.transfers },
        { href: lp("equipe-de-france"), label: t.footer.franceTeam },
      ],
    },
    {
      title: t.footer.colSite,
      links: [
        { href: lp("a-propos"), label: t.footer.about },
        { href: lp("contact"), label: t.footer.contact },
        { href: lp("confidentialite"), label: t.footer.legal },
        { href: lp("publicite"), label: t.footer.advertise },
        { href: "/rss.xml", label: t.footer.rss },
      ],
    },
  ];

  return (
    <footer className="bg-primary-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href={lp()} className="flex items-center">
              <OnzeActuLogo size="md" variant="light" />
            </Link>
            <p className="mt-3 text-sm text-gray-400">{t.footer.tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-display text-lg uppercase tracking-wide text-white">
            {t.footer.newsletterTitle}
          </h3>
          <p className="mt-1 text-sm text-gray-400">{t.footer.newsletterDesc}</p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder={t.footer.newsletterPlaceholder}
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-2 text-sm font-bold uppercase tracking-wide text-primary-dark transition-colors hover:bg-gold/90"
            >
              {t.footer.newsletterCta}
            </button>
          </form>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} OnzeActu. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
