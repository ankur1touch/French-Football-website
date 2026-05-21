import HeroSection from "@/components/home/HeroSection";
import LiveScoreStrip from "@/components/home/LiveScoreStrip";
import NewsGrid from "@/components/home/NewsGrid";
import HotTransfers from "@/components/home/HotTransfers";
import StandingsWidget from "@/components/home/StandingsWidget";
import PollWidget from "@/components/home/PollWidget";
import FixturesWidget from "@/components/home/FixturesWidget";
import TopScorersWidget from "@/components/home/TopScorersWidget";
import HomeBootstrap from "@/components/home/HomeBootstrap";

export default function HomePage() {
  return (
    <>
      <HomeBootstrap />
      <HeroSection />
      <LiveScoreStrip />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsGrid />
            <HotTransfers />
          </div>
          <aside className="flex flex-col gap-6">
            <StandingsWidget />
            <TopScorersWidget />
            <PollWidget />
            <FixturesWidget />
          </aside>
        </div>
      </div>
    </>
  );
}
