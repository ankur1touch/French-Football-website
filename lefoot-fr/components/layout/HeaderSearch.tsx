"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSearch, resetSearch } from "@/store/features/searchSlice";
import { FALLBACK_NEWS_IMAGE } from "@/lib/image-hosts";

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function SearchDropdown({
  query,
  onClose,
  onNavigate,
  mobile,
}: {
  query: string;
  onClose: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { results, status } = useAppSelector((s) => s.search);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      dispatch(resetSearch());
      return;
    }
    dispatch(fetchSearch(debouncedQuery.trim()));
  }, [debouncedQuery, dispatch]);

  const loading = status === "loading";
  const news = results?.news ?? [];
  const teams = results?.teams ?? [];
  const players = results?.players ?? [];

  const hasResults = news.length > 0 || teams.length > 0 || players.length > 0;

  if (!query.trim()) return null;

  function go(href: string) {
    onClose();
    onNavigate?.();
    router.push(href);
  }

  function goSearch() {
    onClose();
    onNavigate?.();
    router.push(`${lp("recherche")}?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div
      className={`absolute z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ${
        mobile ? "left-0 right-0" : "left-0 w-[420px]"
      }`}
    >
      {loading ? (
        <div className="space-y-3 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse gap-3">
              <div className="h-14 w-20 shrink-0 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasResults && status === "succeeded" ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">{t.search.noResults}</p>
      ) : (
        <div className="max-h-[480px] overflow-y-auto">
          {news.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t.search.sections.news}
              </p>
              <ul>
                {news.slice(0, 5).map((article) => (
                  <li key={article.id}>
                    <button
                      type="button"
                      onClick={() => go(lp(`actualites/${article.slug}`))}
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={article.image || FALLBACK_NEWS_IMAGE}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_NEWS_IMAGE;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mt-0.5 text-xs text-gray-400">
                          {new Date(article.publishedAt ?? article.date ?? "").toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teams.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t.search.sections.teams}
              </p>
              <ul>
                {teams.slice(0, 3).map((team) => (
                  <li key={team.id}>
                    <button
                      type="button"
                      onClick={() => go(lp(`equipes/${team.id}`))}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-50"
                    >
                      {team.image && (
                        <Image
                          src={team.image}
                          alt={team.name}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900">{team.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{team.confederation}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {players.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t.search.sections.players}
              </p>
              <ul>
                {players.slice(0, 3).map((player) => (
                  <li key={player.id}>
                    <button
                      type="button"
                      onClick={() => go(lp(`joueurs/${player.id}`))}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-50"
                    >
                      {player.image && (
                        <Image
                          src={player.image}
                          alt={player.name}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{player.name}</p>
                        <p className="text-xs text-gray-400">
                          {player.position} · {player.club}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(hasResults || status === "succeeded") && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <button
            type="button"
            onClick={goSearch}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tous les résultats →
          </button>
        </div>
      )}
    </div>
  );
}

export default function HeaderSearch() {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    dispatch(resetSearch());
    router.push(`${lp("recherche")}?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <form onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
        <input
          name="q"
          type="search"
          value={query}
          autoComplete="off"
          placeholder={t.search.placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          className="w-48 rounded-full bg-white/10 py-1.5 pl-9 pr-8 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold lg:w-56"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              dispatch(resetSearch());
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && (
        <SearchDropdown query={query} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

export function HeaderSearchMobile({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations();
  const lp = useLocalizedPath();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    dispatch(resetSearch());
    router.push(`${lp("recherche")}?q=${encodeURIComponent(q)}`);
    onNavigate?.();
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
        <input
          name="q"
          type="search"
          value={query}
          autoComplete="off"
          placeholder={t.search.placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          className="w-full rounded-full bg-white py-2 pl-9 pr-8 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              dispatch(resetSearch());
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && (
        <SearchDropdown
          query={query}
          onClose={() => setOpen(false)}
          onNavigate={onNavigate}
          mobile
        />
      )}
    </div>
  );
}
