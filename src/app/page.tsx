import { InitialLoader } from "@/components/ui/initial-loader";
import { StarField } from "@/components/ui/star-field";
import { ScrollHudFrame } from "@/components/scrollytelling/scroll-hud-frame";
import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/hero/hero";
import { Philosophy } from "@/components/philosophy/philosophy";
import { PlanetExplorer } from "@/components/destinations/planet-explorer";
import { MissionTimeline } from "@/components/missions/mission-timeline";
import { SpacecraftShowcase } from "@/components/spacecraft/spacecraft-showcase";
import { TechnologyExplorer } from "@/components/technology/technology-explorer";
import { LiveStatus } from "@/components/mission-control/live-status";
import { Statistics } from "@/components/statistics/statistics";
import { FinalCta } from "@/components/cta/final-cta";
import { Footer } from "@/components/footer/footer";
import { AudioToggle } from "@/components/ui/audio-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-obsidian text-bone">
      {/* Avionics Bus Pre-Flight Calibration */}
      <InitialLoader />

      {/* Precision Sub-Pixel Starfield, Architectural Grid & Film Grain */}
      <StarField />

      {/* Viewport Scroll Scrubber & Datum Rails */}
      <ScrollHudFrame />

      {/* Fixed Architectural Navigation */}
      <Navbar />

      {/* Scrollytelling Narrative Flow */}
      <main id="main-content" className="relative z-10 flex flex-col">
        <Hero />
        <Philosophy />
        <PlanetExplorer />
        <MissionTimeline />
        <SpacecraftShowcase />
        <TechnologyExplorer />
        <LiveStatus />
        <Statistics />
        <FinalCta />
      </main>

      <Footer />
      <AudioToggle />
    </div>
  );
}
