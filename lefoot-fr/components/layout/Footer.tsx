"use client";

import Link from "next/link";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

export default function Footer() {
  const t = useTranslations();
  const lp = useLocalizedPath();

  return (
    <footer className="bg-primary-dark text-gray-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <Link href={lp()} className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <span className="text-lg font-bold text-white">
            LeFoot<span className="text-gold">FR</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link href="#" className="hover:text-white transition-colors">
            {t.footer.about}
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            {t.footer.contact}
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            {t.footer.legal}
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            {t.footer.rss}
          </Link>
        </div>
      </div>
    </footer>
  );
}
