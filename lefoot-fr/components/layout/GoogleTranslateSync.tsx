"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";

function setCookie(locale: string) {
  const value = locale === "en" ? "/fr/en" : "/fr/fr";
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};domain=${window.location.hostname};path=/`;
}

function reapplyTranslation() {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return;

  if (select.value === "en") {
    // Already set to en but new SPA content isn't translated yet —
    // reset to source lang then re-apply so GT picks up new DOM nodes
    select.value = "";
    select.dispatchEvent(new Event("change"));
    setTimeout(() => {
      select.value = "en";
      select.dispatchEvent(new Event("change"));
    }, 300);
  } else {
    select.value = "en";
    select.dispatchEvent(new Event("change"));
  }
}

export default function GoogleTranslateSync() {
  const locale = useLocale();
  const pathname = usePathname();
  const initialized = useRef(false);

  // On locale switch: set cookie (already handled by LanguageSwitcher + hard reload).
  // On SPA navigation while locale=en: re-trigger GT after new content renders.
  useEffect(() => {
    setCookie(locale);

    if (locale !== "en") return;

    // First mount — GT initializes itself via cookie, no need to force
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    // Subsequent SPA navigations: wait for new page content to render then re-translate
    const timer = setTimeout(reapplyTranslation, 800);
    return () => clearTimeout(timer);
  }, [pathname, locale]);

  return <div id="google_translate_element" className="hidden" />;
}
