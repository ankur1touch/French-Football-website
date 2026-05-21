"use client";

import Tabs from "@/components/ui/Tabs";
import { useTranslations } from "@/components/providers/LocaleProvider";
import { newsFilterIds, type NewsFilterCategory } from "@/lib/i18n/dictionaries";

export type { NewsFilterCategory };

interface NewsFiltersProps {
  active: NewsFilterCategory;
  onChange: (category: NewsFilterCategory) => void;
}

export default function NewsFilters({ active, onChange }: NewsFiltersProps) {
  const t = useTranslations();

  const filterTabs = newsFilterIds.map((id) => ({
    id,
    label: t.news.categories[id],
  }));

  return (
    <Tabs
      tabs={filterTabs}
      activeTab={active}
      onChange={(id) => onChange(id as NewsFilterCategory)}
    />
  );
}
