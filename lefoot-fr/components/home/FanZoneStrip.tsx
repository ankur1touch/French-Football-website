"use client";

import { useTranslations } from "@/components/providers/LocaleProvider";

export default function FanZoneStrip() {
  const t = useTranslations();

  return (
    <section className="mt-8 rounded-2xl bg-primary p-6 text-white md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wider">{t.home.fanZoneTitle}</h2>
          <p className="mt-2 max-w-xl text-sm text-white/80">{t.home.fanZoneDesc}</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-dark transition-colors hover:bg-gold/90"
        >
          {t.home.fanZoneCta}
        </button>
      </div>
    </section>
  );
}
