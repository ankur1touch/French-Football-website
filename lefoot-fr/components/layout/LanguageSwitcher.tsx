"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { switchLocalePath, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/providers/LocaleProvider";

const options: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.push(switchLocalePath(pathname, next));
  }

  return (
    <div className="flex items-center gap-1 rounded border border-gray-600 p-0.5">
      {options.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors",
            locale === code
              ? "bg-gold text-primary-dark"
              : "text-gray-300 hover:text-white"
          )}
          aria-label={code === "fr" ? "Français" : "English"}
          aria-pressed={locale === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
