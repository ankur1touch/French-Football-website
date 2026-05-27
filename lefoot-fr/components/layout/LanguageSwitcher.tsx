"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { switchLocalePath, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usePathname } from "next/navigation";

const options: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-1 rounded border border-gray-600 p-0.5"
      suppressHydrationWarning
    >
      {options.map(({ code, label }) => (
        <Link
          key={code}
          href={switchLocalePath(pathname, code)}
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
        </Link>
      ))}
    </div>
  );
}
