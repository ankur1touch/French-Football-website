"use client";

import { cn } from "@/lib/cn";
import { switchLocalePath, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usePathname } from "next/navigation";

const options: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

function setGoogTransCookie(to: Locale) {
  const value = to === "en" ? "/fr/en" : "/fr/fr";
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};domain=${window.location.hostname};path=/`;
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  function handleSwitch(code: Locale) {
    if (code === locale) return;
    setGoogTransCookie(code);
    // Full reload so Google Translate applies immediately
    window.location.href = switchLocalePath(pathname, code);
  }

  return (
    <div
      className="flex items-center gap-1 rounded border border-gray-600 p-0.5"
      suppressHydrationWarning
    >
      {options.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors",
            locale === code
              ? "bg-gold text-primary-dark"
              : "text-gray-300 hover:text-white"
          )}
          aria-label={code === "fr" ? "Français" : "English"}
          aria-current={locale === code ? "true" : undefined}
          suppressHydrationWarning
        >
          {label}
        </button>
      ))}
    </div>
  );
}
