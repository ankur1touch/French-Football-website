import { format, formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import type { Locale } from "@/lib/i18n/config";

const localeMap = { fr, en: enUS };

export function formatRelative(dateStr: string, locale: Locale = "fr"): string {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: localeMap[locale],
    });
  } catch {
    return dateStr;
  }
}

export function formatRelativeFr(dateStr: string): string {
  return formatRelative(dateStr, "fr");
}

export function formatDate(date: Date = new Date(), locale: Locale = "fr"): string {
  return format(date, "EEE d MMM yyyy", { locale: localeMap[locale] });
}

export function formatDateFr(date: Date = new Date()): string {
  return formatDate(date, "fr");
}
