"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

export default function HeaderSearch() {
  const router = useRouter();
  const lp = useLocalizedPath();
  const t = useTranslations();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    const q = input.value.trim();
    if (q) router.push(`${lp("recherche")}?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        name="q"
        type="search"
        placeholder={t.search.placeholder}
        className="w-48 rounded-full bg-white/10 py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold lg:w-56"
      />
    </form>
  );
}

export function HeaderSearchMobile({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const lp = useLocalizedPath();
  const t = useTranslations();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    const q = input.value.trim();
    if (q) {
      router.push(`${lp("recherche")}?q=${encodeURIComponent(q)}`);
      onNavigate?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        name="q"
        type="search"
        placeholder={t.search.placeholder}
        className="w-full rounded-full bg-white py-2 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
      />
    </form>
  );
}
