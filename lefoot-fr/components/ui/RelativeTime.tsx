"use client";

import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RelativeTimeProps {
  date: string;
  className?: string;
}

export default function RelativeTime({ date, className }: RelativeTimeProps) {
  const locale = useLocale();
  const dfLocale = locale === "en" ? enUS : fr;

  try {
    const text = formatDistanceToNow(new Date(date), { addSuffix: true, locale: dfLocale });
    return <time dateTime={date} className={className}>{text}</time>;
  } catch {
    return <time dateTime={date} className={className}>{date}</time>;
  }
}
