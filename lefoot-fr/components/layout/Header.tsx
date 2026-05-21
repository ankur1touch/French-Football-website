"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import SearchBar from "@/components/layout/SearchBar";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const lp = useLocalizedPath();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: lp("actualites"), label: t.nav.news },
    { href: lp("classements"), label: t.nav.groups },
    { href: lp("competitions"), label: t.nav.worldCup },
    { href: lp("matchs"), label: t.nav.matches },
    { href: lp("equipes"), label: t.nav.teams },
    { href: lp("joueurs"), label: t.nav.scorers },
  ];

  const homeHref = lp();

  return (
    <header className="bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={homeHref} className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="text-xl font-bold tracking-tight">
            LeFoot<span className="text-gold">FR</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === lp("actualites") && pathname === homeHref);
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
          <Link
            href={lp("recherche")}
            className="rounded-full p-2 hover:bg-white/10 lg:hidden"
            aria-label={t.search.placeholder}
          >
            <Search className="h-5 w-5" />
          </Link>

          <div className="hidden items-center md:flex">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

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
            <Suspense fallback={null}>
              <SearchBar
                inputClassName="w-full rounded-full bg-white py-2 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                onNavigate={() => setMobileOpen(false)}
              />
            </Suspense>
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
