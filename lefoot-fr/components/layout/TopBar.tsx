"use client";

import { useSyncExternalStore } from "react";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

function useClientDate(locale: "fr" | "en") {
  return useSyncExternalStore(
    () => () => {},
    () => formatDate(new Date(), locale),
    () => ""
  );
}

export default function TopBar() {
  const locale = useLocale();
  const dateLabel = useClientDate(locale);
  const t = useTranslations();
  const lp = useLocalizedPath();

  return (
    <div className="bg-primary-dark text-gray-300 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <span className="capitalize">{dateLabel || "\u00a0"}</span>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href={lp("classements")} className="hover:text-white transition-colors">
            {t.topbar.groups}
          </Link>
          <Link href={lp("competitions")} className="hover:text-white transition-colors">
            {t.topbar.worldCup}
          </Link>
          <Link href={lp("transferts")} className="hover:text-white transition-colors">
            {t.topbar.transfers}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="#" className="hover:text-white transition-colors">
            {t.topbar.signIn}
          </Link>
        </div>
      </div>
    </div>
  );
}
