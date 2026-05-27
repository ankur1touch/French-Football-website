import HeroSliderWrapper from "@/components/home/HeroSliderWrapper";
import MatchTickerStrip from "@/components/home/MatchTickerStrip";
import LiveScoreStrip from "@/components/home/LiveScoreStrip";
import NewsGrid from "@/components/home/NewsGrid";
import HotTransfers from "@/components/home/HotTransfers";
import StandingsWidget from "@/components/home/StandingsWidget";
import PollWidget from "@/components/home/PollWidget";
import FixturesWidget from "@/components/home/FixturesWidget";
import TopScorersWidget from "@/components/home/TopScorersWidget";
import MatchOfTheDay from "@/components/home/MatchOfTheDay";
import UpcomingMatchesStrip from "@/components/home/UpcomingMatchesStrip";
import FanZoneStrip from "@/components/home/FanZoneStrip";
import FifaRankingsWidget from "@/components/home/FifaRankingsWidget";
import TournamentsSection from "@/components/home/TournamentsSection";
import HomeBootstrap from "@/components/home/HomeBootstrap";

export default function HomePage() {
  return (
    <>
      <HomeBootstrap />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <HeroSliderWrapper />
      </div>
      <MatchTickerStrip />
      <LiveScoreStrip />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <UpcomingMatchesStrip />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsGrid />
            <HotTransfers />
            <TournamentsSection />
            <FanZoneStrip />
          </div>
          <aside className="flex flex-col gap-6">
            <MatchOfTheDay />
            <FifaRankingsWidget />
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
