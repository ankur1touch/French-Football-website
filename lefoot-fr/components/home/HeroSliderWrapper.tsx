"use client";

import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/hooks";
import HeroSlider from "@/components/home/HeroSlider";

const HeroSliderDynamic = dynamic(() => Promise.resolve(HeroSlider), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] animate-shimmer rounded-2xl lg:h-96" />
  ),
});

export default function HeroSliderWrapper() {
  const { articles, status } = useAppSelector((s) => s.news);
  return (
    <HeroSliderDynamic
      articles={articles}
      loading={status === "loading" || status === "idle"}
    />
  );
}
