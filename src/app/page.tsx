import { HeroSection } from '@/components/dashboard/HeroSection';
import { WeekendTimeline } from '@/components/dashboard/WeekendTimeline';
import { StandingsSection } from '@/components/dashboard/StandingsSection';
import { ChampionshipBattle } from '@/components/dashboard/ChampionshipBattle';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { SeasonTimeline } from '@/components/dashboard/SeasonTimeline';
import { FastestLapsSection } from '@/components/dashboard/FastestLapsSection';
import { PointsProgressionChart } from '@/components/charts/PointsProgressionChart';
import { DriverComparison } from '@/components/dashboard/DriverComparison';
import { ConstructorComparison } from '@/components/dashboard/ConstructorComparison';
import { StatisticsSection } from '@/components/dashboard/StatisticsSection';
import { LiveEventsFeed } from '@/components/dashboard/LiveEventsFeed';
import { NewsletterSection } from '@/components/dashboard/NewsletterSection';
import { CircuitExplorer } from '@/components/track/CircuitExplorer';
import { SectionDivider } from '@/components/layout/SectionDivider';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <WeekendTimeline />
      <SectionDivider />
      <StandingsSection type="drivers" />
      <SectionDivider />
      <StandingsSection type="constructors" />
      <SectionDivider />
      <ChampionshipBattle />
      <SectionDivider />
      <CalendarSection />
      <SectionDivider />
      <CircuitExplorer />
      <SectionDivider />
      <LiveEventsFeed />
      <SectionDivider />
      <DriverComparison />
      <SectionDivider />
      <ConstructorComparison />
      <SectionDivider />
      <PointsProgressionChart />
      <SectionDivider />
      <FastestLapsSection />
      <SectionDivider />
      <StatisticsSection />
      <SectionDivider />
      <SeasonTimeline />
      <SectionDivider />
      <NewsletterSection />
      <SectionDivider />
      <Footer />
    </>
  );
}
