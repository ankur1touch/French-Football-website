"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

interface SearchBarProps {
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void;
}

export default function SearchBar({ className, inputClassName, onNavigate }: SearchBarProps) {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onNavigate?.();
    router.push(`${lp("recherche")}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id="site-search"
          name="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          className={
            inputClassName ??
            "w-48 rounded-full bg-white py-1.5 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold lg:w-56"
          }
          aria-label={t.search.placeholder}
        />
      </div>
    </form>
  );
}
