"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import HeaderSearch, { HeaderSearchMobile } from "@/components/layout/HeaderSearch";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import OnzeActuLogo from "@/components/ui/OnzeActuLogo";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const lp = useLocalizedPath();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: lp("actualites"), label: t.nav.news },
    { href: lp("classements"), label: t.nav.groups },
    { href: lp("coupe-du-monde"), label: t.nav.worldCup },
    { href: lp("matchs"), label: t.nav.matches },
    { href: lp("equipes"), label: t.nav.teams },
    { href: lp("joueurs"), label: t.nav.scorers },
  ];

  const homeHref = lp();

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={homeHref} className="flex shrink-0 items-center">
          <OnzeActuLogo size="md" variant="light" />
        </Link>

        <Link
          href={lp("coupe-du-monde")}
          className="hidden rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark sm:inline-flex"
        >
          CDM 2026
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== homeHref && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold",
                  isActive && "border-b-2 border-gold pb-0.5 text-gold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderSearch />

          <Link
            href={lp("recherche")}
            className="rounded-full p-2 hover:bg-white/10 md:hidden"
            aria-label={t.search.placeholder}
          >
            <Search className="h-5 w-5" />
          </Link>

          <LanguageSwitcher />

          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="mb-3">
            <HeaderSearchMobile onNavigate={() => setMobileOpen(false)} />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm hover:text-gold"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
