"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import {
  useLocale,
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

export default function TopBar() {
  const locale = useLocale();
  const [dateLabel, setDateLabel] = useState("");
  const t = useTranslations();
  const lp = useLocalizedPath();

  useEffect(() => {
    setDateLabel(formatDate(new Date(), locale));
  }, [locale]);

  return (
    <div className="bg-primary-dark text-xs text-gray-300" suppressHydrationWarning>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <span className="capitalize" suppressHydrationWarning>
          {dateLabel || "\u00a0"}
        </span>
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href={lp("classements")}
            className="transition-colors hover:text-white"
            suppressHydrationWarning
          >
            {t.topbar.groups}
          </Link>
          <Link
            href={lp("competitions")}
            className="transition-colors hover:text-white"
            suppressHydrationWarning
          >
            {t.topbar.worldCup}
          </Link>
          <Link
            href={lp("transferts")}
            className="transition-colors hover:text-white"
            suppressHydrationWarning
          >
            {t.topbar.transfers}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="#"
            className="transition-colors hover:text-white"
            suppressHydrationWarning
          >
            {t.topbar.signIn}
          </Link>
        </div>
      </div>
    </div>
  );
}
